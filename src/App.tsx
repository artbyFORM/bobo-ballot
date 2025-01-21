import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Vote from "./pages/Vote";

import ThemeProvider from "./ThemeContext";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AppDispatch, RootState } from "./state/store";
import { getBallotData } from "./state/songs";

const Login: React.FC = () => {
  const id = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      localStorage.setItem("adminKey", id);
      navigate("/");
    }
  }, [id, navigate]);
  return <div />;
};

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
    if (error) setOpen(true);
  }, [error]);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getBallotData());
  }, [dispatch]);

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
            <Route path="/login/:id" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
