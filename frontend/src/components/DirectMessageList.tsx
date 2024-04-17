import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

type Message = {
  user_id: number;
  username: string;
};

const DirectMessageList = () => {
  const user_id = 3;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_ENV + "/chat/direct_message_list/" + user_id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, []);

  return (
    <>
      <div className="d-flex">
        <p>direct message list</p>
        <Button variant="primary">New</Button>
      </div>
      {messages.map((message: Message, idx: number) => (
        <div key={idx}>{message.username}</div>
      ))}
    </>
  );
};

export default DirectMessageList;
