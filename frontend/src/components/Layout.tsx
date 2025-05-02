import { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Collate CMS
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/buckets/new"
            startIcon={<AddIcon />}
          >
            New Bucket
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
