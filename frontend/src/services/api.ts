import {
  CallBucket,
  CallBucketCreate,
  CallBucketUpdate,
} from "../types/releaseNote";

const API_URL = "http://localhost:8000";

export const getCallBuckets = async (): Promise<CallBucket[]> => {
  const response = await fetch(`${API_URL}/call-buckets/`);
  if (!response.ok) {
    throw new Error("Failed to fetch call buckets");
  }
  return response.json();
};

export const getCallBucket = async (id: number): Promise<CallBucket> => {
  const response = await fetch(`${API_URL}/call-buckets/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch call bucket");
  }
  return response.json();
};

export const createCallBucket = async (
  bucket: CallBucketCreate
): Promise<CallBucket> => {
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
  bucket: CallBucketUpdate
): Promise<CallBucket> => {
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
