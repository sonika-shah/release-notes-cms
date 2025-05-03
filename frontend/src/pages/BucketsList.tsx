import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, Link } from "react-router-dom";
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
} from "@mui/material";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import { Bucket } from "../types/releaseNote";
import { getCallBuckets, deleteCallBucket } from "../services/api";

const BucketsList = () => {
  const navigate = useNavigate();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buckets = localStorage.getItem("buckets");
    if (buckets) {
      setBuckets(JSON.parse(buckets));
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API first
      try {
        const bucketsData = await getCallBuckets();
        setBuckets(bucketsData);
      } catch {
        // If API fails, use dummy data
        console.log("Using dummy data while backend is not ready");
      }
    } catch (error) {
      setError("Failed to load data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`Are you sure you want to delete this?`)) {
      try {
        await deleteCallBucket(id);
        setBuckets((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error(`Error deleting:`, error);
      }
    }
  };

  const handleCreateFile = (bucket: Bucket) => {
    navigate(`/buckets/${bucket.id}/files/new`);
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
          Buckets
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buckets.map((bucket) => (
              <TableRow key={bucket.id}>
                <TableCell>
                  <Link
                    to={`/buckets/${bucket.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {bucket.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {format(new Date(bucket.created_at), "MMM dd, yyyy")}
                </TableCell>

                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to={`/buckets/${bucket.id}/edit`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleCreateFile(bucket)}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(bucket.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BucketsList;
