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

Pre-computed cross-layer matches:
{cross_layer_matches}

RULE: If cross_layer_matches is non-empty, TL;DR sentence 1 MUST be
the exact `killer_line` string from cross_layer_matches[0].
Copy it verbatim. Do not paraphrase. Do not omit.

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
    
    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Extract JSON from text using multiple strategies.
        
        Args:
            text: Text that may contain JSON
            
        Returns:
            Parsed JSON dict or None if extraction fails
        """
        # Strategy 1: Check for ```json markdown block
        if "```json" in text:
            json_start = text.find("```json") + 7
            json_end = text.find("```", json_start)
            if json_end != -1:
                try:
                    return json.loads(text[json_start:json_end].strip())
                except json.JSONDecodeError:
                    pass
        
        # Strategy 2: Check for ``` markdown block
        if "```" in text:
            json_start = text.find("```") + 3
            json_end = text.find("```", json_start)
            if json_end != -1:
                try:
                    return json.loads(text[json_start:json_end].strip())
                except json.JSONDecodeError:
                    pass
        
        # Strategy 3: Brace matching - find first { and its matching }
        first_brace = text.find("{")
        if first_brace != -1:
            depth = 0
            in_string = False
            escape_next = False
            
            for i in range(first_brace, len(text)):
                char = text[i]
                
                if escape_next:
                    escape_next = False
                    continue
                
                if char == '\\':
                    escape_next = True
                    continue
                
                if char == '"' and not escape_next:
                    in_string = not in_string
                    continue
                
                if not in_string:
                    if char == '{':
                        depth += 1
                    elif char == '}':
                        depth -= 1
                        if depth == 0:
                            # Found matching brace
                            try:
                                return json.loads(text[first_brace:i+1])
                            except json.JSONDecodeError:
                                pass
                            break
        
        return None
    
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
            
            # Try to parse JSON from output using robust extraction
            raw_output = result.stdout.strip()
            result_json = self._extract_json(raw_output)
            
            if result_json is None:
                print(f"Failed to extract JSON from Bob Shell output", file=sys.stderr)
                print(f"Output was: {raw_output[:500]}", file=sys.stderr)
            
            return result_json
        
        except subprocess.TimeoutExpired:
            print(f"Bob Shell timed out after {timeout}s", file=sys.stderr)
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
                prompt = prompt_template.replace("{diff_content}", self.diff_content)
            elif layer == "synthesis":
                # Pre-compute cross-layer matches before synthesis
                self._compute_cross_layer_matches()
                
                # Synthesis needs ALL layer outputs plus pre-computed matches
                all_layers_json = json.dumps(self.results, indent=2)
                cross_layer_matches_json = json.dumps(
                    self.results.get("cross_layer_matches", []),
                    indent=2
                )
                prompt = prompt_template.replace("{cross_layer_matches}", cross_layer_matches_json).replace("{all_layers}", all_layers_json)
            else:
                prompt = prompt_template.replace("{previous_output}", previous_output)
            
            # Call Bob Shell with retry on failure
            result = self._call_bob_shell(prompt)
            
            if result is None:
                print(f"Layer {layer} failed, retrying once...", file=sys.stderr)
                result = self._call_bob_shell(prompt)
                
                if result is None:
                    print(f"Warning: Layer {layer} failed after retry, continuing with empty result", file=sys.stderr)
                    result = {}
            
            # Store result
            self.results[layer] = result
            
            # Prepare context for next layer
            previous_output = json.dumps(result, indent=2)
        
        return self.results
    
    def _compute_cross_layer_matches(self):
        """
        Pre-compute cross-layer matches between mutations and incidents.
        This ensures the killer line is reliably generated before synthesis.
        """
        try:
            # Import the MCP tool directly
            mcp_server_path = os.path.join(os.path.dirname(__file__), '..', 'mcp-server')
            if mcp_server_path not in sys.path:
                sys.path.insert(0, mcp_server_path)
            
            from server import find_cross_layer_match  # type: ignore
            
            # Extract mutations from mutation layer
            mutation_data = self.results.get("mutation", {})
            mutations = (
                mutation_data.get("next_mode_input", {}).get("survivors", []) or
                mutation_data.get("findings", [])
            )
            
            # Extract incidents from incident layer
            incident_data = self.results.get("incident", {})
            incidents = (
                incident_data.get("next_mode_input", {}).get("incidents", []) or
                incident_data.get("findings", [])
            )
            
            # Call the MCP tool directly
            if mutations and incidents:
                matches = find_cross_layer_match(mutations, incidents)
                self.results["cross_layer_matches"] = matches
                print(f"Found {len(matches)} cross-layer matches", file=sys.stderr)
            else:
                self.results["cross_layer_matches"] = []
                print("No mutations or incidents to match", file=sys.stderr)
        
        except Exception as e:
            print(f"Error computing cross-layer matches: {e}", file=sys.stderr)
            self.results["cross_layer_matches"] = []


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
