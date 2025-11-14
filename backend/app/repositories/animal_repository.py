"""In-memory repository for AnimalCase records.

This acts as a very simple data access layer that mimics what a real
repository would do against a database. For the hackathon you can keep
this in-memory implementation, and later replace it with real
persistence (PostgreSQL, MongoDB, etc.) without touching the routers.
"""

from typing import Dict, List, Optional

from app.models.animal import AnimalCase


class AnimalRepository:
    """Very small in-memory repository for animal cases."""

    def __init__(self) -> None:
        # Internal storage: maps case ID -> AnimalCase instance
        self._storage: Dict[int, AnimalCase] = {}
        self._id_counter: int = 1

    def list_cases(self) -> List[AnimalCase]:
        """Return all stored cases.

        In a real repository this would translate to a `SELECT *` query.
        """

        return list(self._storage.values())

    def create_case(
        self,
        description: str,
        latitude: float,
        longitude: float,
        image_url: str | None = None,
    ) -> AnimalCase:
        """Create and persist a new animal case.

        Parameters are explicit instead of receiving a Pydantic model to
        keep this layer independent from the web layer.
        """

        new_case = AnimalCase(
            id=self._id_counter,
            description=description,
            latitude=latitude,
            longitude=longitude,
            image_url=image_url,
        )
        self._storage[self._id_counter] = new_case
        self._id_counter += 1
        return new_case

    def get_case_by_id(self, case_id: str) -> Optional[AnimalCase]:
        """Get a case by its ID."""
        try:
            return self._storage.get(int(case_id))
        except (ValueError, KeyError):
            return None

    def update_case(
        self,
        case_id: str,
        description: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        image_url: Optional[str] = None,
        status: Optional[str] = None,
    ) -> Optional[AnimalCase]:
        """Update an existing case."""
        try:
            case = self._storage.get(int(case_id))
            if not case:
                return None

            if description is not None:
                case.description = description
            if latitude is not None:
                case.latitude = latitude
            if longitude is not None:
                case.longitude = longitude
            if image_url is not None:
                case.image_url = image_url
            if status is not None:
                case.status = status

            return case
        except (ValueError, KeyError):
            return None

    def delete_case(self, case_id: str) -> bool:
        """Delete a case by ID."""
        try:
            case_id_int = int(case_id)
            if case_id_int in self._storage:
                del self._storage[case_id_int]
                return True
            return False
        except (ValueError, KeyError):
            return False


# Singleton-like repository instance for quick hacking.
repository = AnimalRepository()
