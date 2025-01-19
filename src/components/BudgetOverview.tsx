import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";

interface BudgetOverviewProps {
  totalBudget?: number;
  spent: number;
  remaining: number;
  spentPercentage: number;
}

const BudgetOverview = ({  spent, remaining, spentPercentage }: BudgetOverviewProps) => {
  const remainingPercentage = 100 - spentPercentage;

  return (
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
      <p className="text-[#9B9B9B] mb-4">Adjust your monthly budget</p>
      <LinearProgress
        variant="determinate"
        value={spentPercentage}
        sx={{
          height: "13px",
          borderRadius: "5px",
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#014e7a",
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        <Card
          sx={{
            flex: 1,
            marginRight: "1rem",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <h6 className="font-bold">Spent</h6>
            <Typography variant="h4" color="textPrimary" fontWeight="bold">
              {spent.toFixed(2)} RWF
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {spentPercentage.toFixed(1)}% of budget
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            marginLeft: "1rem",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <h6 className="font-bold">Remaining</h6>
            <Typography variant="h4" color="textPrimary" fontWeight="bold">
              {remaining.toFixed(2)} RWF
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {remainingPercentage.toFixed(1)}% of budget
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default BudgetOverview;