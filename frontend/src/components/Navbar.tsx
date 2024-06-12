import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';

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

return (
    <AppBar position="static">
        <Toolbar className="bg-slate-50">
            <Link to="/" className={classes.link}>
                <Button>Home</Button>
            </Link>
            <Link to="/vote" className={classes.link}>
                <Button>Vote</Button>
            </Link>
        </Toolbar>
    </AppBar>
);
};

export default Navbar;
