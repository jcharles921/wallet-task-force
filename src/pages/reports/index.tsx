import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CustomButton } from "../../containers/Buttons";
import { Table } from "../../containers/Tables";
import { GridColDef } from "@mui/x-data-grid";
import { BudgetCard } from "../../containers/Cards";
import { generateExcelReport } from "../../utils/calculate";
import Loader from "../../containers/Loader";
import apis from "../../store/api";
import { Dayjs } from "dayjs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Reports = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Get data from Redux store
  const {
    data: transactions,
    loading: transactionsLoading,
    error,
  } = useSelector((state: RootState) => state.transactions);
  const { data: accountTypes, loading: accountTypesLoading } = useSelector(
    (state: RootState) => state.accountTypes
  );

  const isLoading = transactionsLoading || accountTypesLoading;

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(apis.transactions()),
        dispatch(apis.accountTypes()),
      ]);
      setIsChartLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value);
    setIsChartLoading(true);
    setTimeout(() => setIsChartLoading(false), 500);
  };

  // Filter transactions based on selected account
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return selectedAccount === "All"
      ? transactions
      : transactions.filter(
          (t: any) => t.account_id === parseInt(selectedAccount)
        );
  }, [transactions, selectedAccount]);

  // Calculate income vs expenses data
  const incomeExpenseData = useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } =
      {};

    filteredTransactions.forEach((transaction: any) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString("en-US", { month: "short" });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }

      const amount = parseFloat(transaction.amount);
      if (transaction.type === "income") {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expenses += amount;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [filteredTransactions]);

  // Calculate category breakdown
  const categoryBreakdownData = useMemo(() => {
    const categories: { [key: string]: number } = {};

    filteredTransactions.forEach((transaction: any) => {
      if (transaction.type === "expense") {
        const amount = parseFloat(transaction.amount);
        const category = transaction.category_name;
        categories[category] = (categories[category] || 0) + amount;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));
  }, [filteredTransactions]);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography>{new Date(params.row.date).toLocaleString()}</Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "category_name",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => {
        const amount = parseFloat(params.row.amount);
        const isExpense = params.row.type === "expense";
        return (
          <Typography sx={{ color: isExpense ? "error.main" : "success.main" }}>
            {Math.abs(amount).toFixed(2)} RWF
          </Typography>
        );
      },
    },
  ];

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || "Failed to load transactions"}</Alert>
      </Box>
    );
  }
  const handleGenerateReport = () => {
    if (!startDate || !endDate) return;

    generateExcelReport(
      filteredTransactions,
      startDate,
      endDate,
      selectedAccount
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <Box className="">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Account</InputLabel>
          <Select
            value={selectedAccount}
            onChange={handleAccountChange}
            label="Account"
            disabled={isLoading}
          >
            <MenuItem value="All">All Accounts</MenuItem>
            {accountTypes.map((account: any) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <div className="w-full max-w-[1216px] flex flex-wrap gap-4">
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
            sx={{
              backgroundColor:
                !startDate?.isValid() || !endDate?.isValid()
                  ? "#9B9B9B"
                  : "#014E7A",
            }}
            disabled={!startDate || !endDate}
            onClick={handleGenerateReport}
          >
            Generate Report
          </CustomButton>
        </BudgetCard>

        <BudgetCard>
          <Typography variant="h5" sx={{ fontWeight: "Bold" }}>
            Category Breakdown
          </Typography>
          <p className="text-[#9B9B9B]">Your spending by category</p>
          {isChartLoading || isLoading ? (
            <div className="flex justify-center items-center h-[250px]">
              <Loader color="#014E7A" size={40} />
            </div>
          ) : (
            <Box height={350} width="100%">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryBreakdownData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.name}: ${entry.value.toLocaleString()} RWF`
                    }
                  >
                    {categoryBreakdownData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      `${value.toLocaleString()} RWF`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
        </BudgetCard>
      </div>

      <BudgetCard sx={{ width: "100%", maxWidth: "1216px" }}>
        <Typography variant="h6">Income vs Expenses</Typography>
        {isChartLoading || isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader color="#014E7A" size={40} />
          </div>
        ) : (
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
        )}
      </BudgetCard>

      <BudgetCard sx={{ width: "100%", maxWidth: "1216px" }}>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        <div className="w-full p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Loader color="#014E7A" size={40} />
            </div>
          ) : (
            <Table columns={columns} rows={filteredTransactions} height={400} />
          )}
        </div>
      </BudgetCard>
    </div>
  );
};

export default Reports;
