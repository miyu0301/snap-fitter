import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import { format } from "date-fns";
import RoomEditModal from "./RoomEditModal";
import common, { UserInfo } from "../Common";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { Socket } from "socket.io-client";

type Chat = {
  is_to_room: boolean;
  from_user_id: number | undefined;
  to_user_id: number | undefined;
  to_room_id: number | undefined;
  username: string;
  comment: string;
  created_datetime: Date;
  image_path: string;
};

const ChatRoom = ({
  socket,
  loginedUser,
  toUserId,
  toRoomId,
  setToRoomId,
  onPageUpdate,
}: {
  socket: Socket | null;
  loginedUser: UserInfo | undefined;
  toUserId: number;
  toRoomId: number;
  setToRoomId: (id: number) => void;
  onPageUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [roomChatMode, setRoomChatMode] = useState(false);
  const [toUsername, setToUsername] = useState("");
  const [toRoomName, setToRoomName] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [comment, setComment] = useState("");
  const [update, onUpdate] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const closeModal = () => setEditModal(false);

  useEffect(() => {
    socket?.on("receiveMessage", (message) => {
      if (message.is_to_room) {
        if (
          message.to_room_id == toRoomId &&
          message.from_user_id != loginedUser?.id
        ) {
          setChats((prevChats) => [...prevChats, message]);
        }
      } else {
        if (message.from_user_id == toUserId) {
          setChats((prevChats) => [...prevChats, message]);
        }
      }
      return () => {
        socket?.off("receiveMessage");
      };
    });
  }, [socket, toUserId, toRoomId]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        if (toUserId) {
          const user = await axios.get(
            import.meta.env.VITE_API_ENV + "/users/" + toUserId
          );
          setRoomChatMode(false);
          setToUsername(user.data.username);

          const params = {
            from_user_id: loginedUser?.id,
            user_id: toUserId,
            room_id: undefined,
          };
          const res = await axios.get(import.meta.env.VITE_API_ENV + "/chat", {
            params,
          });
          setChats(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [update, toUserId]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        if (toRoomId != 0) {
          const room = await axios.get(
            import.meta.env.VITE_API_ENV + "/room/" + toRoomId
          );
          setRoomChatMode(true);
          setToRoomName(room.data.room_name);

          const params = {
            user_id: undefined,
            room_id: toRoomId,
          };
          const res = await axios.get(import.meta.env.VITE_API_ENV + "/chat", {
            params,
          });
          setChats(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [update, toRoomId]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const created_datetime = new Date();
    const formData = {
      from_user_id: loginedUser?.id,
      to_user_id: roomChatMode ? undefined : toUserId,
      to_room_id: roomChatMode ? toRoomId : undefined,
      comment: comment,
      created_datetime: created_datetime,
    };

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_ENV + `/chat`,
        formData
      );
      console.log("Update successful", response.data);

      let newChat: Chat = {
        created_datetime: created_datetime,
        username: loginedUser ? loginedUser.username : "",
        from_user_id: loginedUser ? loginedUser.id : 0,
        is_to_room: roomChatMode,
        to_user_id: roomChatMode ? undefined : toUserId,
        to_room_id: roomChatMode ? toRoomId : undefined,
        comment: comment,
        image_path: loginedUser ? loginedUser.image_path : "",
      };

      socket?.emit("sendMessage", newChat);
      // add chats
      let updatedChats: Chat[] = [...chats];
      updatedChats.push(newChat);
      setChats(updatedChats);
      setComment("");
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };

  return (
    <>
      {roomChatMode ? (
        <div className="d-flex gap-3 mb-4">
          <p className="m-0 p-0">
            <b>{toRoomName}</b>
          </p>
          <Button
            className="no-button"
            variant="primary"
            onClick={() => setEditModal(true)}
          >
            <IoSettingsOutline size="2rem" />
          </Button>
        </div>
      ) : (
        <p className="dmName">{toUsername}</p>
      )}
      <div className="overflow-auto" style={{ height: "60vh" }}>
        {chats.map((chat: Chat, idx: number) => (
          <div key={idx}>
            <div
              className={`d-flex align-items-center gap-2 ${
                chat.from_user_id == loginedUser?.id
                  ? "flex-row-reverse"
                  : "flex-row"
              } `}
            >
              <span>
                <img
                  src={common.getProfileImagePath(chat.image_path)}
                  className="img-fluid rounded-circle profileImage"
                  style={{ width: "3em", height: "3em", cursor: "pointer" }}
                />
              </span>
              <div className="chat-comment">
                <div className="chat-date">
                  {format(
                    new Date(chat.created_datetime),
                    "yyyy/MM/dd HH:mm:ss"
                  )}
                </div>
                <div className="chat-username">{chat.username}</div>
                <div>{chat.comment}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center">
          <Form.Group className="w-100" controlId="exercise_id">
            <Form.Control
              className="chatInput"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" className="chatBtnSubmit" type="submit">
            Send <IoMdSend />
          </Button>
        </div>
      </Form>

      <Modal show={editModal} onHide={closeModal}>
        <RoomEditModal
          closeModal={closeModal}
          onUpdate={onUpdate}
          toRoomId={toRoomId}
          setToRoomId={setToRoomId}
          onPageUpdate={onPageUpdate}
        />
      </Modal>
    </>
  );
};

export default ChatRoom;
