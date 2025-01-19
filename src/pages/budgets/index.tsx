import { useState, useMemo } from "react";
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

const Budgets = () => {
  const [selectedAccount, setSelectedAccount] = useState("All");

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value);
  };

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
      console.log(`Budget set for ${selectedAccount}:`, values);
    },
  });

  const accounts = ["Bank", "Mobile Money", "Cash"];
  const totalBudget = 2000;
  const categoryData = [
    { account: "Bank", category: "Housing", amount: 800 },
    { account: "Bank", category: "Food", amount: 400 },
    { account: "Mobile Money", category: "Transportation", amount: 300 },
    { account: "Cash", category: "Entertainment", amount: 200 },
    { account: "Cash", category: "Other", amount: 100 },
  ];

  const filteredCategoryData = useMemo(
    () =>
      selectedAccount === "All"
        ? categoryData
        : categoryData.filter((item) => item.account === selectedAccount),
    [selectedAccount, categoryData]
  );

  const chartData = filteredCategoryData.map((item) => ({
    category: item.category,
    percentage: Number(((item.amount / totalBudget) * 100).toFixed(1)),
  }));

  return (
    <div className={styles.budgetBox}>
      <Box sx={{ marginBottom: 3, alignSelf: "center" }}>
        <FormControl sx={{ minWidth: 200 , }}>
          <InputLabel>Account</InputLabel>
          <Select
            value={selectedAccount}
            onChange={handleAccountChange}
            label="Account"
          >
            <MenuItem value="All">All</MenuItem>
            {accounts.map((account) => (
              <MenuItem key={account} value={account}>
                {account}
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
          />
          <CustomButton
            onClick={() => formik.handleSubmit()}
            className={styles.button}
            variant="contained"
            backgroundColor="#014E7A"
            sx={{
              mt: 3,
            }}
          >
            Set Budget
          </CustomButton>
        </BudgetCard>

        {/* Expenses Overview Card */}
        <BudgetCard title="Expenses">
          <BudgetOverview />
        </BudgetCard>
      </div>

      {/* Budget by Category Card */}
      <div className="w-full max-w-[1216px] ">
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
            Budget by Category
          </Typography>
          <Box sx={{ height: 300, width: "100%" }}>
            <BarChart
              dataset={chartData}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "category",
                  label: "Categories",
                },
              ]}
              yAxis={[
                {
                  label: "Percentage (%)",
                },
              ]}
              series={[
                {
                  dataKey: "percentage",
                  label: "Budget Percentage",
                  color: "#014E7A",
                },
              ]}
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
