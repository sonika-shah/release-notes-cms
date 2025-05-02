import { useState } from "react";
import { Box, Paper, Tabs, Tab, TextField } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const ContentEditor = ({ content, onChange }: ContentEditorProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Edit" />
        <Tab label="Preview" />
      </Tabs>

      {activeTab === 0 ? (
        <TextField
          fullWidth
          multiline
          rows={10}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your release notes in Markdown..."
          variant="outlined"
        />
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            minHeight: "200px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || "No content to preview"}
          </ReactMarkdown>
        </Paper>
      )}
    </Box>
  );
};

export default ContentEditor;
