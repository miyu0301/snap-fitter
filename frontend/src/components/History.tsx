import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import HistoryList from "../components/HistoryList";
import HistoryGraph from "../components/HistoryGraph";
import HistoryEditModal from "../components/HistoryEditModal";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { format } from "date-fns";

const History = () => {
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [viewGraph, setViewGraph] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [targetId, setTargetId] = useState(0);
  const [update, onUpdate] = useState(false);

  const closeModal = () => setEditModal(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const userId = 2;
        const res = await axios.get(
          import.meta.env.VITE_API_ENV + "/exercise/all/" + userId
        );
        // const res = await axios.get(`${API_URL}/exercise/all/${userId}`);

        setRecords(res.data.records);
        setStartDate(
          format(
            new Date(res.data.datetime_range.oldest_datetime),
            "yyyy-MM-dd"
          )
        );
        setEndDate(
          format(
            new Date(res.data.datetime_range.latest_datetime),
            "yyyy-MM-dd"
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
    onUpdate(false);
  }, [update]);

  const handleStartDate = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const newStartDate = e.target.value;
      const userId = 2;
      const res = await axios.get(
        import.meta.env.VITE_API_ENV +
          "/exercise/all/" +
          userId +
          "/" +
          newStartDate +
          "/" +
          endDate
      );
      setRecords(res.data);
      setStartDate(newStartDate);
    } catch (err) {
      console.log(err);
    }
  };
  const handleEndDate = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const newEndDate = e.target.value;
      const userId = 2;
      const res = await axios.get(
        import.meta.env.VITE_API_ENV +
          "/exercise/all/" +
          userId +
          "/" +
          startDate +
          "/" +
          newEndDate
      );
      setRecords(res.data);
      setEndDate(newEndDate);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <UserNavbar />

      <div className="d-flex flex-column container">
        <h1 className="anton-regular uppercase mb-4">MY WORKOUTS</h1>

        {records.length == 0 && <div>No Data</div>}
        {records.length > 0 && (
          <>
            <Form>
              <Form.Group className="mb-3" controlId="start_datetime">
                <Form.Label>Start</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={handleStartDate}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="start_datetime">
                <Form.Label>End</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={handleEndDate}
                />
              </Form.Group>
            </Form>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={() => setViewGraph(!viewGraph)}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                view graph
              </label>
            </div>
            {viewGraph ? (
              <HistoryGraph records={records} />
            ) : (
              <HistoryList
                records={records}
                setEditModal={setEditModal}
                setTargetId={setTargetId}
                onUpdate={onUpdate}
              />
            )}
            <Modal show={editModal} onHide={closeModal}>
              <HistoryEditModal
                targetId={targetId}
                closeModal={closeModal}
                onUpdate={onUpdate}
              />
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default History;
