import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PlusOneOutlined, Add } from "@mui/icons-material";
import { Bucket, File } from "../types/releaseNote";
import {
  getCallBuckets,
  deleteCallBucket,
  getFiles,
  deleteFile,
} from "../services/api";
import CreateCallBucketModal from "../components/CreateCallBucketModal";
import CreateFileModal from "../components/CreateFileModal";

// Dummy data for testing
const dummyBuckets: Bucket[] = [
  {
    id: 1,
    title: "Version 1.0.0 Release",
    slug: "version-1-0-0-release",
    created_at: "2024-04-30T00:00:00Z",
    updated_at: null,
  },
  {
    id: 2,
    title: "Version 1.1.0 Release",
    slug: "version-1-1-0-release",
    created_at: "2024-05-01T00:00:00Z",
    updated_at: null,
  },
  {
    id: 3,
    title: "Version 1.2.0 Release",
    slug: "version-1-2-0-release",
    created_at: "2024-05-02T00:00:00Z",
    updated_at: null,
  },
];

const BucketsList = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API first
      try {
        const [bucketsData, filesData] = await Promise.all([
          getCallBuckets(),
          getFiles(),
        ]);
        setBuckets(bucketsData);
        setFiles(filesData);
      } catch {
        // If API fails, use dummy data
        console.log("Using dummy data while backend is not ready");
        setBuckets(dummyBuckets);
        setFiles([]);
      }
    } catch (error) {
      setError("Failed to load data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, type: "bucket" | "file") => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === "bucket") {
          await deleteCallBucket(id);
          setBuckets((prev) => prev.filter((item) => item.id !== id));
        } else {
          await deleteFile(id);
          setFiles((prev) => prev.filter((item) => item.id !== id));
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
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
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1">
          Release Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={activeTab === 0 ? <PlusOneOutlined /> : <Add />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New {activeTab === 0 ? "Call Bucket" : "File"}
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Call Buckets" />
        <Tab label="Files" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Directory</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeTab === 0
              ? buckets.map((bucket) => (
                  <TableRow key={bucket.id}>
                    <TableCell>{bucket.title}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {format(new Date(bucket.created_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={RouterLink}
                        to={`/call-buckets/${bucket.id}/edit`}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(bucket.id, "bucket")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              : files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{file.directory}</TableCell>
                    <TableCell>
                      {file.is_published ? "Published" : "Draft"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(file.created_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={RouterLink}
                        to={`/files/${file.id}/edit`}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(file.id, "file")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {activeTab === 0 ? (
        <CreateCallBucketModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
        />
      ) : (
        <CreateFileModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
};

export default BucketsList;
