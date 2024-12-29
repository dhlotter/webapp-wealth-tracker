import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

type AccountHistory = {
  date: string;
  balance: number;
};

// Mock data - in a real app, this would come from an API
const mockAccountData = {
  id: "1",
  name: "Main Checking",
  type: "Checking",
  balance: 5000,
  lastUpdated: "2024-03-20",
  history: [
    { date: "2024-01", balance: 4000 },
    { date: "2024-02", balance: 4500 },
    { date: "2024-03", balance: 5000 },
  ],
};

const AccountDetail = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(mockAccountData);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      toast.success("Account deleted successfully");
      window.close();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
        <div className="space-x-4">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700">Current Balance</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            ${account.balance.toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700">Account Type</h3>
          <p className="text-3xl font-bold text-primary mt-2">{account.type}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700">Last Updated</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            {new Date(account.lastUpdated).toLocaleDateString()}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Balance History</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={account.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#1E40AF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AccountDetail;