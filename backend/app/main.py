from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .routers import release_notes

app = FastAPI(
    title="Release Notes CMS",
    description="A modern Content Management System for managing release notes",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(release_notes.router)

@app.get("/")
async def root():
    return JSONResponse(
        content={"message": "Welcome to Release Notes CMS API"},
        status_code=200
    )

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy"},
        status_code=200
    ) 