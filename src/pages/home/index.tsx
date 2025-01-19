import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../containers/Cards";
import { Table } from "../../containers/Tables";
import styles from "../../styles/global.module.css";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import apis from "../../store/api"; // Import the API actions
import { RootState, AppDispatch } from "../../store"; // Import RootState type

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

const AmountTypography = styled(Typography)(({}) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
}));

const BudgetTypography = styled(Typography)(({ color }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  color,
}));

const localTimeFormat = (date: Date | string): string =>
  new Date(date).toLocaleString();

// Column definitions with updated fields
const columns: GridColDef[] = [
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    renderCell: (params) => (
      <Typography>{localTimeFormat(params.row.date)}</Typography>
    ),
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  { field: "category_name", headerName: "Category", flex: 1 },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    renderCell: (params) => {
      const amount = parseFloat(params.row.amount);
      const isExpense = params.row.type === "expense";
      const displayAmount = isExpense ? -amount : amount;

      return (
        <Typography sx={{ color: isExpense ? "error.main" : "success.main" }}>
          {Math.abs(displayAmount).toFixed(2)} RWF
        </Typography>
      );
    },
  },
];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedAccount, setSelectedAccount] = useState<string>("All");
  const budget: number = 1000; // Budget

  // Replace useTransactions hook with Redux selectors
  const {
    data: transactions,
    loading: isLoading,
    error,
  } = useSelector((state: RootState) => state.transactions);

  // Fetch transactions when component mounts
  useEffect(() => {
    dispatch(apis.transactions());
  }, [dispatch]);

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value as string);
  };

  // Get unique account types from transactions
  const accountTypes = useMemo(() => {
    const types = new Set(transactions.map((t) => t.account_name));
    return ["All", ...Array.from(types)];
  }, [transactions]);

  const filteredRows = useMemo(
    () =>
      selectedAccount === "All"
        ? transactions
        : transactions.filter((row) => row.account_name === selectedAccount),
    [transactions, selectedAccount]
  );

  const lineChartData = useMemo(() => {
    const dailyData: { [day: string]: number } = {};

    filteredRows.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const amount = parseFloat(transaction.amount.toString());
      const finalAmount = transaction.type === "expense" ? -amount : amount;
      dailyData[date] = (dailyData[date] || 0) + finalAmount;
    });

    const sortedDates = Object.keys(dailyData).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let cumulativeSum = 0;
    return sortedDates.map((date) => {
      cumulativeSum += dailyData[date];
      return {
        x: date,
        y: cumulativeSum,
      };
    });
  }, [filteredRows]);

  const summaryCards = useMemo(() => {
    const totalIncome = filteredRows
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalExpenses = filteredRows
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalBalance = totalIncome - totalExpenses;

    return [
      {
        title: "Total Balance",
        amount: `$${totalBalance.toFixed(2)} RWF`,
      },
      {
        title: "Total Income",
        amount: `$${totalIncome.toFixed(2)} RWF`,
      },
      {
        title: "Total Expenses",
        amount: `$${totalExpenses.toFixed(2)} RWF`,
      },
    ];
  }, [filteredRows]);

  const totalExpenses = useMemo(() => {
    return filteredRows
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  }, [filteredRows]);

  const remainingBudget = budget - totalExpenses;
  const budgetColor = remainingBudget <= budget * 0.2 ? "red" : "green";

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || "Failed to load transactions"}</Alert>
      </Box>
    );
  }

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
            {accountTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
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
                ${remainingBudget.toFixed(2)} RWF
              </BudgetTypography>
            </CardContent>
          </Card>
        </Box>
      </div>

      <Card sx={{ maxWidth: "1214px", width: "100%", marginBottom: "16px" }}>
        <CardHeader>
          <CardTitle>
            <div className="text-2xl font-bold">Transaction Overview</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            dataset={lineChartData}
            xAxis={[{ scaleType: "band", dataKey: "x", label: "Day" }]}
            series={[{ dataKey: "y", label: selectedAccount }]}
            height={300}
          />
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: "1214px", width: "100%" }}>
        <CardHeader>
          <CardTitle>
            <div className="text-2xl font-bold">Recent Transactions</div>
          </CardTitle>
        </CardHeader>
        <div className="w-full p-2">
          <Table columns={columns} rows={filteredRows} height={400} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
