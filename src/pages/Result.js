import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import API from "../api";

export default function Result() {
  const { scoreId } = useParams();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await API.get(`/scores/${scoreId}`);
        setScore(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch score");
        setLoading(false);
      }
    };

    fetchScore();
  }, [scoreId]);

  if (loading) return <Container>Loading result...</Container>;
  if (!score) return <Container>No result found.</Container>;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Quiz Result
      </Typography>
      <Typography variant="h6">
        Student: {score.student.studentName}
      </Typography>
      <Typography variant="h6">
        Quiz: {score.quiz.title}
      </Typography>
      <Typography variant="h6">
        Score: {score.score} / {score.totalQuestions}
      </Typography>
      <Typography variant="h6">
        Percentage: {score.percentage.toFixed(2)}%
      </Typography>
      <Typography variant="h6" color={score.status === "passed" ? "green" : "red"}>
        Status: {score.status.toUpperCase()}
      </Typography>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6">Answers:</Typography>
        <List>
          {score.answers.map((a, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={`${i + 1}. ${score.quiz.questions.find(q => q._id === a.questionId)?.questionText}`}
                secondary={
                  <>
                    <span>Your answer: {a.selectedAnswer || "Not answered"}</span><br />
                    <span>Correct answer: {score.quiz.questions.find(q => q._id === a.questionId)?.correctAnswer}</span>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
