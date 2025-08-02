import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

const defaultData = [
  {
    status: "Kurang gizi",
    value: 10,
    fill: "yellow",
  },
  {
    status: "Normal",
    value: 100,
    fill: "green",
  },
  {
    status: "Gizi Lebih",
    value: 150,
    fill: "red",
  },
];

const BarChartComponent = ({
  width,
  height,
  title = "",
  data = defaultData,
}) => {
  console.log({ data });
  return (
    <section>
      {title && <h1 className="text-lg font-bold">{title}</h1>}
      <ResponsiveContainer width={width ?? "100%"} height={height ?? "100%"}>
        <BarChart
          data={data}
          margin={{ top: 25, left: 25, right: 25, bottom: 25 }}
        >
          <Tooltip />
          <Bar dataKey={"total"} radius={[8, 8, 8, 8]} />
          <XAxis dataKey={"status"} />
          <YAxis />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default BarChartComponent;
