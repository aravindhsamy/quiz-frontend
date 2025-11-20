import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StartQuiz from "./pages/StartQuiz";
import QuizPage from "./pages/QuizPage";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminStudents from "./pages/AdminStudents";
import AdminScores from "./pages/AdminScores";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<StartQuiz />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/result/:scoreId" element={<Result />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/scores" element={<AdminScores />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
