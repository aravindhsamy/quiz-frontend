import { useState, useEffect } from "react";
import { Container, Typography, Button, TextField, Box, List, ListItem, ListItemText, IconButton, Paper } from "@mui/material";
import { Delete } from "@mui/icons-material";
import API from "../api";

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    questions: [
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
    ]
  });

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get("/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  // Handle quiz title change
  const handleQuizTitleChange = (e) => {
    setNewQuiz({ ...newQuiz, title: e.target.value });
  };

  // Handle question text change
  const handleQuestionChange = (index, value) => {
    const questions = [...newQuiz.questions];
    questions[index].questionText = value;
    setNewQuiz({ ...newQuiz, questions });
  };

  // Handle option change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const questions = [...newQuiz.questions];
    questions[qIndex].options[oIndex] = value;
    setNewQuiz({ ...newQuiz, questions });
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (qIndex, value) => {
    const questions = [...newQuiz.questions];
    questions[qIndex].correctAnswer = value;
    setNewQuiz({ ...newQuiz, questions });
  };

  // Add a new question
  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
    });
  };

  // Remove a question
  const removeQuestion = (index) => {
    const questions = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({ ...newQuiz, questions });
  };

  // Create quiz
  const handleCreateQuiz = async () => {
    try {
      const res = await API.post("/quizzes", newQuiz);
      setQuizzes([...quizzes, res.data]);
      setNewQuiz({ title: "", questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }] });
      alert("Quiz created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await API.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Manage Quizzes
      </Typography>

      {/* Create Quiz Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Create New Quiz</Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Quiz Title"
          value={newQuiz.title}
          onChange={handleQuizTitleChange}
        />

        {newQuiz.questions.map((q, qIndex) => (
          <Paper key={qIndex} sx={{ p: 2, mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />
            {q.options.map((opt, oIndex) => (
              <TextField
                key={oIndex}
                fullWidth
                margin="normal"
                label={`Option ${oIndex + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
              />
            ))}
            <TextField
              fullWidth
              margin="normal"
              label="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
            />
            <Button color="error" onClick={() => removeQuestion(qIndex)}>Remove Question</Button>
          </Paper>
        ))}

        <Button variant="outlined" onClick={addQuestion} sx={{ mr: 2 }}>
          Add Question
        </Button>
        <Button variant="contained" onClick={handleCreateQuiz}>
          Create Quiz
        </Button>
      </Paper>

      {/* Existing Quizzes */}
      <Typography variant="h5" gutterBottom>Existing Quizzes</Typography>
      <List>
        {quizzes.map((quiz) => (
          <ListItem
            key={quiz._id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteQuiz(quiz._id)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary={quiz.title} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
