from sqlalchemy.orm import Session
from . import models, schemas

def get_call_bucket(db: Session, call_bucket_id: int):
    return db.query(models.CallBucket).filter(models.CallBucket.id == call_bucket_id).first()

def get_call_buckets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CallBucket).offset(skip).limit(limit).all()
    return db.query(models.Bucket).offset(skip).limit(limit).all()

def create_bucket(db: Session, bucket: schemas.BucketCreate):
    db_bucket = models.Bucket(**bucket.model_dump())
    db.add(db_bucket)
    db.commit()
    db.refresh(db_bucket)
    return db_bucket

def update_bucket(db: Session, bucket_id: int, bucket: schemas.BucketUpdate):
    db_bucket = db.query(models.Bucket).filter(models.Bucket.id == bucket_id).first()
    if db_bucket:
        update_data = bucket.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_bucket, key, value)
        db.commit()
        db.refresh(db_bucket)
    return db_call_bucket

def delete_call_bucket(db: Session, call_bucket_id: int):
    db_call_bucket = db.query(models.CallBucket).filter(models.CallBucket.id == call_bucket_id).first()
    if db_call_bucket:
        db.delete(db_call_bucket)
        db.commit()
        return True
    return False 