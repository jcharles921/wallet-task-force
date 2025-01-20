import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import { CustomButton } from "../../containers/Buttons";
import { useFormik } from "formik";
import { calculateBudgetOverview } from "../../utils/calculate";
import BudgetOverview from "../../components/BudgetOverview";
import Loader from "../../containers/Loader";
import { Info } from "lucide-react";
import * as Yup from "yup";
import { BarChart } from "@mui/x-charts/BarChart";
import apis from "../../store/api";

const getBudgetForAccount = (accountId: string, accountTypes: any[]) => {
  if (accountId === "All") return null;
  const account = accountTypes.find((acc) => acc.id === parseInt(accountId));
  return account?.spending_limit ? parseFloat(account.spending_limit) : null;
};

const Budgets = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Get data from Redux store
  const { data: transactions, loading: transactionsLoading } = useSelector(
    (state: RootState) => state.transactions
  );
  const { data: accountTypes, loading: accountTypesLoading } = useSelector(
    (state: RootState) => state.accountTypes
  );
  const { loading: budgetLoading, error, success } = useSelector(
    (state: RootState) => state.budget
  );

  const isLoading = transactionsLoading || accountTypesLoading;

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(apis.transactions()),
        dispatch(apis.accountTypes())
      ]);
      setIsChartLoading(false);
    };
    fetchData();
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
    onSubmit: async (values) => {
      if (selectedAccount !== "All") {
        await dispatch(
          apis.setBudget({
            account_id: parseInt(selectedAccount),
            spending_limit: parseFloat(values.amount),
          })
        );
        // Refetch data after budget update
        dispatch(apis.transactions());
        dispatch(apis.accountTypes());
      }
    },
  });

  // Calculate spending by category for selected account
  const categorySpending = useMemo(() => {
    const filteredTransactions =
      selectedAccount === "All"
        ? transactions
        : transactions.filter(
            (t: any) => t.account_id === parseInt(selectedAccount)
          );

    const spending: { [key: string]: { spent: number; budget: number } } = {};

    // Calculate total spent per category
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t: any) => {
        if (!spending[t.category_name]) {
          spending[t.category_name] = { spent: 0, budget: 0 };
        }
        spending[t.category_name].spent += parseFloat(t.amount);
      });

    const totalBudget =
      selectedAccount === "All"
        ? accountTypes.reduce(
            (sum, acc: any) =>
              sum + (acc.spending_limit ? parseFloat(acc.spending_limit) : 0),
            0
          )
        : getBudgetForAccount(selectedAccount, accountTypes) || 0;

    return Object.entries(spending)
      .map(([category, values]) => ({
        category,
        spent: values.spent,
        budgetPercentage: Number(
          ((values.spent / totalBudget) * 100).toFixed(1)
        ),
      }))
      .sort((a, b) => b.budgetPercentage - a.budgetPercentage);
  }, [transactions, selectedAccount, accountTypes]);

  const budgetOverviewData = useMemo(
    () => calculateBudgetOverview(transactions, accountTypes, selectedAccount),
    [transactions, accountTypes, selectedAccount]
  );

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value);
    formik.resetForm();
    setIsChartLoading(true);
    setTimeout(() => setIsChartLoading(false), 500); // Simulate chart reload
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
            disabled={selectedAccount === "All" || budgetLoading}
          />
          <CustomButton
            onClick={() => formik.handleSubmit()}
            className={styles.button}
            variant="contained"
            backgroundColor="#014E7A"
            sx={{ mt: 3 }}
            disabled={selectedAccount === "All" || budgetLoading}
          >
            {budgetLoading ? (
              <div className="flex items-center">
                <Loader color="#fff" size={16} marginRight={8} />
                Setting Budget...
              </div>
            ) : (
              "Set Budget"
            )}
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

        <BudgetCard title="Expenses">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader color="#014E7A" size={40} />
            </div>
          ) : (
            <BudgetOverview
              totalBudget={budgetOverviewData.totalBudget}
              spent={budgetOverviewData.spent}
              remaining={budgetOverviewData.remaining}
              spentPercentage={budgetOverviewData.spentPercentage}
            />
          )}
        </BudgetCard>
      </div>

      <div className="w-full max-w-[1216px]">
        <BudgetCard
          sx={{
            width: "100%",
            paddingBottom: "2rem",
            minHeight: "400px",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Typography
                variant="h6"
                className={`${styles.t1Transactions} self-start`}
                gutterBottom
              >
                Spending by Category
              </Typography>
              <p className="text-[#9B9B9B]">
                View your expense distribution across different categories
              </p>
            </div>
            <Tooltip title="This chart shows how your spending is distributed across different categories as a percentage of your total budget" arrow>
              <IconButton size="small">
                <Info className="w-5 h-5" />
              </IconButton>
            </Tooltip>
          </div>

          {isChartLoading || isLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <Loader color="#014E7A" size={40} />
            </div>
          ) : categorySpending.length > 0 ? (
            <Box sx={{ height: 300, width: "100%" }}>
              <BarChart
                dataset={categorySpending}
                xAxis={[
                  {
                    scaleType: "band",
                    dataKey: "category",
                    label: "Categories",
                  },
                ]}
                yAxis={[
                  {
                    label: "Percentage of Total Budget (%)",
                    max: 100,
                  },
                ]}
                series={[
                  {
                    dataKey: "budgetPercentage",
                    label: "Budget Percentage",
                    color: "#014E7A",
                  },
                ]}
                height={300}
                margin={{ top: 10, bottom: 50, left: 60, right: 10 }}
                tooltip={{ trigger: "item" }}
              />
            </Box>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-gray-500">
              No spending data available for the selected account
            </div>
          )}

          {categorySpending.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-[#014E7A]"></div>
                <span>Percentage of total budget spent in each category</span>
              </div>
              <p className="mt-2">
                Highest spending category:{" "}
                <strong>{categorySpending[0]?.category}</strong> (
                {categorySpending[0]?.budgetPercentage.toFixed(1)}% of budget)
              </p>
            </div>
          )}
        </BudgetCard>
      </div>
    </div>
  );
};

export default Budgets;