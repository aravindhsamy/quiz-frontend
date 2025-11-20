// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { AppBar, Toolbar, Typography} from "@mui/material";
// import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Quiz Platform
        </Typography>

        {/* <Button color="inherit" component={Link} to="/">
          Home
        </Button>

        <Button color="inherit" component={Link} to="/admin">
          Admin
        </Button> */}
      </Toolbar>
    </AppBar>
  );
}
