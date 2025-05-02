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
import { slugify } from "../utils/slugify";
import { createFile } from "../services/api";

interface CreateFileModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateFileModal = ({
  open,
  onClose,
  onSuccess,
}: CreateFileModalProps) => {
  const [name, setName] = useState("");
  const [directory, setDirectory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const slug = slugify(name);
      await createFile({
        name,
        slug,
        directory,
        content,
        is_published: isPublished,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError("Failed to create file");
      console.error("Error creating file:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDirectory("");
    setIsPublished(false);
    setContent("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New File</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={!!error}
              helperText={error}
            />
            <TextField
              fullWidth
              label="Directory"
              value={directory}
              onChange={(e) => setDirectory(e.target.value)}
              required
              placeholder="e.g., /docs/release-notes"
            />
            <TextField
              fullWidth
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={4}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
              }
              label="Published"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateFileModal;
