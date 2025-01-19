import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState,AppDispatch } from "../../store";
import styles from "../../styles/global.module.css";
import { BudgetCard } from "../../containers/Cards";
import {
  Typography,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { CustomButton } from "../../containers/Buttons";
import { useFormik } from "formik";
import BudgetOverview from "../../components/BudgetOverview";
import * as Yup from "yup";
import { BarChart } from "@mui/x-charts/BarChart";
import apis from "../../store/api";



const getBudgetForAccount = (accountId: string, accountTypes: any[]) => {
  if (accountId === "All") return null;
  const account = accountTypes.find(acc => acc.id === parseInt(accountId));
  return account?.spending_limit ? parseFloat(account.spending_limit) : null;
};

const Budgets = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedAccount, setSelectedAccount] = useState("All");

  // Get data from Redux store
  const { data: transactions } = useSelector((state: RootState) => state.transactions);
  const { data: accountTypes } = useSelector((state: RootState) => state.accountTypes);
  const { loading, error, success } = useSelector((state: RootState) => state.budget);

  useEffect(() => {
    dispatch(apis.transactions());
    dispatch(apis.accountTypes());
    // if (selectedAccount !== "All") {
    //   dispatch(apis.getBudget(parseInt(selectedAccount)));
    // }
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .positive("Must be a positive number")
        .required("Amount is required"),
    }),
    onSubmit: (values) => {
      if (selectedAccount !== "All") {
        dispatch(apis.setBudget({
          account_id: parseInt(selectedAccount),
          spending_limit: parseFloat(values.amount)
        }));
      }
    },
  });

  // Calculate spending by category for selected account
  const categorySpending = useMemo(() => {
    const filteredTransactions = selectedAccount === "All"
      ? transactions
      : transactions.filter(t => t.account_name === selectedAccount);

    const spending: { [key: string]: number } = {};
    let totalSpent = 0;

    filteredTransactions
      .filter(t => t.type === "expense")
      .forEach((t:any) => {
        spending[t.category_name] = (spending[t.category_name] || 0) + parseFloat(t.amount);
        totalSpent += parseFloat(t.amount);
      });

    return Object.entries(spending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Number(((amount / totalSpent) * 100).toFixed(1))
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by amount spent
  }, [transactions, selectedAccount]);

  // Calculate budget overview data
  const budgetOverviewData = useMemo(() => {
    const filteredTransactions = selectedAccount === "All"
      ? transactions
      : transactions.filter(t => t.account_name === selectedAccount);

    const totalSpent = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t:any) => sum + parseFloat(t.amount), 0);

    // Get budget from account spending limit or form value
    const accountBudget = getBudgetForAccount(selectedAccount, accountTypes);
    const currentBudget = formik.values.amount 
      ? parseFloat(formik.values.amount) 
      : (accountBudget || 0); // Use account spending limit as default if available

    const remaining = currentBudget - totalSpent;
    const spentPercentage = currentBudget ? (totalSpent / currentBudget) * 100 : 0;

    return {
      totalBudget: currentBudget,
      spent: totalSpent,
      remaining,
      spentPercentage
    };
  }, [transactions, selectedAccount, accountTypes, formik.values.amount]);

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value);
    formik.resetForm();
  };

  return (
    <div className={styles.budgetBox}>
      <Box sx={{ marginBottom: 3, alignSelf: "center" }}>
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

      <div className="flex gap-4">
        <BudgetCard title={`Set Budget for ${selectedAccount}`}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              alignSelf: "flex-start",
              fontWeight: "Bold",
            }}
          >
            Set Budget
          </Typography>
          <p className="text-[#9B9B9B]">Adjust your monthly budget</p>
          <h5 className="font-bold my-3">Total Monthly Budget in RWF</h5>
          <TextField
            fullWidth
            id="amount"
            name="amount"
            label="Amount"
            placeholder="0.00"
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            disabled={selectedAccount === "All"}
          />
          <CustomButton
            onClick={() => formik.handleSubmit()}
            className={styles.button}
            variant="contained"
            backgroundColor="#014E7A"
            sx={{ mt: 3 }}
            disabled={selectedAccount === "All" || loading}
          >
            {loading ? "Setting Budget..." : "Set Budget"}
          </CustomButton>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Budget set successfully!
            </Typography>
          )}
        </BudgetCard>

        {/* Expenses Overview Card */}
        <BudgetCard title="Expenses">
          <BudgetOverview
            totalBudget={budgetOverviewData.totalBudget}
            spent={budgetOverviewData.spent}
            remaining={budgetOverviewData.remaining}
            spentPercentage={budgetOverviewData.spentPercentage}
          />
        </BudgetCard>
      </div>

      {/* Budget by Category Card */}
      <div className="w-full max-w-[1216px]">
        <BudgetCard
          sx={{
            width: "100%",
            paddingBottom: "2rem",
          }}
        >
          <Typography
            variant="h6"
            className={`${styles.t1Transactions} self-start`}
            gutterBottom
          >
            Spending by Category
          </Typography>
          <Box sx={{ height: 300, width: "100%" }}>
            <BarChart
              dataset={categorySpending}
              xAxis={[{
                scaleType: "band",
                dataKey: "category",
                label: "Categories",
              }]}
              yAxis={[{
                label: "Percentage of Total Spending (%)",
              }]}
              series={[{
                dataKey: "percentage",
                label: "Spending Percentage",
                color: "#014E7A",
              }]}
              height={300}
              margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
            />
          </Box>
        </BudgetCard>
      </div>
    </div>
  );
};

export default Budgets;