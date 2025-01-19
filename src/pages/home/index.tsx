import React, { useState, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../containers/Cards";
import { initialRows } from "../../utils/dummy";
import { Table } from "../../containers/Tables";
import styles from "../../styles/global.module.css";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";


const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: theme.spacing(1),
  "& .MuiBox-root": {
    marginTop: 0,
    marginBottom: 0,
  },
}));

const AmountTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
}));
const BudgetTypography = styled(Typography)(({ theme, color }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  color,
}));
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  accountType: string;
}

// Column definitions
const columns: GridColDef[] = [
  { field: "date", headerName: "Date", width: 150, type: "string" },
  {
    field: "description",
    headerName: "Description",
    width: 200,
    type: "string",
  },
  { field: "category", headerName: "Category", width: 150, type: "string" },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
    type: "number",
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <Typography
        sx={{ color: params.value < 0 ? "error.main" : "success.main" }}
      >
        ${Math.abs(params.value).toFixed(2)}
      </Typography>
    ),
  },
];

const Dashboard: React.FC = () => {
  const [rows, setRows] = useState<Transaction[]>(initialRows);
  const [selectedAccount, setSelectedAccount] = useState<string>("All");

  // Handle account selection
  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value as string);
  };

  // Filtered Transactions
  const filteredRows = useMemo(
    () =>
      selectedAccount === "All"
        ? rows
        : rows.filter((row) => row.accountType === selectedAccount),
    [rows, selectedAccount]
  );

  // Aggregate Line Chart Data
  const lineChartData = useMemo(() => {
    const monthlyData: { [month: string]: number } = {};

    filteredRows.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "short",
      });
      monthlyData[month] = (monthlyData[month] || 0) + transaction.amount;
    });

    return Object.keys(monthlyData).map((month) => ({
      x: month,
      y: monthlyData[month],
    }));
  }, [filteredRows]);

  const summaryCards = useMemo(() => {
    const totalIncome = filteredRows
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredRows
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalIncome + totalExpenses;

    return [
      { title: "Total Balance", amount: `$${totalBalance.toFixed(2)}` },
      { title: "Total Income", amount: `$${totalIncome.toFixed(2)}` },
      {
        title: "Total Expenses",
        amount: `$${Math.abs(totalExpenses).toFixed(2)}`,
      },
    ];
  }, [filteredRows]);

  const [budget, setBudget] = useState<number>(1000); 

  const totalExpenses = useMemo(() => {
    return filteredRows
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredRows]);

  const remainingBudget = budget + totalExpenses; // Calculate remaining budget
  const budgetColor = remainingBudget <= budget * 0.2 ? "red" : "green"; // Change color when close to zero

  return (
    <div className={styles.mainBox}>
      <Box sx={{ marginBottom: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Account Type</InputLabel>
          <Select
            value={selectedAccount}
            onChange={handleAccountChange}
            label="Account Type"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Bank">Bank</MenuItem>
            <MenuItem value="Mobile Money">Mobile Money</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <div className={styles.cardBox}>
        {summaryCards.map((item, index) => (
          <Box key={index} sx={{ flex: "1 1 250px", minWidth: 0 }}>
            <Card>
              <StyledCardHeader>
                <CardTitle>
                  <Typography variant="body2" fontWeight="medium">
                    {item.title}
                  </Typography>
                </CardTitle>
              </StyledCardHeader>
              <CardContent>
                <AmountTypography>{item.amount}</AmountTypography>
              </CardContent>
            </Card>
          </Box>
        ))}

        {/* Budget Card */}
        <Box sx={{ flex: "1 1 250px", minWidth: 0 }}>
          <Card>
            <StyledCardHeader>
              <CardTitle>
                <Typography variant="body2" fontWeight="medium">
                  Remaining Budget
                </Typography>
              </CardTitle>
            </StyledCardHeader>
            <CardContent>
              <BudgetTypography color={budgetColor}>
                ${remainingBudget.toFixed(2)}
              </BudgetTypography>
            </CardContent>
          </Card>
        </Box>
      </div>

      <Card sx={{ maxWidth: "1214px", width: "100%", marginBottom: "16px" }}>
        <CardHeader>
          <CardTitle>
            <div className=" text-2xl font-bold">Transaction Overview</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            dataset={lineChartData}
            xAxis={[{ scaleType: "band", dataKey: "x", label: "Month" }]}
            series={[{ dataKey: "y", label: selectedAccount }]}
            height={300}
          />
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: "1214px", width: "100%" }}>
        <CardHeader>
          <CardTitle>
            <div className=" text-2xl font-bold">Recent Transactions</div>
          </CardTitle>
        </CardHeader>
        <div className=" w-full p-2">
          <Table columns={columns} rows={filteredRows} height={400} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
