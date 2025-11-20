import { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";  // ✅ import

export default function StartQuiz() {
  const navigate = useNavigate(); // ✅ hook
  const [form, setForm] = useState({
    studentName: "",
    rollNumber: "",
    systemNumber: "",
    quizCode: "",
    quizTitle: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startQuiz = async () => {
    try {
      const res = await API.post("/students/start", form);
      const student = res.data;

      // Navigate to QuizPage with student ID
      navigate(`/quiz/${student._id}`, { state: { student } });

    } catch (err) {
      console.error(err);
      alert("Failed to start quiz");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Start Quiz</Typography>

      <TextField fullWidth margin="normal" label="Student Name" name="studentName" onChange={handleChange}/>
      <TextField fullWidth margin="normal" label="Roll Number" name="rollNumber" onChange={handleChange}/>
      <TextField fullWidth margin="normal" label="System Number" name="systemNumber" onChange={handleChange}/>
      <TextField fullWidth margin="normal" label="Quiz Code" name="quizCode" onChange={handleChange}/>
      <TextField fullWidth margin="normal" label="Quiz Title" name="quizTitle" onChange={handleChange}/>

      <Button variant="contained" sx={{ mt: 2 }} onClick={startQuiz}>
        Begin Quiz
      </Button>
    </Container>
  );
}
