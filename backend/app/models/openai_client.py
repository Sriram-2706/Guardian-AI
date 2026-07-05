import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
DEFAULT_OPENAI_MODEL = "gpt-4o-mini"
_client: OpenAI | None = None


load_dotenv(ENV_FILE)


def get_openai_client() -> OpenAI:
    """
    Return a reusable OpenAI client.
    """
    global _client

    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not set. Add it to backend/.env before using /analyze."
            )

        _client = OpenAI(api_key=api_key)

    return _client


def get_openai_model() -> str:
    """
    Return the model name used by the Sentinel agent.
    """
    return os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL)
