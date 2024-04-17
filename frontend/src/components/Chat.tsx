import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import RoomList from "./RoomList";
import DirectMessageList from "./DirectMessageList";
import ChatRoom from "./ChatRoom";
import { ChangeEvent, useEffect, useState } from "react";

const Chat = () => {
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
        <div className="d-flex">
          <div className="d-flex flex-column" style={{ width: "50vh" }}>
            <RoomList />
            <DirectMessageList />
          </div>
          <div className="w-100">
            <ChatRoom />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
