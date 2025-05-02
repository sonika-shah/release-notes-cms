from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/release-notes", tags=["release-notes"])

@router.post("/", response_model=schemas.ReleaseNote)
def create_release_note(release_note: schemas.ReleaseNoteCreate, db: Session = Depends(get_db)):
    return crud.create_release_note(db=db, release_note=release_note)

@router.get("/", response_model=List[schemas.ReleaseNote])
def read_release_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    release_notes = crud.get_release_notes(db, skip=skip, limit=limit)
    return release_notes

@router.get("/{release_note_id}", response_model=schemas.ReleaseNote)
def read_release_note(release_note_id: int, db: Session = Depends(get_db)):
    db_release_note = crud.get_release_note(db, release_note_id=release_note_id)
    if db_release_note is None:
        raise HTTPException(status_code=404, detail="Release note not found")
    return db_release_note

@router.put("/{release_note_id}", response_model=schemas.ReleaseNote)
def update_release_note(
    release_note_id: int,
    release_note: schemas.ReleaseNoteUpdate,
    db: Session = Depends(get_db)
):
    db_release_note = crud.update_release_note(db, release_note_id, release_note)
    if db_release_note is None:
        raise HTTPException(status_code=404, detail="Release note not found")
    return db_release_note

@router.delete("/{release_note_id}")
def delete_release_note(release_note_id: int, db: Session = Depends(get_db)):
    success = crud.delete_release_note(db, release_note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Release note not found")
    return {"message": "Release note deleted successfully"} 