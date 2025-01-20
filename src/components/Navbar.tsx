import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import apis from "../store/api";
import {
  Badge,
  Menu,
  MenuItem,
  CircularProgress,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import styles from "../styles/global.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [activeLink, setActiveLink] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    data: notifications,
    unreadCount,
    loading,
  } = useSelector((state: RootState) => state.notifications);

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Transactions", path: "/transactions" },
    { name: "Categories", path: "/categories" },
    { name: "Budgets", path: "/budgets" },
    { name: "Reports", path: "/reports" },
  ];

  useEffect(() => {
    setActiveLink(location.pathname);
    dispatch(apis.fetchNotifications());
  }, [location.pathname, dispatch]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleOpenNotifications = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: number) => {
    dispatch(apis.markNotificationAsRead(id));
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
        <Badge badgeContent={unreadCount} color="primary">
          <NotificationsNoneOutlinedIcon
            onClick={handleOpenNotifications}
            style={{ cursor: "pointer" }}
          />
        </Badge>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNotifications}
          PaperProps={{
            style: { maxHeight: 300, width: "320px" },
          }}
        >
          {loading ? (
            <MenuItem>
              <CircularProgress size={24} />
            </MenuItem>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                sx={{
                  backgroundColor: notification.is_read
                    ? "transparent"
                    : "rgba(25, 118, 210, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.2)",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: notification.is_read ? "normal" : "bold",
                      }}
                    >
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>
                  }
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <Typography variant="body2">No new notifications</Typography>
            </MenuItem>
          )}
          <Divider />
          {notifications.length > 0 && (
            <MenuItem
              onClick={() => {
                // dispatch(apis.markNotificationAsRead());
                handleCloseNotifications();
              }}
            >
              <Typography variant="body2" color="primary">
                Mark all as read
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
