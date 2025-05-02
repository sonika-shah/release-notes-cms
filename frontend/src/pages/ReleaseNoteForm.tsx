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
  CircularProgress,
} from "@mui/material";
import { ReleaseNoteCreate } from "../types/releaseNote";
import {
  getReleaseNote,
  createReleaseNote,
  updateReleaseNote,
} from "../services/api";

// Dummy data for testing
const dummyReleaseNote = {
  id: 1,
  title: "Version 1.0.0 Release",
  content: `# 1.7.0 Release 🎉

**Apr 15th, 2025**

You can find the GitHub release [here](https://github.com/open-metadata/OpenMetadata/releases/tag/1.7.0-release).

The latest Release 1.7 of OpenMetadata and Collate delivers new features to accelerate the onboarding of both data services and users, taking discovery, automations, and customizations one step further.

# What's Changed

## Breaking Changes

### Removing support for Python 3.8

Python 3.8 was [officially EOL on 2024-10-07](https://devguide.python.org/versions/). Some of our dependencies have already
started removing support for higher versions, and are following suit to ensure we are using the latest and most stable
versions of our dependencies.

This means that for Release 1.7, the supported Python versions for the Ingestion Framework are 3.9, 3.10 and 3.11.

We were already shipping our Docker images with Python 3.10, so this change should not affect you if you are using our Docker images.
However, if you installed the \`openmetadata-ingestion\` package directly, please make sure to update your Python version to 3.9 or higher.

# What's New

### Putting your Metadata Ingestion on AutoPilot

<iframe width="560" height="315" src="https://www.youtube.com/embed/lo4SrBAmTZM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

OpenMetadata provides workflows out of the box to extract different types of metadata from your data services such as schemas, lineage, usage and profiling. To accelerate the onboarding of new services, we have created the new AutoPilot Application, which will automatically deploy and trigger all these Metadata Agents when a new service is created!`,
  version: "1.0.0",
  release_date: "2024-05-01T00:00:00Z",
  is_published: true,
  created_at: "2024-04-30T00:00:00Z",
  updated_at: null,
};

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
  const [isLoading, setIsLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchReleaseNote(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchReleaseNote = async (noteId: number) => {
    try {
      setIsLoading(true);
      try {
        const data = await getReleaseNote(noteId);
        setFormData({
          title: data.title,
          content: data.content,
          version: data.version,
          release_date: data.release_date.split("T")[0],
          is_published: data.is_published,
        });
      } catch {
        // If API fails, use dummy data
        console.log("Using dummy data while backend is not ready");
        setFormData({
          title: dummyReleaseNote.title,
          content: dummyReleaseNote.content,
          version: dummyReleaseNote.version,
          release_date: dummyReleaseNote.release_date.split("T")[0],
          is_published: dummyReleaseNote.is_published,
        });
      }
    } catch (error) {
      setError("Failed to load release note");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
      // For now, just navigate back even if the API call fails
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );
  }

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
