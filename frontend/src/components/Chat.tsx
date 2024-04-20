import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import RoomList from "./RoomList";
import DirectMessageList from "./DirectMessageList";
import ChatRoom from "./ChatRoom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useUser } from "../user/userProvider";

const Chat = () => {
  const auth = useAuth();
  const logined_user_id = auth.getSessionId();
  if (logined_user_id === undefined) {
    throw new Error("Session ID is undefined");
  }
  const { fetchUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [toUserId, setToUserId] = useState(0);
  const [toRoomId, setToRoomId] = useState(0);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        fetchUserData(logined_user_id);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, []);

  return (
    <>
      <UserNavbar />
      {!loading && (
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
      )}
    </>
  );
};

export default Chat;
