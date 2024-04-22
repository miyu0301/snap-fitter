import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, ListGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import common, { UserInfo } from "../Common";

function DirectMessageCreateModal({
  recipients,
  setRecipients,
  closeModal,
  setToUserId,
}: {
  recipients: UserInfo[];
  setRecipients: any;
  closeModal: () => void;
  setToUserId: (id: number) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [selectedMember, setSelectedMember] = useState<UserInfo>();

  const handleCreateDirectMessage = async () => {
    if (selectedMember) {
      if (!recipients.some((recipient) => recipient.id == selectedMember.id)) {
        const addedRecipients = [...recipients];
        addedRecipients.push(selectedMember);
        setRecipients(addedRecipients);
      }
      setToUserId(selectedMember.id);
      closeModal();
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
      const response = await axios.get(
        import.meta.env.VITE_API_ENV + `/users?search=${searchTerm}`
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    }
  };

  const handleSelectMember = (
    e: MouseEvent<Element, globalThis.MouseEvent>,
    member: UserInfo
  ) => {
    e.preventDefault();
    setSearchTerm(member.username);
    setSelectedMember(member);
    setMembers([]);
  };

  return (
    <>
      {" "}
      <Modal.Header closeButton>
        <Modal.Title className="anton-regular">Choose Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter member name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {members.length > 0 && (
            <ListGroup>
              {members.map((member: UserInfo, key: number) => (
                <ListGroup.Item
                  key={key}
                  onClick={(e) => handleSelectMember(e, member)}
                  action
                >
                  {`${member.username} ${common.GOAL_DICT[member.goal_id]} / ${
                    common.LEVEL_DICT[member.level_id]
                  }`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="" className="button btn-outline" onClick={closeModal}>
          Close
        </Button>
        <Button
          className="button btn-solid w-50"
          type="submit"
          onClick={handleCreateDirectMessage}
        >
          Create
        </Button>
      </Modal.Footer>
    </>
  );
}

export default DirectMessageCreateModal;
