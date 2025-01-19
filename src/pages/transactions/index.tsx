import { useMemo, useState } from "react";
import styles from "../../styles/global.module.css";
import { Table } from "../../containers/Tables";
import AddTransactionForm from "../../components/AddTransactionForm";
import { GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useTransactions } from "../../hooks/useTransactions";

const localTimeFormat = (date: Date | string): string =>
  new Date(date).toLocaleString();
const columns: GridColDef[] = [
  {
    field: "date",
    headerName: "Date",
    width: 150,
    renderCell: (params) => (
      <Typography>{localTimeFormat(params.row.date)}</Typography>
    ),
  },
  { field: "description", headerName: "Description", width: 200 },
  { field: "category_name", headerName: "Category", width: 150 },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <Typography
        sx={{
          color: params.row.type === "expense" ? "error.main" : "success.main",
        }}
      >
        ${Math.abs(parseFloat(params.value)).toFixed(2)}
      </Typography>
    ),
  },
];

const Transactions = () => {
  const { transactions, isLoading, error } = useTransactions();
  const [selectedAccount, _] = useState<string>("All");

  // const handleAccountChange = (event: any) => {
  //   setSelectedAccount(event.target.value as string);
  // };

  // Filter transactions by account type
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
      <Alert severity="error">
        {error.message || "Failed to load transactions"}
      </Alert>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row gap-2 w-full items-center justify-center">
        <div className="w-1/3">
          <AddTransactionForm />
        </div>

        <div className="">
          <h1 className={styles.t1Transactions}>Recent Transactions</h1>

          <Table columns={columns} rows={filteredRows} height={400} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
