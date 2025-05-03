import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FileCreate } from "../types/releaseNote";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const SplitViewContainer = styled(Box)({
  display: "flex",
  gap: "16px",
  height: "500px",
  marginTop: "16px",
});

const EditorPane = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

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

const IframeWrapper = styled(Box)({
  position: "relative",
  paddingBottom: "56.25%", // 16:9 aspect ratio
  height: 0,
  overflow: "hidden",
  maxWidth: "100%",
  margin: "16px 0",
  "& iframe": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
  },
});

interface MarkdownUploaderProps {
  onFileSelect: (fileData: File) => void;
  initialContent?: string;
}

export const MarkdownUploader: React.FC<MarkdownUploaderProps> = ({
  onFileSelect,
  initialContent = "",
}) => {
  const [content, setContent] = useState(initialContent);
  const [fileName, setFileName] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
    "split"
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "text/markdown") {
        setFileName(file.name);
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setContent(content);
          onFileSelect(file);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a Markdown (.md) file");
      }
    },
    [onFileSelect]
  );

  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = event.target.value;
      setContent(newContent);
      onFileSelect(
        new File([newContent], fileName, {
          type: file?.type,
        })
      );
    },
    [fileName, onFileSelect, file]
  );

  const components = {
    iframe: ({
      src,
      title,
      ...props
    }: React.IframeHTMLAttributes<HTMLIFrameElement>) => {
      if (src?.includes("youtube.com") || src?.includes("youtu.be")) {
        return (
          <IframeWrapper>
            <iframe
              src={src}
              title={title || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              {...props}
            />
          </IframeWrapper>
        );
      }
      return <iframe src={src} title={title} {...props} />;
    },
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<span>📄</span>}
        >
          Upload Markdown
          <VisuallyHiddenInput
            type="file"
            accept=".md"
            onChange={handleFileChange}
          />
        </Button>
        <Tabs
          value={viewMode}
          onChange={(_, newValue) => setViewMode(newValue)}
          sx={{ flexGrow: 1 }}
        >
          <Tab value="edit" label="Edit" />
          <Tab value="preview" label="Preview" />
          <Tab value="split" label="Split View" />
        </Tabs>
      </Box>

      {fileName && (
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          File: {fileName}
        </Typography>
      )}

      {viewMode === "preview" ? (
        <PreviewPane elevation={2}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </PreviewPane>
      ) : viewMode === "edit" ? (
        <TextField
          fullWidth
          multiline
          rows={20}
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing or upload a Markdown file..."
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "monospace",
              fontSize: "14px",
            },
          }}
        />
      ) : (
        <SplitViewContainer>
          <EditorPane>
            <TextField
              fullWidth
              multiline
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing or upload a Markdown file..."
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  fontFamily: "monospace",
                  fontSize: "14px",
                  height: "100%",
                  "& textarea": {
                    height: "100% !important",
                  },
                },
              }}
            />
          </EditorPane>
          <PreviewPane elevation={2}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </PreviewPane>
        </SplitViewContainer>
      )}
    </Box>
  );
};
