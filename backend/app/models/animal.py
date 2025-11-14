"""Database / domain model definitions for animals.

In a real project this module would contain ORM models (e.g. SQLAlchemy)
that map to database tables. For the hackathon scaffold we only define
a lightweight in-memory representation so you can iterate quickly.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class AnimalCase:
    """Domain model for a reported animal case.

    Attributes
    ----------
    id: int
        Unique identifier of the case. In a real database this would be
        generated automatically (e.g. auto-increment primary key).
    description: str
        Free-text description of the animal's condition or situation.
    latitude: float
        Latitude coordinate of the animal's location.
    longitude: float
        Longitude coordinate of the animal's location.
    image_url: Optional[str]
        URL where the uploaded photo is stored (S3, local storage, etc.).
    status: str
        Simple status flag (e.g. "open", "in_progress", "resolved").
    """

    id: int
    description: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    status: str = "open"
