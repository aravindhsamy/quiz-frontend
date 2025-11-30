import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import API from "../api";

export default function AdminScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all scores
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await API.get("/scores");
        setScores(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) return <Container>Loading scores...</Container>;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Student Scores
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>System Number</TableCell>
              <TableCell>Quiz Title</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {scores.map((score) => (
              <TableRow key={score._id}>
                <TableCell>{score.student.studentName}</TableCell>
                <TableCell>{score.student.rollNumber}</TableCell>
                <TableCell>{score.student.systemNumber}</TableCell>
                <TableCell>{score.quiz.title}</TableCell>
                <TableCell>
                  {score.score} / {score.totalQuestions}
                </TableCell>
                <TableCell>{score.percentage.toFixed(2)}%</TableCell>
                <TableCell>
                  <strong>{score.status}</strong>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
