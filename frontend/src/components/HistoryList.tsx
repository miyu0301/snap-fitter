import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import { format } from "date-fns";
import axios from "axios";
import common from "../Common";

type Record = {
  id: number;
  exercise_name: string;
  user_id: number;
  start_datetime: Date;
  end_datetime: Date;
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
      await axios.delete("http://localhost:3000/exercise/" + id);
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
          <th>Date</th>
          <th>Workout</th>
          <th>Duration</th>
          <th>Calories</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, idx: number) => (
          <tr>
            <td>{idx + 1}</td>
            <td>
              {format(new Date(record.start_datetime), "yyyy/MM/dd HH:mm:ss")}
            </td>
            <td>{record.exercise_name}</td>
            <td>
              {common.calculateDurationForDisplay(
                new Date(record.start_datetime),
                new Date(record.end_datetime)
              )}
            </td>
            <td>{record.burned_calories}</td>
            <div>
              <button onClick={() => onEditModal(record.id)}>Edit</button>
              <button onClick={() => deleteRecord(record.id)}>Delete</button>
            </div>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default HistoryList;
