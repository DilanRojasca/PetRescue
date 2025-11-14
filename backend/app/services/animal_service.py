"""Service layer for animal cases.

The service layer encapsulates business rules. Controllers (routers)
should call services instead of repositories directly so you can evolve
business logic without changing the HTTP layer.
"""

from typing import List, Optional

from app.models.animal import AnimalCase
from app.repositories.animal_repository import repository


def list_animal_cases() -> List[AnimalCase]:
    """Return all animal cases.

    At this stage there is no complex business logic, but this function
    is the right place to add filtering, permissions, etc.
    """

    return repository.list_cases()


def create_animal_case(
    *, description: str, latitude: float, longitude: float, image_url: str | None
) -> AnimalCase:
    """Create a new animal case with basic validation.

    Note that FastAPI already validated types, but here we could perform
    extra domain checks (e.g. valid coordinate ranges, rate limiting per
    user, etc.).
    """

    return repository.create_case(
        description=description,
        latitude=latitude,
        longitude=longitude,
        image_url=image_url,
    )


def get_animal_case_by_id(case_id: str) -> Optional[AnimalCase]:
    """Get a single animal case by ID."""
    return repository.get_case_by_id(case_id)


def update_animal_case(
    *,
    case_id: str,
    description: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    image_url: Optional[str] = None,
    status: Optional[str] = None,
) -> Optional[AnimalCase]:
    """Update an existing animal case."""
    return repository.update_case(
        case_id=case_id,
        description=description,
        latitude=latitude,
        longitude=longitude,
        image_url=image_url,
        status=status,
    )


def delete_animal_case(case_id: str) -> bool:
    """Delete an animal case by ID."""
    return repository.delete_case(case_id)
