import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}));

const Navbar: React.FC = () => {
  const classes = useStyles();
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" className={classes.link}>
          <Button color="inherit" className="text-white">Home</Button>
        </Link>
        <Link to="/vote" className={classes.link}>
          <Button color="inherit" className="text-white">Vote</Button>
        </Link>
        <Button color="inherit" onClick={toggleTheme}>
          {isDarkMode ? "Dark" : "Light"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
