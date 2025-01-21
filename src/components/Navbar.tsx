import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { selectNext } from "../state/songsByRound";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Navbar: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();

  const nextUnvoted = useSelector(selectNext({ unvoted: true }));

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar className={`bg-pink-500 justify-between`}>
        <div className="flex">
          <img
            src={"/logo50.png"}
            alt=""
            className="mr-3 size-8 drop-shadow-lg"
          />
          <StyledLink to="/">
            <Button color="secondary" className="text-white">
              Home
            </Button>
          </StyledLink>
          {nextUnvoted && (
            <StyledLink to={"/vote/" + nextUnvoted}>
              <Button color="secondary" className="text-white">
                Vote
              </Button>
            </StyledLink>
          )}
        </div>

        <IconButton onClick={toggleTheme}>
          {isDarkMode ? (
            <Brightness4Icon style={{ color: "white" }} />
          ) : (
            <Brightness7Icon style={{ color: "white" }} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
