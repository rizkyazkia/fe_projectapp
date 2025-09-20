import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const defaultData = [
  {
    name: "Bandung",
    total: 1000,
    fill: "red",
  },
  {
    name: "Jakarta",
    total: 100,
    fill: "green",
  },
  {
    name: "Jogjakarta",
    total: 500,
    fill: "blue",
  },
];

const CustomLegend = ({ payload, total }) => {
  return (
    <ul className="space-y-2">
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          className="flex items-center justify-between gap-8"
        >
          <div className="flex items-center gap-2 flex-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
          <h1 className="text-sm font-bold">
            {((entry?.payload?.total / total) * 100).toFixed(2)}%
          </h1>
        </li>
      ))}
    </ul>
  );
};

const DoughnutChartComponent = ({
  title,
  width,
  height,
  data = defaultData,
  legend = true,
}) => {
  const total = data.reduce((acc, current) => acc + Number(current.total), 0);
  return (
    <div className="space-y-6  w-full h-[80%] flex flex-col items-center ">
      {title && <h1 className="text-lg font-bold">{title}</h1>}
      <ResponsiveContainer width={width ?? "100%"} height={height ?? "100%"}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          {legend && (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={<CustomLegend total={total} />}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChartComponent;
