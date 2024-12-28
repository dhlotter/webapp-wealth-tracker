import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Temporary mock data
const data = [
  { name: "Jan", assets: 4000, liabilities: 2400, netWorth: 1600 },
  { name: "Feb", assets: 4500, liabilities: 2300, netWorth: 2200 },
  { name: "Mar", assets: 4700, liabilities: 2200, netWorth: 2500 },
  { name: "Apr", assets: 5000, liabilities: 2000, netWorth: 3000 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Select defaultValue="3m">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700">Total Assets</h3>
          <p className="text-3xl font-bold text-primary mt-2">$5,000.00</p>
          <span className="text-sm text-green-600">+12% from last month</span>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700">Total Liabilities</h3>
          <p className="text-3xl font-bold text-primary mt-2">$2,000.00</p>
          <span className="text-sm text-red-600">-5% from last month</span>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700">Net Worth</h3>
          <p className="text-3xl font-bold text-primary mt-2">$3,000.00</p>
          <span className="text-sm text-green-600">+25% from last month</span>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Net Worth Trend</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="assets"
                stroke="#1E40AF"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="liabilities"
                stroke="#EF4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;