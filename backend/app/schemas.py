from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BucketBase(BaseModel):
    title: str
    slug: str

class BucketCreate(BucketBase):
    pass

class BucketUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    version: Optional[str] = None
    release_date: Optional[datetime] = None
    is_published: Optional[bool] = None

class Bucket(BucketBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 