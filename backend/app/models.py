from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Bucket(Base):
    __tablename__ = "buckets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    content = Column(String)
    version = Column(String)
    release_date = Column(DateTime(timezone=True))
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship with files
    files = relationship("File", back_populates="bucket", cascade="all, delete-orphan")

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    original_name = Column(String)
    storage_path = Column(String)  # Path where file is stored
    file_type = Column(String)     # MIME type
    file_size = Column(Float)      # Size in bytes
    description = Column(String, nullable=True)  # Optional description of the file
    bucket_id = Column(Integer, ForeignKey("buckets.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship with bucket
    bucket = relationship("Bucket", back_populates="files") 