import React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Props {
  type: any;
  message: string;
  openSnackBar: boolean;
}

const CustomSnackBar: React.FC<Props> = ({ type, openSnackBar, message }) => {
  return (
    <Stack>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={type}>{message}</Alert>
      </Snackbar>
    </Stack>
  );
};

export default CustomSnackBar;