import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";

const formSchema = Yup.object().shape({
  amount: Yup.string().required("Amount is required"),
  type: Yup.string().oneOf(["income", "expense"], "Invalid type").required("Type is required"),
  category: Yup.string().required("Category is required"),
  account: Yup.string().required("Account is required"),
  description: Yup.string(),
});

const AddTransactionForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      amount: "",
      type: "expense",
      category: "",
      account: "",
      description: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values:any) => {
      setIsLoading(true);
      console.log(values);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsLoading(false);
      formik.resetForm();
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 400, margin: "auto", mt: 4 }}
    >
      <Typography variant="h5" align="center">
        Add Transaction
      </Typography>

      {/* Amount Field */}
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

      >
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>

   
      <TextField
        fullWidth
        id="category"
        name="category"
        label="Category"
        placeholder="e.g., Food, Rent"
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category && Boolean(formik.errors.category)}

      />

   
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

      />

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
       
      />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Transaction"}
      </Button>
    </Box>
  );
};

export default AddTransactionForm;