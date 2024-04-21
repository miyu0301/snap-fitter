import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

import { Line } from "react-chartjs-2";

type Record = {
  id: number;
  exercise_name: string;
  user_id: number;
  start_datetime: Date;
  end_datetime: Date;
  burned_calories: number;
};
type Calorie = {
  start_datetime: Date;
  total_calories: number;
};

function HistoryGraph({
  records,
  calories,
}: {
  records: Record[];
  calories: Calorie[];
}) {
  let labels: string[] = [];
  let datasets: any[] = [];
  let data: any = {};
  let options: any = {};
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

  let caloryData: number[] = [];
  for (let calorie of calories) {
    caloryData.push(calorie.total_calories);
  }
  const calorieDdataset = {
    type: "line",
    label: "Burned Calories",
    data: caloryData,
    borderWidth: 2,
    borderColor: "rgba(254,97,132,0.8)",
    fill: false,
    yAxisID: "y2",
  };
  datasets.push(calorieDdataset);

  Object.keys(groupedByExerciseName).forEach((exercise_name) => {
    const exercisDdataset: {
      type: string;
      label: string;
      data: number[];
      backgroundColor: string;
      yAxisID: string;
    } = {
      type: "bar",
      label: "",
      data: [],
      backgroundColor: "",
      yAxisID: "y1",
    };
    const durations: number[] = [];
    exercisDdataset.label = exercise_name;

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
    exercisDdataset.data = durations;
    exercisDdataset.backgroundColor = backgroundColors[datasets.length % 3];
    datasets.push(exercisDdataset);
  });

  console.log(datasets);
  data = {
    labels,
    datasets: datasets,
    // datasets: [
    //   {
    //     type: "line",
    //     label: "Sample Line",
    //     data: [100, 300, 200],
    //     borderWidth: 2,
    //     borderColor: "rgba(254,97,132,0.8)",
    //     fill: false,
    //     yAxisID: "y2",
    //   },
    //   {
    //     type: "bar",
    //     label: "Running",
    //     data: [10, 20, 5],
    //     backgroundColor: "rgb(255, 99, 132)",
    //     yAxisID: "y1",
    //   },
    //   {
    //     type: "bar",
    //     label: "Walking",
    //     data: [30, 0, 0],
    //     backgroundColor: "rgb(75, 192, 192)",
    //     yAxisID: "y1",
    //   },
    //   {
    //     type: "bar",
    //     label: "Swimming",
    //     data: [20, 0, 50],
    //     backgroundColor: "rgb(53, 162, 235)",
    //     yAxisID: "y1",
    //   },
    // ],
  };

  options = {
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
      y1: {
        stacked: true,
        ticks: {
          callback: function (value: number) {
            return `${value} m`;
          },
        },
      },
      y2: {
        position: "right",
        stacked: false,
        ticks: {
          callback: function (value: number) {
            return `${value} cal`;
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // console.log("data");
  // console.log(labels);
  // console.log(datasets);

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
}

export default HistoryGraph;
