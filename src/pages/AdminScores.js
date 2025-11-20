import { useState, useEffect } from "react";
import { Container, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
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

      <List>
        {scores.map((score) => (
          <Paper key={score._id} sx={{ p: 2, mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={`${score.student.studentName} — ${score.quiz.title}`}
                secondary={
                  <>
                    Roll Number: {score.student.rollNumber} <br />
                    System Number: {score.student.systemNumber} <br />
                    Score: {score.score} / {score.totalQuestions} <br />
                    Percentage: {score.percentage.toFixed(2)}% <br />
                    Status: <strong>{score.status}</strong>
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}
