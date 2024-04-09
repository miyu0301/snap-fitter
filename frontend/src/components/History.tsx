import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "../partials/navbar";
import HistoryList from "../components/HistoryList";
import HistoryGraph from "../components/HistoryGraph";
import { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [records, setRecords] = useState([]);
  const [viewGraph, setViewGraph] = useState(false);

  useEffect(() => {
    const fechAllRecords = async () => {
      try {
        const userId = 2;
        const res = await axios.get("http://localhost:3000/exercise/" + userId);
        setRecords(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fechAllRecords();
  }, []);

  return (
    <>
      <UserNavbar />

      <div className="d-flex flex-column container">
        <h1 className="anton-regular uppercase mb-4">MY WORKOUTS</h1>

        {records.length == 0 && <div>No Data</div>}
        {records.length > 0 && (
          <>
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
              <HistoryList records={records} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default History;
