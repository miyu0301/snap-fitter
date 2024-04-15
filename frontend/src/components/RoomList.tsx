import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import RoomCreateModal from "./RoomCreateModal";

type Room = {
  id: number;
  room_name: string;
};

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [update, onUpdate] = useState(false);

  const closeModal = () => setCreateModal(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get(process.env.API_ENV + "/room");
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [update]);

  return (
    <>
      <Button variant="primary" onClick={() => setCreateModal(true)}>
        New
      </Button>
      <Modal show={createModal} onHide={closeModal}>
        <RoomCreateModal closeModal={closeModal} onUpdate={onUpdate} />
      </Modal>
      {rooms.map((room: Room, idx: number) => (
        <div>{room.room_name}</div>
      ))}
    </>
  );
};

export default RoomList;
