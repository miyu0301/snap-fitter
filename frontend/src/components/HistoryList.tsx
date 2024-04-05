import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import { format } from "date-fns";

type Record = {
  id: number;
  exercise_name: string;
  user_id: number;
  start_datetime: Date;
  end_datetime: Date;
  duration: number;
  burned_calories: number;
};
function HistoryList({ records }: { records: Record[] }) {
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
            <td>{record.duration}</td>
            <td>{record.burned_calories}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default HistoryList;
