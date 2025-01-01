import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/types/accounts";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: Partial<Account>) => void;
  onCancel: () => void;
}

const accountTypes = [
  "Bank Account",
  "Investment Account",
  "Property",
  "Vehicle",
  "Bond",
  "Other Asset"
];

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "ZAR", label: "South African Rand (R)" },
];

export function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState<Partial<Account>>(
    account || { type: accountTypes[0], currency: "USD" }
  );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-[2mm]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Account Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              value={formData.balance || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  balance: parseFloat(e.target.value),
                })
              }
            />
          </div>

          {account && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Balance History</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={account.history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-[2mm] flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(formData)}>
          {account ? "Save Changes" : "Add Account"}
        </Button>
      </div>
    </div>
  );
}