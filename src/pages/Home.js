import { Container, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Quiz Platform
      </Typography>

      <Button variant="contained" component={Link} to="/start">
        Start a Quiz
      </Button>
    </Container>
  );
}
