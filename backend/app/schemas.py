from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CallBucketBase(BaseModel):
    title: str
    slug: str
    content: str
    version: str
    release_date: datetime
    is_published: bool = False

class CallBucketCreate(CallBucketBase):
    pass

class CallBucketUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    version: Optional[str] = None
    release_date: Optional[datetime] = None
    is_published: Optional[bool] = None

class CallBucket(CallBucketBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 