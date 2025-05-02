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
import { format } from "date-fns";
import { slugify } from "../utils/slugify";
import { CallBucket, CallBucketCreate } from "../types/releaseNote";
import {
  createCallBucket,
  updateCallBucket,
  getCallBucket,
} from "../services/api";

const CallBucketForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CallBucket>({
    id: 0,
    title: "",
    slug: "",
    content: "",
    version: "",
    release_date: new Date().toISOString(),
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: null,
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const data = await getCallBucket(parseInt(id));
          setFormData(data);
        } catch (error) {
          console.error("Error fetching call bucket:", error);
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

      // Automatically generate slug when title changes
      if (name === "title") {
        newData.slug = slugify(value);
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCallBucket(parseInt(id), formData);
      } else {
        await createCallBucket(formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving call bucket:", error);
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
        {id ? "Edit Call Bucket" : "New Call Bucket"}
      </Typography>
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
        type="datetime-local"
        value={formData.release_date}
        onChange={handleChange}
        margin="normal"
        required
        InputLabelProps={{
          shrink: true,
        }}
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

export default CallBucketForm;
