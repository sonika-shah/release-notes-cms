import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { slugify } from "../utils/slugify";
import { Bucket } from "../types/releaseNote";
import {
  createCallBucket,
  updateCallBucket,
  getCallBucket,
} from "../services/api";

const CreateBucketForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Bucket>({
    id: 0,
    title: "",
    slug: "",
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
    const { name, value } = e.target;

    setFormData((prev: Bucket) => {
      const newData = {
        ...prev,
        [name]: value,
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
        const buckets = localStorage.getItem("buckets");
        const parsedBuckets = buckets ? JSON.parse(buckets) : [];
        parsedBuckets.push(formData);
        localStorage.setItem("buckets", JSON.stringify(parsedBuckets));

        await createCallBucket({
          ...formData,
          slug: slugify(formData.title),
        });
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

export default CreateBucketForm;
