import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

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
          process.env.API_ENV + "/chat/direct_message_list/" + user_id
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
      {messages.map((message: Message, idx: number) => (
        <div>{message.username}</div>
      ))}
    </>
  );
};

export default DirectMessageList;
