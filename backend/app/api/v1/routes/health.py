"""Health check endpoints.

These endpoints are used to quickly verify that the API is up and
running. They do not touch the database and are safe to expose for
monitoring or load balancers.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", summary="Simple health check", tags=["health"])
async def health_check() -> dict:
    """Return a simple JSON payload indicating the service is alive."""

    return {"status": "ok"}
