import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { slugify } from "../utils/slugify";
import { File } from "../types/releaseNote";
import { createFile } from "../services/api";

const FileForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<File>({
    id: 0,
    name: "",
    slug: "",
    directory: "",
    content: "",
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: null,
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          //   const data = await getFile(parseInt(id));
          //   setFormData(data);
        } catch (error) {
          console.error("Error fetching file:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Automatically generate slug when name changes
      if (name === "name") {
        newData.slug = slugify(value);
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        // await updateFile(parseInt(id), formData);
      } else {
        await createFile(formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving file:", error);
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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? "Edit File" : "New File"}
      </Typography>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Slug"
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        margin="normal"
        required
        disabled
      />
      <TextField
        fullWidth
        label="Directory"
        name="directory"
        value={formData.directory}
        onChange={handleChange}
        margin="normal"
        required
        placeholder="e.g., /docs/release-notes"
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
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {id ? "Update" : "Create"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
          sx={{ ml: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default FileForm;
