import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

import { AppDispatch, RootState } from "../state/store";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { comment, disqualify } from "../state/songs";

function Comments({ id }: { id: number }) {
  // LOCAL STATE
  const [text, setText] = useState<string>("");

  // GLOBAL STATE
  const comments = useSelector((state: RootState) => state.songs[id]?.comments);
  const disqualified = useSelector(
    (state: RootState) => state.songs[id]?.disqualified
  );

  // ACTIONS
  const dispatch: AppDispatch = useDispatch();
  const postComment = () => {
    dispatch(comment({ id, message: text }));
    setText("");
  };
  const dispatchDisqualify = () => {
    dispatch(disqualify({ id, disqualified: !disqualified }));
  };

  return (
    <div
      className="w-full flex gap-20 max-w-7xl m-auto"
      style={{ marginTop: "50px" }}
    >
      <div className="flex-1">
        <TextField
          className="flex-1 w-full"
          sx={{ marginBottom: "15px" }}
          multiline
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <div className="flex justify-between">
          <FormControlLabel
            control={
              <Switch checked={disqualified} onChange={dispatchDisqualify} />
            }
            label="Disqualify song"
          />
          <Button
            variant="contained"
            color="primary"
            className="float-right"
            onClick={postComment}
          >
            POST COMMENT
          </Button>
        </div>
      </div>
      <div className="flex-1">
        {comments?.map((i) => (
          <Card variant="outlined" key={i.id} className="mb-5">
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                {i.voter_id} •{" "}
                {format(new Date(i.created_at), "MMM d, h:mm aa")}
              </Typography>
              <Typography variant="body2" style={{ whiteSpace: "pre" }}>
                {i.message}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {comments?.length === 0 && (
          <h4 className="font-bold">No comments yet!</h4>
        )}
      </div>
    </div>
  );
}

export default Comments;
