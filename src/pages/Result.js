import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import API from "../api";

export default function Result() {
  const { scoreId } = useParams();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Anti-cheating states
  const tabSwitchCount = useRef(0);
  const [locked, setLocked] = useState(false);

  // Fullscreen warning
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const countdownTimerRef = useRef();

  // -----------------------
  // Fetch Score
  // -----------------------
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

  // -----------------------
  // Anti-cheating logic
  // -----------------------
  useEffect(() => {
    const MAX_TAB_SWITCHES = 3;

    // --- Tab switch detection ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current += 1;
        console.warn("Tab switched! Count:", tabSwitchCount.current);

        if (tabSwitchCount.current >= MAX_TAB_SWITCHES) {
          setLocked(true);
          alert("You have switched tabs too many times. Access is locked.");
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

        countdownTimerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimerRef.current);
              alert("Fullscreen not restored. Access locked.");
              setLocked(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        clearInterval(countdownTimerRef.current);
        setFullscreenWarning(false);
      }
    };

    // --- Copy/paste prevention ---
    const preventCopyPaste = (e) => {
      e.preventDefault();
      alert("Copying and pasting is disabled.");
    };

    // --- Right-click prevention ---
    const preventRightClick = (e) => {
      e.preventDefault();
      alert("Right-click is disabled.");
    };

    // --- Keyboard shortcuts blocking ---
    const blockShortcuts = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "a", "p"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        alert("This keyboard shortcut is disabled.");
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        alert("Opening DevTools is disabled.");
      }
      if (e.key === "F12") {
        e.preventDefault();
        alert("Opening DevTools is disabled.");
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
      clearInterval(countdownTimerRef.current);
    };
  }, []);

  if (loading) return <Container>Loading result...</Container>;
  if (!score) return <Container>No result found.</Container>;
  if (locked) return <Container>Access locked due to suspicious activity!</Container>;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Quiz Result
      </Typography>

      <Typography variant="h6">Student: {score.student.studentName}</Typography>
      <Typography variant="h6">Quiz: {score.quiz.title}</Typography>
      <Typography variant="h6">
        Score: {score.score} / {score.totalQuestions}
      </Typography>
      <Typography variant="h6">
        Percentage: {score.percentage.toFixed(2)}%
      </Typography>
      <Typography
        variant="h6"
        color={score.status === "passed" ? "green" : "red"}
      >
        Status: {score.status.toUpperCase()}
      </Typography>

      {/* Back to Home Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>

      {/* Answers List */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6">Answers:</Typography>
        <List>
          {score.answers.map((a, i) => {
            const question = score.quiz.questions.find(
              (q) => q._id === a.questionId
            );
            const isCorrect = a.selectedAnswer === question.correctAnswer;

            return (
              <ListItem
                key={i}
                sx={{ mb: 2, borderBottom: "1px solid #ddd" }}
              >
                <ListItemText
                  primary={
                    <>
                      {i + 1}. {question.questionText}{" "}
                      {isCorrect ? (
                        <CheckIcon color="success" sx={{ ml: 1 }} />
                      ) : (
                        <CloseIcon color="error" sx={{ ml: 1 }} />
                      )}
                    </>
                  }
                  secondary={
                    <>
                      <span
                        style={{
                          color: isCorrect ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        Your answer: {a.selectedAnswer || "Not answered"}
                      </span>
                      <br />
                      <span style={{ color: "green" }}>
                        Correct answer: {question.correctAnswer}
                      </span>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Fullscreen Warning Modal */}
      <Dialog open={fullscreenWarning} disableEscapeKeyDown>
        <DialogTitle>⚠ Fullscreen Mode Required</DialogTitle>
        <DialogContent>
          <Typography>
            You have exited fullscreen. Please return to fullscreen within {countdown} seconds,
            or access will be locked.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const elem = document.documentElement;
              if (elem.requestFullscreen) elem.requestFullscreen();
              else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
              else if (elem.msFullscreenRequest) elem.msFullscreenRequest();
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
