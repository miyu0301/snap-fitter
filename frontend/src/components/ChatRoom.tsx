import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { format } from "date-fns";

type Chat = {
  id: number;
  created_datetime: Date;
  user_id: number;
  username: string;
  comment: string;
};

const ChatRoom = () => {
  const logined_user_id = 3;
  const user_id = 2;
  const room_id = undefined;
  const [chats, setChats] = useState([]);
  const [comment, setComment] = useState("");
  const [update, onUpdate] = useState(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const params = {
          user_id: 2,
          room_id: undefined,
        };
        const res = await axios.get(process.env.API_ENV + "/chat", {
          params,
        });
        console.log(res.data);
        setChats(res.data);
        onUpdate(false);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [update]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = {
      from_user_id: logined_user_id,
      to_user_id: user_id,
      to_room_id: room_id,
      comment: comment,
      created_datetime: new Date(),
    };
    console.log(formData);
    try {
      const response = await axios.post(
        process.env.API_ENV + `/chat`,
        formData
      );
      console.log("Update successful", response.data);
      setComment("");
      onUpdate(true);
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };

  return (
    <>
      {chats.map((chat: Chat, idx: number) => (
        <>
          <div>
            {format(new Date(chat.created_datetime), "yyyy/MM/dd HH:mm:ss")}
          </div>
          <div>{chat.username}</div>
          <div>{chat.comment}</div>
        </>
      ))}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exercise_id">
          <Form.Label>comment</Form.Label>
          <Form.Control
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </>
  );
};

export default ChatRoom;
