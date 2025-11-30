import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>System Number</TableCell>
              <TableCell>Quiz Code</TableCell>
              <TableCell>Quiz Title</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.systemNumber}</TableCell>
                <TableCell>{student.quizCode}</TableCell>
                <TableCell>{student.quizTitle}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
