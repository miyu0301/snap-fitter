import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import common from "../Common";

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
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>start date</th>
          <th>end date</th>
          <th>pause</th>
          <th>Workout</th>
          <th>Duration</th>
          <th>Burned Calories</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, idx: number) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{common.getDatetimeForDisplay(record.start_datetime)}</td>
            <td>{common.getDatetimeForDisplay(record.end_datetime)}</td>
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
                <button onClick={() => onEditModal(record.id)}>Edit</button>
                <button onClick={() => deleteRecord(record.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default HistoryList;
