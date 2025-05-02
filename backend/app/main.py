from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from .routers import release_notes
from . import crud, models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

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
def read_root():
    return {"message": "Welcome to Release Notes CMS API"}

@app.get("/release-notes/", response_model=List[schemas.ReleaseNote])
def read_release_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    release_notes = crud.get_release_notes(db, skip=skip, limit=limit)
    return release_notes

@app.get("/release-notes/{release_note_id}", response_model=schemas.ReleaseNote)
def read_release_note(release_note_id: int, db: Session = Depends(get_db)):
    db_release_note = crud.get_release_note(db, release_note_id=release_note_id)
    if db_release_note is None:
        raise HTTPException(status_code=404, detail="Release note not found")
    return db_release_note

@app.post("/release-notes/", response_model=schemas.ReleaseNote)
def create_release_note(release_note: schemas.ReleaseNoteCreate, db: Session = Depends(get_db)):
    return crud.create_release_note(db=db, release_note=release_note)

@app.put("/release-notes/{release_note_id}", response_model=schemas.ReleaseNote)
def update_release_note(
    release_note_id: int,
    release_note: schemas.ReleaseNoteUpdate,
    db: Session = Depends(get_db)
):
    db_release_note = crud.update_release_note(db, release_note_id=release_note_id, release_note=release_note)
    if db_release_note is None:
        raise HTTPException(status_code=404, detail="Release note not found")
    return db_release_note

@app.delete("/release-notes/{release_note_id}")
def delete_release_note(release_note_id: int, db: Session = Depends(get_db)):
    success = crud.delete_release_note(db, release_note_id=release_note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Release note not found")
    return {"message": "Release note deleted successfully"}

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy"},
        status_code=200
    ) 