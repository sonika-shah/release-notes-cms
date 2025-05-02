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
} from "@mui/material";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReleaseNote } from "../types/releaseNote";
import { getReleaseNotes, deleteReleaseNote } from "../services/api";

const ReleaseNotesList = () => {
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>([]);

  useEffect(() => {
    fetchReleaseNotes();
  }, []);

  const fetchReleaseNotes = async () => {
    try {
      const data = await getReleaseNotes();
      setReleaseNotes(data);
    } catch (error) {
      console.error("Error fetching release notes:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this release note?")) {
      try {
        await deleteReleaseNote(id);
        fetchReleaseNotes();
      } catch (error) {
        console.error("Error deleting release note:", error);
      }
    }
  };

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
    </>
  );
};

export default ReleaseNotesList;
