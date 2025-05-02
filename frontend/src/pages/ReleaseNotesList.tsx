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
} from "@mui/material";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import { ReleaseNote } from "../types/releaseNote";
import { getReleaseNotes, deleteReleaseNote } from "../services/api";
import PreviewModal from "../components/PreviewModal";

// Dummy data for testing
const dummyReleaseNotes: ReleaseNote[] = [
  {
    id: 1,
    title: "Version 1.0.0 Release",
    content: `# 1.7.0 Release 🎉

**Apr 15th, 2025**

You can find the GitHub release [here](https://github.com/open-metadata/OpenMetadata/releases/tag/1.7.0-release).

The latest Release 1.7 of OpenMetadata and Collate delivers new features to accelerate the onboarding of both data services and users, taking discovery, automations, and customizations one step further.

# What's Changed

## Breaking Changes

### Removing support for Python 3.8

Python 3.8 was [officially EOL on 2024-10-07](https://devguide.python.org/versions/). Some of our dependencies have already
started removing support for higher versions, and are following suit to ensure we are using the latest and most stable
versions of our dependencies.

This means that for Release 1.7, the supported Python versions for the Ingestion Framework are 3.9, 3.10 and 3.11.

We were already shipping our Docker images with Python 3.10, so this change should not affect you if you are using our Docker images.
However, if you installed the \`openmetadata-ingestion\` package directly, please make sure to update your Python version to 3.9 or higher.

# What's New

### Putting your Metadata Ingestion on AutoPilot

<iframe width="560" height="315" src="https://www.youtube.com/embed/lo4SrBAmTZM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

OpenMetadata provides workflows out of the box to extract different types of metadata from your data services such as schemas, lineage, usage and profiling. To accelerate the onboarding of new services, we have created the new AutoPilot Application, which will automatically deploy and trigger all these Metadata Agents when a new service is created!`,
    version: "1.0.0",
    release_date: "2024-05-01T00:00:00Z",
    is_published: true,
    created_at: "2024-04-30T00:00:00Z",
    updated_at: null,
  },
  {
    id: 2,
    title: "Version 1.1.0 Release",
    content: "Added new features and bug fixes",
    version: "1.1.0",
    release_date: "2024-05-02T00:00:00Z",
    is_published: true,
    created_at: "2024-05-01T00:00:00Z",
    updated_at: null,
  },
  {
    id: 3,
    title: "Version 1.2.0 Release",
    content: "Performance improvements and UI enhancements",
    version: "1.2.0",
    release_date: "2024-05-03T00:00:00Z",
    is_published: false,
    created_at: "2024-05-02T00:00:00Z",
    updated_at: null,
  },
];

const ReleaseNotesList = () => {
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewNote, setPreviewNote] = useState<ReleaseNote | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        try {
          const data = await getReleaseNotes();
          setReleaseNotes(data);
        } catch {
          // If API fails, use dummy data
          console.log("Using dummy data while backend is not ready");
          setReleaseNotes(dummyReleaseNotes);
        }
      } catch (error) {
        setError("Failed to load release notes");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this release note?")) {
      try {
        await deleteReleaseNote(id);
        setReleaseNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== id)
        );
      } catch (error) {
        console.error("Error deleting release note:", error);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Release Notes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {releaseNotes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{note.title}</TableCell>
                <TableCell>{note.version}</TableCell>
                <TableCell>
                  {format(new Date(note.release_date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {note.is_published ? "Published" : "Draft"}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => setPreviewNote(note)}
                  >
                    <PreviewIcon />
                  </IconButton>
                  <IconButton
                    component={RouterLink}
                    to={`/release-notes/${note.id}/edit`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(note.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {previewNote && (
        <PreviewModal
          open={Boolean(previewNote)}
          onClose={() => setPreviewNote(null)}
          title={previewNote.title}
          content={previewNote.content}
        />
      )}
    </>
  );
};

export default ReleaseNotesList;
