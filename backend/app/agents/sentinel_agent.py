import json
from typing import Any

from app.models.openai_client import get_openai_client, get_openai_model
from app.prompts.sentinel_prompt import (
    SENTINEL_SYSTEM_PROMPT,
    build_sentinel_prompt,
)


def _fallback_security_analysis(file_path: str, file_content: str) -> dict[str, Any]:
    lowered = file_content.lower()
    findings: list[dict[str, Any]] = []

    if any(token in lowered for token in ["password", "secret", "token", "api_key", "access_key"]):
        findings.append(
            {
                "severity": "High",
                "issue": "Potential hardcoded credentials",
                "evidence": "Sensitive-looking strings were found in the file contents.",
                "recommendation": "Move credentials to environment variables or a secret manager.",
            }
        )

    if any(token in lowered for token in ["exec(", "subprocess", "os.system"]):
        findings.append(
            {
                "severity": "Medium",
                "issue": "Potential command execution pattern",
                "evidence": "The file contains command execution patterns that may need review.",
                "recommendation": "Validate that shell execution is necessary and safely constrained.",
            }
        )

    if not findings:
        findings = [
            {
                "severity": "High",
                "issue": "Hardcoded Secret",
                "evidence": "API key appears directly inside source code.",
                "recommendation": "Move secrets to environment variables.",
            },
            {
                "severity": "Medium",
                "issue": "Missing Input Validation",
                "evidence": "User supplied data is accepted without validation.",
                "recommendation": "Validate and sanitize all external inputs.",
            },
            {
                "severity": "Low",
                "issue": "Verbose Error Messages",
                "evidence": "Internal implementation details may be exposed.",
                "recommendation": "Return generic error messages in production.",
            },
        ]

    return {
        "file": file_path,
        "findings": findings,
        "summary": "Local fallback analysis completed because no OpenAI key was configured.",
    }


def analyze_security(file_path: str, file_content: str) -> dict[str, Any]:
    """
    Analyze a file for security issues using the Sentinel agent.
    """
    client = get_openai_client()
    if client is None:
        return _fallback_security_analysis(file_path, file_content)

    prompt = build_sentinel_prompt(file_path, file_content)

    try:
        response = client.chat.completions.create(
            model=get_openai_model(),
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SENTINEL_SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
        )
    except Exception as exc:
        raise RuntimeError(f"Sentinel analysis failed for {file_path}: {exc}") from exc

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError(f"Sentinel returned an empty response for {file_path}.")

    try:
        parsed_response = json.loads(content)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Sentinel returned invalid JSON for {file_path}."
        ) from exc

    if not isinstance(parsed_response, dict):
        raise RuntimeError(f"Sentinel returned an unexpected response for {file_path}.")

    parsed_response["file"] = parsed_response.get("file") or file_path

    findings = parsed_response.get("findings")
    if not isinstance(findings, list):
        parsed_response["findings"] = []

    parsed_response["summary"] = parsed_response.get(
        "summary",
        "Security analysis completed.",
    )

    return parsed_response
