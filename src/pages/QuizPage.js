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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import API from "../api";

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  // Quiz states
  const [quiz, setQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 min

  const handleSubmitRef = useRef();

  // Anti-cheating states
  const tabSwitchCount = useRef(0);
  const [locked, setLocked] = useState(false);

  // Fullscreen warning states
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // -----------------------
  // Fetch Quiz
  // -----------------------
  useEffect(() => {
    if (!student) {
      navigate("/"); // go back if no student info
      return;
    }

    const fetchQuiz = async () => {
      try {
        const res = await API.get("/quizzes");
        const selectedQuiz = res.data.find((q) => q.title === student.quizTitle);
        setQuiz(selectedQuiz);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [student, navigate]);

  // -----------------------
  // Timer + auto-submit
  // -----------------------
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

  // -----------------------
  // Submit function
  // -----------------------
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

      localStorage.removeItem(`quizStart_${student._id}`);
      navigate(`/result/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz");
    }
  };

  handleSubmitRef.current = handleSubmit;

  // -----------------------
  // Anti-cheating logic
  // -----------------------
  useEffect(() => {
    if (!student) return;

    const MAX_TAB_SWITCHES = 3;
    let countdownTimer;

    // --- Tab switch detection ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current += 1;
        console.warn("Tab switched! Count:", tabSwitchCount.current);

        if (tabSwitchCount.current >= MAX_TAB_SWITCHES) {
          setLocked(true);
          alert("You have switched tabs too many times. Quiz is locked.");
          handleSubmitRef.current(); // auto-submit
        }
      }
    };

    // --- Fullscreen detection ---
    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      if (!isFullscreen) {
        setFullscreenWarning(true);
        setCountdown(3);

        countdownTimer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              alert("Fullscreen not restored. Quiz will end.");
              handleSubmitRef.current();
              navigate("/"); // redirect after countdown
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        clearInterval(countdownTimer);
        setFullscreenWarning(false);
      }
    };

    // --- Copy/paste prevention ---
    const preventCopyPaste = (e) => {
      e.preventDefault();
      alert("Copying and pasting is disabled during the quiz.");
    };

    // --- Right-click prevention ---
    const preventRightClick = (e) => {
      e.preventDefault();
      alert("Right-click is disabled during the quiz.");
    };

    // --- Keyboard shortcuts blocking ---
    const blockShortcuts = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "a", "p"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        alert("This keyboard shortcut is disabled during the quiz.");
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        alert("Opening DevTools is disabled during the quiz.");
      }
      if (e.key === "F12") {
        e.preventDefault();
        alert("Opening DevTools is disabled during the quiz.");
      }
    };

    // --- Disable text selection ---
    document.body.style.userSelect = "none";

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", preventCopyPaste);
    document.addEventListener("paste", preventCopyPaste);
    document.addEventListener("contextmenu", preventRightClick);
    document.addEventListener("keydown", blockShortcuts);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("keydown", blockShortcuts);
      document.body.style.userSelect = "auto";
      clearInterval(countdownTimer);
    };
  }, [student, navigate]);

  // -----------------------
  // Answer handling
  // -----------------------
  const handleAnswerChange = (e) => {
    const selectedAnswer = e.target.value;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQIndex] = {
      questionId: quiz.questions[currentQIndex]._id,
      selectedAnswer,
    };
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1) setCurrentQIndex(currentQIndex + 1);
  };

  const handlePrev = () => {
    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
  };

  if (loading) return <Container>Loading quiz...</Container>;
  if (!quiz) return <Container>No quiz found</Container>;
  if (locked) return <Container>Quiz Locked due to suspicious activity!</Container>;

  const question = quiz.questions[currentQIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">{quiz.title}</Typography>
      <Typography variant="h6" color="primary">
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
            <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
          ))}
        </RadioGroup>

        <div style={{ marginTop: "20px" }}>
          <Button variant="contained" sx={{ mr: 1 }} onClick={handlePrev} disabled={currentQIndex === 0}>
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

      {/* Fullscreen Warning Modal */}
      <Dialog open={fullscreenWarning} disableEscapeKeyDown>
        <DialogTitle>⚠ Fullscreen Mode Required</DialogTitle>
        <DialogContent>
          <Typography>
            You have exited fullscreen. Please return to fullscreen within {countdown} seconds,
            or the quiz will end.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const elem = document.documentElement;
              if (elem.requestFullscreen) elem.requestFullscreen();
              else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
              else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
            }}
            variant="contained"
          >
            Re-enter Fullscreen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
