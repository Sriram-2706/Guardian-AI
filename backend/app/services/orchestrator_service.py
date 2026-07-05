from app.agents.sentinel_agent import analyze_security
from app.services.github_service import extract_repo_info, get_file_content, get_repo_tree
from app.services.prioritization_service import rank_files, select_top_files
from app.services.repository_service import filter_repository_files


TOP_FILES = 3


def run_repository_analysis(repo_url: str) -> dict:
    """
    Run the end-to-end repository analysis workflow.
    """
    repo_info = extract_repo_info(repo_url)
    repository_name = repo_info["repo"]

    repository_files = get_repo_tree(repo_url)
    filtered_files = filter_repository_files(repository_files)
    ranked_files = rank_files(filtered_files)
    top_files = select_top_files(ranked_files, limit=TOP_FILES)
    security_findings = []

    for file_info in top_files:
        file_path = file_info.get("path", "")
        file_content = get_file_content(repo_url, file_path)
        finding = analyze_security(file_path, file_content)
        security_findings.append(finding)

    return {
        "repository": repository_name,
        "total_files": len(repository_files),
        "candidate_files": len(filtered_files),
        "top_files": top_files,
        "security_findings": security_findings,
    }
