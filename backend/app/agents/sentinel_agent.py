import json
from typing import Any

from app.models.openai_client import get_openai_client, get_openai_model
from app.prompts.sentinel_prompt import (
    SENTINEL_SYSTEM_PROMPT,
    build_sentinel_prompt,
)


def analyze_security(file_path: str, file_content: str) -> dict[str, Any]:
    """
    Analyze a file for security issues using the Sentinel agent.
    """
    client = get_openai_client()
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
