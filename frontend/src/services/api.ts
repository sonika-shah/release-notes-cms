import axios from "axios";
import {
  ReleaseNote,
  ReleaseNoteCreate,
  ReleaseNoteUpdate,
} from "../types/releaseNote";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getReleaseNotes = async (): Promise<ReleaseNote[]> => {
  const response = await api.get("/release-notes");
  return response.data;
};

export const getReleaseNote = async (id: number): Promise<ReleaseNote> => {
  const response = await api.get(`/release-notes/${id}`);
  return response.data;
};

export const createReleaseNote = async (
  data: ReleaseNoteCreate
): Promise<ReleaseNote> => {
  const response = await api.post("/release-notes", data);
  return response.data;
};

export const updateReleaseNote = async (
  id: number,
  data: ReleaseNoteUpdate
): Promise<ReleaseNote> => {
  const response = await api.put(`/release-notes/${id}`, data);
  return response.data;
};

export const deleteReleaseNote = async (id: number): Promise<void> => {
  await api.delete(`/release-notes/${id}`);
};
