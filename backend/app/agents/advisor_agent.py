import json
from typing import Any

from app.models.openai_client import get_openai_client, get_openai_model
from app.prompts.advisor_prompt import (
    ADVISOR_SYSTEM_PROMPT,
    build_advisor_prompt,
)


def generate_executive_summary(
    security_findings: dict,
    quality_findings: dict,
    performance_findings: dict,
) -> dict[str, Any]:
    """
    Generate an executive summary using the Advisor agent.
    """
    client = get_openai_client()
    prompt = build_advisor_prompt(
        security_findings,
        quality_findings,
        performance_findings,
    )

    try:
        response = client.chat.completions.create(
            model=get_openai_model(),
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": ADVISOR_SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
        )
    except Exception as exc:
        raise RuntimeError(
            f"Advisor analysis failed: {exc}"
        ) from exc

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("Advisor returned an empty response.")

    try:
        parsed_response = json.loads(content)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Advisor returned invalid JSON."
        ) from exc

    if not isinstance(parsed_response, dict):
        raise RuntimeError(
            "Advisor returned an unexpected response."
        )

    parsed_response["overall_risk"] = parsed_response.get(
        "overall_risk",
        "low",
    )

    parsed_response["executive_summary"] = parsed_response.get(
        "executive_summary",
        "Repository analysis completed.",
    )

    priority_actions = parsed_response.get("priority_actions")
    if not isinstance(priority_actions, list):
        parsed_response["priority_actions"] = []

    return parsed_response