import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

type Room = {
  id: number;
  room_name: string;
};

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get("http://localhost:3000/room");
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, []);

  return (
    <>
      {rooms.map((room: Room, idx: number) => (
        <div>{room.room_name}</div>
      ))}
    </>
  );
};

export default RoomList;
