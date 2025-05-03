import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FileCreate } from "../types/releaseNote";
import { createFile } from "../services/api";
import { MarkdownUploader } from "../components/MarkdownUploader";

const FileForm = () => {
  const navigate = useNavigate();
  const { bucketId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FileCreate>({
    description: "",
    original_name: "",
    file: new File([], ""),
    bucketId: 0,
  });

  const handleFileSelect = async (file: File) => {
    setFormData((prev) => ({
      ...prev,
      file,
      original_name: file.name ?? formData.original_name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!bucketId) {
        throw new Error("Bucket ID is required");
      }

      if (!formData.file) {
        throw new Error("File is required");
      }

      setIsLoading(true);
      await createFile(parseInt(bucketId), {
        ...formData,
        file: formData.file,
      });

      navigate(`/buckets/${bucketId}`);
    } catch (error) {
      console.error("Error creating file:", error);
    } finally {
      setIsLoading(false);
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
        New File
      </Typography>

      <TextField
        fullWidth
        label="Name"
        name="original_name"
        value={formData.original_name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, original_name: e.target.value }))
        }
        margin="normal"
        required
      />
      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Description"
        name="description"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        margin="normal"
      />

      <MarkdownUploader onFileSelect={handleFileSelect} initialContent="" />

      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formData.file}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)}
          sx={{ ml: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default FileForm;
