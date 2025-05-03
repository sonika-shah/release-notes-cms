import os
import uuid
import shutil
from pathlib import Path
from typing import Optional
import mimetypes

class FileStorageService:
    def __init__(self, base_storage_path: str):
        self.base_storage_path = Path(base_storage_path)
        self.base_storage_path.mkdir(parents=True, exist_ok=True)

    def _get_storage_path(self, bucket_id: int) -> Path:
        """Get the storage path for a specific bucket"""
        bucket_path = self.base_storage_path / str(bucket_id)
        bucket_path.mkdir(exist_ok=True)
        return bucket_path

    def save_file(self, file_data: bytes, original_name: str, bucket_id: int) -> tuple[str, str, float]:
        """Save a file and return (storage_path, file_type, file_size)"""
        # Generate unique filename
        file_extension = os.path.splitext(original_name)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Get storage path
        storage_path = self._get_storage_path(bucket_id)
        file_path = storage_path / unique_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(file_data)
        
        # Get file metadata
        file_type = mimetypes.guess_type(original_name)[0] or "application/octet-stream"
        file_size = os.path.getsize(file_path)
        
        return str(file_path), file_type, file_size

    def delete_file(self, storage_path: str) -> bool:
        """Delete a file from storage"""
        try:
            file_path = Path(storage_path)
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False

    def get_file(self, storage_path: str) -> Optional[bytes]:
        """Get file content from storage"""
        try:
            with open(storage_path, "rb") as f:
                return f.read()
        except Exception:
            return None

    def update_file(self, storage_path: str, new_content: bytes) -> bool:
        """Update file content in storage"""
        try:
            with open(storage_path, "wb") as f:
                f.write(new_content)
            return True
        except Exception:
            return False

# Initialize the storage service
STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "storage")
file_storage = FileStorageService(STORAGE_DIR) 