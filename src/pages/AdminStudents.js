import { useState, useEffect } from "react";
import { Container, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import API from "../api";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/students");
        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <Container>Loading students...</Container>;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Students List
      </Typography>

      <List>
        {students.map((student) => (
          <Paper key={student._id} sx={{ p: 2, mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={student.studentName}
                secondary={
                  <>
                    Roll Number: {student.rollNumber} <br />
                    System Number: {student.systemNumber} <br />
                    Quiz Code: {student.quizCode} <br />
                    Quiz Title: {student.quizTitle}
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
