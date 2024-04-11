import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import moment from "moment";

type Record = {
  id: number;
  exercise_id: string;
  user_id: number;
  start_datetime: Date;
  end_datetime: Date;
  duration: number;
  burned_calories: number;
};

function HistoryEditModal({
  targetId,
  closeModal,
  onUpdate,
}: {
  targetId: number;
  closeModal: () => void;
  onUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [formData, setFormData] = useState<Record | null>(null);
  useEffect(() => {
    const fechRecord = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/exercise/" + targetId
        );
        setFormData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechRecord();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/exercise/${targetId}`,
        formData
      );
      console.log("Update successful", response.data);
      onUpdate(response.data);
      closeModal;
    } catch (err) {
      console.error("Failed to update record", err);
    }
  };
  return (
    <>
      {" "}
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form.Group className="mb-3" controlId="start_datetime">
            <Form.Label>Start Date and Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={
                formData
                  ? moment(new Date(formData.start_datetime)).format(
                      "YYYY-MM-DDTHH:mm"
                    )
                  : ""
              }
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exercise_id">
            <Form.Label>Exercise ID</Form.Label>
            <Form.Control
              type="text"
              value={formData?.exercise_id}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="duration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              value={formData?.duration}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={closeModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
}

export default HistoryEditModal;
