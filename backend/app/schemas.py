from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReleaseNoteBase(BaseModel):
    title: str
    content: str
    version: str
    release_date: datetime
    is_published: bool = False

class ReleaseNoteCreate(ReleaseNoteBase):
    pass

class ReleaseNoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    version: Optional[str] = None
    release_date: Optional[datetime] = None
    is_published: Optional[bool] = None

class ReleaseNote(ReleaseNoteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 