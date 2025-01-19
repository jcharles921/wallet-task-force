import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  backgroundColor?: string;
  textColor?: string;
  customWidth?: string | number;
  customHeight?: string | number;
  hoverColor?: string;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => 
    !['backgroundColor', 'textColor', 'customWidth', 'customHeight', 'hoverColor'].includes(prop as string),
})<CustomButtonProps>(({ 
  backgroundColor, 
  textColor, 
  customWidth, 
  customHeight,
  hoverColor,
  theme 
}) => ({
  backgroundColor: backgroundColor || theme.palette.primary.main,
  color: textColor || theme.palette.primary.contrastText,
  width: customWidth || 'auto',
  height: customHeight || 'auto',
  '&:hover': {
    backgroundColor: hoverColor || theme.palette.primary.dark,
  },

  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
}));

const CustomButton: React.FC<CustomButtonProps> = ({ 
  children,
  backgroundColor,
  textColor,
  customWidth,
  customHeight,
  hoverColor,
  ...props 
}) => {
  return (
    <StyledButton
      backgroundColor={backgroundColor}
      textColor={textColor}
      customWidth={customWidth}
      customHeight={customHeight}
      hoverColor={hoverColor}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export  {CustomButton};