
import React from 'react';
import { Box, MenuItem, Typography, TextField, Button, useMediaQuery, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import BaggroundImg from '../imgs/bg7.2.jpg';
import logo from '../imgs/logo5.jpeg';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";
import Cookies from 'js-cookie';
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [userName, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //login
  const Login = () => {
     if (!userName || !password) {
    alert("Please enter username and password.");
    return;
  }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("UserId", userName);
    urlencoded.append("Password", password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch("https://arohanagroapi.microtechsolutions.net.in/php/Usernameget.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        if (result?.message === "Login successful") {
          sessionStorage.setItem("UserId", result.Id); // Store user ID
          sessionStorage.setItem("Name", result.Name); // Store user Name
          //  console.log("UserName:", result.Name);
          toast.success("Log In created successfully");
          setIsLoggedIn(true)

        } else {
          alert("Login failed! Please check your credentials.");
        }
      })
      .catch((error) => console.error(error));
  };
  ///for daterange
  const [FromDate, setFromDate] = useState(dayjs());
  const [ToDate, setToDate] = useState(dayjs());
  const [years, setYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState('');

  const fetchDateRange = async () => {
    // setIsLoading(true);
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.net.in/php/getyears.php"
      );
      setYears(response.data);
      // console.log('fetchDateRange',response.data)
    } catch (error) {
      toast.error("Error fetching Years:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDateRange();
  }, []);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedYearId(selectedId);

    const selectedYear = years.find((year) => year.Id === selectedId);
    if (selectedYear) {
      setFromDate(dayjs(selectedYear.FromDate.date));
      setToDate(dayjs(selectedYear.ToDate.date));

      // Console log the YearId immediately when selected
      //  console.log('Selected YearId:', selectedId);

      // Store in cookies right away if needed
      Cookies.set('SelectedYearId', selectedId, { expires: 7 });
    }
  };

  const handleOkClick = async (e) => {
    e.preventDefault();
    // setIsLoading(true);

    try {
      if (!FromDate || !ToDate) {
        toast.error("Please select both From and To dates");
        return;
      }
      
      if (!selectedYearId) {
        toast.error("Please select a year");
        return;
      }
      const fromDate = FromDate.format("YYYY-MM-DD");
      const toDate = ToDate.format("YYYY-MM-DD");
      const selectedYear = years.find(year => year.Id === selectedYearId);

      if (selectedYear) {
        // Set all cookies
        Cookies.set('FromDate', fromDate, { expires: 7 });
        Cookies.set('ToDate', toDate, { expires: 7 });
        Cookies.set('YearId', selectedYear.Id, { expires: 7 });
        Cookies.set('DateRange', selectedYear.DateRange, { expires: 7 });

        // Console log all stored values
        // console.log('Stored values:', {
        //   FromDate: fromDate,
        //   ToDate: toDate,
        //   YearId: selectedYear.Id,
        //   DateRange: selectedYear.DateRange
        // });
      }

      toast.success("Year selected successfully!");
      navigate('/customermaster');
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error saving record! " + error.message);
    } finally {
      // setIsLoading(false);
    }
  };




  return (

    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${BaggroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            width: isSmallScreen ? "90vw" : "950px",
            height: isSmallScreen ? "auto" : "460px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(32, 30, 29, 0.22)",
            background: "rgba(255, 255, 255, 0.17)",
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          {/* Left side - always visible */}
          <Box
            sx={{
              width: "100%",
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              display: isSmallScreen ? 'none' : 'auto'
            }}
          >
            <Box className="login-logo">
              <img
                src={logo}
                alt="SNP Tax & Financials Logo"
                style={{ height: "460px", width: '100%' }}
              />
            </Box>
          </Box>

          {/* Right side - changes based on login status */}
          <Box
            sx={{
              width: isSmallScreen ? "100%" : "100%",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isLoggedIn ? (
              <>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#3A3B3C", marginBottom: 7 }}
                >
                  Select Date Range
                </Typography>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={selectedYearId}
                  onChange={handleSelectChange}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "30px",
                      background: "linear-gradient(90deg, rgba(173,216,230,0.5), rgba(216,191,216,0.5))",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      paddingLeft: 2,
                      color: "#000",
                      "& .MuiSelect-select": {
                        paddingY: "12px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#666",
                    },
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year.Id} value={year.Id}>
                      {year.DateRange}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  sx={{
                    mt: 6,
                    fontSize: "16px",
                    width: '90%',
                    background: '#074e2c',
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "#08A04B",
                    },
                  }}
                  fullWidth
                  onClick={handleOkClick}
                  variant='contained'
                  disabled={!FromDate || !ToDate || !selectedYearId}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#3A3B3C", marginBottom: 7 }}
                >
                  Welcome ..
                </Typography>

                <TextField
                  variant="standard"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  placeholder="Username"
                  sx={{
                    display: 'flex',
                    height: '3.5vh',
                    width: '90%',
                    justifyContent: 'center',
                    marginBottom: 3,
                    background: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "20px",
                    p: 1,
                    paddingLeft: 3
                  }}
                />

                <TextField
                  variant="standard"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? "hide password" : "show password"}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ right: 20 }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Password"
                  sx={{
                    display: "flex",
                    height: "3.5vh",
                    width: "90%",
                    justifyContent: "center",
                    marginBottom: 2,
                    background: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "20px",
                    p: 1,
                    paddingLeft: 3,
                  }}
                />

                <Button
                  sx={{
                    mt: 6,
                    fontSize: "16px",
                    width: '90%',
                    background: '#074e2c',
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "#08A04B",
                    },
                  }}
                  fullWidth
                  onClick={Login}
                  variant='contained'
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;


