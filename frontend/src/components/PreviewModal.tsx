import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const PreviewModal = ({ open, onClose, title, content }: PreviewModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="preview-modal-title"
      aria-describedby="preview-modal-content"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography id="preview-modal-title" variant="h5" component="h2">
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          id="preview-modal-content"
          sx={{
            mt: 2,
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              mt: 2,
              mb: 1,
            },
            "& p": {
              mb: 1,
            },
            "& ul, & ol": {
              pl: 3,
              mb: 1,
            },
            "& iframe": {
              width: "100%",
              height: "315px",
              border: "none",
              mb: 2,
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </Box>
      </Box>
    </Modal>
  );
};

export default PreviewModal;
