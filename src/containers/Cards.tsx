
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';

const BudgetCard = styled(Paper)(({ theme }) => ({
  width:'600px',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

// Card
const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
}));

// CardHeader
const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
}));

// CardTitle
const CardTitle = styled(Box)(({  }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '-0.025em',
}));

// CardDescription
const CardDescription = styled(Box)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

// CardContent
const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: 0,
}));

// CardFooter
const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  paddingTop: 0,
}));

// Add display names
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  BudgetCard,
};