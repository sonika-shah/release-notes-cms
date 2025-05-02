import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { slugify } from "../utils/slugify";
import { createCallBucket } from "../services/api";

interface CreateCallBucketModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCallBucketModal = ({
  open,
  onClose,
  onSuccess,
}: CreateCallBucketModalProps) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const slug = slugify(name);
      console.log("data", {
        title: name,
        slug: slug,
        content: "",
      });
      await createCallBucket({
        title: name,
        slug: slug,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError("Failed to create call bucket");
      console.error("Error creating call bucket:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Call Bucket</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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

export default CreateCallBucketModal;
