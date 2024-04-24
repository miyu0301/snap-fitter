import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, ListGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import common, { UserInfo } from "../Common";
import { FaRegTrashAlt, FaUserCircle } from "react-icons/fa";

function RoomCreateModal({
  loginedUser,
  closeModal,
  onUpdate,
  setToRoomId,
}: {
  loginedUser: UserInfo | undefined;
  closeModal: () => void;
  onUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setToRoomId: (id: number) => void;
}) {
  const [roomName, setRoomName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([
    loginedUser as UserInfo,
  ]);
  const [selectedUserIds, setSelectedUsersIds] = useState<number[]>([
    loginedUser?.id as number,
  ]);

  const handleCraeteRoom = async () => {
    try {
      const formData = {
        room_name: roomName,
        create_user_id: loginedUser?.id,
        members: selectedUserIds,
      };

      const response = await axios.post(
        import.meta.env.VITE_API_ENV + `/room`,
        formData
      );
      console.log("Update successful", response.data);
      setToRoomId(response.data.id);
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
        <Modal.Title className="anton-regular">Create Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Form.Group className="mb-3" controlId="room_name">
          <Form.Label>Name</Form.Label>
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
                  <div className="d-flex gap-2 align-items-center">
                    <span>
                      <img
                        src={common.getProfileImagePath(user.image_path)}
                        className="img-fluid rounded-circle profileImage"
                        style={{
                          width: "2em",
                          height: "2em",
                          cursor: "pointer",
                        }}
                      />
                    </span>
                    <div className="dmUserName">{user.username}</div>
                    <div className="small dmGoal">
                      {common.GOAL_DICT[user.goal_id] +
                        " / " +
                        common.LEVEL_DICT[user.level_id]}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        {selectedUsers.length > 0 && (
          <div className="mt-4">
            <strong>Selected Users:</strong>
            <ul className="roomSelectedUserList">
              {selectedUsers.map((user: UserInfo) => (
                <li key={user.id}>
                  <div className="d-flex gap-2 align-items-center">
                    <span>
                      <img
                        src={common.getProfileImagePath(user.image_path)}
                        className="img-fluid rounded-circle profileImage"
                        style={{
                          width: "2em",
                          height: "2em",
                          cursor: "pointer",
                        }}
                      />
                    </span>
                    <div className="dmUserName">{user.username}</div>
                    <div className="small dmGoal">
                      {common.GOAL_DICT[user.goal_id] +
                        " / " +
                        common.LEVEL_DICT[user.level_id]}
                    </div>
                  </div>

                  <button onClick={() => handleRemoveMember(user.id)}>
                    <FaRegTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="" className="button btn-outline" onClick={closeModal}>
          Close
        </Button>
        <Button
          className="button btn-solid w-50"
          type="submit"
          onClick={handleCraeteRoom}
        >
          Create
        </Button>
      </Modal.Footer>
    </>
  );
}

export default RoomCreateModal;
