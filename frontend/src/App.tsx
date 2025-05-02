import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ReleaseNotesList from "./pages/ReleaseNotesList";
import ReleaseNoteForm from "./pages/ReleaseNoteForm";
import Layout from "./components/Layout";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ReleaseNotesList />} />
            <Route path="/release-notes/new" element={<ReleaseNoteForm />} />
            <Route
              path="/release-notes/:id/edit"
              element={<ReleaseNoteForm />}
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