//customer box
// import React, { useState, useRef, useEffect } from "react";
// import { Box, Paper, Typography, TextField, Button, InputAdornment, List, ListItem, ListItemText } from '@mui/material';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import SearchIcon from '@mui/icons-material/Search';

// const Login = () => {
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [newCustomer, setNewCustomer] = useState("");
//     const [selectedCustomer, setSelectedCustomer] = useState("");
//     const [showSearchOptions, setShowSearchOptions] = useState(false);
//     const dropdownRef = useRef(null);

//     // Sample customer data
//     const customers = [
//         { id: 1, name: "John Doe" },
//         { id: 2, name: "Jane Smith" },
//         { id: 3, name: "Acme Corporation" },
//         { id: 4, name: "Global Tech" },
//         { id: 5, name: "Sarah Johnson" },
//     ];

//     // Filter customers based on search term
//     const filteredCustomers = customers.filter(customer =>
//         customer.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//                 setShowSearchOptions(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleAddCustomer = () => {
//         if (newCustomer.trim()) {
//             // In a real app, you would add the customer to your database/state here
//             setSelectedCustomer(newCustomer);
//             setNewCustomer("");
//             setShowDropdown(false);
//             setShowSearchOptions(false);
//         }
//     };

//     const handleSelectCustomer = (customerName) => {
//         setSelectedCustomer(customerName);
//         setShowDropdown(false);
//         setShowSearchOptions(false);
//     };

//     return (
//         <Box flex={1} m={2} position="relative" ref={dropdownRef}>
//             <Typography variant="body2"><b>Customer</b></Typography>
//             <TextField
//                 fullWidth
//                 variant="standard"
//                 sx={{
//                     '& .MuiInput-underline:before': {
//                         borderBottomWidth: 1.5,
//                         borderBottomColor: '#44ad74',
//                         opacity: 1,
//                     }, mt: 2
//                 }}
//                 size="small"
//                 placeholder="Select Customer"
//                 value={selectedCustomer}
//                 onClick={() => setShowDropdown(true)}
//                 InputProps={{
//                     readOnly: true,
//                 }}
//             />

//             {showDropdown && (
//                 <Paper
//                     sx={{ 
//                         position: "absolute", 
//                         width: "100%", 
//                         maxHeight: 250, 
//                         overflowY: "auto", 
//                         zIndex: 10, 
//                         mt: 1, 
//                         p: 2 
//                     }}
//                 >
//                     <TextField
//                         size="small"
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         placeholder="Search Customer Name"
//                         fullWidth
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onClick={() => setShowSearchOptions(true)}
//                     />

//                     {showSearchOptions && (
//                         <Box mt={1}>
//                             <List dense>
//                                 {filteredCustomers.length > 0 ? (
//                                     filteredCustomers.map(customer => (
//                                         <ListItem 
//                                             key={customer.id} 
//                                             button
//                                             onClick={() => handleSelectCustomer(customer.name)}
//                                         >
//                                             <ListItemText primary={customer.name} />
//                                         </ListItem>
//                                     ))
//                                 ) : (
//                                     <ListItem>
//                                         <ListItemText primary="No customers found" />
//                                     </ListItem>
//                                 )}
//                             </List>
//                         </Box>
//                     )}

//                     <Box display="flex" gap={1} mt={1}>
//                         <TextField 
//                             size="small" 
//                             placeholder="Create New Customer" 
//                             fullWidth 
//                             value={newCustomer}
//                             onChange={(e) => setNewCustomer(e.target.value)}
//                         />
//                         <Button 
//                             sx={{
//                                 background: 'var(--primary-color)',
//                             }}
//                             variant="contained"
//                             startIcon={<AddCircleIcon sx={{ fontSize: '20px' }} />}
//                             onClick={handleAddCustomer}
//                         >
//                             Add
//                         </Button>
//                     </Box>
//                 </Paper>
//             )}
//         </Box>
//     );
// }

// export default Login;


