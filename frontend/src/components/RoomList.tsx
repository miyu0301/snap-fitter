import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import RoomCreateModal from "./RoomCreateModal";

type Room = {
  id: number;
  room_name: string;
};

const RoomList = ({ setToRoomId }: { setToRoomId: (id: number) => void }) => {
  const [rooms, setRooms] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [update, onUpdate] = useState(false);

  const closeModal = () => setCreateModal(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_ENV + "/room");
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [update]);

  return (
    <>
      <div className="h-50 overflow-auto">
        <div className="d-flex">
          <p>room list</p>
          <Button variant="primary" onClick={() => setCreateModal(true)}>
            New
          </Button>
        </div>
        <Modal show={createModal} onHide={closeModal}>
          <RoomCreateModal closeModal={closeModal} onUpdate={onUpdate} />
        </Modal>
        {rooms.map((room: Room, idx: number) => (
          <div
            key={idx}
            style={{ cursor: "pointer" }}
            onClick={() => setToRoomId(room.id)}
          >
            {room.room_name}
          </div>
        ))}
      </div>
    </>
  );
};

export default RoomList;
