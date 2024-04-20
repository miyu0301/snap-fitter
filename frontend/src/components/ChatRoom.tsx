import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { format } from "date-fns";
import { io } from "socket.io-client";
import { useUser } from "../user/userProvider";

type Chat = {
  created_datetime: Date;
  username: string;
  comment: string;
};

const ChatRoom = ({
  toUserId,
  toRoomId,
}: {
  toUserId: number;
  toRoomId: number;
}) => {
  const socket = io(import.meta.env.VITE_API_ENV);
  const { dbUser } = useUser();
  // const [loginedUserName, setLoginedUserName] = useState("");
  const [roomChatMode, setRoomChatMode] = useState(false);
  const [toUsername, setToUsername] = useState("");
  const [toRoomName, setToRoomName] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [comment, setComment] = useState("");

  // useEffect(() => {
  //   const fechAllRecords = async () => {
  //     try {
  //       const user = await axios.get(
  //         import.meta.env.VITE_API_ENV + "/users/" + dbUser.id
  //       );
  //       setLoginedUserName(user.data.username);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fechAllRecords();
  // }, []);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const user = await axios.get(
          import.meta.env.VITE_API_ENV + "/users/" + toUserId
        );
        setRoomChatMode(false);
        setToUsername(user.data.username);

        const params = {
          from_user_id: dbUser.id,
          user_id: toUserId,
          room_id: undefined,
        };
        const res = await axios.get(import.meta.env.VITE_API_ENV + "/chat", {
          params,
        });
        setChats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [toUserId]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
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
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [toRoomId]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const created_datetime = new Date();
    const formData = {
      from_user_id: dbUser.id,
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

      let newChat = {
        created_datetime: created_datetime,
        username: dbUser.username,
        is_to_room: roomChatMode,
        to_user_id: roomChatMode ? undefined : toUserId,
        to_room_id: roomChatMode ? toRoomId : undefined,
        comment: comment,
      };

      socket.emit("sendMessage", newChat);
      // add chats
      let updatedChats = [...chats];
      updatedChats.push(newChat);
      setChats(updatedChats);
      setComment("");
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };

  socket.on("receiveMessage", (message) => {
    if (message.is_to_room) {
      if (message.to_room_id == toRoomId) {
        let updatedChats = [...chats];
        updatedChats.push(message);
        setChats(updatedChats);
      }
    } else {
      if (message.to_user_id == toUserId) {
        let updatedChats = [...chats];
        updatedChats.push(message);
        setChats(updatedChats);
      }
    }
  });

  return (
    <>
      <div className="">
        <p>{roomChatMode ? toRoomName : toUsername}</p>
        <div className="overflow-auto" style={{ height: "70vh" }}>
          {chats.map((chat: Chat, idx: number) => (
            <div key={idx}>
              <div>
                {format(new Date(chat.created_datetime), "yyyy/MM/dd HH:mm:ss")}
              </div>
              <div>{chat.username}</div>
              <div>{chat.comment}</div>
            </div>
          ))}
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex ">
            <Form.Group className="mb-3 w-100" controlId="exercise_id">
              <Form.Control
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChatRoom;
