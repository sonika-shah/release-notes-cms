import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import BucketsList from "./pages/BucketsList";
import CallBucketForm from "./pages/CreateBucketForm";
import FileForm from "./pages/FileForm";
import Layout from "./components/Layout";
import { BucketDetails } from "./pages/BucketDetails";

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
            <Route path="/" element={<BucketsList />} />
            <Route path="/buckets/new" element={<CallBucketForm />} />
            <Route path="/buckets/:id/edit" element={<CallBucketForm />} />
            <Route path="/buckets/:bucketId/files/new" element={<FileForm />} />
            <Route path="/files/:id/edit" element={<FileForm />} />
            <Route path="/buckets/:id" element={<BucketDetails />} />
            <Route path="/files/new" element={<FileForm />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
