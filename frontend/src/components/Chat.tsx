import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import RoomList from "./RoomList";
import DirectMessageList from "./DirectMessageList";
import ChatRoom from "./ChatRoom";
import { useState } from "react";

const Chat = () => {
  const [toUserId, setToUserId] = useState(0);
  const [toRoomId, setToRoomId] = useState(0);

  return (
    <>
      <UserNavbar />

      <div className="d-flex flex-column container">
        <h1 className="anton-regular uppercase mb-4">Chat</h1>
        <div className="d-flex">
          <div className="d-flex flex-column" style={{ width: "50vh" }}>
            <RoomList setToRoomId={setToRoomId} />
            <DirectMessageList setToUserId={setToUserId} />
          </div>
          <div className="w-100">
            <ChatRoom toUserId={toUserId} toRoomId={toRoomId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
