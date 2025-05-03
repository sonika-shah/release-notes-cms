from sqlalchemy.orm import Session
from app.models import Bucket, File
from app.schemas import BucketCreate, BucketUpdate, FileCreate
from app.storage_service import file_storage
import os
from datetime import datetime

def get_buckets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Bucket).offset(skip).limit(limit).all()

def get_bucket(db: Session, bucket_id: int):
    return db.query(Bucket).filter(Bucket.id == bucket_id).first()

def create_bucket(db: Session, bucket: BucketCreate):
    db_bucket = Bucket(**bucket.model_dump())
    db.add(db_bucket)
    db.commit()
    db.refresh(db_bucket)
    return db_bucket

def update_bucket(db: Session, bucket_id: int, bucket: BucketUpdate):
    db_bucket = db.query(Bucket).filter(Bucket.id == bucket_id).first()
    if db_bucket:
        for key, value in bucket.model_dump(exclude_unset=True).items():
            setattr(db_bucket, key, value)
        db.commit()
        db.refresh(db_bucket)
    return db_bucket

def delete_bucket(db: Session, bucket_id: int):
    db_bucket = db.query(Bucket).filter(Bucket.id == bucket_id).first()
    if db_bucket:
        # This will automatically delete associated files due to cascade
        db.delete(db_bucket)
        db.commit()
        return True
    return False

def get_files(db: Session, bucket_id: int, skip: int = 0, limit: int = 100):
    return db.query(File).filter(File.bucket_id == bucket_id).offset(skip).limit(limit).all()

def get_file(db: Session, file_id: int):
    return db.query(File).filter(File.id == file_id).first()

def create_file(db: Session, file_data: bytes, original_name: str, bucket_id: int, description: str = None):
    # Save file to storage
    storage_path, file_type, file_size = file_storage.save_file(
        file_data, original_name, bucket_id
    )
    
    # Create database record
    db_file = File(
        original_name=original_name,
        storage_path=storage_path,
        file_type=file_type,
        file_size=file_size,
        description=description,
        bucket_id=bucket_id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def delete_file(db: Session, file_id: int):
    db_file = db.query(File).filter(File.id == file_id).first()
    if db_file:
        # Delete from storage
        file_storage.delete_file(db_file.storage_path)
        # Delete database record
        db.delete(db_file)
        db.commit()
        return True
    return False

def get_bucket_with_files(db: Session, bucket_id: int):
    return db.query(Bucket).filter(Bucket.id == bucket_id).first() 