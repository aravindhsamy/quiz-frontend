import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '' }
  ]);
  const [error, setError] = useState('');

  // Fetch quizzes from backend
  useEffect(() => {
    axios.get('https://tapp-9b1w.onrender.com/api/quizzes') // Replace with your Render URL
      .then(res => {
        setQuizzes(res.data.quizzes || []);
      })
      .catch(err => console.log(err));
  }, []);

  // Add a new question
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '' }]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  // Handle input change
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // Submit quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Convert individual options into an array for backend
    const quizData = {
      title: quizTitle,
      questions: questions.map(q => ({
        questionText: q.questionText,
        options: [q.option1, q.option2, q.option3, q.option4],
        correctAnswer: q.correctAnswer
      }))
    };

    try {
      const res = await axios.post('https://your-backend.onrender.com/api/quizzes', quizData);
      setQuizzes([...quizzes, res.data]);
      setQuizTitle('');
      setQuestions([{ questionText: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '' }]);
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || 'Error adding quiz. Make sure all fields are correct.');
    }
  };

  return (
    <div className="App">
      <h1>Quiz App</h1>

      <h2>Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes yet.</p>
      ) : (
        <ul>
          {quizzes.map(q => (
            <li key={q._id}>{q.title}</li>
          ))}
        </ul>
      )}

      <h2>Add New Quiz</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Quiz Title: </label>
          <input value={quizTitle} onChange={e => setQuizTitle(e.target.value)} required />
        </div>

        {questions.map((q, idx) => (
          <div key={idx} style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
            <div>
              <label>Question {idx + 1}:</label>
              <input value={q.questionText} onChange={e => handleQuestionChange(idx, 'questionText', e.target.value)} required />
            </div>
            <div>
              <label>Option 1:</label>
              <input value={q.option1} onChange={e => handleQuestionChange(idx, 'option1', e.target.value)} required />
            </div>
            <div>
              <label>Option 2:</label>
              <input value={q.option2} onChange={e => handleQuestionChange(idx, 'option2', e.target.value)} required />
            </div>
            <div>
              <label>Option 3:</label>
              <input value={q.option3} onChange={e => handleQuestionChange(idx, 'option3', e.target.value)} required />
            </div>
            <div>
              <label>Option 4:</label>
              <input value={q.option4} onChange={e => handleQuestionChange(idx, 'option4', e.target.value)} required />
            </div>
            <div>
              <label>Correct Answer:</label>
              <input value={q.correctAnswer} onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)} required />
            </div>
            <button type="button" onClick={() => removeQuestion(idx)}>Remove Question</button>
          </div>
        ))}

        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
}

export default App;
