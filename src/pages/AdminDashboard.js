import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={() => navigate('/admin/quizzes')}>
          Manage Quizzes
        </Button>
        <Button variant="contained" onClick={() => navigate('/admin/students')}>
          Manage Students
        </Button>
        <Button variant="contained" onClick={() => navigate('/admin/scores')}>
          Manage Scores
        </Button>
      </Box>
    </Container>
  );
}
