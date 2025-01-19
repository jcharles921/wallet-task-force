import  { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import styles from "../styles/global.module.css";

// Validation Schema
const formSchema = Yup.object().shape({
  amount: Yup.string()
    .required("Amount is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 10.00)"),
  type: Yup.string()
    .oneOf(["income", "expense"], "Type must be either 'income' or 'expense'")
    .required("Type is required"),
  category: Yup.string().required("Category is required"),
//   subcategory: Yup.string().required("Subcategory is required"),
//   account: Yup.string().required("Account is required"),
  accountType: Yup.string()
    .oneOf(["Bank", "Mobile Money", "Cash"], "Select a valid account type")
    .required("Account type is required"),
  description: Yup.string()
    .max(250, "Description should not exceed 250 characters")
    .optional(),
});

const AddTransactionForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const subcategoryOptions: { [key: string]: string[] } = {
    Food: ["Groceries", "Dining Out", "Snacks"],
    Rent: ["Monthly Rent", "Utilities"],
    Transport: ["Fuel", "Public Transport", "Parking"],
    Other: ["Miscellaneous"],
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      type: "expense",
      category: "",
      subcategory: "",
      account: "",
      accountType: "",
      description: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      console.log(values);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        resetForm();
      } catch (error) {
        console.error("Error adding transaction:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle Subcategory reset when Category changes
  const handleCategoryChange = (e:any) => {
    formik.setFieldValue("category", e.target.value);
    formik.setFieldValue("subcategory", ""); // Reset subcategory when category changes
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 400,
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h5" className={styles.t2Transactions}>
        Add Transactions
      </Typography>
      <TextField
        fullWidth
        id="amount"
        name="amount"
        label="Amount"
        placeholder="0.00"
        value={formik.values.amount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.touched.amount && formik.errors.amount}
      />

      {/* Type Field */}
      <TextField
        select
        fullWidth
        id="type"
        name="type"
        label="Type"
        value={formik.values.type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.type && Boolean(formik.errors.type)}
        helperText={formik.touched.type && formik.errors.type}
      >
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>

      {/* Category Field */}
      <TextField
        select
        fullWidth
        id="category"
        name="category"
        label="Category"
        value={formik.values.category}
        onChange={handleCategoryChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
      >
        {Object.keys(subcategoryOptions).map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>

      {/* Subcategory Field */}
      {/* <TextField
        select
        fullWidth
        id="subcategory"
        name="subcategory"
        label="Subcategory"
        value={formik.values.subcategory}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.subcategory && Boolean(formik.errors.subcategory)}
        helperText={formik.touched.subcategory && formik.errors.subcategory}
        disabled={!formik.values.category} // Disable if no category is selected
      >
        {(subcategoryOptions[formik.values.category as keyof typeof subcategoryOptions] || []).map((subcat) => (
          <MenuItem key={subcat} value={subcat}>
            {subcat}
          </MenuItem>
        ))}
      </TextField> */}

      {/* Account Field */}
      <TextField
        fullWidth
        id="account"
        name="account"
        label="Account"
        placeholder="e.g., Savings, Credit Card"
        value={formik.values.account}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.account && Boolean(formik.errors.account)}
        helperText={formik.touched.account && formik.errors.account}
      />

      {/* Account Type Field */}
      <TextField
        select
        fullWidth
        id="accountType"
        name="accountType"
        label="Account Type"
        value={formik.values.accountType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.accountType && Boolean(formik.errors.accountType)}
        helperText={formik.touched.accountType && formik.errors.accountType}
      >
        <MenuItem value="Bank">Bank</MenuItem>
        <MenuItem value="Mobile Money">Mobile Money</MenuItem>
        <MenuItem value="Cash">Cash</MenuItem>
      </TextField>

      {/* Description Field */}
      <TextField
        fullWidth
        id="description"
        name="description"
        label="Description"
        placeholder="Optional"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        
        fullWidth
        disabled={isLoading}
        sx={{
          textTransform: "none",
          fontFamily: "Rubik, sans-serif",
          fontWeight: "400",
          color:"white",
          backgroundColor: "#014e7a",
        }}
      >
        {isLoading ? "Adding..." : "Add Transaction"}
      </Button>
    </Box>
  );
};

export default AddTransactionForm;
