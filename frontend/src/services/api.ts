import {
  Bucket,
  BucketCreate,
  BucketUpdate,
  File,
  FileCreate,
} from "../types/releaseNote";

const API_URL = "/api";

export const getCallBuckets = async (): Promise<Bucket[]> => {
  const response = await fetch(`${API_URL}/buckets/`);
  if (!response.ok) {
    throw new Error("Failed to fetch call buckets");
  }
  return response.json();
};

export const getCallBucket = async (id: number): Promise<Bucket> => {
  const response = await fetch(`${API_URL}/buckets/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch call bucket");
  }
  return response.json();
};

export const createCallBucket = async (
  bucket: BucketCreate
): Promise<Bucket> => {
  const response = await fetch(`${API_URL}/buckets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bucket),
  });
  if (!response.ok) {
    throw new Error("Failed to create call bucket");
  }
  return response.json();
};

export const updateCallBucket = async (
  id: number,
  bucket: BucketUpdate
): Promise<Bucket> => {
  const response = await fetch(`${API_URL}/buckets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bucket),
  });
  if (!response.ok) {
    throw new Error("Failed to update call bucket");
  }
  return response.json();
};

export const deleteCallBucket = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/buckets/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete call bucket");
  }
};

export const getFiles = async (): Promise<File[]> => {
  const response = await fetch(`${API_URL}/files/`);
  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }
  return response.json();
};

export const getFile = async (id: number): Promise<File> => {
  const response = await fetch(`${API_URL}/files/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch file");
  }
  return response.json();
};

export const createFile = async (
  bucketId: number,
  file: FileCreate
): Promise<File> => {
  const response = await fetch(`${API_URL}/buckets/${bucketId}/files/`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify(file),
  });
  if (!response.ok) {
    throw new Error("Failed to create file");
  }
  return response.json();
};

export const updateFile = async (id: number, file: File): Promise<File> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files/${id}/content`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to update file");
  }
  return response.json();
};

export const deleteFile = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/files/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
};

export const fetchFileContent = async (fileId?: number) => {
  if (!fileId) {
    throw new Error("File ID is required");
  }
  try {
    const response = await fetch(`/api/files/${fileId}/download`);
    if (!response.ok) throw new Error("Failed to fetch file content");

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return {
        content: data.content,
        fileType: data.file_type || "text/plain",
      };
    } else {
      const content = await response.text();
      return {
        content,
        fileType: "text/plain",
      };
    }
  } catch (error) {
    console.error("Error fetching file content:", error);
    throw error;
  }
};
