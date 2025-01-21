import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  Select,
  Button,
  MenuItem,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { AppDispatch, RootState } from "../state/store";
import { changeSettings } from "../state/settings";

const users = ["abby", "aden", "bri", "erik", "eve", "june", "noah", "winnie"];

function Settings({ open, close }: { open: boolean; close: any }) {
  const settings = useSelector((state: RootState) => state.settings);

  const dispatch: AppDispatch = useDispatch();
  const change = (v: any) => {
    console.log(v);
    dispatch(changeSettings(v));
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please set up your bobo ballot configuration here to ensure your votes
          are counted correctly.
        </DialogContentText>
        <br />
        <FormControl fullWidth>
          <InputLabel id="current-user-label">Current user</InputLabel>
          <Select
            labelId="current-user-label"
            id="current-user"
            value={settings.voter_id}
            label="Current user"
            onChange={(e) => change({ voter_id: e.target.value })}
            fullWidth
          >
            {users.map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl fullWidth>
          <ToggleButtonGroup
            color="primary"
            value={settings.round}
            exclusive
            onChange={(e, round) => {
              if (round) change({ round });
            }}
          >
            <ToggleButton value={1}>Round 1</ToggleButton>
            <ToggleButton value={2}>Round 2</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Settings;
