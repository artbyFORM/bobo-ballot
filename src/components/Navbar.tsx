import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import { useTheme } from "../ThemeContext";
import { selectNext } from "../state/songsByRound";
import Settings from "./Settings";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Navbar: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState<boolean>(false);

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
          <StyledLink to="/songs">
            <Button color="secondary" className="text-white">
              Songs
            </Button>
          </StyledLink>
        </div>
        <div>
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? (
              <Brightness4 color="secondary" />
            ) : (
              <Brightness7 color="secondary" />
            )}
          </IconButton>
          <IconButton onClick={() => setShowSettings(true)}>
            <SettingsIcon color="secondary" />
          </IconButton>
        </div>
      </Toolbar>
      <Settings open={showSettings} close={() => setShowSettings(false)} />
    </AppBar>
  );
};

export default Navbar;
