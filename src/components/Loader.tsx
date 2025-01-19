import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  color?: string;
  size?: number;
  marginRight?: number;
}

const Loader: React.FC<Props> = ({ color, size, marginRight }) => {
  return <CircularProgress size={size ? size : 20} sx={{ color: color, marginRight:marginRight }} />;
};

export default Loader;
