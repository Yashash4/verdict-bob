from mcp.server.fastmcp import FastMCP
import subprocess
import os
import re
from pathlib import Path
from typing import List, Dict, Any

mcp = FastMCP("verdict-tools")
REPO_PATH = os.environ.get("VERDICT_REPO_PATH", ".")


@mcp.tool()
def get_git_history(file_path: str, since_days: int = 90) -> List[Dict[str, str]]:
    """
    Get git commit history for a specific file.
    
    Args:
        file_path: Path to the file relative to repository root
        since_days: Number of days to look back (default: 90)
    
    Returns:
        List of commits with sha, date, and message
    """
    try:
        cmd = [
            "git", "log",
            f"--since={since_days} days ago",
            "--follow",
            "--format=%H|%ai|%s",
            "--",
            file_path
        ]
        
        result = subprocess.run(
            cmd,
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            return []
        
        commits = []
        for line in result.stdout.strip().split('\n'):
            if not line:
                continue
            
            parts = line.split('|', 2)
            if len(parts) == 3:
                sha, date, message = parts
                commits.append({
                    "sha": sha[:8],
                    "date": date.split()[0],
                    "message": message
                })
        
        return commits
    
    except Exception:
        return []


@mcp.tool()
def find_incident_commits(file_paths: List[str]) -> List[Dict[str, Any]]:
    """
    Find incident-related commits and parse INCIDENTS.md.
    
    Args:
        file_paths: List of file paths to search for incidents
    
    Returns:
        List of incidents with id, date, files, lines, and summary
    """
    try:
        incidents = {}
        
        incidents_file = Path(REPO_PATH) / "INCIDENTS.md"
        if incidents_file.exists():
            try:
                content = incidents_file.read_text(encoding='utf-8')
                
                incident_pattern = r'(INC-\d{4}-\d{4})'
                incident_ids = re.findall(incident_pattern, content)
                
                for inc_id in incident_ids:
                    if inc_id in incidents:
                        continue
                    
                    inc_section_match = re.search(
                        rf'{re.escape(inc_id)}.*?(?=INC-\d{{4}}-\d{{4}}|\Z)',
                        content,
                        re.DOTALL
                    )
                    
                    if not inc_section_match:
                        continue
                    
                    section = inc_section_match.group(0)
                    
                    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', section)
                    date = date_match.group(1) if date_match else ""
                    
                    files = re.findall(r'`([^`]+\.py)`', section)
                    
                    lines = []
                    line_patterns = [
                        r'lines?\s+(\d+)-(\d+)',
                        r'lines?\s+(\d+)',
                    ]
                    
                    for pattern in line_patterns:
                        matches = re.findall(pattern, section, re.IGNORECASE)
                        for match in matches:
                            if isinstance(match, tuple):
                                if len(match) == 2:
                                    start, end = int(match[0]), int(match[1])
                                    lines.extend(range(start, end + 1))
                                else:
                                    lines.append(int(match[0]))
                            else:
                                lines.append(int(match))
                    
                    lines = sorted(set(lines))
                    
                    root_cause = ""
                    root_cause_match = re.search(
                        r'Root cause:\s*(.+?)(?:\n\n|\n[A-Z]|\Z)',
                        section,
                        re.DOTALL | re.IGNORECASE
                    )
                    if root_cause_match:
                        root_cause = root_cause_match.group(1).strip()
                    
                    incidents[inc_id] = {
                        "id": inc_id,
                        "date": date,
                        "files": files,
                        "lines": lines,
                        "summary": root_cause
                    }
            
            except Exception:
                pass
        
        if file_paths:
            try:
                cmd = ["git", "log", "--format=%H|%ai|%s", "--"] + file_paths
                
                result = subprocess.run(
                    cmd,
                    cwd=REPO_PATH,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    incident_keywords = ['fix:', 'hotfix:', 'revert:', 'rollback:', 'INC-']
                    
                    for line in result.stdout.strip().split('\n'):
                        if not line:
                            continue
                        
                        parts = line.split('|', 2)
                        if len(parts) != 3:
                            continue
                        
                        sha, date, message = parts
                        
                        if not any(keyword in message for keyword in incident_keywords):
                            continue
                        
                        inc_match = re.search(r'INC-\d{4}-\d{4}', message)
                        if inc_match:
                            inc_id = inc_match.group(0)
                            if inc_id not in incidents:
                                incidents[inc_id] = {
                                    "id": inc_id,
                                    "date": date.split()[0],
                                    "files": file_paths,
                                    "lines": [],
                                    "summary": message
                                }
            
            except Exception:
                pass
        
        return list(incidents.values())
    
    except Exception:
        return []


@mcp.tool()
def find_cross_layer_match(
    mutations: List[Dict[str, Any]],
    incidents: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Match mutations to incidents by file and line proximity.
    
    Args:
        mutations: List of mutation dicts with id, file, line, and optional function_name
        incidents: List of incident dicts with id, files, lines, and summary
    
    Returns:
        List of matches with mutation_id, incident_id, line_distance, and killer_line
    """
    try:
        matches = []
        
        for mutation in mutations:
            mut_id = mutation.get("id", "")
            mut_file = mutation.get("file", "")
            mut_line = mutation.get("line", 0)
            
            if not mut_id or not mut_file or not mut_line:
                continue
            
            for incident in incidents:
                inc_id = incident.get("id", "")
                inc_files = incident.get("files", [])
                inc_lines = incident.get("lines", [])
                
                if not inc_id or not inc_files:
                    continue
                
                file_match = False
                for inc_file in inc_files:
                    if mut_file.endswith(inc_file) or inc_file in mut_file or mut_file in inc_file:
                        file_match = True
                        break
                
                if not file_match:
                    continue
                
                if not inc_lines:
                    continue
                
                min_distance = float('inf')
                for inc_line in inc_lines:
                    distance = abs(mut_line - inc_line)
                    if distance < min_distance:
                        min_distance = distance
                
                if min_distance <= 5:
                    matches.append({
                        "mutation_id": mut_id,
                        "incident_id": inc_id,
                        "mutation_file": mut_file,
                        "mutation_line": mut_line,
                        "line_distance": min_distance,
                        "killer_line": f"Surviving mutation {mut_id} is the same code path that caused {inc_id}"
                    })
        
        matches.sort(key=lambda x: x["line_distance"])
        
        return matches
    
    except Exception:
        return []


if __name__ == "__main__":
    mcp.run()

# Made with Bob
