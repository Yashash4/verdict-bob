#!/usr/bin/env python3
"""
Verdict CLI - Command-line interface for the Verdict PR analysis pipeline.

Usage:
    python verdict_cli.py --repo /path/to/repo --diff changes.diff
    python verdict_cli.py --repo /path/to/repo < changes.diff
    python verdict_cli.py --repo /path/to/repo --diff changes.diff --format json --output report.json
"""

import argparse
import sys
import json
from pathlib import Path
from typing import Dict, Any

from pipeline import run_pipeline


def format_text_output(results: Dict[str, Any]) -> str:
    """
    Format pipeline results as human-readable text.
    
    Args:
        results: Dictionary with all layer results
        
    Returns:
        Formatted text output
    """
    output = []
    output.append("=" * 80)
    output.append("VERDICT REPORT")
    output.append("=" * 80)
    output.append("")
    
    # Check if synthesis layer exists and has content
    synthesis = results.get("synthesis", {})
    
    if not synthesis:
        output.append("⚠️  WARNING: Synthesis layer failed or returned no output")
        output.append("")
    
    # Display synthesis output (the final comment)
    if synthesis:
        # If synthesis has a 'findings' field with text content
        if "findings" in synthesis:
            findings = synthesis["findings"]
            if isinstance(findings, str):
                output.append(findings)
            elif isinstance(findings, list):
                output.append("\n".join(str(f) for f in findings))
            else:
                output.append(json.dumps(findings, indent=2))
        else:
            # Otherwise dump the whole synthesis object
            output.append(json.dumps(synthesis, indent=2))
        output.append("")
    
    # Add summary of other layers
    output.append("-" * 80)
    output.append("LAYER SUMMARY")
    output.append("-" * 80)
    
    # Map layers to their specific output keys
    layer_keys = {
        "semantic": ["findings"],
        "blast": ["findings"],
        "mutation": ["findings"],
        "incident": ["findings"],
        "questions": ["findings"]
    }
    
    for layer in ["semantic", "blast", "mutation", "incident", "questions"]:
        layer_data = results.get(layer, {})
        if layer_data:
            # Count items from the appropriate keys for this layer
            count = 0
            for key in layer_keys[layer]:
                items = layer_data.get(key, [])
                if isinstance(items, list):
                    count += len(items)
            output.append(f"✓ {layer.upper()}: {count} findings")
        else:
            output.append(f"✗ {layer.upper()}: No output")
    
    output.append("")
    output.append("=" * 80)
    
    return "\n".join(output)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Verdict PR Analysis Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Analyze a diff file
  python verdict_cli.py --repo /path/to/repo --diff changes.diff
  
  # Read diff from stdin
  git diff main | python verdict_cli.py --repo /path/to/repo
  
  # Output as JSON
  python verdict_cli.py --repo /path/to/repo --diff changes.diff --format json
  
  # Save to file
  python verdict_cli.py --repo /path/to/repo --diff changes.diff --output report.txt
        """
    )
    
    parser.add_argument(
        "--repo",
        required=True,
        help="Path to the target git repository"
    )
    
    parser.add_argument(
        "--diff",
        help="Path to PR diff file (default: read from stdin)"
    )
    
    parser.add_argument(
        "--format",
        choices=["json", "text"],
        default="text",
        help="Output format (default: text)"
    )
    
    parser.add_argument(
        "--output",
        help="Output file path (default: stdout)"
    )
    
    args = parser.parse_args()
    
    # Validate repo path
    repo_path = Path(args.repo)
    if not repo_path.exists():
        print(f"Error: Repository path does not exist: {args.repo}", file=sys.stderr)
        sys.exit(1)
    
    if not (repo_path / ".git").exists():
        print(f"Error: Not a git repository: {args.repo}", file=sys.stderr)
        sys.exit(1)
    
    # Read diff content
    try:
        if args.diff:
            diff_path = Path(args.diff)
            if not diff_path.exists():
                print(f"Error: Diff file does not exist: {args.diff}", file=sys.stderr)
                sys.exit(1)
            with open(diff_path, 'r', encoding='utf-8') as f:
                diff_content = f.read()
        else:
            # Read from stdin
            diff_content = sys.stdin.read()
        
        if not diff_content.strip():
            print("Error: Diff content is empty", file=sys.stderr)
            sys.exit(1)
    
    except Exception as e:
        print(f"Error reading diff: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Run the pipeline
    print("Running Verdict pipeline...", file=sys.stderr)
    print(f"Repository: {args.repo}", file=sys.stderr)
    print(f"Diff size: {len(diff_content)} bytes", file=sys.stderr)
    print("", file=sys.stderr)
    
    try:
        results = run_pipeline(str(repo_path), diff_content, args.format)
    except Exception as e:
        print(f"Error running pipeline: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Check if synthesis layer succeeded
    synthesis = results.get("synthesis", {})
    if not synthesis:
        print("Warning: Synthesis layer failed or returned no output", file=sys.stderr)
        exit_code = 1
    else:
        exit_code = 0
    
    # Format output
    if args.format == "json":
        output_text = json.dumps(results, indent=2)
    else:
        output_text = format_text_output(results)
    
    # Write output
    try:
        if args.output:
            output_path = Path(args.output)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(output_text)
            print(f"Output written to: {args.output}", file=sys.stderr)
        else:
            print(output_text)
    
    except Exception as e:
        print(f"Error writing output: {e}", file=sys.stderr)
        sys.exit(1)
    
    sys.exit(exit_code)


if __name__ == "__main__":
    main()

# Made with Bob
