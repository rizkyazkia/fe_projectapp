import React from "react";
import { RiPassValidLine } from "react-icons/ri";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const defaultData = [
  { date: "17", height: 0, bmi: 20.5, weight: 10 },
  { date: "18", height: 0, bmi: 18.5, weight: 20 },
  { date: "19", height: 102, bmi: 22.5, weight: 12 },
  { date: "20", height: 105, bmi: 25.5, weight: 40 },
];

const LineChartComponent = ({
  keys = [
    { key: "height", fill: "red" },
    { key: "weight", fill: "green" },
    { key: "bmi", fill: "blue" },
  ],
  data = defaultData,
  width,
  height,
  title = "",
  xAxisKey = "date",
}) => {
  return (
    <div className="w-full h-full ">
      {title && <h1 className="text-lg font-bold">{title}</h1>}
      <ResponsiveContainer width={width ?? "100%"} height={height ?? "100%"}>
        <LineChart
          data={data}
          margin={{ top: 25, left: 25, right: 25, bottom: 25 }}
        >
          {keys.map((val, i) => (
            <Line
              key={val.key}
              type={"natural"}
              dataKey={val.key}
              fill={val.fill}
              stroke={val.fill}
            />
          ))}
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
