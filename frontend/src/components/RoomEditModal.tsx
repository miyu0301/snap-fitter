import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, ListGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useUser } from "../user/userProvider";
import common, { UserInfo } from "../Common";

function RoomEditModal({
  closeModal,
  onUpdate,
  toRoomId,
  setToRoomId,
  onPageUpdate,
}: {
  closeModal: () => void;
  onUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  toRoomId: number;
  setToRoomId: (id: number) => void;
  onPageUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { dbUser } = useUser();
  const [roomName, setRoomName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([]);
  const [selectedUserIds, setSelectedUsersIds] = useState<number[]>([
    dbUser.id,
  ]);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const room = await axios.get(
          import.meta.env.VITE_API_ENV + "/room/" + toRoomId
        );
        setRoomName(room.data.room_name);
        setSelectedUsers(room.data.members);
        setSelectedUsersIds(room.data.member_ids);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, []);

  const handleEditRoom = async () => {
    try {
      const formData = {
        room_name: roomName,
        create_user_id: dbUser.id,
        members: selectedUserIds,
      };

      const response = await axios.put(
        import.meta.env.VITE_API_ENV + `/room/` + toRoomId,
        formData
      );
      console.log("Update successful", response.data);
      setToRoomId(response.data.id);
      onPageUpdate(true);
      onUpdate(true);
      closeModal();
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };

  const handleSearchChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    setSearchTerm(value.split(" ")[0]);
    searchMembers(value.split(" ")[0]);
  };

  const searchMembers = async (searchTerm: string) => {
    if (!searchTerm) {
      setUsers([]);
      return;
    }
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_ENV + `/users?search=${searchTerm}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setUsers([]);
    }
  };

  const handleSelectMember = (
    e: MouseEvent<Element, globalThis.MouseEvent>,
    member: UserInfo
  ) => {
    e.preventDefault();
    if (!selectedUsers.some((m: UserInfo) => m.id === member.id)) {
      setSelectedUsers([...selectedUsers, member]);
      setSelectedUsersIds([...selectedUserIds, member.id]);
    }
  };

  const handleRemoveMember = (target_id: number) => {
    const removedMembers = selectedUsers.filter((user) => user.id != target_id);
    setSelectedUsers(removedMembers);
    console.log(selectedUserIds);
    const removedMemberIds = selectedUserIds.filter((id) => id != target_id);
    console.log(removedMemberIds);
    setSelectedUsersIds(removedMemberIds);
  };

  return (
    <>
      {" "}
      <Modal.Header closeButton>
        <Modal.Title>Create Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Form.Group className="mb-3" controlId="room_name">
          <Form.Label>name</Form.Label>
          <Form.Control
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Search for members</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter member name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {users.length > 0 && (
            <ListGroup>
              {users.map((user: UserInfo) => (
                <ListGroup.Item
                  key={user.id}
                  onClick={(e) => handleSelectMember(e, user)}
                  action
                >
                  {`${user.username} ${common.GOAL_DICT[user.goal_id]} / ${
                    common.LEVEL_DICT[user.level_id]
                  }`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        {selectedUsers.length > 0 && (
          <div>
            <strong>Selected Users:</strong>
            <ul>
              {selectedUsers.map((user: UserInfo) => (
                <li key={user.id}>
                  {user.username}{" "}
                  <button onClick={() => handleRemoveMember(user.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleEditRoom}>
          Update
        </Button>
      </Modal.Footer>
    </>
  );
}

export default RoomEditModal;
