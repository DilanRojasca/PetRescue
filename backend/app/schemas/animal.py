"""Pydantic schemas (views) for AnimalCase.

These classes define how data is exposed and validated at the API
boundary. They are used both as request bodies and as response
models in the controllers (routers).
"""

from typing import Optional

from pydantic import BaseModel, Field


class AnimalCaseBase(BaseModel):
    """Common fields shared by create and update operations."""

    description: str = Field(..., description="Descripción del caso")
    latitude: float = Field(..., description="Latitud de la ubicación")
    longitude: float = Field(..., description="Longitud de la ubicación")
    image_url: Optional[str] = Field(
        None, description="URL de la imagen almacenada del animal"
    )


class AnimalCaseCreate(AnimalCaseBase):
    """Schema used when a user creates a new animal case."""

    pass


class AnimalCaseUpdate(BaseModel):
    """Schema used when updating an existing animal case."""

    description: Optional[str] = Field(None, description="Descripción del caso")
    latitude: Optional[float] = Field(None, description="Latitud de la ubicación")
    longitude: Optional[float] = Field(None, description="Longitud de la ubicación")
    image_url: Optional[str] = Field(None, description="URL de la imagen almacenada del animal")
    status: Optional[str] = Field(None, description="Estado del caso (open/in_progress/resolved)")


class AnimalCaseRead(AnimalCaseBase):
    """Schema used when returning an animal case to the client."""

    id: int = Field(..., description="ID interno del caso")
    status: str = Field(..., description="Estado del caso (open/in_progress/resolved)")

    class Config:
        orm_mode = True
