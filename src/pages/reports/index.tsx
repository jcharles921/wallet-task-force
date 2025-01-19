import { useState, useMemo } from "react";
import { Dayjs } from "dayjs";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { initialRows } from "../../utils/dummy";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CustomButton } from "../../containers/Buttons";
import { Table } from "../../containers/Tables";
import { GridColDef } from "@mui/x-data-grid";
import { BudgetCard } from "../../containers/Cards";

const Reports = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("All");

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value);
  };


  const filteredTransactions = useMemo(() => {
    if (selectedAccount === "All") return initialRows;
    return initialRows.filter(
      (transaction) => transaction.accountType === selectedAccount
    );
  }, [selectedAccount]);


  const incomeExpenseData = useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {
      Jan: { income: 0, expenses: 0 },
      Feb: { income: 0, expenses: 0 },
      Mar: { income: 0, expenses: 0 },
      Apr: { income: 0, expenses: 0 },
      May: { income: 0, expenses: 0 },
      Jun: { income: 0, expenses: 0 },
    };

    filteredTransactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString('en-US', { month: 'short' });
      if (transaction.amount > 0) {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += Math.abs(transaction.amount);
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [filteredTransactions]);

  const categoryBreakdownData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    filteredTransactions.forEach((transaction) => {
      if (transaction.amount < 0) { // Only consider expenses
        const amount = Math.abs(transaction.amount);
        categories[transaction.category] = (categories[transaction.category] || 0) + amount;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredTransactions]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{ color: params.value < 0 ? "error.main" : "success.main" }}
        >
          {params.value < 0 ? `-${Math.abs(params.value)}` : params.value}
        </Typography>
      ),
    },
    { field: "accountType", headerName: "Account Type", width: 150 },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Account Type Selector at the top */}
      <Box className="">
        <FormControl sx={{ minWidth: 200 ,}}>
          <InputLabel>Account Type</InputLabel>
          <Select value={selectedAccount} onChange={handleAccountChange}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Bank">Bank</MenuItem>
            <MenuItem value="Mobile Money">Mobile Money</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <div className="w-full max-w-[1216px] flex flex-wrap gap-4">
        {/* Generate Report Section */}
        <BudgetCard>
          <Typography variant="h5" sx={{ fontWeight: "Bold" }}>
            Generate Report
          </Typography>
          <p className="text-[#9B9B9B] mb-3">
            Select a date range for your report
          </p>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Box>
          <CustomButton
            customWidth={"200px"}
            customHeight={"40px"}
            backgroundColor="#014E7A"
          >
            Generate Report
          </CustomButton>
        </BudgetCard>

        {/* Category Breakdown */}
        <BudgetCard>
          <Typography variant="h5" sx={{ fontWeight: "Bold" }}>
            Category Breakdown
          </Typography>
          <p className="text-[#9B9B9B]">Your spending by category</p>
          <Box height={250} width="100%">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {categoryBreakdownData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </BudgetCard>
      </div>

      {/* Income vs Expenses Chart */}
      <BudgetCard sx={{ width: "100%", maxWidth: "1216px" }}>
        <Typography variant="h6">Income vs Expenses</Typography>
        <Box height={300}>
          <BarChart
            dataset={incomeExpenseData}
            xAxis={[{ scaleType: "band", dataKey: "month", label: "Months" }]}
            yAxis={[{ label: "Amount (RWF)" }]}
            series={[
              { dataKey: "income", label: "Income", color: "#82ca9d" },
              { dataKey: "expenses", label: "Expenses", color: "#8884d8" },
            ]}
          />
        </Box>
      </BudgetCard>

      {/* Transactions Table */}
      <BudgetCard sx={{ width: "100%", maxWidth: "1216px" }}>
        <Table columns={columns} rows={filteredTransactions} height={400} />
      </BudgetCard>
    </div>
  );
};

export default Reports;