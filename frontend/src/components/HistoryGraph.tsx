import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Record = {
  id: number;
  exercise_name: string;
  user_id: number;
  start_datetime: Date;
  end_datetime: Date;
  burned_calories: number;
};

function HistoryGraph({ records }: { records: Record[] }) {
  const labels: string[] = [];
  const datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[] = [];
  const backgroundColors: string[] = [
    "rgb(255, 99, 132)",
    "rgb(75, 192, 192)",
    "rgb(53, 162, 235)",
  ];

  const groupedByExerciseName = records.reduce(
    (
      acc: { [key: string]: any[] },
      { exercise_name, start_datetime, ...rest }
    ) => {
      let start_date = format(new Date(start_datetime), "yyyy/MM/dd");
      // create array of object with exercise_name as key
      if (acc[exercise_name]) {
        acc[exercise_name].push({ start_date, start_datetime, ...rest });
      } else {
        acc[exercise_name] = [{ start_date, start_datetime, ...rest }];
      }

      if (!labels.includes(start_date)) {
        labels.push(start_date);
      }
      return acc;
    },
    {}
  );

  const caluculateMinutes = (start_datetime: string, end_datetime: string) => {
    const minutes =
      (new Date(end_datetime).getTime() - new Date(start_datetime).getTime()) /
      6000;
    return minutes;
  };

  Object.keys(groupedByExerciseName).forEach((exercise_name) => {
    const dataset: {
      label: string;
      data: number[];
      backgroundColor: string;
    } = {
      label: "",
      data: [],
      backgroundColor: "",
    };
    const durations: number[] = [];
    dataset.label = exercise_name;

    labels.forEach((start_date) => {
      const result = groupedByExerciseName[exercise_name].filter(
        (record) => record.start_date == start_date
      );
      durations.push(
        result.length == 0
          ? 0
          : caluculateMinutes(result[0].start_datetime, result[0].end_datetime)
      );
    });
    dataset.data = durations;
    dataset.backgroundColor = backgroundColors[datasets.length % 3];
    datasets.push(dataset);
  });
  // console.log("data");
  // console.log(labels);
  // console.log(datasets);

  const data = {
    labels,
    datasets: datasets,
    // datasets: [
    //   {
    //     label: "Running",
    //     data: data1,
    //     // data: [10, 20, 5],
    //     backgroundColor: "rgb(255, 99, 132)",
    //   },
    //   {
    //     label: "Walking",
    //     data: data2,
    //     // data: [30, 0, 0],
    //     backgroundColor: "rgb(75, 192, 192)",
    //   },
    //   {
    //     label: "Swimming",
    //     data: data3,
    //     // data: [20, 0, 50],
    //     backgroundColor: "rgb(53, 162, 235)",
    //   },
    // ],
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: `${labels[0]} - ${labels[labels.length - 1]}`,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <>
      <Bar options={options} data={data} />
    </>
  );
}

export default HistoryGraph;
