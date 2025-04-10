// import React, { useEffect, useState } from "react";
// import {useNavigate} from 'react-router-dom';
// import { Box, Button } from "@mui/material";
// import Select from "react-select";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import dayjs from "dayjs";

// function CoverPage() {
//   const [FromDate, setFromDate] = useState(dayjs()); // Default to today's date
//   const [ToDate, setToDate] = useState(dayjs()); // Default to today's date
//   const [years, setYears] = useState([]); // List of years for the dropdown
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Fetch date ranges from API
//   const fetchDateRange = async () => {
//     try {
//       const response = await axios.get(
//         "https://arohanagroapi.microtechsolutions.co.in/php/getyears.php"
//       );
//       setYears(response.data);
//     } catch (error) {
//       toast.error("Error fetching Years:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDateRange();
//   }, []);

//   // Handle selection from the dropdown
//   const handleSelectChange = (selectedOption) => {
//     const selectedYear = years.find((year) => year.Id === selectedOption.value);
//     console.log(selectedYear, "selected year");
//     if (selectedYear) {
//       // Set FromDate and ToDate based on the selected year
//       setFromDate(dayjs(selectedYear.FromDate.date)); // Set FromDate
//       setToDate(dayjs(selectedYear.ToDate.date)); // Set ToDate
//     }
//     setIsDropdownOpen(false); // Close dropdown after selection
//   };

//   const navigate = useNavigate();

//   const handleOkClick = async (e) => {
//     e.preventDefault();
  
//     const data = new URLSearchParams();
//     data.append("FromDate", FromDate.format("YYYY-MM-DD"));
//     data.append("ToDate", ToDate.format("YYYY-MM-DD"));
//     data.append("Status", 1);
  
//     const url = "https://arohanagroapi.microtechsolutions.co.in/php/postyears.php";
  
//     try {
//       const response = await axios.post(url, data, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       });
  
//       console.log("API Response:", response.data); // Debugging response
  
//       const fromDate = response.data.FromDate?.date || response.data.FromDate;
//       const toDate = response.data.ToDate?.date || response.data.ToDate;
//       const yearId = response.data.Id;
//       if (fromDate && toDate && yearId) {
//         sessionStorage.setItem("FromDate", fromDate);
//         sessionStorage.setItem("ToDate", toDate);
//         sessionStorage.setItem('YearId', yearId)
//         toast.success("Year added successfully!");
//         navigate('/')
//       } else {
//         // toast.error("FromDate or ToDate or YearId is missing in the response.");
//       }
//     } catch (error) {
//       console.error("Error:", error.response?.data || error.message);
//       toast.error("Error saving record! " + (error.response?.data || error.message));
//     }
//   };
  
//   return (
//     <Box
//       sx={{
//         textAlign: "center",
//         p: 2,
//         width: "100vw",
//         background: "linear-gradient(to right, rgb(21, 110, 148), #2c5364)",
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Dropdown Positioned at the Top */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 20,
//           left: "50%",
//           transform: "translateX(-50%)",
//           width: "300px",
//           zIndex: 3,
//           background: "#2c5364", // Solid background
//           borderRadius: "8px",
//           padding: "8px",
//         }}
//       >
//         <Select
//           options={years.map((year) => ({
//             value: year.Id,
//             label: year.DateRange,
//           }))}
//           onChange={handleSelectChange}
//           onMenuOpen={() => setIsDropdownOpen(true)}
//           onMenuClose={() => setIsDropdownOpen(false)}
//           placeholder="Select Date Range"
//           styles={{
//             control: (base) => ({
//               ...base,
//               backgroundColor: "#ffffff", // Solid background
//               borderColor: "#AFC1D6",
//               color: "black",
//             }),
//             singleValue: (provided) => ({ ...provided, color: "black" }),
//             menu: (provided) => ({
//               ...provided,
//               backgroundColor: "#ffffff",
//               zIndex: 9999,
//             }),
//             option: (provided, state) => ({
//               ...provided,
//               backgroundColor: state.isFocused ? "#AFC1D6" : "#ffffff",
//               color: "black",
//             }),
//           }}
//         />
//       </Box>

//       {/* OK Button - Hidden When Dropdown is Open */}
//       {!isDropdownOpen && (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOkClick}
//           sx={{ zIndex: 2, mt: 4 }}
//         >
//           OK
//         </Button>
//       )}

//       {/* Toast Notifications */}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </Box>
//   );
// }

// export default CoverPage;







import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import Cookies from 'js-cookie';

