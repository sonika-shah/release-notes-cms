from fastapi import FastAPI, Depends, HTTPException, UploadFile, File as FastAPIFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from app import crud
from app.models import Base
from app.schemas import Bucket, BucketCreate, BucketUpdate, File
from app.database import engine, get_db
from app.storage_service import file_storage
from sqlalchemy.sql import func

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Release Notes CMS",
    description="A modern Content Management System for managing release notes",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Release Notes CMS",
        version="1.0.0",
        description="A modern Content Management System for managing release notes",
        routes=app.routes,
    )
    openapi_schema["components"]["schemas"]["UploadFile"] = {
        "title": "UploadFile",
        "type": "object",
        "properties": {
            "file": {
                "title": "File",
                "type": "string",
                "format": "binary"
            },
            "description": {
                "title": "Description",
                "type": "string"
            }
        }
    }
    openapi_schema["components"]["schemas"]["UpdateFileContent"] = {
        "title": "UpdateFileContent",
        "type": "object",
        "properties": {
            "file": {
                "title": "File",
                "type": "string",
                "format": "binary",
                "description": "New file content to replace existing file"
            }
        },
        "required": ["file"]
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/")
def read_root():
    return {"message": "Welcome to Release Notes CMS API"}

@app.get("/buckets/", response_model=List[Bucket])
def read_buckets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    buckets = crud.get_buckets(db, skip=skip, limit=limit)
    return buckets

@app.get("/buckets/{bucket_id}", response_model=Bucket)
def read_bucket(bucket_id: int, db: Session = Depends(get_db)):
    db_bucket = crud.get_bucket_with_files(db, bucket_id=bucket_id)
    if db_bucket is None:
        raise HTTPException(status_code=404, detail="Release bucket not found")
    return db_bucket

@app.post("/buckets/", response_model=Bucket)
def create_bucket(bucket: BucketCreate, db: Session = Depends(get_db)):
    return crud.create_bucket(db=db, bucket=bucket)

@app.put("/buckets/{bucket_id}", response_model=Bucket)
def update_bucket(
    bucket_id: int,
    bucket: BucketUpdate,
    db: Session = Depends(get_db)
):
    db_bucket = crud.update_bucket(db, bucket_id=bucket_id, bucket=bucket)
    if db_bucket is None:
        raise HTTPException(status_code=404, detail="Release bucket not found")
    return db_bucket

@app.delete("/buckets/{bucket_id}")
def delete_bucket(bucket_id: int, db: Session = Depends(get_db)):
    success = crud.delete_bucket(db, bucket_id=bucket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Release bucket not found")
    return {"message": "Release bucket and associated files deleted successfully"}

@app.post("/buckets/{bucket_id}/files/", response_model=File)
async def upload_file(
    bucket_id: int,
    file: UploadFile = FastAPIFile(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Verify bucket exists
    db_bucket = crud.get_bucket(db, bucket_id=bucket_id)
    if not db_bucket:
        raise HTTPException(status_code=404, detail="Release bucket not found")

    try:
        # Read file content
        contents = await file.read()
        
        # Save file and create record
        db_file = crud.create_file(
            db=db,
            file_data=contents,
            original_name=file.filename,
            bucket_id=bucket_id,
            description=description
        )
        return db_file
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

@app.get("/buckets/{bucket_id}/files/", response_model=List[File])
def get_bucket_files(
    bucket_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.get_files(db, bucket_id=bucket_id, skip=skip, limit=limit)

@app.get("/files/{file_id}/download")
async def download_file(file_id: int, db: Session = Depends(get_db)):
    db_file = crud.get_file(db, file_id=file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=db_file.storage_path,
        filename=db_file.original_name,
        media_type=db_file.file_type
    )

@app.delete("/files/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    success = crud.delete_file(db, file_id=file_id)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}

@app.put("/files/{file_id}/content")
async def update_file_content(
    file_id: int,
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db)
):
    """
    Update the content of an existing file.
    
    - **file_id**: The ID of the file to update
    - **file**: The new file content to replace the existing file
    - **Returns**: Success message and updated file information
    
    This endpoint allows you to replace the content of an existing file while maintaining
    the same file ID and metadata. The file size and updated timestamp will be automatically
    updated in the database.
    """
    db_file = crud.get_file(db, file_id=file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # Read new file content
        contents = await file.read()
        
        # Update file in storage
        success = file_storage.update_file(db_file.storage_path, contents)
        if not success:
            raise HTTPException(status_code=500, detail="Error updating file content")
        
        # Update file metadata in database
        db_file.file_size = len(contents)
        db_file.updated_at = func.now()
        db.commit()
        db.refresh(db_file)
        
        return {"message": "File content updated successfully", "file": db_file}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating file: {str(e)}")

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy"},
        status_code=200
    ) 