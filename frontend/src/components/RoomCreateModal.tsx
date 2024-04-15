import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, ListGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

type Member = {
  id: number;
  username: string;
};

function RoomCreateModal({
  closeModal,
  onUpdate,
}: {
  closeModal: () => void;
  onUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const user_id = 2;
  const [roomName, setRoomName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [selectedMemberIds, setSelectedMembersIds] = useState<number[]>([]);

  const handleCraeteRoom = async () => {
    try {
      const formData = {
        room_name: roomName,
        create_user_id: user_id,
        members: selectedMemberIds,
      };

      const response = await axios.post(
        process.env.API_ENV + `/room`,
        formData
      );
      console.log("Update successful", response.data);
      onUpdate(true);
      closeModal();
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };

  const handleSearchChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    setSearchTerm(value);
    searchMembers(value);
  };

  const searchMembers = async (searchTerm: string) => {
    if (!searchTerm) {
      setMembers([]);
      return;
    }
    try {
      const res = await axios.get(process.env.API_ENV + `/users`);
      console.log(res.data);

      const response = await axios.get(
        process.env.API_ENV + `/users?search=${searchTerm}`
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    }
  };

  const handleSelectMember = (
    e: MouseEvent<Element, globalThis.MouseEvent>,
    member: Member
  ) => {
    e.preventDefault();
    if (!selectedMembers.some((m: Member) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
      setSelectedMembersIds([...selectedMemberIds, member.id]);
    }
  };

  const handleRemoveMember = (target_id: number) => {
    const removedMembers = selectedMembers.filter(
      (member) => member.id != target_id
    );
    setSelectedMembers(removedMembers);
    console.log(selectedMemberIds);
    const removedMemberIds = selectedMemberIds.filter((id) => id != target_id);
    console.log(removedMemberIds);
    setSelectedMembersIds(removedMemberIds);
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
          {members.length > 0 && (
            <ListGroup>
              {members.map((member: Member) => (
                <ListGroup.Item
                  key={member.id}
                  onClick={(e) => handleSelectMember(e, member)}
                  action
                >
                  {member.username}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        {selectedMembers.length > 0 && (
          <div>
            <strong>Selected Users:</strong>
            <ul>
              {selectedMembers.map((user: Member) => (
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
        <Button variant="primary" type="submit" onClick={handleCraeteRoom}>
          Create
        </Button>
      </Modal.Footer>
    </>
  );
}

export default RoomCreateModal;
