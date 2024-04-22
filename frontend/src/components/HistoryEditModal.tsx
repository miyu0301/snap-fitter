import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calculateCaloriesBurned } from "./CaloriesApi/api";
import common from "../Common";

type Record = {
  exercise_id: number;
  start_datetime: Date;
  end_datetime: Date;
  pause: number;
  burned_calories: number;
};

type MExercise = {
  id: number;
  name: string;
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
  const [mExercises, setMExercises] = useState<MExercise[]>([]);
  const [selectedMExerciseName, setSelectedMExerciseName] =
    useState<string>("");
  const [formData, setFormData] = useState<Record | null>(null);

  useEffect(() => {
    const fechRecord = async () => {
      try {
        // get selected data
        const res = await axios.get(
          import.meta.env.VITE_API_ENV + "/exercise/" + targetId
        );
        const resData = res.data;
        const formattedData = {
          ...resData,
          start_datetime: new Date(resData.start_datetime),
          end_datetime: new Date(resData.end_datetime),
        };
        setFormData(formattedData);
        // exercise name is used for calorie calculation api
        setSelectedMExerciseName(resData.name);

        // for exercise select box
        const exResponse = await axios.get(
          import.meta.env.VITE_API_ENV + "/m_exercise/"
        );
        const mExercises: MExercise[] = exResponse.data;
        setMExercises(mExercises);
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
    setFormData((prevFormData) => {
      if (prevFormData === null) return null;
      return {
        ...prevFormData,
        [id]: value,
      };
    });
  };
  const handleChangeStart = (start_datetime: Date | null) => {
    if (start_datetime) {
      setFormData((prevFormData) => {
        if (prevFormData === null) return null;
        return {
          ...prevFormData,
          ["start_datetime"]: start_datetime,
        };
      });
    }
  };
  const handleChangeEnd = (end_datetime: Date | null) => {
    if (end_datetime) {
      setFormData((prevFormData) => {
        if (prevFormData === null) return null;
        return {
          ...prevFormData,
          ["end_datetime"]: end_datetime,
        };
      });
    }
  };
  const handleChangeExercise = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exerciseId = Number(e.target.value);
    const selectedOption = e.target.selectedOptions[0];
    const name = selectedOption.getAttribute("data-name");
    setSelectedMExerciseName(name ? name : "");
    setFormData((prevFormData) => {
      if (prevFormData === null) return null;
      return {
        ...prevFormData,
        ["exercise_id"]: exerciseId,
      };
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (formData) {
      const duration = common.calculateDurationMinutes(
        formData.start_datetime,
        formData.end_datetime,
        formData.pause
      );
      const res = await calculateCaloriesBurned(
        selectedMExerciseName,
        duration
      );
      const burned_calories = res[0].total_calories;
      const submittedformData = {
        exercise_id: formData.exercise_id,
        start_datetime: formData.start_datetime,
        end_datetime: formData.end_datetime,
        pause: formData.pause,
        burned_calories: burned_calories,
      };
      try {
        const response = await axios.put(
          import.meta.env.VITE_API_ENV + `/exercise/${targetId}`,
          submittedformData
        );
        console.log("Update successful", response.data);
        onUpdate(true);
        closeModal;
      } catch (err) {
        console.error("Failed to update record", err);
      }
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
            <Form.Label>Start Date Time</Form.Label>
            <DatePicker
              selected={formData?.start_datetime}
              onChange={(e) => handleChangeStart(e)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm"
              customInput={<Form.Control />}
            />

            {/* <Form.Control
              type="datetime-local"
              value={
                formData
                  ? moment(new Date(formData.start_datetime)).format(
                      "YYYY-MM-DDTHH:mm"
                    )
                  : ""
              }
              onChange={(e) => handleChange(e)}
            /> */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="end_datetime">
            <Form.Label>End Date Time</Form.Label>
            <DatePicker
              selected={formData?.end_datetime}
              onChange={(e) => handleChangeEnd(e)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm"
              customInput={<Form.Control />}
            />

            {/* <Form.Control
              type="datetime-local"
              value={
                formData
                  ? moment(new Date(formData.end_datetime)).format(
                      "YYYY-MM-DDTHH:mm"
                    )
                  : ""
              }
              onChange={(e) => handleChange(e)}
            /> */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="pause">
            <Form.Label>Pause</Form.Label>
            <Form.Control
              type="number"
              value={formData?.pause}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exercise_id">
            <Form.Label>Exercise</Form.Label>
            {/* <Form.Control
              type="text"
              value={formData?.exercise_id}
              onChange={(e) => handleChange(e)}
            /> */}
            <Form.Select
              id="exerciseSelect"
              className="select-custom"
              aria-label="Default select example"
              onChange={(e) => handleChangeExercise(e)}
              value={formData?.exercise_id}
            >
              {mExercises.map((mExercise: MExercise, id: number) => {
                return (
                  <option
                    data-name={mExercise.name}
                    value={mExercise.id}
                    key={id}
                  >
                    {mExercise.name}
                  </option>
                );
              })}
            </Form.Select>
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
