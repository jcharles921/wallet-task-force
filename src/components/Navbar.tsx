import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/global.module.css";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Badge } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Transactions", path: "/transactions" },
    { name: "Categories", path: "/categories" },
    { name: "Budgets", path: "/budgets" },
    { name: "Reports", path: "/reports" },
  ];

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.navBar}>
      <h2 className="text-4xl font-bold font-fancy text-indigo">The Wallet</h2>
      <div className={styles.navLinks}>
        {links.map((link) => (
          <div
            key={link.path}
            className={`${styles.navLink} ${
              activeLink === link.path ? styles.active : ""
            } link-slider`}
            onClick={() => handleNavigation(link.path)}
          >
            {link.name}
          </div>
        ))}
      </div>
      <div className={styles.notificationIcon}>
        <Badge badgeContent={4} color="primary">
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </div>
    </div>
  );
};

export default Navbar;
