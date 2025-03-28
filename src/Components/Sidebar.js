
import React, { useState, useEffect, } from "react";
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
  Chip
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Outlet, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import "./sidebar.css";
import { menuItems } from "./menuItems"; // Import your JSON data
// import logo from '../imgs/logo5.PNG'
import logo from '../imgs/logo5.jpeg'
import logonew from '../imgs/logo_white.png'
import user from '../imgs/user.jpg'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { green } from "@mui/material/colors";
import LogoutIcon from '@mui/icons-material/Logout';


function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleToggleSubmenu = (path) => {
    setOpenMenu(openMenu === path ? null : path);
  };

  const logoutUser = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const Name = sessionStorage.getItem('Name');
  // Function to extract the initials from the username (for Avatar display)
  const getInitials = (name) => {
    if (!name) return ''; 
    const splitName = name.trim().split(' '); 
    const initials = splitName
      .filter(word => word.length > 0) 
      .map(word => word[0].toUpperCase()) 
      .join('');
  
    return initials || '?'; 
  }; 


  return (
    <div className="grid-container">
      <header className="header">
        <Box component="header" sx={{ p: 2, display: "flex", gap: 3 }}>
          <Box className="bar-icon">
            <FaBars onClick={handleToggleSidebar} style={{ fontSize: "1.8rem" }} />
          </Box>


          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', }}>

            <Typography color="var(--primary-color)" variant="body">
              <b>Welcome To Arohan Agro</b>
            </Typography>


            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

              <Avatar sx={{ bgcolor: "#054c2a", fontSize: 12, width: 31, height: 31 }}> {getInitials(Name || '')}</Avatar>
              <span style={{ fontSize: 13 }} className="hidden-text">
                <b>{Name}</b>
              </span>

              {/* {!isCollapsed && (
                <div>
                  <AiOutlineLogout onClick={logoutUser} className="logout-icon" />
                </div>
              )} */}
            </Box>

          </Box>
          {/*           
          <Box display={'flex'} justifyContent={'space-between'} flex={1} m={2} color={'#000'}>
          
            <Box display={'flex'} flexDirection={'column'}>
           
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" className="title">
                  <b>Anant Pride - Phase1</b>
                </Typography>
                <Chip
                  label="A340"
                  sx={{ backgroundColor: "#25D366", color: "#fff",height:'25px' }}
                />
              </Box>

              <Typography className="title">
                Plant 19A, Pirojshanagar, Vikhroli , Mumbai 400079, India
              </Typography>
            </Box>
            <Typography variant="h5" className="title">

            </Typography>
            <Box display={'flex'} flexDirection={"column"}>
              <Typography variant="h6" className="title">
                Registration
              </Typography>
              <Box display={'flex'} gap={5}>
                <Typography className="title">
                  Date:-18-01-2025
                </Typography>
                <Typography className="title">
                  No:-555AB0256Q
                </Typography>
              </Box>
            </Box>
          </Box> */}
        </Box>
      </header>
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "show" : ""}`}>
        <IconButton onClick={handleToggleSidebar} className="toggle-button">
          {isCollapsed ? <ChevronRight className="toggle-icon" /> : <ChevronLeft className="toggle-icon" />}
        </IconButton>
        <Box
          component="aside"
          style={{
            width: isCollapsed ? "60px" : "250px",
            // padding: 5,
            transition: "width 0.3s",

          }}
        >
          <Box
          //  sx={{ pt: 3, display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}
          >

            {/* <div style={{ textAlign: "center" }}>
              <img
                src={isCollapsed ? logonew : logo}
                alt="logo"
                // style={{ height: "150px",  width: isCollapsed ? "55px" : "230px", }}
                style={{
                  height: "150px",
                  width: isCollapsed ? "55px" : "230px",
                 
                  display: "block", 
                
                }}
              />

            </div> */}
            <div style={{ display: "flex", justifyContent: 'center', height: '160px', alignItems: 'center' }}>
              <img
                // src={isCollapsed ? logonew : logo}
                src={isCollapsed ? logonew : logo}
                alt="logo"
                style={{
                  height: isCollapsed ? "60px" : "160px",
                  width: isCollapsed ? "60px" : "250px",

                  // width:"250px",
                  display: "block",
                }}
              />
            </div>
            {!isCollapsed && <Typography variant="h5" className="company-name-text"></Typography>}
          </Box>
          <Box className="sidebar-contents" sx={{ height: "65vh", overflowY: 'auto', p: 0.6 }}>
            <List sx={{ cursor: "pointer" }}>
              {menuItems.map((item, index) => (
                <Box key={index}>
                  <ListItem
                    onClick={() => handleToggleSubmenu(item.path)}
                    className="menu-item"
                    sx={{
                      mt: 1,
                      color: '#0d4a2b',
                      fontWeight: 'bold',
                      borderRadius: "10px",
                      transition: "background-color 0.3s, color 0.3s",
                      "&:hover": {
                        color: "#fff",
                        // backgroundColor: "#2c85de",
                        backgroundColor: 'var(--primary-color)',

                        ".menu-icon": {
                          color: "#fff",
                        },
                        ".menu-text": {
                          color: "#fff",
                        },
                      },
                    }}
                    component={item.submenus?.length ? "div" : Link}
                    to={item.submenus?.length ? undefined : item.path} // Only add `to` for items without submenus
                  >
                    <ListItemIcon sx={{ fontSize: "1.5rem" }} className="menu-icon">
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={item.title} sx={{ ml: -2 }} />}
                    {!isCollapsed && item.submenus?.length > 0 && (
                      <ListItemIcon sx={{ justifyContent: "end" }}>
                        {openMenu === item.path ? <ExpandLess className="menu-icon" /> : <ExpandMore className="menu-icon" />}
                      </ListItemIcon>
                    )}
                  </ListItem>
                  {item.submenus?.length > 0 && (
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
                              // color: "black",
                              color: '#407d5e',
                              //  pl: 4,
                              transition: "background-color 0.3s, color 0.3s",
                              "&:hover": {
                                color: "#fff",
                                backgroundColor: "#588d72",
                                ".menu-icon": {
                                  color: "#fff",
                                },
                                ".menu-text": {
                                  color: "#fff",
                                },
                              },
                            }}
                          >
                            <ListItemIcon sx={{ fontSize: "1.2rem" }} className="menu-icon">
                              {subItem.icon}
                            </ListItemIcon>
                            {!isCollapsed && <ListItemText primary={subItem.title} sx={{ ml: -2 }} className="menu-text" />}
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              ))}
            </List>

            <div className="bottom-content">
              <ul>
                <li>
                  <Link to="#" className="logout-link">
                    <div className="info">


                      {/* <div>
                        <AiOutlineLogout className="logout-icon" />
                      </div> */}
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </Box>


          <div className="bottom-content">
            <ul>
              <li>
                <Link to="#" className="logout-link">
                  <div className="info" >
                    {/* <div>
                      
                      <Avatar sx={{ bgcolor: "#054c2a", fontSize: 15 }}>DC</Avatar>
                    </div> */}
                    {/* <img src={user} alt="user" className="user-icon" style={{ height: "50px", width: "50px" }} /> */}
                    {/* <span className="hidden-text" >
                      <b>Chavan Diksha</b>
                      
                    </span> */}

                    {!isCollapsed && (

                      // <div style={{display:"flex",alignItems:'center'}}>
                      //   loggout
                      //   <LogoutIcon onClick={logoutUser} className="logout-icon" />
                      // </div>

                      <Button
                        variant="contained"
                        color="primary"

                        endIcon={<LogoutIcon />}
                        onClick={logoutUser}
                        sx={{
                          backgroundColor: "#074e2c", // Adjust to match the image
                          color: "white",
                          textTransform: "none",
                          padding: "6px 16px",
                          borderRadius: "6px",
                          width: 210,
                          textAlign: 'center',
                          m: 2
                        }}
                      >
                        Logout
                      </Button>
                    )}
                  </div>


                </Link>
              </li>

            </ul>
          </div>
        </Box>
      </aside>
      <main className="main">
        <Box component="main">
          <Outlet />
        </Box>
      </main>

    </div>
  );
}

export default Sidebar;
