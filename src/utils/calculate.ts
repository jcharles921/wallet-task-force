const calculateBudgetOverview = (
    transactions: any[],
    accountTypes: any[],
    selectedAccount: string
  ) => {
    // If "All" selected, calculate for accounts with spending limits
    if (selectedAccount === "All") {
      const accountSummaries = accountTypes
        .filter(account => account.spending_limit !== null)
        .map(account => {
          const accountTransactions = transactions.filter(
            t => t.account_id === account.id && t.type === "expense"
          );
          
          const spent = accountTransactions.reduce(
            (sum, t) => sum + parseFloat(t.amount),
            0
          );
          
          const budget = parseFloat(account.spending_limit);
          const remaining = budget - spent;
          const spentPercentage = (spent / budget) * 100;
          
          return {
            accountId: account.id,
            accountName: account.name,
            budget,
            spent,
            remaining,
            spentPercentage
          };
        });
  
      // Calculate totals across all accounts
      const totalBudget = accountSummaries.reduce((sum, acc) => sum + acc.budget, 0);
      const totalSpent = accountSummaries.reduce((sum, acc) => sum + acc.spent, 0);
      const totalRemaining = totalBudget - totalSpent;
      const totalSpentPercentage = (totalSpent / totalBudget) * 100;
  
      return {
        totalBudget,
        spent: totalSpent,
        remaining: totalRemaining,
        spentPercentage: totalSpentPercentage,
        accountSummaries // Include individual account details if needed
      };
    } else {
      // Calculate for single selected account
      const selectedAccountData = accountTypes.find(
        acc => acc.id === parseInt(selectedAccount)
      );
      
      if (!selectedAccountData || selectedAccountData.spending_limit === null) {
        return {
          totalBudget: 0,
          spent: 0,
          remaining: 0,
          spentPercentage: 0
        };
      }
  
      const accountTransactions = transactions.filter(
        t => t.account_id === selectedAccountData.id && t.type === "expense"
      );
      
      const spent = accountTransactions.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0
      );
      
      const budget = parseFloat(selectedAccountData.spending_limit);
      const remaining = budget - spent;
      const spentPercentage = (spent / budget) * 100;
  
      return {
        totalBudget: budget,
        spent,
        remaining,
        spentPercentage
      };
    }
  };

  export { calculateBudgetOverview };