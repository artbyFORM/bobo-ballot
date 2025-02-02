import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { AppDispatch, RootState } from "../state/store";
import { comment, disqualify } from "../state/songs";

function Comments({ id }: { id: number }) {
  // LOCAL STATE
  const [text, setText] = useState<string>("");
  const commentField = useRef<HTMLTextAreaElement>(null);

  const privateComments = JSON.parse(
    localStorage.getItem("privateComments") || "{}"
  );
  const [privateNote, setPrivateNote] = useState<string>(
    privateComments[id]?.comment || ""
  );
  const [flagged, setFlagged] = useState<boolean>(
    privateComments[id]?.flagged || false
  );

  // needed because comments gets rerendered across songs
  useEffect(() => {
    setText("");
    setPrivateNote(privateComments[id]?.comment || "");
    setFlagged(privateComments[id]?.flagged || false);
    // eslint-disable-next-line
  }, [id]);

  // GLOBAL STATE
  const comments = useSelector((state: RootState) => state.songs[id]?.comments);
  const disqualified = useSelector(
    (state: RootState) => state.songs[id]?.disqualified
  );

  // ACTIONS
  const dispatch: AppDispatch = useDispatch();
  const postComment = () => {
    if (!text) return;
    dispatch(comment({ id, message: text }));
    setText("");
    if (commentField.current) commentField.current.blur();
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
        <form>
          <TextField
            className="flex-1 w-full"
            sx={{ marginBottom: "15px" }}
            multiline
            value={text}
            inputRef={commentField}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                postComment();
              }
            }}
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
              type="submit"
              variant="contained"
              color="primary"
              className="float-right"
              onClick={(e) => {
                e.preventDefault();
                postComment();
              }}
            >
              POST COMMENT
            </Button>
          </div>
        </form>
        <form className="mt-10">
          <TextField
            className="flex-1 w-full"
            sx={{ marginBottom: "15px" }}
            multiline
            value={privateNote}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              setPrivateNote(e.target.value);
              localStorage.setItem(
                "privateComments",
                JSON.stringify({
                  ...privateComments,
                  [id]: {
                    ...(privateComments[id] || {}),
                    comment: e.target.value,
                  },
                })
              );
            }}
            placeholder="Private note"
          />
          <FormControlLabel
            control={
              <Switch
                checked={flagged}
                onChange={() => {
                  setFlagged(!flagged);
                  localStorage.setItem(
                    "privateComments",
                    JSON.stringify({
                      ...privateComments,
                      [id]: {
                        ...(privateComments[id] || {}),
                        flagged: !flagged,
                      },
                    })
                  );
                }}
              />
            }
            label="Flag for self"
          />
        </form>
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
