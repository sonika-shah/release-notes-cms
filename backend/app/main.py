from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bucket CMS",
    description="A modern Content Management System for managing buckets",
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

@app.get("/")
def read_root():
    return {"message": "Welcome to Call Bucket CMS API"}

@app.get("/buckets/", response_model=List[schemas.Bucket])
def read_buckets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    buckets = crud.get_buckets(db, skip=skip, limit=limit)
    return buckets

@app.get("/buckets/{bucket_id}", response_model=schemas.Bucket)
def read_bucket(bucket_id: int, db: Session = Depends(get_db)):
    db_bucket = crud.get_bucket(db, bucket_id=bucket_id)
    if db_bucket is None:
        raise HTTPException(status_code=404, detail="Call bucket not found")
    return db_bucket

@app.post("/buckets/", response_model=schemas.Bucket)
def create_bucket(bucket: schemas.BucketCreate, db: Session = Depends(get_db)):
    return crud.create_bucket(db=db, bucket=bucket)

@app.put("/buckets/{bucket_id}", response_model=schemas.Bucket)
def update_bucket(
    bucket_id: int,
    bucket: schemas.BucketUpdate,
    db: Session = Depends(get_db)
):
    db_bucket = crud.update_bucket(db, bucket_id=bucket_id, bucket=bucket)
    if db_bucket is None:
        raise HTTPException(status_code=404, detail="Bucket not found")
    return db_bucket

@app.delete("/buckets/{bucket_id}")
def delete_bucket(bucket_id: int, db: Session = Depends(get_db)):
    success = crud.delete_bucket(db, bucket_id=bucket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Bucket not found")
    return {"message": "Bucket deleted successfully"}

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy"},
        status_code=200
    ) 