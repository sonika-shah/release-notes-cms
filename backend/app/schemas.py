from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class FileBase(BaseModel):
    original_name: str
    description: Optional[str] = None

class FileCreate(FileBase):
    pass

class File(FileBase):
    id: int
    storage_path: str
    file_type: str
    file_size: float
    bucket_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BucketBase(BaseModel):
    title: str
    slug: str

class BucketCreate(BucketBase):
    version: Optional[str] = None
    release_date: Optional[datetime] = None
    content: Optional[str] = None
    is_published: Optional[bool] = False

class BucketUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    version: Optional[str] = None
    release_date: Optional[datetime] = None
    is_published: Optional[bool] = None

class Bucket(BucketBase):
    id: int
    version: Optional[str]
    release_date: Optional[datetime]
    content: Optional[str]
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    files: List[File] = []

    class Config:
        from_attributes = True 