import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import RoomList from "./RoomList";
import DirectMessageList from "./DirectMessageList";
import ChatRoom from "./ChatRoom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
// import { fetchUserData } from "../user/userProvider";
import common, { UserInfo } from "../Common";
import axios from "axios";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Socket, io } from "socket.io-client";

const Chat = () => {
  const auth = useAuth();
  const logined_user_id = auth.getSessionId();
  if (logined_user_id === undefined) {
    throw new Error("Session ID is undefined");
  }
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loginedUser, setLoginedUser] = useState<UserInfo>();
  const [loading, setLoading] = useState(true);
  const [toUserId, setToUserId] = useState(0);
  const [toRoomId, setToRoomId] = useState(0);
  const [pageUpdate, onPageUpdate] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_ENV, {
      autoConnect: false,
    });
    setSocket(socket);
    socket.connect();
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_ENV + "/users/" + logined_user_id
        );
        const user: UserInfo = res.data;
        setLoginedUser(user);
        setLoading(false);
        onPageUpdate(false);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [pageUpdate]);

  return (
    <>
      <UserNavbar
        username={loginedUser ? loginedUser.username : ""}
        imagePath={
          loginedUser ? common.getProfileImagePath(loginedUser?.image_path) : ""
        }
      />
      {!loading && (
        <div className="d-flex flex-column container mt-80">
          <div className="row">
            <div className="col-sm-12">
              <h1 className="anton-regular uppercase mb-4">
                <IoChatbubbleEllipsesOutline /> Chat Room
              </h1>
            </div>

            <div className="col-sm-12">
              <div className="d-flex chatContainer gap-4">
                <div className="d-flex flex-column chatLeftCol">
                  <RoomList
                    loginedUser={loginedUser}
                    setToRoomId={setToRoomId}
                  />
                  <hr className="hr"></hr>
                  <DirectMessageList
                    loginedUser={loginedUser}
                    setToUserId={setToUserId}
                  />
                </div>
                <div className="w-100 chatRoom">
                  <ChatRoom
                    socket={socket}
                    loginedUser={loginedUser}
                    toUserId={toUserId}
                    toRoomId={toRoomId}
                    setToRoomId={setToRoomId}
                    onPageUpdate={onPageUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div> /*d-flex container*/
      )}
    </>
  );
};

export default Chat;
