import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { format } from "date-fns";
import { io } from "socket.io-client";

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
  const socket = io(import.meta.env.VITE_API_ENV);
  const [chats, setChats] = useState([]);
  const [comment, setComment] = useState("");
  const [update, onUpdate] = useState(false);

  const [test, setTest] = useState<string[]>([]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const params = {
          user_id: 2,
          room_id: undefined,
        };
        const res = await axios.get(import.meta.env.VITE_API_ENV + "/chat", {
          params,
        });
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
    const created_datetime = new Date();
    const formData = {
      from_user_id: logined_user_id,
      to_user_id: user_id,
      to_room_id: room_id,
      comment: comment,
      created_datetime: created_datetime,
    };
    console.log(formData);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_ENV + `/chat`,
        formData
      );
      console.log("Update successful", response.data);
      socket.emit("sendMessage", {
        created_datetime: created_datetime,
        username: logined_user_id,
        comment: comment,
      });
      setComment("");
      onUpdate(true);
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };
  socket.on("receiveMessage", (message) => {
    const updatedTest = [...test];
    updatedTest.push(message);
    setTest(updatedTest);
  });
  console.log(test);

  return (
    <>
      <div className="">
        <div className="overflow-auto" style={{ height: "70vh" }}>
          {chats.map((chat: Chat, idx: number) => (
            <div key={idx}>
              <div>
                {format(new Date(chat.created_datetime), "yyyy/MM/dd HH:mm:ss")}
              </div>
              <div>{chat.username}</div>
              <div>{chat.comment}</div>
            </div>
          ))}
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex ">
            <Form.Group className="mb-3 w-100" controlId="exercise_id">
              <Form.Control
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChatRoom;
