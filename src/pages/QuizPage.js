import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
} from "@mui/material";
import API from "../api";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const student = location.state?.student;
  const [quiz, setQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

  // Ref to safely call handleSubmit inside setInterval
  const handleSubmitRef = useRef();

  // Fetch quiz based on student's quizTitle
  useEffect(() => {
    if (!student) return;

    const fetchQuiz = async () => {
      try {
        const res = await API.get("/quizzes"); // fetch all quizzes
        const selectedQuiz = res.data.find(
          (q) => q.title === student.quizTitle
        );
        setQuiz(selectedQuiz);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [student]);

  // Timer + auto-submit logic
  useEffect(() => {
    if (!student) return;

    const storedStart = localStorage.getItem(`quizStart_${student._id}`);
    let start = storedStart ? parseInt(storedStart) : Date.now();
    if (!storedStart) localStorage.setItem(`quizStart_${student._id}`, start);

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = 20 * 60 - elapsed;

      if (remaining <= 0) {
        clearInterval(timer);
        handleSubmitRef.current(); // auto-submit
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [student]);

  // Submit function
  const handleSubmit = async () => {
    try {
      const res = await API.post("/scores/submit", {
        studentId: student._id,
        quizId: quiz._id,
        answers: quiz.questions.map((q, i) => ({
          questionId: q._id,
          selectedAnswer: answers[i]?.selectedAnswer || null,
        })),
      });

      localStorage.removeItem(`quizStart_${student._id}`); // clear timer
      navigate(`/result/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz");
    }
  };

  // Update ref for timer
  handleSubmitRef.current = handleSubmit;

  if (loading) return <Container>Loading quiz...</Container>;
  if (!quiz) return <Container>No quiz found</Container>;

  const question = quiz.questions[currentQIndex];

  const handleAnswerChange = (e) => {
    const selectedAnswer = e.target.value;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQIndex] = {
      questionId: question._id,
      selectedAnswer,
    };
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {quiz.title}
      </Typography>

      <Typography variant="h6" color="primary" gutterBottom>
        Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Typography>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6">
          Question {currentQIndex + 1} of {quiz.questions.length}
        </Typography>
        <Typography sx={{ mt: 1, mb: 2 }}>{question.questionText}</Typography>

        <RadioGroup
          value={answers[currentQIndex]?.selectedAnswer || ""}
          onChange={handleAnswerChange}
        >
          {question.options.map((option, i) => (
            <FormControlLabel
              key={i}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>

        <div style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={handlePrev}
            disabled={currentQIndex === 0}
          >
            Previous
          </Button>

          {currentQIndex < quiz.questions.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
        </div>
      </Paper>
    </Container>
  );
}
