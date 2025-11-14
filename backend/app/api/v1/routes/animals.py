"""Animal-related endpoints (controllers).

These functions receive HTTP requests, delegate to the service layer,
and return Pydantic schemas as responses. This is the "Controller" part
of the MVC-inspired architecture.
"""

from typing import List

from fastapi import APIRouter, status, HTTPException

from app.schemas.animal import AnimalCaseCreate, AnimalCaseRead, AnimalCaseUpdate
from app.services.animal_service import (
    create_animal_case,
    list_animal_cases,
    delete_animal_case,
    update_animal_case,
    get_animal_case_by_id,
)

router = APIRouter(prefix="/animals")


@router.get("/", response_model=List[AnimalCaseRead], summary="Listar casos")
async def list_cases() -> List[AnimalCaseRead]:
    """List all reported animal cases.

    For now this simply dumps the in-memory list of cases. Later you can
    add filters (status, distance, etc.).
    """

    cases = list_animal_cases()
    return [
        AnimalCaseRead(
            id=c.id,
            description=c.description,
            latitude=c.latitude,
            longitude=c.longitude,
            image_url=c.image_url,
            status=c.status,
        )
        for c in cases
    ]


@router.post(
    "/",
    response_model=AnimalCaseRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nuevo caso de animal",
)
async def create_case(payload: AnimalCaseCreate) -> AnimalCaseRead:
    """Create a new animal case from user input.

    The payload is validated by FastAPI using the `AnimalCaseCreate`
    schema. We then pass the validated data to the service.
    """

    case = create_animal_case(
        description=payload.description,
        latitude=payload.latitude,
        longitude=payload.longitude,
        image_url=payload.image_url,
    )
    return AnimalCaseRead(
        id=case.id,
        description=case.description,
        latitude=case.latitude,
        longitude=case.longitude,
        image_url=case.image_url,
        status=case.status,
    )


@router.put(
    "/{case_id}",
    response_model=AnimalCaseRead,
    summary="Actualizar caso de animal",
)
async def update_case(case_id: str, payload: AnimalCaseUpdate) -> AnimalCaseRead:
    """Update an existing animal case."""
    
    case = update_animal_case(
        case_id=case_id,
        description=payload.description,
        latitude=payload.latitude,
        longitude=payload.longitude,
        image_url=payload.image_url,
        status=payload.status,
    )
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    return AnimalCaseRead(
        id=case.id,
        description=case.description,
        latitude=case.latitude,
        longitude=case.longitude,
        image_url=case.image_url,
        status=case.status,
    )


@router.delete(
    "/{case_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar caso de animal",
)
async def delete_case(case_id: str):
    """Delete an animal case by ID."""
    
    success = delete_animal_case(case_id)
    if not success:
        raise HTTPException(status_code=404, detail="Case not found")
    
    return None
