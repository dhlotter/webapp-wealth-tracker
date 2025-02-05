import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface BudgetChartProps {
  chartData: Array<{
    month: string;
    total: number;
  }>;
}

export const BudgetChart = ({ chartData }: BudgetChartProps) => {
  return (
    <div className="h-[200px] w-full">
      <BarChart width={350} height={200} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#3b82f6" />
      </BarChart>
    </div>
  );
};