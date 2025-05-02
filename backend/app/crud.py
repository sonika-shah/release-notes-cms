from sqlalchemy.orm import Session
from . import models, schemas

def get_release_note(db: Session, release_note_id: int):
    return db.query(models.ReleaseNote).filter(models.ReleaseNote.id == release_note_id).first()

def get_release_notes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ReleaseNote).offset(skip).limit(limit).all()

def create_release_note(db: Session, release_note: schemas.ReleaseNoteCreate):
    db_release_note = models.ReleaseNote(**release_note.dict())
    db.add(db_release_note)
    db.commit()
    db.refresh(db_release_note)
    return db_release_note

def update_release_note(db: Session, release_note_id: int, release_note: schemas.ReleaseNoteUpdate):
    db_release_note = get_release_note(db, release_note_id)
    if db_release_note:
        update_data = release_note.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_release_note, key, value)
        db.commit()
        db.refresh(db_release_note)
    return db_release_note

def delete_release_note(db: Session, release_note_id: int):
    db_release_note = get_release_note(db, release_note_id)
    if db_release_note:
        db.delete(db_release_note)
        db.commit()
        return True
    return False 