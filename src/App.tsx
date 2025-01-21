import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Vote from "./pages/Vote";

import ThemeProvider from "./ThemeContext";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { RootState } from "./state/store";

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason !== "clickaway") setOpen(false);
  };

  const error = useSelector((state: RootState) => state.error);

  useEffect(() => {
    console.log(error);
    if (error) setOpen(true);
  }, [error]);

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vote/:id" element={<Vote />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
