from typing import Any

from pydantic import BaseModel


class RepositoryAnalysisResponse(BaseModel):
    repository: str
    total_files: int
    candidate_files: int
    top_files: list[dict[str, Any]]
    security_findings: list[dict[str, Any]]
    quality_findings: list[dict[str, Any]]
    performance_findings: list[dict[str, Any]]
    advisor_report: dict[str, Any]
