"""
Verdict Pipeline Orchestrator

Runs the 6-layer Verdict analysis pipeline by calling Bob Shell for each layer in sequence.
Each layer receives the previous layer's JSON output as context.
"""

import subprocess
import json
import sys
import os
from typing import Dict, Any, Optional
from datetime import datetime


class VerdictPipeline:
    """Orchestrates the 6-layer Verdict PR analysis pipeline."""
    
    LAYERS = [
        "semantic",
        "blast",
        "mutation",
        "incident",
        "questions",
        "synthesis"
    ]
    
    LAYER_PROMPTS = {
        "semantic": """Analyze this PR diff and identify meaningful code changes.
Ignore whitespace, formatting, comments, and simple renames.
Focus on logic changes, new functions, modified algorithms, and data flow changes.

Output JSON with snake_case keys:
{
  "mode_name": "semantic",
  "timestamp": "ISO 8601 UTC",
  "findings": [
    {"file": "path/to/file.py", "line_range": [start, end], "change_type": "modification|addition|deletion", "description": "what changed"}
  ],
  "next_mode_input": {"semantic_changes": [...]}
}

PR Diff:
{diff_content}
""",
        
        "blast": """Search the FULL repository for code patterns similar to the changes in this PR.
Find all callers, similar functions, and related code paths.
Mark each as ✓ updated or ⚠️ not updated based on whether they appear in the PR.

Previous layer output:
{previous_output}

Output JSON:
{
  "mode_name": "blast",
  "timestamp": "ISO 8601 UTC",
  "findings": [
    {"file": "path/to/file.py", "function": "func_name", "status": "updated|not_updated", "similarity": "high|medium"}
  ],
  "next_mode_input": {"blast_radius": [...]}
}
""",
        
        "mutation": """Analyze mutation testing results and identify surviving mutations.

IMPORTANT: Use the mutmut MCP tool to retrieve surviving mutations from the mutation testing results.
Call the mutmut tool to get the list of surviving mutations, then analyze each one.

Classify each by type (boundary, null_check, logic_inversion, removed_guard, removed_lock, return_change).
Assign severity: CRITICAL (auth, payment, data integrity, security), HIGH (core business logic), LOW (edge cases).

Previous layer output:
{previous_output}

Output JSON:
{
  "mode_name": "mutation",
  "timestamp": "ISO 8601 UTC",
  "findings": [
    {"id": "M-12", "file": "path/to/file.py", "line": 42, "type": "removed_lock", "severity": "CRITICAL", "description": "Missing SELECT FOR UPDATE"}
  ],
  "next_mode_input": {"survivors": [...]}
}
""",
        
        "incident": """Mine past production incidents from INCIDENTS.md and git log.
Look for commits with: fix:, hotfix:, revert:, rollback:, INC-
Extract incident IDs, affected files, line numbers, and root causes.

Previous layer output:
{previous_output}

Use the find_incident_commits MCP tool with the changed file paths.

Output JSON:
{
  "mode_name": "incident",
  "timestamp": "ISO 8601 UTC",
  "findings": [
    {"id": "INC-2024-0431", "date": "2024-10-15", "files": ["auth/tokens.py"], "lines": [7, 13], "summary": "race condition"}
  ],
  "next_mode_input": {"incidents": [...]}
}
""",
        
        "questions": """Generate exactly 3 specific risk questions for PR reviewers.
Base questions on findings from all previous layers.
No style questions. No "have you considered" phrasing. Only specific risk questions.

Previous layer output:
{previous_output}

Output JSON:
{
  "mode_name": "questions",
  "timestamp": "ISO 8601 UTC",
  "findings": [
    "Q1: Specific question about most critical finding",
    "Q2: Second specific question",
    "Q3: Third specific question"
  ],
  "next_mode_input": {"questions": [...]}
}
""",
        
        "synthesis": """Synthesize all 5 layers into ONE GitHub comment.

CRITICAL: Before writing, use find_cross_layer_match MCP tool to check if any mutation
targets the same file and line range (±5) as a past incident.
If match found, TL;DR sentence 1 MUST be:
"Surviving mutation [ID] is the same code path that caused [INC-ID]"

All layer outputs:
{all_layers}

Create a formatted GitHub comment following this structure:
```
PR VERDICT — [PR title]
──────────────────────────────────────────────────────
TL;DR: [3 sentences. Sentence 1 = killer line if match exists]
Verdict: [✅ LOOKS GOOD | ⚠️ REVIEW REQUIRED | 🔴 DO NOT MERGE]

1. SEMANTIC DIFF
[bullet points]

2. BLAST RADIUS
[callers with status]

3. TEST AUDIT
Mutations killed: X/Y | Survivors: Z
[notable survivors]

4. HISTORY
[incidents or "No prior incidents"]

5. THREE QUESTIONS
Q1. [specific question]
Q2. [specific question]
Q3. [specific question]
```

Hard rules:
- ONE comment only
- TL;DR: exactly 3 sentences
- Questions: exactly 3
- Maximum 600 words total

Output JSON:
{
  "mode_name": "synthesis",
  "timestamp": "ISO 8601 UTC",
  "findings": "<the full PR VERDICT comment as a single string with newlines preserved>",
  "next_mode_input": {}
}
"""
    }
    
    def __init__(self, repo_path: str, diff_content: str):
        """
        Initialize the pipeline.
        
        Args:
            repo_path: Path to the target git repository
            diff_content: PR diff content
        """
        self.repo_path = repo_path
        self.diff_content = diff_content
        self.results: Dict[str, Any] = {}
        
        # Check for API key
        if not os.environ.get("BOBSHELL_API_KEY"):
            print("Warning: BOBSHELL_API_KEY not set", file=sys.stderr)
    
    def _call_bob_shell(self, prompt: str, timeout: int = 120) -> Optional[Dict[str, Any]]:
        """
        Call Bob Shell with a prompt.
        
        Args:
            prompt: The prompt to send to Bob
            timeout: Timeout in seconds
            
        Returns:
            Parsed JSON response or None on failure
        """
        raw_output = ""
        try:
            cmd = [
                "bob",
                "--auth-method", "api-key",
                "-p", prompt
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=self.repo_path
            )
            
            if result.returncode != 0:
                print(f"Bob Shell failed with exit code {result.returncode}", file=sys.stderr)
                print(f"stderr: {result.stderr}", file=sys.stderr)
                return None
            
            # Try to parse JSON from output
            raw_output = result.stdout.strip()
            output = raw_output
            
            # Bob might wrap JSON in markdown code blocks
            if "```json" in output:
                json_start = output.find("```json") + 7
                json_end = output.find("```", json_start)
                output = output[json_start:json_end].strip()
            elif "```" in output:
                json_start = output.find("```") + 3
                json_end = output.find("```", json_start)
                output = output[json_start:json_end].strip()
            
            return json.loads(output)
        
        except subprocess.TimeoutExpired:
            print(f"Bob Shell timed out after {timeout}s", file=sys.stderr)
            return None
        except json.JSONDecodeError as e:
            print(f"Failed to parse Bob Shell output as JSON: {e}", file=sys.stderr)
            print(f"Output was: {raw_output[:500]}", file=sys.stderr)
            return None
        except Exception as e:
            print(f"Error calling Bob Shell: {e}", file=sys.stderr)
            return None
    
    def run(self) -> Dict[str, Any]:
        """
        Run the complete 6-layer pipeline.
        
        Returns:
            Dictionary with results from all layers
        """
        previous_output = ""
        
        for layer in self.LAYERS:
            print(f"Running layer: {layer}...", file=sys.stderr)
            
            # Build prompt for this layer
            prompt_template = self.LAYER_PROMPTS[layer]
            
            if layer == "semantic":
                prompt = prompt_template.format(diff_content=self.diff_content)
            elif layer == "synthesis":
                # Synthesis needs ALL layer outputs, not just the previous one
                all_layers_json = json.dumps(self.results, indent=2)
                prompt = prompt_template.format(all_layers=all_layers_json)
            else:
                prompt = prompt_template.format(previous_output=previous_output)
            
            # Call Bob Shell
            result = self._call_bob_shell(prompt)
            
            if result is None:
                print(f"Warning: Layer {layer} failed, continuing with empty result", file=sys.stderr)
                result = {}
            
            # Store result
            self.results[layer] = result
            
            # Prepare context for next layer
            previous_output = json.dumps(result, indent=2)
        
        return self.results


def run_pipeline(repo_path: str, diff_content: str, output_format: str = "json") -> Dict[str, Any]:
    """
    Run the Verdict pipeline and return results.
    
    Args:
        repo_path: Path to target git repository
        diff_content: PR diff content
        output_format: Output format (json or text)
        
    Returns:
        Dictionary with all layer results
    """
    pipeline = VerdictPipeline(repo_path, diff_content)
    results = pipeline.run()
    
    return results


if __name__ == "__main__":
    # Simple test mode
    if len(sys.argv) < 2:
        print("Usage: python pipeline.py <repo_path> [diff_file]", file=sys.stderr)
        sys.exit(1)
    
    repo_path = sys.argv[1]
    
    if len(sys.argv) > 2:
        with open(sys.argv[2], 'r') as f:
            diff_content = f.read()
    else:
        diff_content = sys.stdin.read()
    
    results = run_pipeline(repo_path, diff_content)
    print(json.dumps(results, indent=2))

# Made with Bob
