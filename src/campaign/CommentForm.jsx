import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const CommentForm = (props) => {
  const [comment, setComment] = useState(props.comment);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(comment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="filled-multiline-flexible"
        label="댓글을 작성해주세요."
        multiline
        maxRows={3}
        variant="filled"
        sx={{
          width: "70%",
          marginRight: "20px",
        }}
        value={comment}
        onChange={handleCommentChange}
      />
      <Button
        type="submit"
        variant="contained"
        endIcon={<SendIcon />}
        sx={{
          color: "white",
          fontSize: "0.8rem",
          marginTop: "10px",
        }}
      >
        작성하기
      </Button>
    </form>
  );
};

export default CommentForm;
