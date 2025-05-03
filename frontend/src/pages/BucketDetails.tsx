import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Bucket, Files } from "../types/releaseNote";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styled from "@emotion/styled";
import { fetchFileContent, updateFile } from "../services/api";

const PreviewPane = styled(Paper)({
  flex: 1,
  overflow: "auto",
  padding: "16px",
  backgroundColor: "#f8f9fa",
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    marginTop: "24px",
    marginBottom: "16px",
    fontWeight: 600,
    lineHeight: 1.25,
  },
  "& h1": {
    fontSize: "2em",
    borderBottom: "1px solid #eaecef",
    paddingBottom: "0.3em",
  },
  "& h2": {
    fontSize: "1.5em",
    borderBottom: "1px solid #eaecef",
    paddingBottom: "0.3em",
  },
  "& h3": {
    fontSize: "1.25em",
  },
  "& p": {
    marginTop: 0,
    marginBottom: "16px",
  },
  "& pre": {
    backgroundColor: "#f6f8fa",
    padding: "16px",
    borderRadius: "6px",
    overflow: "auto",
    fontSize: "85%",
    lineHeight: 1.45,
  },
  "& code": {
    backgroundColor: "#f6f8fa",
    padding: "0.2em 0.4em",
    borderRadius: "6px",
    fontSize: "85%",
    fontFamily:
      "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
  },
  "& blockquote": {
    padding: "0 1em",
    color: "#6a737d",
    borderLeft: "0.25em solid #dfe2e5",
    margin: "0 0 16px 0",
  },
  "& table": {
    borderSpacing: 0,
    borderCollapse: "collapse",
    width: "100%",
    marginBottom: "16px",
    display: "block",
    overflow: "auto",
  },
  "& th, & td": {
    padding: "6px 13px",
    border: "1px solid #dfe2e5",
  },
  "& th": {
    fontWeight: 600,
    backgroundColor: "#f6f8fa",
  },
  "& tr:nth-child(2n)": {
    backgroundColor: "#f6f8fa",
  },
  "& img": {
    maxWidth: "100%",
    boxSizing: "content-box",
    backgroundColor: "#fff",
  },
  "& ul, & ol": {
    paddingLeft: "2em",
    marginTop: 0,
    marginBottom: "16px",
  },
  "& li": {
    marginTop: "0.25em",
  },
  "& hr": {
    height: "0.25em",
    padding: 0,
    margin: "24px 0",
    backgroundColor: "#e1e4e8",
    border: 0,
  },
});

interface FilePreviewModalProps {
  open: boolean;
  onClose: () => void;
  file: Files | null;
  onSave: (content: string) => Promise<void>;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  open,
  onClose,
  file,
  onSave,
}) => {
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (file?.id) {
      const loadFileContent = async () => {
        try {
          const { content: fileContent } = await fetchFileContent(file.id);
          setContent(fileContent);
        } catch (error) {
          console.error("Error loading file content:", error);
        }
      };
      loadFileContent();
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;
    setIsSaving(true);
    try {
      await onSave(content);
      onClose();
    } catch (error) {
      console.error("Error saving file:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!file) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: "80vh" },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{file.original_name}</Typography>
          <Tabs
            value={viewMode}
            onChange={(_, newValue: "edit" | "preview") =>
              setViewMode(newValue)
            }
          >
            <Tab value="edit" label="Edit" />
            <Tab value="preview" label="Preview" />
          </Tabs>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {viewMode === "preview" ? (
          <PreviewPane elevation={0}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </PreviewPane>
        ) : (
          <TextField
            fullWidth
            multiline
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              height: "100%",
              "& .MuiOutlinedInput-root": {
                height: "100%",
                alignItems: "flex-start",
              },
              "& textarea": {
                height: "100% !important",
              },
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const BucketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [files, setFiles] = useState<Files[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<Files | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchBucketDetails = async () => {
      try {
        const [bucketResponse, filesResponse] = await Promise.all([
          fetch(`/api/buckets/${id}`),
          fetch(`/api/buckets/${id}/files`),
        ]);

        if (!bucketResponse.ok || !filesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [bucketData, filesData] = await Promise.all([
          bucketResponse.json(),
          filesResponse.json(),
        ]);

        // If bucket has content, fetch it
        if (bucketData.content) {
          const contentResponse = await fetch(`/api/buckets/${id}/content`);
          if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            bucketData.content = contentData.content;
          }
        }

        setBucket(bucketData);
        setFiles(filesData);
      } catch (error) {
        console.error("Error fetching bucket details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBucketDetails();
  }, [id]);

  const handleDeleteFile = async (fileId: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete file");
        }

        setFiles(files.filter((file) => file.id !== fileId));
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const handleDownloadFile = async (file: Files) => {
    try {
      const { content, fileType } = await fetchFileContent(file.id);

      // Create a blob with the content
      const blob = new Blob([content], { type: fileType });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // If it's a markdown file, change extension to .txt
      const fileName = file.original_name.endsWith(".md")
        ? file.original_name.replace(".md", ".txt")
        : file.original_name;

      link.download = fileName;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleFileClick = (file: Files) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleSaveFile = async (content: string) => {
    if (!selectedFile) return;
    try {
      const response = await updateFile(
        selectedFile.id,
        new File([content], selectedFile.original_name, {
          type: selectedFile.file_type,
        })
      );

      if (!response.ok) {
        throw new Error("Failed to save file");
      }

      // Update the files list with the new content
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === selectedFile.id ? { ...file, content } : file
        )
      );
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!bucket) {
    return <Typography>Bucket not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">{bucket.title}</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/buckets/${id}/edit`)}
            startIcon={<EditIcon />}
          >
            Edit Bucket
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/buckets/${id}/files/new`)}
          >
            Add File
          </Button>
        </Stack>
      </Stack>

      <Typography variant="h5" mb={2}>
        Files
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow
                key={file.id}
                onClick={() => handleFileClick(file)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell>{file.original_name}</TableCell>
                <TableCell>{file.description}</TableCell>
                <TableCell>{file.file_type}</TableCell>
                <TableCell>
                  {file.file_size
                    ? `${(file.file_size / 1024).toFixed(2)} KB`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {format(new Date(file.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    onClick={() => handleDownloadFile(file)}
                    title="Download"
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteFile(file.id)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {files.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No files found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FilePreviewModal
        open={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedFile(null);
        }}
        file={selectedFile ?? null}
        onSave={handleSaveFile}
      />
    </Box>
  );
};
