import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Dayjs } from 'dayjs';

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

  

  
  const generateExcelReport = (
    transactions: any[],
    startDate: Dayjs,
    endDate: Dayjs,
    selectedAccount: string
  ) => {
    // Filter transactions based on date range
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate.toDate() && 
             transactionDate <= endDate.toDate();
    });
  
    // Calculate summaries
    const summary = filteredTransactions.reduce(
      (acc, curr) => {
        const amount = parseFloat(curr.amount);
        if (curr.type === 'income') {
          acc.totalIncome += amount;
        } else {
          acc.totalExpenses += amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );
  
    // Category breakdown
    const categoryBreakdown = filteredTransactions.reduce((acc: {[key: string]: number}, curr) => {
      if (curr.type === 'expense') {
        acc[curr.category_name] = (acc[curr.category_name] || 0) + parseFloat(curr.amount);
      }
      return acc;
    }, {});
  
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
  
    // Transactions sheet
    const transactionData = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Description: t.description,
      Category: t.category_name,
      Type: t.type,
      Amount: `${parseFloat(t.amount).toLocaleString()} RWF`
    }));
    const wsTransactions = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(wb, wsTransactions, 'Transactions');
  
    // Summary sheet
    const summaryData = [
      ['Report Period', `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`],
      ['Account', selectedAccount],
      [''],
      ['Summary'],
      ['Total Income', `${summary.totalIncome.toLocaleString()} RWF`],
      ['Total Expenses', `${summary.totalExpenses.toLocaleString()} RWF`],
      ['Net', `${(summary.totalIncome - summary.totalExpenses).toLocaleString()} RWF`],
      [''],
      ['Category Breakdown'],
      ...Object.entries(categoryBreakdown).map(([category, amount]) => 
        [category, `${amount.toLocaleString()} RWF`]
      )
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
  
    // Generate and download the file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = `Financial_Report_${startDate.format('YYYYMMDD')}_${endDate.format('YYYYMMDD')}.xlsx`;
    saveAs(blob, fileName);
  };
  
  
  export { calculateBudgetOverview,generateExcelReport };