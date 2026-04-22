


import { useState, useEffect } from "react";
import {
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";
import { menuItems as defaultMenuItems } from "./menuItems";
import logo from "../imgs/logo5.jpeg";
import logonew from "../imgs/logo_white.png";

function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userMenuItems, setUserMenuItems] = useState(defaultMenuItems);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // read sessionStorage once (string or null)
  const rawUserId = sessionStorage.getItem("UserId");
  const userIdNumber = rawUserId ? Number(rawUserId) : null;
  const Name = sessionStorage.getItem("Name");

  const normalize = (s = "") => s.toString().replace(/\s+/g, " ").trim().toLowerCase();

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .trim()
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("") || "?";
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsSidebarVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Filter for user 15: only specific transaction submenus
  // const filterForUser15 = (menu) => {
  //   const transactionItem = menu.find(
  //     (it) => normalize(it.title).includes("transaction")
  //   );

  //   if (transactionItem && Array.isArray(transactionItem.submenus)) {
  //     const allowed = ["delivery challan", "packing entry", "production entry"];
  //     const filteredSubs = transactionItem.submenus.filter((s) =>
  //       allowed.includes(normalize(s.title))
  //     );
  //     return filteredSubs.length > 0 ? [{ ...transactionItem, submenus: filteredSubs }] : [];
  //   }

  //   return [];
  // };


  const filterForsales = (menu) => {
    const normalize = (s = "") => s.toString().toLowerCase().trim();

    const transactionItem = menu.find((it) =>
      normalize(it.title).includes("transaction")
    );

    const reportsItem = menu.find((it) =>
      normalize(it.title).includes("reports")
    );

    let result = [];

    // 👉 Transaction → only Sales
    if (transactionItem && Array.isArray(transactionItem.submenus)) {
      const filteredTransaction = transactionItem.submenus.filter((s) =>
        normalize(s.title) === "sales"
      );

      if (filteredTransaction.length > 0) {
        result.push({
          ...transactionItem,
          submenus: filteredTransaction,
        });
      }
    }

    // 👉 Reports → only Sales Report
    if (reportsItem && Array.isArray(reportsItem.submenus)) {
    const filteredReports = reportsItem.submenus.filter((s) => {
  const title = normalize(s.title);
  return ["sales report", "sales hsn wise"].some((key) =>
    title.includes(key)
  );
});

      if (filteredReports.length > 0) {
        result.push({
          ...reportsItem,
          submenus: filteredReports,
        });
      }
    }

    return result;
  };

  useEffect(() => {
    if (userIdNumber === 15) {
      const filtered = filterForsales(defaultMenuItems);
      setUserMenuItems(filtered);
    } else {
      setUserMenuItems(defaultMenuItems);
    }
  }, [rawUserId]);

  const handleToggleSidebar = () => {
    if (isSmallScreen) setIsSidebarVisible(!isSidebarVisible);
    else setIsCollapsed(!isCollapsed);
  };

  const handleToggleSubmenu = (path) => {
    setOpenMenu(openMenu === path ? null : path);
  };

  const logoutUser = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="grid-container">
      {/* Header */}
      <header className="header">
        <Box component="header" sx={{ p: 2, display: "flex", gap: 3 }}>
          <Box className="bar-icon">
            <FaBars onClick={handleToggleSidebar} style={{ fontSize: "1.8rem" }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Typography color="var(--primary-color)" variant="body">
              <b>Welcome To Aarohan Agro</b>
              {!isOnline && (
                <Typography color="error" variant="body2">
                  ⚠️ No Internet Connection
                </Typography>
              )}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "#054c2a", fontSize: 12, width: 31, height: 31 }}>
                {getInitials(Name)}
              </Avatar>
              <span style={{ fontSize: 13 }} className="hidden-text"><b>{Name}</b></span>
            </Box>
          </Box>
        </Box>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "show" : ""}`}>
        <IconButton onClick={handleToggleSidebar} className="toggle-button">
          {isCollapsed ? <ChevronRight className="toggle-icon" /> : <ChevronLeft className="toggle-icon" />}
        </IconButton>

        <Box style={{ width: isCollapsed ? "60px" : "250px", transition: "width 0.3s" }}>
          <div style={{ display: "flex", justifyContent: "center", height: "160px", alignItems: "center" }}>
            <img src={isCollapsed ? logonew : logo} alt="logo"
              style={{ height: isCollapsed ? "60px" : "160px", width: isCollapsed ? "60px" : "250px", display: "block" }} />
          </div>

          <Box className="sidebar-contents" sx={{ height: "65vh", overflowY: "auto", p: 0.6 }}>
            <List sx={{ cursor: "pointer" }}>
              {userMenuItems && userMenuItems.length ? userMenuItems.map((item, index) => (
                <Box key={index}>


                  <ListItem
                    onClick={() => handleToggleSubmenu(item.path)}
                    className="menu-item"
                    sx={{
                      mt: 1,
                      color: "#0d4a2b",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      transition: "background-color 0.3s, color 0.3s",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "var(--primary-color)",
                        ".MuiListItemIcon-root, .MuiListItemText-root": {
                          color: "#fff",
                        },
                        ".MuiSvgIcon-root": {
                          color: "#fff",
                        },
                      },
                    }}
                    component={item.submenus && item.submenus.length ? "div" : Link}
                    to={item.submenus && item.submenus.length ? undefined : item.path}
                  >
                    <ListItemIcon sx={{ fontSize: "1.5rem", color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={item.title} sx={{ ml: -2, color: "inherit" }} />}
                    {!isCollapsed && item.submenus && item.submenus.length > 0 && (
                      <ListItemIcon sx={{ justifyContent: "end", color: "inherit" }}>
                        {openMenu === item.path ? <ExpandLess /> : <ExpandMore />}
                      </ListItemIcon>
                    )}
                  </ListItem>


                  {item.submenus && item.submenus.length > 0 && (
                    <Collapse in={openMenu === item.path} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenus.map((subItem, subIndex) => (
                          <ListItem
                            key={subIndex}
                            component={Link}
                            to={subItem.path}
                            className="menu-item"
                            sx={{
                              mt: 1,
                              borderRadius: "10px",
                              color: "#407d5e",
                              transition: "background-color 0.3s, color 0.3s",
                              "&:hover": { color: "#fff", backgroundColor: "#588d72" },
                            }}
                          >
                            <ListItemIcon sx={{
                              fontSize: "1.2rem", color: '#407d5e', transition: "background-color 0.3s, color 0.3s",
                              "&:hover": { color: "#fff", },
                            }}>{subItem.icon}</ListItemIcon>
                            {!isCollapsed && <ListItemText primary={subItem.title} sx={{ ml: -2 }} />}
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              )) : (
                <Box sx={{ p: 2 }}>
                  {!isCollapsed && <Typography variant="body2" color="textSecondary">No menu available</Typography>}
                </Box>
              )}
            </List>

            {!isCollapsed && (
              <Box sx={{ mt: "auto", p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<LogoutIcon />}
                  onClick={logoutUser}
                  sx={{
                    backgroundColor: "#074e2c",
                    color: "white",
                    textTransform: "none",
                    padding: "6px 16px",
                    borderRadius: "6px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </aside>

      {/* Main */}
      <main className="main">
        <Box component="main"><Outlet /></Box>
      </main>
    </div>
  );
}

export default Sidebar;









