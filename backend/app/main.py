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
    title="Call Bucket CMS",
    description="A modern Content Management System for managing call buckets",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Call Bucket CMS API"}

@app.get("/call-buckets/", response_model=List[schemas.CallBucket])
def read_call_buckets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    call_buckets = crud.get_call_buckets(db, skip=skip, limit=limit)
    return call_buckets

@app.get("/call-buckets/{call_bucket_id}", response_model=schemas.CallBucket)
def read_call_bucket(call_bucket_id: int, db: Session = Depends(get_db)):
    db_call_bucket = crud.get_call_bucket(db, call_bucket_id=call_bucket_id)
    if db_call_bucket is None:
        raise HTTPException(status_code=404, detail="Call bucket not found")
    return db_call_bucket

@app.post("/call-buckets/", response_model=schemas.CallBucket)
def create_call_bucket(call_bucket: schemas.CallBucketCreate, db: Session = Depends(get_db)):
    return crud.create_call_bucket(db=db, call_bucket=call_bucket)

@app.put("/call-buckets/{call_bucket_id}", response_model=schemas.CallBucket)
def update_call_bucket(
    call_bucket_id: int,
    call_bucket: schemas.CallBucketUpdate,
    db: Session = Depends(get_db)
):
    db_call_bucket = crud.update_call_bucket(db, call_bucket_id=call_bucket_id, call_bucket=call_bucket)
    if db_call_bucket is None:
        raise HTTPException(status_code=404, detail="Call bucket not found")
    return db_call_bucket

@app.delete("/call-buckets/{call_bucket_id}")
def delete_call_bucket(call_bucket_id: int, db: Session = Depends(get_db)):
    success = crud.delete_call_bucket(db, call_bucket_id=call_bucket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Call bucket not found")
    return {"message": "Call bucket deleted successfully"}

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy"},
        status_code=200
    ) 