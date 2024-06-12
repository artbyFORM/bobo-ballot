import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}));

const Navbar: React.FC = () => {
  const classes = useStyles();
  const { toggleTheme, isDarkMode } = useTheme();

return (
    <AppBar position="static" elevation={0}>
        <Toolbar>
            <img src={'/logo50.png'} alt="" className="mr-3 size-8 drop-shadow-sm"/>
            <Link to="/" className={classes.link}>
                <Button color="inherit" className="text-white">Home</Button>
            </Link>
            <Link to="/vote" className={classes.link}>
                <Button color="inherit" className="text-white">Vote</Button>
            </Link>
            <IconButton color="inherit" onClick={toggleTheme}>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Toolbar>
    </AppBar>
);
};

export default Navbar;
