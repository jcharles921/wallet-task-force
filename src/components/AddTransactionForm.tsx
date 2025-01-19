import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTransactionMutations } from "../hooks/useTransactionMutations";
import { useCategories } from "../hooks/useCategories";
import { useAccountTypes } from "../hooks/useAccountTypes";

// Validation Schema
const formSchema = Yup.object().shape({
  amount: Yup.string()
    .required("Amount is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g., 10.00)"),
  type: Yup.string()
    .oneOf(["income", "expense"], "Type must be either 'income' or 'expense'")
    .required("Type is required"),
  category_id: Yup.number().required("Category is required"),
  account_type_id: Yup.number().required("Account type is required"),
  description: Yup.string()
    .max(250, "Description should not exceed 250 characters")
    .optional(),
});

const AddTransactionForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    accountTypes,
    isLoading: accountTypesLoading,
    error: accountTypesError,
  } = useAccountTypes();
  const { addTransaction, error: submitError } = useTransactionMutations();


  const formik = useFormik({
    initialValues: {
      amount: "",
      type: "expense",
      category_id: "",
      account_type_id: "",
      description: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        // Find the selected account type

        console.log(JSON.stringify(values, null, 2) + "  =====> values");
        await addTransaction({
          amount: values.amount,
          type: values.type as 'income' | 'expense',
          category_id: Number(values.category_id),
       
          account_id: Number(values.account_type_id),
          description: values.description,
        
        });
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (categoriesLoading || accountTypesLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (categoriesError || accountTypesError) {
    return (
      <Box sx={{ color: "error.main", textAlign: "center", mt: 4 }}>
        Error loading form data:{" "}
        {categoriesError?.message || accountTypesError?.message}
      </Box>
    );
  }

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
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          alignSelf: "flex-start",
          fontWeight: "Bold",
        }}
      >
        Add Transaction
      </Typography>

      {submitError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {submitError.message}
        </Typography>
      )}

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

      <TextField
        select
        fullWidth
        id="category_id"
        name="category_id"
        label="Category"
        value={formik.values.category_id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category_id && Boolean(formik.errors.category_id)}
        helperText={formik.touched.category_id && formik.errors.category_id}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        id="account_type_id"
        name="account_type_id"
        label="Account Type"
        value={formik.values.account_type_id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.account_type_id &&
          Boolean(formik.errors.account_type_id)
        }
        helperText={
          formik.touched.account_type_id && formik.errors.account_type_id
        }
      >
        {accountTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>

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

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading || categoriesLoading || accountTypesLoading}
        sx={{
          textTransform: "none",
          fontFamily: "Rubik, sans-serif",
          fontWeight: "400",
          color: "white",
          backgroundColor: "#014e7a",
        }}
      >
        {isLoading ? "Adding..." : "Add Transaction"}
      </Button>
    </Box>
  );
};

export default AddTransactionForm;
