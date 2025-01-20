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
import apis from "../../store/api"; 
import { RootState, AppDispatch } from "../../store"; 
import { calculateBudgetOverview } from "../../utils/calculate";

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

  const {
    data: transactions,
    loading: isLoading,
    error,
  } = useSelector((state: RootState) => state.transactions);
  
  const { data: accountTypes } = useSelector(
    (state: RootState) => state.accountTypes
  );

  useEffect(() => {
    dispatch(apis.transactions());
    dispatch(apis.accountTypes());
  }, [dispatch]);

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value as string);
  };

  const filteredRows = useMemo(
    () =>
      selectedAccount === "All"
        ? transactions
        : transactions.filter((row:any) => row.account_id === parseInt(selectedAccount)),
    [transactions, selectedAccount]
  );

  // Use the new budget calculation
  const budgetData = useMemo(() => 
    calculateBudgetOverview(transactions, accountTypes, selectedAccount),
    [transactions, accountTypes, selectedAccount]
  );

  const lineChartData = useMemo(() => {
   
    let remainingBudget = budgetData.totalBudget;
    const dailyData: { [day: string]: number } = {};

    // Sort transactions by date
    const sortedTransactions = [...filteredRows]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate remaining budget for each day
    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const amount = parseFloat(transaction.amount.toString());
      if (transaction.type === "expense") {
        remainingBudget -= amount;
      }
      dailyData[date] = remainingBudget;
    });

    return Object.entries(dailyData).map(([date, remaining]) => ({
      x: date,
      y: remaining,
    }));
  }, [filteredRows, budgetData.totalBudget]);

  const summaryCards = useMemo(() => [
    {
      title: "Total Budget",
      amount: `${budgetData.totalBudget.toFixed(2)} RWF`,
    },
    {
      title: "Total Spent",
      amount: `${budgetData.spent.toFixed(2)} RWF`,
    },
    {
      title: "Remaining Budget",
      amount: `${budgetData.remaining.toFixed(2)} RWF`,
      color: budgetData.remaining <= budgetData.totalBudget * 0.2 ? "error.main" : "success.main",
    }
  ], [budgetData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
          <InputLabel>Account</InputLabel>
          <Select
            value={selectedAccount}
            onChange={handleAccountChange}
            label="Account"
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
                <AmountTypography sx={{ color: item.color }}>
                  {item.amount}
                </AmountTypography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </div>

      <Card sx={{ maxWidth: "1214px", width: "100%", marginBottom: "16px" }}>
        <CardHeader>
          <CardTitle>
            <div className="text-2xl font-bold">Budget Overview</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            dataset={lineChartData}
            xAxis={[{ 
              scaleType: "band", 
              dataKey: "x", 
              label: "Date"
            }]}
            series={[{ 
              dataKey: "y", 
              label: "Remaining Budget",
              color: "#014E7A"
            }]}
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