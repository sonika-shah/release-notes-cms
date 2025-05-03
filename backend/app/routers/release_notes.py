from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/buckets", tags=["buckets"])

@router.post("/", response_model=schemas.Bucket)
def create_bucket(bucket: schemas.BucketCreate, db: Session = Depends(get_db)):
    return crud.create_bucket(db=db, bucket=bucket)

@router.get("/", response_model=List[schemas.Bucket])
def read_buckets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    buckets = crud.get_buckets(db, skip=skip, limit=limit)
    return buckets

@router.get("/{bucket_id}", response_model=schemas.Bucket)
def read_bucket(bucket_id: int, db: Session = Depends(get_db)):
    db_bucket = crud.get_bucket(db, bucket_id=bucket_id)
    if db_bucket is None:
        raise HTTPException(status_code=404, detail="Bucket not found")
    return db_bucket

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