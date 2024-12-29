import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const generalSettingsSchema = z.object({
  currency: z.string().min(1, { message: "Please select a currency" }),
  locale: z.string().min(1, { message: "Please select a locale" }),
  darkMode: z.string().min(1, { message: "Please select a theme" }),
  dateFormat: z.string().min(1, { message: "Please select a date format" }),
  averageMonths: z.string().min(1, { message: "Please select number of months" }),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;

const defaultValues: Partial<GeneralSettingsValues> = {
  currency: "USD",
  locale: "en-US",
  darkMode: "light",
  dateFormat: "MM/dd/yyyy",
  averageMonths: "3",
};

type AccountType = {
  id: string;
  name: string;
  description: string;
};

const mockAccountTypes: AccountType[] = [
  {
    id: "1",
    name: "Checking",
    description: "Regular checking account for daily transactions",
  },
  {
    id: "2",
    name: "Savings",
    description: "Interest-bearing savings account",
  },
  {
    id: "3",
    name: "Credit Card",
    description: "Credit card account for tracking expenses",
  },
  {
    id: "4",
    name: "Investment",
    description: "Investment accounts like stocks, bonds, etc.",
  },
  {
    id: "5",
    name: "Property",
    description: "Real estate and property assets",
  },
];

export default function SettingsGeneral() {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>(mockAccountTypes);
  const [isNewTypeSheetOpen, setIsNewTypeSheetOpen] = useState(false);
  const [newAccountType, setNewAccountType] = useState<Partial<AccountType>>({
    name: "",
    description: "",
  });

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: GeneralSettingsValues) {
    toast.success("Settings updated successfully!");
    console.log("Settings data:", data);
  }

  function handleAddAccountType() {
    if (newAccountType.name && newAccountType.description) {
      setAccountTypes([
        ...accountTypes,
        {
          id: (accountTypes.length + 1).toString(),
          name: newAccountType.name,
          description: newAccountType.description,
        },
      ]);
      setNewAccountType({ name: "", description: "" });
      setIsNewTypeSheetOpen(false);
      toast.success("Account type added successfully!");
    }
  }

  function handleDeleteAccountType(id: string) {
    setAccountTypes(accountTypes.filter((type) => type.id !== id));
    toast.success("Account type deleted successfully!");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold text-gray-900">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your application preferences and account types.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="ZAR">ZAR (R)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locale</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select locale" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="en-ZA">English (South Africa)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="darkMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Format</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="averageMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Months for Average Spend Calculation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of months" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save</Button>
        </form>
      </Form>



    </div>
  );
}
