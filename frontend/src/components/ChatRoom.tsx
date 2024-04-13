import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import HistoryList from "./HistoryList";
import HistoryGraph from "./HistoryGraph";
import HistoryEditModal from "./HistoryEditModal";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import { format } from "date-fns";

type Chat = {
  id: number;
  created_datetime: Date;
  // from_user_id: string;
  // to_room_id: string;
  // to_user_id: string;
  username: string;
  comment: string;
};

const ChatRoom = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    console.log("a");
    const fechAllRecords = async () => {
      try {
        const params = {
          user_id: 2,
          room_id: undefined,
        };
        const res = await axios.get("http://localhost:3000/chat", { params });
        console.log(res.data);
        setChats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, []);

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
    </>
  );
};

export default ChatRoom;
