import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import common from "../Common";
import { BsCalendar } from "react-icons/bs";
import { FaRegClock, FaRunning } from "react-icons/fa";
import { LuFlame } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";

type Record = {
  id: number;
  exercise_name: string;
  user_id: number;
  start_datetime: Date;
  end_datetime: Date;
  pause: number;
  burned_calories: number;
};
function HistoryList({
  records,
  setEditModal,
  setTargetId,
  onUpdate,
}: {
  records: Record[];
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTargetId: (id: number) => void;
  onUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onEditModal = (id: number) => {
    setTargetId(id);
    setEditModal(true);
  };
  const deleteRecord = async (id: number) => {
    try {
      await axios.delete(import.meta.env.VITE_API_ENV + "/exercise/" + id);
      onUpdate(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="table-responsive historyList">
    <Table striped  hover className="table-auto">
      <thead>
        <tr>
          <th>#</th>
          <th><BsCalendar /> Start date</th>
          <th><BsCalendar /> End date</th>
          <th><FaRegClock /> Pause</th>
          <th><FaRunning /> Workout</th>
          <th><FaRegClock /> Duration</th>
          <th><LuFlame /> Burned Calories</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, idx: number) => (
          <tr className="tr-sm" key={idx}>
            <td>{idx + 1}</td>
            {/* <td>{common.getDatetimeForDisplay(record.start_datetime)}</td>
            <td>{common.getDatetimeForDisplay(record.end_datetime)}</td> */}
            <td>{common.getMinutesForDisplay(record.pause)}</td>
            <td>{record.exercise_name}</td>
            <td>
              {common.calculateDurationForDisplay(
                new Date(record.start_datetime),
                new Date(record.end_datetime),
                record.pause
              )}
            </td>
            <td>{record.burned_calories} cal</td>
            <td>
              {" "}
              <div>
                <button className="no-button ms-4" onClick={() => onEditModal(record.id)}><FiEdit size="1.3rem" /></button>
                <button className="no-button ms-4" onClick={() => deleteRecord(record.id)}><MdOutlineDelete size="1.5rem" /></button>
              </div>
            </td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
}

export default HistoryList;
