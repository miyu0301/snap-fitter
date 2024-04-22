import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import RoomCreateModal from "./RoomCreateModal";
// import { useUser } from "../user/userProvider";
import { UserInfo } from "../Common";
import { CiSquarePlus } from "react-icons/ci";
import { IoChatbubblesOutline } from "react-icons/io5";

type Room = {
  id: number;
  room_name: string;
};

const RoomList = ({
  loginedUser,
  setToRoomId,
}: {
  loginedUser: UserInfo | undefined;
  setToRoomId: (id: number) => void;
}) => {
  // const { dbUser } = useUser();
  const [rooms, setRooms] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [update, onUpdate] = useState(false);

  const closeModal = () => setCreateModal(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_ENV + "/room/room_list/" + loginedUser?.id
        );
        console.log(res.data);
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, [loginedUser, update]);

  return (
    <>
      <div className="h-custom-50">
        <div className="roomListHeader">
          <p className="m-0 p-0">Room list</p>
          <Button className="no-button" variant="primary" onClick={() => setCreateModal(true)}>
          <CiSquarePlus size="2rem" />
          </Button>
        </div>
        <Modal show={createModal} onHide={closeModal}>
          <RoomCreateModal
            closeModal={closeModal}
            onUpdate={onUpdate}
            setToRoomId={setToRoomId}
          />
        </Modal>
        <div className="itemsScroll">
        {rooms.map((room: Room, idx: number) => (
        <div className="roomItems">
            <div className="roomItemIcon">
            <IoChatbubblesOutline size="1.5rem" />
            </div>   

            <div
            className="roomItem"
            key={idx}
            style={{ cursor: "pointer" }}
            onClick={() => setToRoomId(room.id)}
            >
            {room.room_name}
            </div>
        </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default RoomList;
