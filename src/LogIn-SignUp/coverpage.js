import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import { Box, Button } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

function CoverPage() {
  const [FromDate, setFromDate] = useState(dayjs()); // Default to today's date
  const [ToDate, setToDate] = useState(dayjs()); // Default to today's date
  const [years, setYears] = useState([]); // List of years for the dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch date ranges from API
  const fetchDateRange = async () => {
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.co.in/php/getyears.php"
      );
      setYears(response.data);
    } catch (error) {
      toast.error("Error fetching Years:", error);
    }
  };

  useEffect(() => {
    fetchDateRange();
  }, []);

  // Handle selection from the dropdown
  const handleSelectChange = (selectedOption) => {
    const selectedYear = years.find((year) => year.Id === selectedOption.value);
    console.log(selectedYear, "selected year");
    if (selectedYear) {
      // Set FromDate and ToDate based on the selected year
      setFromDate(dayjs(selectedYear.FromDate.date)); // Set FromDate
      setToDate(dayjs(selectedYear.ToDate.date)); // Set ToDate
    }
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const navigate = useNavigate();

  const handleOkClick = async (e) => {
    e.preventDefault();
  
    const data = new URLSearchParams();
    data.append("FromDate", FromDate.format("YYYY-MM-DD"));
    data.append("ToDate", ToDate.format("YYYY-MM-DD"));
    data.append("Status", 1);
  
    const url = "https://arohanagroapi.microtechsolutions.co.in/php/postyears.php";
  
    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      console.log("API Response:", response.data); // Debugging response
  
      const fromDate = response.data.FromDate?.date || response.data.FromDate;
      const toDate = response.data.ToDate?.date || response.data.ToDate;
      const yearId = response.data.Id;
      if (fromDate && toDate && yearId) {
        sessionStorage.setItem("FromDate", fromDate);
        sessionStorage.setItem("ToDate", toDate);
        sessionStorage.setItem('YearId', yearId)
        toast.success("Year added successfully!");
        navigate('/')
      } else {
        // toast.error("FromDate or ToDate or YearId is missing in the response.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Error saving record! " + (error.response?.data || error.message));
    }
  };
  
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        width: "100vw",
        background: "linear-gradient(to right, rgb(21, 110, 148), #2c5364)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dropdown Positioned at the Top */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          zIndex: 3,
          background: "#2c5364", // Solid background
          borderRadius: "8px",
          padding: "8px",
        }}
      >
        <Select
          options={years.map((year) => ({
            value: year.Id,
            label: year.DateRange,
          }))}
          onChange={handleSelectChange}
          onMenuOpen={() => setIsDropdownOpen(true)}
          onMenuClose={() => setIsDropdownOpen(false)}
          placeholder="Select Date Range"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#ffffff", // Solid background
              borderColor: "#AFC1D6",
              color: "black",
            }),
            singleValue: (provided) => ({ ...provided, color: "black" }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "#ffffff",
              zIndex: 9999,
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#AFC1D6" : "#ffffff",
              color: "black",
            }),
          }}
        />
      </Box>

      {/* OK Button - Hidden When Dropdown is Open */}
      {!isDropdownOpen && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOkClick}
          sx={{ zIndex: 2, mt: 4 }}
        >
          OK
        </Button>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}

export default CoverPage;
