import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const ProgressCircle = ({ percentage = 67, size = 200, data }) => {
  const defaultData = [
    { name: "Progress", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];
  data = data ? data : defaultData;
  const COLORS = ["#00C49F", "#E0E0E0"];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={size * 0.35}
          outerRadius={size * 0.5}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div
        className="absolute inset-0 flex items-center justify-center text-xl font-bold"
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800">{percentage}%</p>
          <p className="text-xs text-gray-500">Terselesaikan</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;
