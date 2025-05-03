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
  const response = await fetch(`${API_URL}/call-buckets/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch call bucket");
  }
  return response.json();
};

export const createCallBucket = async (
  bucket: BucketCreate
): Promise<Bucket> => {
  const response = await fetch(`${API_URL}/call-buckets/`, {
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
  const response = await fetch(`${API_URL}/call-buckets/${id}`, {
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
  const response = await fetch(`${API_URL}/call-buckets/${id}`, {
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

export const createFile = async (file: FileCreate): Promise<File> => {
  const response = await fetch(`${API_URL}/files/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  });
  if (!response.ok) {
    throw new Error("Failed to create file");
  }
  return response.json();
};

export const updateFile = async (
  id: number,
  file: Partial<FileCreate>
): Promise<File> => {
  const response = await fetch(`${API_URL}/files/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
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
