import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import HistoryList from "../components/HistoryList";
import HistoryGraph from "../components/HistoryGraph";
import HistoryEditModal from "../components/HistoryEditModal";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { useAuth } from "../auth/AuthProvider";
import { UserInfo } from "../Common";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const History = () => {
  // const { dbUser } = useUser();
  const auth = useAuth();
  const logined_user_id = auth.getSessionId();
  if (logined_user_id === undefined) {
    throw new Error("Session ID is undefined");
  }
  const [loginedUser, setLoginedUser] = useState<UserInfo>();
  const [records, setRecords] = useState([]);
  const [calories, setCalories] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [viewGraph, setViewGraph] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [targetId, setTargetId] = useState(0);
  const [update, onUpdate] = useState(false);

  const closeModal = () => setEditModal(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const userResponse = await axios.get(
          import.meta.env.VITE_API_ENV + "/users/" + logined_user_id
        );
        const user: UserInfo = userResponse.data;
        setLoginedUser(user);

        const res = await axios.get(
          import.meta.env.VITE_API_ENV + "/exercise/all/" + logined_user_id
        );

        setRecords(res.data.records);
        setStartDate(res.data.datetime_range.oldest_datetime);
        setEndDate(res.data.datetime_range.latest_datetime);
        const response = await axios.get(
          import.meta.env.VITE_API_ENV +
            "/exercise/burned_calories/" +
            logined_user_id
        );
        setCalories(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
    onUpdate(false);
  }, [update]);

  const handleStartDate = async (newStartDate: Date | null) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_ENV +
          "/exercise/all/" +
          logined_user_id +
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
  const handleEndDate = async (newEndDate: Date | null) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_ENV +
          "/exercise/all/" +
          logined_user_id +
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
      <UserNavbar username={loginedUser ? loginedUser.username : ""} />

      <div className="d-flex flex-column container">
        <h1 className="anton-regular uppercase mb-4">MY WORKOUTS</h1>

        {records.length == 0 && <div>No Data</div>}
        {records.length > 0 && (
          <>
            <Form>
              <Form.Group className="mb-3" controlId="start_datetime">
                <Form.Label>Start</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={(e) => handleStartDate(e)}
                  dateFormat="MMM d, yyyy"
                  customInput={<Form.Control />}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="start_datetime">
                <Form.Label>End</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={(e) => handleEndDate(e)}
                  dateFormat="MMM d, yyyy"
                  customInput={<Form.Control />}
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
              <HistoryGraph records={records} calories={calories} />
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
