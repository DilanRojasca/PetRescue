"""Main entrypoint for the PetRescue backend API.

This module initializes the FastAPI application, configures the main
router and basic middleware, and exposes the `app` object that will be
used by the ASGI server (uvicorn, hypercorn, etc.).

The idea is to keep this file very small and delegate logic to
routers, services, models, and repositories following an MVC-inspired
architecture:

- Models:   `app.models.*` (domain / persistence models)
- Views:    API responses encoded via Pydantic schemas in `app.schemas.*`
- Controllers: Routers in `app.api.v1.routes.*` that receive HTTP
  requests and orchestrate calls to services.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.v1.routes import animals, health, upload


def create_app() -> FastAPI:
    """Application factory.

    Using a factory pattern helps later when you want to configure
    different settings for tests, staging, or production.
    """

    app = FastAPI(
        title="PetRescue Map API",
        description=(
            "API para reportar animales callejeros o en riesgo, "
            "permitiendo registrar casos, hacer seguimiento y "
            "coordinar ayuda entre voluntarios y refugios."
        ),
        version="0.1.0",
    )

    # Configure CORS - Permitir todos los orígenes
    # En producción, Railway y Vercel necesitan acceso completo
    allowed_origins = ["*"]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    # Create uploads directory if it doesn't exist
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Mount static files for uploaded images
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

    # Include versioned routers (controllers)
    app.include_router(health.router, prefix="/api/v1", tags=["health"])
    app.include_router(animals.router, prefix="/api/v1", tags=["animals"])
    app.include_router(upload.router, prefix="/api/v1", tags=["upload"])
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {"message": "PetRescue API", "version": "0.1.0"}

    return app


# ASGI application instance used by uvicorn: `uvicorn app.main:app --reload`
app = create_app()
