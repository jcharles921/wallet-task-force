
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Info } from "lucide-react";

interface BudgetOverviewProps {
  totalBudget?: number;
  spent: number;
  remaining: number;
  spentPercentage: number;
}

const BudgetOverview = ({ totalBudget, spent, remaining, spentPercentage }: BudgetOverviewProps) => {
  const remainingPercentage = 100 - spentPercentage;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              alignSelf: "flex-start",
              fontWeight: "Bold",
            }}
          >
            Budget Overview
          </Typography>
          <p className="text-[#9B9B9B]">Track your monthly spending</p>
        </div>
        <Tooltip title="This overview shows your spending progress for the current month. The progress bar indicates remaining budget in blue." arrow>
          <IconButton size="small">
            <Info className="w-5 h-5" />
          </IconButton>
        </Tooltip>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Monthly Budget Progress</span>
          <span className="font-medium">
            {totalBudget?.toLocaleString()} RWF
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          value={remainingPercentage}
          sx={{
            height: "13px",
            borderRadius: "5px",
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#014e7a",
              transition: "transform 0.4s ease",
            },
          }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{spentPercentage.toFixed(1)}% spent</span>
          <span>{remainingPercentage.toFixed(1)}% remaining</span>
        </div>
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Card
          sx={{
            flex: 1,
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <div className="flex items-center gap-2">
              <h6 className="font-bold">Amount Spent</h6>
              <Tooltip title="Total amount spent this month" arrow>
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <Typography variant="h4" color="textPrimary" fontWeight="bold">
              {spent.toLocaleString()} RWF
            </Typography>
            <Typography variant="body2" className="text-red-500">
              {spentPercentage.toFixed(1)}% of budget used
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <div className="flex items-center gap-2">
              <h6 className="font-bold">Remaining Budget</h6>
              <Tooltip title="Amount left to spend this month" arrow>
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <Typography variant="h4" color="textPrimary" fontWeight="bold">
              {remaining.toLocaleString()} RWF
            </Typography>
            <Typography variant="body2" className="text-green-600">
              {remainingPercentage.toFixed(1)}% of budget available
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default BudgetOverview;