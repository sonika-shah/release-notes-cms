import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { ReleaseNoteCreate } from "../types/releaseNote";
import {
  getReleaseNote,
  createReleaseNote,
  updateReleaseNote,
} from "../services/api";

const ReleaseNoteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<ReleaseNoteCreate>({
    title: "",
    content: "",
    version: "",
    release_date: new Date().toISOString().split("T")[0],
    is_published: false,
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchReleaseNote(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchReleaseNote = async (noteId: number) => {
    try {
      const data = await getReleaseNote(noteId);
      setFormData({
        title: data.title,
        content: data.content,
        version: data.version,
        release_date: data.release_date.split("T")[0],
        is_published: data.is_published,
      });
    } catch (error) {
      console.error("Error fetching release note:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateReleaseNote(parseInt(id), formData);
      } else {
        await createReleaseNote(formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving release note:", error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Edit Release Note" : "New Release Note"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          label="Version"
          name="version"
          value={formData.version}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Release Date"
          name="release_date"
          type="date"
          value={formData.release_date}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
            />
          }
          label="Published"
        />
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReleaseNoteForm;
