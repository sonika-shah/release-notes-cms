import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Bucket, FileCreate } from "../types/releaseNote";
import { createFile } from "../services/api";

interface CreateFileModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultDirectory?: string;
}

const CreateFileModal = ({
  open,
  onClose,
  onSuccess,
  defaultDirectory = "",
}: CreateFileModalProps) => {
  const [formData, setFormData] = useState<FileCreate>({
    name: "",
    directory: defaultDirectory,
    slug: "",
    content: "",
    is_published: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_published" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("data", formData);

      const buckets = localStorage.getItem("buckets");
      const parsedBuckets = buckets ? JSON.parse(buckets) : [];
      const bucket = parsedBuckets.find(
        (bucket: Bucket) => bucket.slug === formData.directory
      );
      if (!bucket) {
        throw new Error("Bucket not found");
      }
      bucket.files = bucket.files ? [...bucket.files, formData] : [formData];

      localStorage.setItem("buckets", buckets);

      await createFile(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New File</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
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
            label="Directory"
            name="directory"
            value={formData.directory}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateFileModal;