function CoverPage() {
  const [FromDate, setFromDate] = useState(dayjs());
  const [ToDate, setToDate] = useState(dayjs());
  const [years, setYears] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDateRange = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.co.in/php/getyears.php"
      );
      setYears(response.data);
    } catch (error) {
      toast.error("Error fetching Years:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDateRange();
  }, []);

  const handleSelectChange = (selectedOption) => {
    const selectedYear = years.find((year) => year.Id === selectedOption.value);
    if (selectedYear) {
      setFromDate(dayjs(selectedYear.FromDate.date));
      setToDate(dayjs(selectedYear.ToDate.date));
    }
    setIsDropdownOpen(false);
  };

  const navigate = useNavigate();

  // const handleOkClick = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
    
  //   const data = new URLSearchParams();
  //   data.append("FromDate", FromDate.format("YYYY-MM-DD"));
  //   data.append("ToDate", ToDate.format("YYYY-MM-DD"));
  //   data.append("Status", 1);

  //   try {
  //     const response = await axios.post(
  //       "https://arohanagroapi.microtechsolutions.co.in/php/postyears.php",
  //       data,
  //       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  //     );

  //     console.log("Response Data:", response.data);

  //     const fromDate = response.data.FromDate?.date || response.data.FromDate;
  //     const toDate = response.data.ToDate?.date || response.data.ToDate;
  //     const yearId = response.data.Id;
      
  //     if (fromDate && toDate && yearId) {
  //       sessionStorage.setItem("FromDate", fromDate);
  //       sessionStorage.setItem("ToDate", toDate);
  //       sessionStorage.setItem('YearId', yearId);
  //       toast.success("Year selected successfully!");
  //       navigate('/customermaster');
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.response?.data || error.message);
  //     toast.error("Error saving record! " + (error.response?.data || error.message));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleOkClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const fromDate = FromDate.format("YYYY-MM-DD");
      const toDate = ToDate.format("YYYY-MM-DD");
      
      // Find the selected year based on the dates
      const selectedYear = years.find(year => 
        dayjs(year.FromDate.date).format("YYYY-MM-DD") === fromDate &&
        dayjs(year.ToDate.date).format("YYYY-MM-DD") === toDate
      );
      
      // if (selectedYear) {
      //   sessionStorage.setItem("FromDate", fromDate);
      //   console.log('FromDate',FromDate)
      //   sessionStorage.setItem("ToDate", toDate);
      //   console.log('ToDate',ToDate)
      //   sessionStorage.setItem("YearId", selectedYear.Id);
      //   console.log('YearId',selectedYear.Id)
      //   sessionStorage.setItem("DateRange", selectedYear.DateRange);
      //   console.log('DateRange',selectedYear.DateRange)
      // }
      if (selectedYear) {
        // Set cookies with expiration (e.g., 7 days)
        Cookies.set('FromDate', FromDate, { expires: 7 });
        Cookies.set('ToDate', ToDate, { expires: 7 });
        Cookies.set('YearId', selectedYear.Id, { expires: 7 });
        Cookies.set('DateRange', selectedYear.DateRange, { expires: 7 });
        console.log('FromDate', FromDate);
        console.log('ToDate', ToDate);
        console.log('YearId', selectedYear.Id);
        console.log('DateRange', selectedYear.DateRange);
      }
      toast.success("Year selected successfully!");
      navigate('/customermaster');
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error saving record! " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // const handleOkClick = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
    
  //   try {
  //     // Use your selected values directly instead of from API response
      
  //     const fromDate = FromDate.format("YYYY-MM-DD");
  //     const toDate = ToDate.format("YYYY-MM-DD");
      

  //     sessionStorage.setItem("FromDate", fromDate);
  //     console.log('FromDate',FromDate)
  //     sessionStorage.setItem("ToDate", toDate);
  //     console.log('ToDate',ToDate)
      
  //     toast.success("Year selected successfully!");
  //     navigate('/customermaster');
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     toast.error("Error saving record! " + error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)",
        p: 3,
        boxSizing: "border-box"
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "90%",
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          transform: "translateY(-5%)" // Slightly raise the card for better centering
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: "#1a2980",
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
            fontSize: { xs: "1.8rem", sm: "2rem" } // Responsive font size
          }}
        >
          Select Date Range
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Available Date Ranges
          </Typography>
          <Select
            options={years.map((year) => ({
              value: year.Id,
              label: year.DateRange,
            }))}
            onChange={handleSelectChange}
            onMenuOpen={() => setIsDropdownOpen(true)}
            onMenuClose={() => setIsDropdownOpen(false)}
            placeholder="Select Date Range"
            isLoading={isLoading}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#f8f9fa",
                borderColor: "#ced4da",
                minHeight: "48px",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#adb5bd",
                },
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: "200px", // Limit dropdown height
                overflowY: "auto", // Add scroll inside dropdown if needed
              }),
             
            }}
          />
        </Box>

        {/* <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          mb: 3,
          flexWrap: "wrap" // Allow wrapping on small screens
        }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: { xs: 1, sm: 0 } }}>
            From: {FromDate.format("DD MMM YYYY")}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            To: {ToDate.format("DD MMM YYYY")}
          </Typography>
        </Box> */}

        {!isDropdownOpen && (
          <Button
            variant="contained"
            color="primary"
             onClick={handleOkClick}
            disabled={isLoading}
   

            fullWidth
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(90deg, #1a2980 0%, #26d0ce 100%)",
              boxShadow: "0 4px 15px rgba(26, 41, 128, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(26, 41, 128, 0.4)",
              },
            }}
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        )}
      </Paper>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        style={{ width: "100%", maxWidth: "500px" }}
      />
    </Box>
  );
}

export default CoverPage;