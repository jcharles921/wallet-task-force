import  { useState } from "react";
import styles from "../../styles/global.module.css";
import { Table } from "../../containers/Tables";
import AddTransactionForm from "../../components/AddTransactionForm";
import { GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

// Sample transaction data
const initialRows = [
  {
    id: 1,
    date: "2025-01-17",
    description: "Groceries",
    amount: -50.0,
    category: "Food",
  },
  {
    id: 2,
    date: "2025-01-16",
    description: "Freelance",
    amount: 200.0,
    category: "Income",
  },
  {
    id: 3,
    date: "2025-01-15",
    description: "Transportation",
    amount: -30.0,
    category: "Travel",
  },
  {
    id: 4,
    date: "2025-01-14",
    description: "Dining",
    amount: -80.0,
    category: "Food",
  },
  {
    id: 5,
    date: "2025-01-13",
    description: "Salary",
    amount: 100.0,
    category: "Income",
  },
];

const columns: GridColDef[] = [
  { field: "date", headerName: "Date", width: 150 },
  { field: "description", headerName: "Description", width: 200 },
  { field: "category", headerName: "Category", width: 150 },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <Typography
        sx={{ color: params.value < 0 ? "error.main" : "success.main" }}
      >
        ${Math.abs(params.value).toFixed(2)}
      </Typography>
    ),
  },
];

const Transactions = () => {
  const [rows, _] = useState(initialRows);

//   const handleAddTransaction = (newTransaction: any) => {
//     setRows((prevRows) => [
//       { ...newTransaction, id: prevRows.length + 1 },
//       ...prevRows,
//     ]);
//   };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row gap-2 w-full items-center justify-center">
        <div className=" w-1/2">
          <AddTransactionForm />
        </div>

        <div className="  pr-10">
          <h1 className={styles.t1Transactions}>Recents Transactions</h1>

          <Table columns={columns} rows={rows} height={400} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
