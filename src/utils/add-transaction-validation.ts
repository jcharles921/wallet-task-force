import * as Yup from "yup";
export default Yup.object().shape({
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
