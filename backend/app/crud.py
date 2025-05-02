from sqlalchemy.orm import Session
from . import models, schemas

def get_call_bucket(db: Session, call_bucket_id: int):
    return db.query(models.CallBucket).filter(models.CallBucket.id == call_bucket_id).first()

def get_call_buckets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CallBucket).offset(skip).limit(limit).all()

def create_call_bucket(db: Session, call_bucket: schemas.CallBucketCreate):
    db_call_bucket = models.CallBucket(**call_bucket.model_dump())
    db.add(db_call_bucket)
    db.commit()
    db.refresh(db_call_bucket)
    return db_call_bucket

def update_call_bucket(db: Session, call_bucket_id: int, call_bucket: schemas.CallBucketUpdate):
    db_call_bucket = db.query(models.CallBucket).filter(models.CallBucket.id == call_bucket_id).first()
    if db_call_bucket:
        update_data = call_bucket.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_call_bucket, key, value)
        db.commit()
        db.refresh(db_call_bucket)
    return db_call_bucket

def delete_call_bucket(db: Session, call_bucket_id: int):
    db_call_bucket = db.query(models.CallBucket).filter(models.CallBucket.id == call_bucket_id).first()
    if db_call_bucket:
        db.delete(db_call_bucket)
        db.commit()
        return True
    return False 