import { Container, Typography, Button, Alert, Box, Checkbox, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Welcome to the Quiz Platform</Typography>

      <Alert severity="warning" variant="filled" sx={{ mb: 3, fontWeight: "bold" }}>
        Please review all rules carefully. Violations can lead to disqualification.
      </Alert>

      <Box sx={{ mt: 2, mb: 4, p: 2, borderRadius: 2, bgcolor: "#fff8e1", border: "1px solid #ffecb3" }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#e65100" }}>⚠ Important Instructions</Typography>
        <Typography sx={{ mb: 1 }}>• Read each question carefully before selecting your answer.</Typography>
        <Typography sx={{ mb: 1 }}>• This quiz must be completed individually. No collaboration allowed.</Typography>
        <Typography sx={{ mb: 1 }}>• External assistance is strictly forbidden.</Typography>
        <Typography sx={{ mb: 1 }}>• Do not refresh, reload, or close the quiz once started.</Typography>
        <Typography sx={{ mb: 1 }}>• Time limits are enforced and cannot be extended.</Typography>
        <Typography sx={{ mb: 1 }}>• Cheating or manipulation results in disqualification or account suspension.</Typography>
        <Typography sx={{ mb: 1 }}>• Stay focused, stay calm, and do your best.</Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Please confirm that you have read and agree to the Terms & Conditions.
      </Alert>

      <FormControlLabel
        control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} color="warning" />}
        label="I have read and agree to the Terms & Conditions."
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        component={Link}
        to={agreed ? "/start" : "#"}
        disabled={!agreed}
        sx={{
          bgcolor: agreed ? "warning.main" : "grey.400",
          color: "black",
          "&:hover": { bgcolor: agreed ? "warning.dark" : "grey.500" }
        }}
      >
        Start Quiz
      </Button>
    </Container>
  );
}
