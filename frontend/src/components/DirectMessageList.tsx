import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import common from "../Common";

type Message = {
  user_id: number;
  username: string;
  goal_id: 1 | 2 | 3;
  level_id: 1 | 2 | 3;
};

const DirectMessageList = ({
  setToUserId,
}: {
  setToUserId: (id: number) => void;
}) => {
  const user_id = 3;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_ENV + "/chat/direct_message_list/" + user_id
        );
        setMessages(res.data);
        setToUserId(res.data[0].user_id);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, []);

  return (
    <>
      <div className="h-50 overflow-auto">
        <div className="d-flex">
          <p>direct message list</p>
          <Button variant="primary">New</Button>
        </div>
        {messages.map((message: Message, idx: number) => (
          <div
            key={idx}
            style={{ cursor: "pointer" }}
            onClick={() => setToUserId(message.user_id)}
          >
            {message.username}
            <div className="">
              {common.GOAL_DICT[message.goal_id] +
                " / " +
                common.LEVEL_DICT[message.level_id]}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DirectMessageList;
