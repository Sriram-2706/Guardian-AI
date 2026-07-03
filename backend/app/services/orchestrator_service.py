from app.services.github_service import extract_repo_info, get_repo_tree
from app.services.prioritization_service import rank_files, select_top_files
from app.services.repository_service import filter_repository_files


def run_repository_analysis(repo_url: str) -> dict:
    """
    Run the end-to-end repository analysis workflow.
    """
    repo_info = extract_repo_info(repo_url)
    repository_name = repo_info["repo"]

    repository_files = get_repo_tree(repo_url)
    filtered_files = filter_repository_files(repository_files)
    ranked_files = rank_files(filtered_files)
    top_files = select_top_files(ranked_files)

    return {
        "repository": repository_name,
        "total_files": len(repository_files),
        "candidate_files": len(filtered_files),
        "top_files": top_files,
    }
