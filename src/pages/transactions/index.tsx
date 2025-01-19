import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/global.module.css";
import { Table } from "../../containers/Tables";
import AddTransactionForm from "../../components/AddTransactionForm";
import { GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import apis from "../../store/api";
import { RootState, AppDispatch } from "../../store";

const localTimeFormat = (date: Date | string): string =>
  new Date(date).toLocaleString();

const Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedAccount, _] = useState<string>("All");

  const {
    data: transactions,
    loading: isLoading,
    error,
  } = useSelector((state: RootState) => state.transactions);

  const { loading: isDeleting, success: deleteSuccess } = useSelector(
    (state: RootState) => state.deleteTransaction
  );
  const { success: addSuccess } = useSelector(
    (state: RootState) => state.transactions.addTransactionStatus
  );

  useEffect(() => {
    dispatch(apis.transactions());
    dispatch(apis.categories());
    dispatch(apis.accountTypes());
  }, [dispatch, deleteSuccess, addSuccess ]); // Refresh when delete is successful

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(apis.deleteTransaction(id));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography>{localTimeFormat(params.row.date)}</Typography>
      ),
    },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "category_name", headerName: "Category", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color:
              params.row.type === "expense" ? "error.main" : "success.main",
          }}
        >
          {Math.abs(parseFloat(params.value)).toFixed(2)} RWF
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDelete(params.row.id)}
          disabled={isDeleting}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const filteredRows = useMemo(
    () =>
      selectedAccount === "All"
        ? transactions
        : transactions.filter((row) => row.account_name === selectedAccount),
    [transactions, selectedAccount]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error">{error || "Failed to load transactions"}</Alert>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row gap-2 w-full items-center justify-center">
        <div className="w-1/3">
          <AddTransactionForm />
        </div>

        <div className="w-[60rem]">
          <h1 className={styles.t1Transactions}>Recent Transactions</h1>
          <Table columns={columns} rows={filteredRows} height={500} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
