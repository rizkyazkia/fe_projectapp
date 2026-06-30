import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const defaultData = [
  { name: "Kurus", value: 1, fill: "red" },
  { name: "Normal", value: 2, fill: "green" },
  { name: "Gemuk", value: 1, fill: "blue" },
];

const PieChartComponent = ({
  title = "",
  key = "name",
  data = defaultData,
  width = 400,
  height = 300,
}) => {
  return (
    <div className="p-4">
      {title && <h1 className="font-semibold text-lg">{title}</h1>}
      <PieChart
        width={width}
        height={height}
        margin={{ top: 5, bottom: 5, left: 10, right: 10 }}
      >
        <Pie
          data={data}
          dataKey={"value"}
          nameKey={key}
          fill="green"
          cx={"50%"}
          cy={"50%"}
          label
        >
          {data.map((val, i) => (
            <Cell key={`cell-${i}`} fill={val.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
