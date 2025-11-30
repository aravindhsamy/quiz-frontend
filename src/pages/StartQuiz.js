import { useState, useEffect, useRef } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function StartQuiz() {
  const navigate = useNavigate();
  const tabSwitchCount = useRef(0); // Use ref instead of state
  const [form, setForm] = useState({
    studentName: "",
    rollNumber: "",
    systemNumber: "",
    quizCode: "",
    quizTitle: "",
  });
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startQuiz = async () => {
    // Request fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();

    setLoading(true);

    try {
      const res = await API.post("/students/start", form);
      const student = res.data;
      navigate(`/quiz/${student._id}`, { state: { student } });
    } catch (err) {
      console.error(err);
      alert("Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const MAX_TAB_SWITCHES = 3;

    // --- Tab switch detection ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current += 1;
        console.warn("Tab switched! Count:", tabSwitchCount.current);

        if (tabSwitchCount.current >= MAX_TAB_SWITCHES) {
          setLocked(true);
          alert("You have switched tabs too many times. Quiz is locked.");
        }
      }
    };

    // --- Fullscreen exit detection ---
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setLocked(true);
        alert("Exiting fullscreen is not allowed. Quiz is locked.");
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

    // --- Keyboard shortcut blocking ---
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
    const disableTextSelection = () => {
      document.body.style.userSelect = "none";
    };

    disableTextSelection();

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", preventCopyPaste);
    document.addEventListener("paste", preventCopyPaste);
    document.addEventListener("contextmenu", preventRightClick);
    document.addEventListener("keydown", blockShortcuts);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("keydown", blockShortcuts);
      document.body.style.userSelect = "auto";
    };
  }, [form.studentName]);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Start Quiz
      </Typography>

      {locked ? (
        <Typography color="error" variant="h6">
          Quiz Locked! Due to suspicious activity.
        </Typography>
        
      ) : (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Student Name"
            name="studentName"
            onChange={handleChange}
            value={form.studentName}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Roll Number"
            name="rollNumber"
            onChange={handleChange}
            value={form.rollNumber}
          />
          <TextField
            fullWidth
            margin="normal"
            label="System Number"
            name="systemNumber"
            onChange={handleChange}
            value={form.systemNumber}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Quiz Code"
            name="quizCode"
            onChange={handleChange}
            value={form.quizCode}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Quiz Title"
            name="quizTitle"
            onChange={handleChange}
            value={form.quizTitle}
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={startQuiz}
            disabled={loading}
          >
            {loading ? "Starting Quiz..." : "Begin Quiz"}
          </Button>
        </>
      )}
    </Container>
  );
}
