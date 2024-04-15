import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import RoomList from "./RoomList";
import DirectMessageList from "./DirectMessageList";
import ChatRoom from "./ChatRoom";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import { format } from "date-fns";

const Chat = () => {
  const [records, setRecords] = useState([]);
  const [update, onUpdate] = useState(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        // const userId = 2;
        // const res = await axios.get(
        //   "http://localhost:3000/exercise/all/" + userId
        // );
        // setRecords(res.data.records);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
    onUpdate(false);
  }, [update]);

  return (
    <>
      <UserNavbar />

      <div className="d-flex flex-column container">
        <h1 className="anton-regular uppercase mb-4">Chat</h1>
        <p>room list</p>
        <RoomList />
        <p>direct message list</p>
        <DirectMessageList />
        <p>chat room</p>
        <ChatRoom />
      </div>
    </>
  );
};

export default Chat;
