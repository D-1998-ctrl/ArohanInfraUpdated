// import React, { useMemo, useState, useEffect } from 'react'
// import { Grid, Autocomplete, FormControl, useMediaQuery, Box, Button, IconButton, Typography, TextField, Drawer, Divider, Select, MenuItem, Menu } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { MaterialReactTable, } from 'material-react-table';
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { useTheme } from "@mui/material/styles";
// import axios from 'axios';
// import { toast } from "react-toastify";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import moment from 'moment';
// import dayjs from "dayjs";
// import Cookies from 'js-cookie';
// import { Input } from '@mui/material';

// const ProductionEntry = () => {
//     const theme = useTheme();
//     const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const handleDrawerOpen = () => {
//         setIsDrawerOpen(true);
//         handleClearTemplate();
//     };

//     const handleDrawerClose = () => {
//         setIsDrawerOpen(false);
//     };

//     //table
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [currentRow, setCurrentRow] = useState(null);

//     const handleMenuOpen = (event, row) => {
//         setAnchorEl(event.currentTarget);
//         setCurrentRow(row);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };
//     const [idwiseData, setIdwiseData] = useState('')

//     //for machine start time
//     const getTimeParts = (data) => {
//         let [datepart, timepart] = data.split(" ");
//         let [hour, minute] = timepart.split(":");
//         // Determine AM/PM and convert to 12-hour format
//         let period = hour < 12 ? "AM" : "PM";
//         let hr = hour < 12 ? hour : (hour - 12);
//         return {
//             date: datepart,
//             hour: hr,
//             minute: minute,
//             period: period,
//         };
//     };

//     //for machine end time
//     const getEndTimeParts = (data) => {
//         let [datepart, timepart] = data.split(" ");
//         let [hour, minute] = timepart.split(":");
//         // Determine AM/PM and convert to 12-hour format
//         let period = hour < 12 ? "AM" : "PM";
//         let hr = hour < 12 ? hour : (hour - 12);

//         return {
//             date: datepart,
//             hour: hr,
//             minute: minute,
//             period: period,
//         };

//     };

//     const handleEdit = () => {
//         if (currentRow) {
//             console.log("Editing item with ID:", currentRow.original);

//             let updatedproductionDate = currentRow.original.ProductionDate.date || null;
//             console.log('updatedproductionDate', updatedproductionDate)
//             const updatedproductionDateObject = updatedproductionDate
//                 ? dayjs(updatedproductionDate).format("YYYY-MM-DD")
//                 : null;
//             console.log('updatedproductionDateObject', updatedproductionDateObject)

//             const startTimeParts = getTimeParts(currentRow.original.MachineStartTime.date);
//             console.log('startTimeParts', startTimeParts)

//             const endTimeParts = getEndTimeParts(currentRow.original.MachineEndTime.date);
//             console.log('endTimeParts', endTimeParts)

//             setIdwiseData(currentRow.original.Id);
//             setUpdateProductNo(currentRow.original.ProductionNo);
//             setUpdateProductionDate(updatedproductionDateObject);
//             // console.log("productionDateObject", formattedupdatedProductionDate)
//             setSelectedOperator(currentRow.original.OperatorId);
//             setSelectedMachine(currentRow.original.MachineId);
//             // setSelectedOillSeed(currentRow.original.MaterialId);
//             setSelectedOillSeed(currentRow.original.MaterialId);

//             setupdateStorage(currentRow.original.Storage);
//             setupdateBrandName(currentRow.original.BrandName);
//             setupdateBatchNo(currentRow.original.BatchNo);
//             setupdateWeight(currentRow.original.Weight);
//             setupdateOilProduced(currentRow.original.OilProduced);
//             setUpdatePercentage(currentRow.original.Percentage);
//             setupdateOilInLit(currentRow.original.OilInLitre);
//             setUpdateStartTimeInHour(startTimeParts.hour)
//             setUpdateStartTimeMin(startTimeParts.minute)
//             setupdateStartPeriod(startTimeParts.period);

//             setupdateMachineStartTime(startTimeParts.hour + ':' + startTimeParts.minute)

//             setUpdateEndTimeInHour(endTimeParts.hour)
//             setUpdateEndTimeMin(endTimeParts.minute)
//             setupdateEndPeriod(endTimeParts.period)
//             setupdatemachineEndtime(endTimeParts.hour + ':' + endTimeParts.minute)

//         }
//     };

//     const [data, setData] = useState([]);
//     const columns = useMemo(() => {
//         return [

//             {
//                 accessorKey: 'ProductionNo',
//                 header: 'Production No',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'ProductionDate.date',
//                 header: 'Production Date',
//                 size: 150,
//                 Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
//             },

//             {

//                 accessorKey: 'MachineStartTime.date',
//                 header: 'Machine Start Time',
//                 size: 150,
//                 Cell: ({ cell }) => <span>{moment(cell.getValue()).format('hh:mm A')}</span>,

//             },
//             {
//                 accessorKey: 'MachineEndTime.date',
//                 header: 'Machine End Time',
//                 size: 150,
//                 Cell: ({ cell }) => <span>{moment(cell.getValue()).format('hh:mm A')}</span>,
//             },
//             // {
//             //     accessorKey: 'OilSeedId',
//             //     header: 'Oil seed',
//             //     size: 150,
//             // },

//             {
//                 accessorKey: 'Storage',
//                 header: 'Storage',
//                 size: 150,
//             },

//             {
//                 accessorKey: 'BrandName',
//                 header: 'Brand Name',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'BatchNo',
//                 header: 'Batch No',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'Weight',
//                 header: 'Weight',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'OilProduced',
//                 header: 'Oil Produced(Kg)',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'Percentage',
//                 header: 'Percentage',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'OilInLitre',
//                 header: 'Oil(L)',
//                 size: 150,
//             },

//             {
//                 id: 'actions',
//                 header: 'Actions',
//                 size: 150,
//                 Cell: ({ row }) => (
//                     <IconButton
//                         onClick={(event) => handleMenuOpen(event, row)} // Open the menu on click
//                     >
//                         <MoreVertIcon />
//                     </IconButton>
//                 ),

//             },
//         ];
//     }, []);

//     //integration
//     const [productNo, setProductNo] = useState('');
//     const [updateproductNo, setUpdateProductNo] = useState('');
//     const [productiondate, setProductionDate] = useState(null);
//     const [updateProductiondate, setUpdateProductionDate] = useState(null);

//     const [machinestarttime, SetMachineStartTime] = useState(null)
//     const [updatemachinestarttime, setupdateMachineStartTime] = useState('')
//     const [machineEndtime, SetMachineEndTime] = useState(null)
//     const [updatemachineEndtime, setupdatemachineEndtime] = useState('')
//     const [storage, setStorage] = useState('')
//     const [updatestorage, setupdateStorage] = useState('')
//     const [brandName, setBrandName] = useState('')
//     const [updatebrandName, setupdateBrandName] = useState('')
//     const [batchno, setBatchNo] = useState('')
//     const [updatebatchno, setupdateBatchNo] = useState('')
//     const [weight, setWeight] = useState('')
//     const [updateweight, setupdateWeight] = useState('')
//     const [oilProduced, setOilProduced] = useState('')
//     const [updateoilProduced, setupdateOilProduced] = useState('')
//     const [percentage, setPercentage] = useState('')
//     const [updatepercentage, setUpdatePercentage] = useState('')
//     const [oilInLit, setOilInLit] = useState('')
//     const [updateoilInLit, setupdateOilInLit] = useState('')
//     const [startTimeInHour, setStartTimeInHour] = useState('')
//     const [startTimeInMin, setStartTimeMin] = useState('')
//     const [period, setPeriod] = useState('')
//     // 
//     const [endTimeInHour, setEndTimeInHour] = useState('')
//     const [endTimeInMin, setEndTimeMin] = useState('')
//     const [endperiod, setEndPeriod] = useState('')


//     const handleEndPeriodChange = (e) => {
//         const selectedPeriod = e.target.value;
//         setEndPeriod(selectedPeriod);

//         let formattedTime;
//         if (selectedPeriod === "AM") {
//             formattedTime = endTimeInHour + ":" + endTimeInMin;
//         } else {
//             formattedTime = (parseInt(endTimeInHour, 10) + 12) + ":" + endTimeInMin;
//         }

//         //console.log("Selected Time:", formattedTime);
//         SetMachineEndTime(formattedTime)
//     };


//     //update



//     const [updateendperiod, setupdateEndPeriod] = useState('')

//     const handleUpadateEndPeriodChange = (e) => {
//         const selectedPeriod = e.target.value;
//         setupdateEndPeriod(selectedPeriod);

//         // let formattedTime;
//         // if (selectedPeriod === "AM") {
//         //     formattedTime = updateendTimeInHour + ":" + updateendTimeInMin;
//         // } else {
//         //     formattedTime = (parseInt(updateendTimeInHour, 10) + 12) + ":" + updateendTimeInMin;
//         // }

//         //console.log("Selected Time:", formattedTime);
//         // setupdatemachineEndtime(formattedTime)
//     };

//     //
//     const [updatestartperiod, setupdateStartPeriod] = useState('')

//     const handleUpadatStartPeriodChange = (e) => {
//         const selectedPeriod = e.target.value;
//         setupdateStartPeriod(selectedPeriod);
//         console.log(selectedPeriod)
//         // let formattedTime;
//         // if (selectedPeriod === "AM") {
//         //     formattedTime = updatestartTimeInHour + ":" + updateendTimeInMin;
//         // } else {
//         //     formattedTime = (parseInt(updatestartTimeInHour, 10) + 12) + ":" + updateendTimeInMin;
//         // }

//         // console.log("Selected Time:", formattedTime);
//         // setupdateMachineStartTime(formattedTime)
//     };


//     //for  Operator
//     const [operatorOptions, setOperatorOptions] = useState([]);
//     const [selectedOperator, setSelectedOperator] = useState("");

//     const fetchAccounts = async () => {
//         try {
//             const response = await axios.get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=operators");
//             const opratorOptions = response.data.map((operator) => ({
//                 value: operator.Id,
//                 label: operator.OperatorName,
//             }));
//             setOperatorOptions(opratorOptions);
//         } catch (error) {

//         }
//     };

//     //for Machines
//     const [machineOptions, setMachineOptions] = useState([]);
//     const [selectedMachine, setSelectedMachine] = useState("");

//     const fetchMachines = async () => {
//         try {
//             const response = await axios.get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=machines");
//             const machineOptions = response.data.map((machine) => ({
//                 value: machine.Id,
//                 label: machine.MachineName,
//             }));
//             setMachineOptions(machineOptions);
//         } catch (error) {

//         }
//     };

//     //for Oillseed
//     const [oilseedOptions, setOilSeedOptions] = useState([]);
//     const [selectedOillSeed, setSelectedOillSeed] = useState("");

//     const fetchOilseed = async () => {
//         try {

//             const response = await axios.get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=materialmaster");
//             //console.log(response.data)
//             const oil = response.data.map((oilseed) => ({
//                 value: oilseed.Id,
//                 label: oilseed.MaterialName,
//             }));
//             setOilSeedOptions(oil);
//         } catch (error) {

//         }
//     };

//     useEffect(() => {
//         fetchAccounts();
//         fetchMachines();
//         fetchOilseed()
//     }, []);


//     const handleClearTemplate = () => {
//         setProductNo('');
//         setProductionDate('');
//         setSelectedOperator('');
//         setSelectedMachine('');
//         SetMachineStartTime('');
//         SetMachineEndTime('');
//         setSelectedOillSeed('');
//         setStorage('');
//         setBrandName('');
//         setBatchNo('');
//         setWeight('');
//         setOilProduced('');
//         setPercentage('');
//         setOilInLit('');
//         setErrors('')
//     }


//     const CreateProductionEntry = () => {

//         if (!validateForm()) {
//             return;
//         }


//         // const formattedProductionDate = moment(productiondate).format("YYYY-MM-DD");
//         let productionDate = productiondate || null;
//         // console.log('productionDate', productionDate)
//         const productionDateObject = productionDate
//             ? dayjs(productionDate).format("YYYY-MM-DD")
//             : null;
//         // console.log('productionDateObject', productionDateObject)

//         const urlencoded = new URLSearchParams();
//         urlencoded.append("ProductionNo", productNo);
//         urlencoded.append("ProductionDate", productionDateObject);
//         urlencoded.append("OperatorId", selectedOperator);
//         // urlencoded.append("MaterialId", selectedOillSeed);
//         urlencoded.append("MaterialId", selectedOillSeed);
//         urlencoded.append("Storage", storage);
//         urlencoded.append("BrandName", brandName);
//         urlencoded.append("BatchNo", batchno);
//         urlencoded.append("MachineId", selectedMachine);
//         urlencoded.append("MachineStartTime", machinestarttime);
//         urlencoded.append("Weight", weight);
//         urlencoded.append("OilProduced", oilProduced);
//         urlencoded.append("Percentage", percentage);
//         urlencoded.append("OilInLitre", oilInLit);
//         urlencoded.append("MachineEndTime", machineEndtime);

//         const requestOptions = {
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//             },
//         };

//         axios.post(
//             "https://arohanagroapi.microtechsolutions.co.in/php/postproduction.php",
//             urlencoded,
//             requestOptions
//         )
//             .then((response) => {
//                 console.log("API Response:", response.data);
//                 toast.success("Production Entry created successfully");
//                 handleClearTemplate();
//                 handleDrawerClose()
//                 fetchData();
//             })
//             .catch((error) => {
//                 console.error("Error:", error);
//             });
//     };

//     //tble data
//     const fetchData = async () => {
//         const requestOptions = {
//             method: "GET",
//             redirect: "follow"
//         };

//         try {
//             const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=production", requestOptions);
//             const result = await response.json();

//             // console.log("Fetched result:", result);

//             setData(result);

//         } catch (error) {
//             console.error(error);
//         }
//     };
//     // console.log("result", data);
//     useEffect(() => {
//         fetchData();
//     }, []);

//     const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);
//     const handleEditDrawerOpen = () => {
//         handleEdit()
//         setEditIsDrawerOpen(true);
//         handleMenuOpen(false)

//     };

//     const handleEditDrawerClose = () => {
//         setEditIsDrawerOpen(false);
//     };
//     // console.log(idwiseData)

//     //update 
//     // const UpdateProductionEntry = () => {
//     //     const urlencoded = new URLSearchParams();
//     //     urlencoded.append("ProductionNo", updateproductNo);
//     //     urlencoded.append("ProductionDate", productiondate);
//     //     urlencoded.append("OperatorId", selectedOperator);
//     //     urlencoded.append("OilSeedId", selectedOillSeed);
//     //     urlencoded.append("Storage", updatestorage);
//     //     urlencoded.append("BrandName", updatebrandName);
//     //     urlencoded.append("BatchNo", updatebatchno);
//     //     urlencoded.append("MachineId", selectedMachine);
//     //     urlencoded.append("MachineStartTime", updatemachinestarttime);
//     //     urlencoded.append("Weight", updateweight);
//     //     urlencoded.append("OilProduced", updateoilProduced);
//     //     urlencoded.append("Percentage", updatepercentage);
//     //     urlencoded.append("OilInLitre", updateoilInLit);
//     //     urlencoded.append("MachineEndTime", updatemachineEndtime);
//     //     urlencoded.append("Id", idwiseData);
//     //     const requestOptions = {
//     //         headers: {
//     //             "Content-Type": "application/x-www-form-urlencoded",
//     //         },
//     //     };

//     //     axios
//     //         .post(
//     //             "https://arohanagroapi.microtechsolutions.co.in/php/updateproductmaster.php",
//     //             urlencoded,
//     //             requestOptions
//     //         )
//     //         .then((response) => {
//     //             console.log("UpdateProductionEntry:", response.data);
//     //             handleEditDrawerClose()
//     //             toast.success("Product Master Updated successfully");
//     //         })
//     //         .catch((error) => {
//     //             console.error("Error:", error);
//     //         });
//     // };
//     // const [ProductionDate, setProductiondate] = useState(null);

//     const UpdateProductionEntry = () => {
//         const formattedProductiondate = moment(updateProductiondate).format("YYYY-MM-DD");
//         const qs = require('qs');
//         let formattedTime;
//         if (updatestartperiod === "AM") {
//             formattedTime = updatestartTimeInHour + ":" + updatestartTimeInMin;
//         } else {
//             formattedTime = (parseInt(updatestartTimeInHour, 10) + 12) + ":" + updatestartTimeInMin;
//         }
//         console.log('start', formattedTime, updatestartTimeInHour, updatestartTimeInMin)
//         let formattedEndTime;
//         if (updateendperiod === "AM") {
//             formattedEndTime = updateendTimeInHour + ":" + updateendTimeInMin;
//         } else {
//             formattedEndTime = (parseInt(updateendTimeInHour, 10) + 12) + ":" + updateendTimeInMin;
//         }
//         console.log('end', formattedEndTime, updateendTimeInHour, updateendTimeInMin)
//         let data = qs.stringify({
//             ProductionDate: formattedProductiondate,
//             OperatorId: selectedOperator,
//             //   MaterialId: selectedOillSeed,
//             MaterialId: selectedOillSeed,
//             Storage: updatestorage,
//             BrandName: updatebrandName,
//             BatchNo: updatebatchno,
//             MachineId: selectedMachine,
//             MachineStartTime: formattedTime,
//             Weight: updateweight,
//             OilProduced: updateoilProduced,
//             Percentage: updatepercentage,
//             OilInLitre: updateoilInLit,
//             MachineEndTime: formattedEndTime,
//             Id: idwiseData
//         });
//         let config = {
//             method: 'post',
//             maxBodyLength: Infinity,
//             url: 'https://arohanagroapi.microtechsolutions.co.in/php/updateproduction.php',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             data: data
//         };
//         axios.request(config)
//             .then((response) => {
//                 console.log(JSON.stringify(response.data));

//                 toast.success("Production Entry updated successfully");
//                 handleEditDrawerClose()
//                 fetchData()

//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     //for delete 
//     const DeleteProductionEntry = () => {
//         const requestOptions = {
//             method: "GET",
//             redirect: "follow"
//         };
//         const url = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=production&Id=${currentRow.original.Id}`
//         console.log(url)
//         fetch(url, requestOptions)
//             .then((response) => response.text())
//             .then((result) => {
//                 console.log(result)
//                 toast.success("Production Entry deleted successfully!");
//             })
//             .catch((error) => console.error(error));
//     }

//     const handlePeriodChange = (e) => {
//         const selectedPeriod = e.target.value;
//         setPeriod(selectedPeriod);

//         let formattedTime;
//         if (selectedPeriod === "AM") {
//             formattedTime = startTimeInHour + ":" + startTimeInMin;
//         } else {
//             formattedTime = (parseInt(startTimeInHour, 10) + 12) + ":" + startTimeInMin;
//         }

//         //console.log("Selected Time:", formattedTime);
//         SetMachineStartTime(formattedTime)
//     };

//     //update start
//     const [updatestartTimeInHour, setUpdateStartTimeInHour] = useState('')
//     const [updatestartTimeInMin, setUpdateStartTimeMin] = useState('')
//     //
//     const [updateendTimeInHour, setUpdateEndTimeInHour] = useState('')
//     const [updateendTimeInMin, setUpdateEndTimeMin] = useState('')


//     //validation
//     const [errors, setErrors] = useState({
//         productiondate: '',
//         selectedOperator: '',
//         selectedMachine: '',
//         startTimeInHour: '',
//         startTimeInMin: '',
//         selectedOillSeed: '',
//         brandName: "",
//         weight: '',
//         Percentage: '',
//         endTimeInHour: '',
//         endTimeInMin: '',
//         storage: '',
//         batchno: '',
//         oilProduced: '',
//         oilInLit: ''
//     })


//     const validateForm = () => {
//         const newErrors = {
//             productiondate: '',
//             selectedMachine: '',
//             startTimeInHour: '',
//             startTimeInMin: '',
//             selectedOillSeed: '',
//             brandName: "",
//             weight: '',
//             percentage: '',
//             endTimeInHour: '',
//             endTimeInMin: '',
//             storage: '',
//             batchno: '',
//             oilProduced: '',
//             oilInLit: ''
//         };

//         let isValid = true;

//         if (!productiondate) {
//             newErrors.productiondate = 'productiondate  is required';
//             isValid = false;
//         } else {
//             // Convert dates to Date objects for comparison
//             const productiondateObj = new Date(productiondate);
//             const fromDateObj = new Date(fromdate);
//             const toDateObj = new Date(todate);

//             // Check if invoice date is before from date
//             if (productiondateObj < fromDateObj) {
//                 newErrors.productiondate = `productiondate  cannot be before ${new Date(fromdate).toLocaleDateString()}`;
//                 isValid = false;
//             }
//             // Check if invoice date is after to date
//             else if (productiondateObj > toDateObj) {
//                 newErrors.productiondate = `productiondate cannot be after ${new Date(todate).toLocaleDateString()}`;
//                 isValid = false;
//             }
//         };

//         if (!selectedOperator) {
//             newErrors.selectedOperator = 'Operator is required';
//             isValid = false;
//         }

//         if (!selectedMachine) {
//             newErrors.selectedMachine = 'selectedMachine is required';
//             isValid = false;
//         }

//         if (!startTimeInHour) {
//             newErrors.startTimeInHour = 'startTimeInHour is required';
//             isValid = false;
//         }

//         if (!startTimeInMin) {
//             newErrors.startTimeInMin = 'startTimeInMin is required';
//             isValid = false;
//         }

//         if (!selectedOillSeed) {
//             newErrors.selectedOillSeed = 'Product is required';
//             isValid = false;
//         }

//         if (!brandName) {
//             newErrors.brandName = 'brandName is required';
//             isValid = false;
//         }

//         if (!weight) {
//             newErrors.weight = 'weight is required';
//             isValid = false;
//         }

//         //
//         if (!percentage) {
//             newErrors.percentage = 'Percentage is required';
//             isValid = false;
//         }

//         if (!endTimeInHour) {
//             newErrors.endTimeInHour = 'endTimeInHour is required';
//             isValid = false;
//         }

//         if (!endTimeInMin) {
//             newErrors.endTimeInMin = 'endTimeInMin is required';
//             isValid = false;
//         }

//         if (!storage) {
//             newErrors.storage = 'storage is required';
//             isValid = false;
//         }

//         if (!batchno) {
//             newErrors.batchno = 'batchno is required';
//             isValid = false;
//         }


//         if (!oilProduced) {
//             newErrors.oilProduced = 'oilProduced is required';
//             isValid = false;
//         }

//         if (!oilInLit) {
//             newErrors.oilInLit = 'oilInLit is required';
//             isValid = false;
//         }

//         setErrors(newErrors);
//         return isValid;
//     };


//     // for yearId
//     const [yearid, setYearId] = useState('');
//     const [fromdate, setFromDate] = useState('');
//     const [todate, setToDate] = useState('');

//     useEffect(() => {
//         const storedYearId = Cookies.get("YearId");
//         const storedfromdate = Cookies.get("FromDate");
//         const storedtodate = Cookies.get("ToDate");

//         if (storedYearId) {
//             setYearId(storedYearId);
//             console.log('storedYearId', storedYearId);
//         } else {
//             toast.error("Year is not set.");
//         };
//         if (storedfromdate) {
//             setFromDate(storedfromdate);
//             console.log('storedfromdate', storedfromdate);
//         } else {
//             toast.error("FromDate is not set.");
//         }

//         if (storedtodate) {
//             setToDate(storedtodate);
//             console.log('storedTodate', storedtodate);
//         } else {
//             toast.error("ToDate is not set.");
//         }

//     }, [yearid, fromdate, todate]);


//     return (
//         <Box>
//             <Box textAlign={'center'}>
//                 <Typography color='var(--complementary-color)' variant='h4'><b>Production Entry</b></Typography>
//             </Box>
//             <Box sx={{ p: 5, height: 'auto' }}>


//                 <Box sx={{ display: 'flex', gap: 3 }}>
//                     <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Production Entry </Button>
//                 </Box>


//                 <Box mt={4}>
//                     <MaterialReactTable
//                         columns={columns}
//                         data={data}
//                         muiTableHeadCellProps={{
//                             sx: {

//                                 color: 'var(--primary-color)',

//                             },
//                         }}
//                     />
//                     <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl)}
//                         onClose={handleMenuClose}
//                     >
//                         <MenuItem
//                             onClick={handleEditDrawerOpen}
//                         >Edit
//                         </MenuItem>
//                         <MenuItem
//                             onClick={DeleteProductionEntry}
//                         >
//                             Delete
//                         </MenuItem>
//                     </Menu>
//                 </Box>

//                 <Drawer
//                     anchor="right"
//                     open={isDrawerOpen}
//                     onClose={handleDrawerClose}
//                     PaperProps={{
//                         sx: {
//                             borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//                             width: isSmallScreen ? "100%" : "720px",
//                             zIndex: 1000,
//                         },
//                     }}
//                 >
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
//                             <Typography m={2} variant="h6"><b>Create Production Entry</b></Typography>
//                             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />


//                         </Box>
//                         <Divider />


//                         <Box m={1.5}>
//                             <Grid container spacing={2} alignItems="start">
//                                 {/* Left Column */}
//                                 <Grid item xs={6}>
//                                     <Box mt={2}>
//                                         <Typography variant="body2">Production No</Typography>
//                                         <TextField
//                                             variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 }, mt: 1
//                                             }}
//                                             focused
//                                             value={productNo}
//                                             placeholder='Production Number'
//                                             // disabled
//                                             // onChange={(e) => setProductNo(e.target.value)}
//                                             size="small"
//                                             fullWidth
//                                         />
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Operator</Typography>

//                                         <Select
//                                             variant="standard"
//                                             input={
//                                                 <Input
//                                                     disableUnderline={false}
//                                                     sx={{
//                                                         '&:before': {
//                                                             borderBottomWidth: 1.5,
//                                                             borderBottomColor: '#44ad74',
//                                                         },
//                                                         mt: 1,
//                                                     }}
//                                                 />
//                                             }
//                                             focused
//                                             fullWidth
//                                             size="small"
//                                             value={selectedOperator || ""}
//                                             onChange={(e) => setSelectedOperator(e.target.value)}>


//                                             {operatorOptions.map((option) => (
//                                                 <MenuItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Machine Start Time</Typography>
//                                         <Grid container spacing={2} alignItems="center">
//                                             <Grid item xs={4}>
//                                                 <TextField variant="standard"
//                                                     sx={{
//                                                         '& .MuiInput-underline:after': {
//                                                             borderBottomWidth: 1.5,
//                                                             borderBottomColor: '#44ad74',
//                                                         },
//                                                     }}
//                                                     focused value={startTimeInHour} onChange={(e) => setStartTimeInHour(e.target.value)} fullWidth size="small" placeholder="Hours" />
//                                             </Grid>
//                                             <Grid item xs={1} sx={{ textAlign: "center" }}>
//                                                 <Typography variant="body2"><b>:</b></Typography>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <TextField variant="standard"
//                                                     sx={{
//                                                         '& .MuiInput-underline:after': {
//                                                             borderBottomWidth: 1.5,
//                                                             borderBottomColor: '#44ad74',
//                                                         },
//                                                     }}
//                                                     focused value={startTimeInMin} onChange={(e) => setStartTimeMin(e.target.value)} fullWidth size="small" placeholder="Minutes" />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <Select
//                                                     variant="standard"
//                                                     input={
//                                                         <Input
//                                                             disableUnderline={false}
//                                                             sx={{
//                                                                 '&:before': {
//                                                                     borderBottomWidth: 1.5,
//                                                                     borderBottomColor: '#44ad74',
//                                                                 },

//                                                             }}
//                                                         />
//                                                     } fullWidth size="small" value={period} onChange={handlePeriodChange}>
//                                                     <MenuItem value="AM">AM</MenuItem>
//                                                     <MenuItem value="PM">PM</MenuItem>
//                                                 </Select>
//                                             </Grid>
//                                         </Grid>
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Product</Typography>
//                                         <Select
//                                             variant='standard'
//                                             input={
//                                                 <Input
//                                                     disableUnderline={false}
//                                                     sx={{
//                                                         '&:before': {
//                                                             borderBottomWidth: 1.5,
//                                                             borderBottomColor: '#44ad74',
//                                                         },
//                                                         mt: 1,
//                                                     }}
//                                                 />
//                                             }
//                                             fullWidth
//                                             size="small"
//                                             value={selectedOillSeed}
//                                             onChange={(e) => setSelectedOillSeed(e.target.value)}>
//                                             {oilseedOptions.map((option) => (
//                                                 <MenuItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Brand Name</Typography>
//                                         <TextField
//                                             variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 },
//                                             }}
//                                             focused
//                                             value={brandName}
//                                             onChange={(e) => setBrandName(e.target.value)}
//                                             size="small"
//                                             fullWidth />
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Weight</Typography>
//                                         <TextField variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 },
//                                             }}
//                                             focused
//                                             value={weight}
//                                             onChange={(e) => setWeight(e.target.value)}
//                                             size="small"
//                                             fullWidth />
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Percentage</Typography>
//                                         <TextField variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 },
//                                             }}
//                                             focused
//                                             value={percentage}
//                                             onChange={(e) => setPercentage(e.target.value)}
//                                             size="small"
//                                             fullWidth />
//                                     </Box>
//                                 </Grid>

//                                 {/* Right Column */}
//                                 <Grid item xs={6}>
//                                     <Box mt={2}>
//                                         <Typography variant="body2">Production Date</Typography>
//                                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                             <DatePicker
//                                                 value={productiondate ? new Date(productiondate) : null}
//                                                 format="dd-MM-yyyy"
//                                                 onChange={(newValue) => {
//                                                     setProductionDate(newValue);
//                                                     setErrors({ ...errors, productiondate: undefined })
//                                                 }}
//                                                 slotProps={{
//                                                     textField: { size: "small", fullWidth: true, error: !!errors.productiondate, helperText: errors.productiondate },
//                                                 }}
//                                             />
//                                         </LocalizationProvider>
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Machine</Typography>
//                                         <Select variant="standard"
//                                             input={
//                                                 <Input
//                                                     disableUnderline={false}
//                                                     sx={{
//                                                         '&:before': {
//                                                             borderBottomWidth: 1.5,
//                                                             borderBottomColor: '#44ad74',
//                                                         },
//                                                         mt: 0.8,
//                                                     }}
//                                                 />
//                                             } fullWidth size="small" value={selectedMachine || ""} onChange={(e) => setSelectedMachine(e.target.value)}>
//                                             {machineOptions.map((option) => (
//                                                 <MenuItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Machine End Time</Typography>
//                                         <Grid container spacing={2} alignItems="center">
//                                             <Grid item xs={4}>
//                                                 <TextField variant="standard"
//                                                     sx={{
//                                                         '& .MuiInput-underline:after': {
//                                                             borderBottomWidth: 1.5,
//                                                             borderBottomColor: '#44ad74',
//                                                         },
//                                                     }}
//                                                     focused value={endTimeInHour} onChange={(e) => setEndTimeInHour(e.target.value)} fullWidth size="small" placeholder="Hours" />
//                                             </Grid>
//                                             <Grid item xs={1} sx={{ textAlign: "center" }}>
//                                                 <Typography variant="body2"><b>:</b></Typography>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <TextField variant="standard"
//                                                     sx={{
//                                                         '& .MuiInput-underline:after': {
//                                                             borderBottomWidth: 1.5,
//                                                             borderBottomColor: '#44ad74',
//                                                         },
//                                                     }}
//                                                     focused value={endTimeInMin} onChange={(e) => setEndTimeMin(e.target.value)} fullWidth size="small" placeholder="Minutes" />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <Select
//                                                     variant="standard"
//                                                     input={
//                                                         <Input
//                                                             disableUnderline={false}
//                                                             sx={{
//                                                                 '&:before': {
//                                                                     borderBottomWidth: 1.5,
//                                                                     borderBottomColor: '#44ad74',
//                                                                 },

//                                                             }}
//                                                         />
//                                                     }
//                                                     fullWidth
//                                                     size="small"
//                                                     value={endperiod}
//                                                     onChange={handleEndPeriodChange}
//                                                 >
//                                                     <MenuItem value="AM">AM</MenuItem>
//                                                     <MenuItem value="PM">PM</MenuItem>
//                                                 </Select>
//                                             </Grid>
//                                         </Grid>
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Storage</Typography>
//                                         <TextField
//                                             variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 }, mt: 1
//                                             }}
//                                             focused
//                                             value={storage}
//                                             onChange={(e) => setStorage(e.target.value)}
//                                             size="small"

//                                             fullWidth />
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Batch No</Typography>
//                                         <TextField
//                                             variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 },
//                                             }}
//                                             focused
//                                             value={batchno}
//                                             onChange={(e) => setBatchNo(e.target.value)}
//                                             size="small"

//                                             fullWidth />
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Oil Produced (kg)</Typography>
//                                         <TextField
//                                             variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 },
//                                             }}
//                                             focused
//                                             value={oilProduced}
//                                             onChange={(e) => setOilProduced(e.target.value)}
//                                             size="small"

//                                             fullWidth />
//                                     </Box>

//                                     <Box mt={2}>
//                                         <Typography variant="body2">Oil (Lit)</Typography>
//                                         <TextField
//                                             variant="standard"
//                                             sx={{
//                                                 '& .MuiInput-underline:after': {
//                                                     borderBottomWidth: 1.5,
//                                                     borderBottomColor: '#44ad74',
//                                                 },
//                                             }}
//                                             focused
//                                             value={oilInLit}
//                                             onChange={(e) => setOilInLit(e.target.value)}
//                                             size="small"

//                                             fullWidth />
//                                     </Box>
//                                 </Grid>
//                             </Grid>
//                         </Box>

//                         <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//                             <Box>
//                                 <Button sx={{
//                                     background: 'var(--primary-color)',
//                                 }}
//                                     onClick={CreateProductionEntry}
//                                     variant='contained'>Save </Button>
//                             </Box>

//                             <Box>
//                                 <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant='outlined'><b>Cancel</b> </Button>
//                             </Box>
//                         </Box>
//                     </LocalizationProvider>
//                 </Drawer>

//                 {/* edit drawer */}
//                 <Drawer
//                     anchor="right"
//                     open={isEditDrawerOpen}
//                     onClose={handleEditDrawerClose}
//                     PaperProps={{
//                         sx: {
//                             borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//                             width: isSmallScreen ? "100%" : "720px",
//                             zIndex: 1000,
//                         },
//                     }}
//                 >
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
//                             <Typography m={2} variant="h6"><b>Update Production Entry</b></Typography>
//                             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleEditDrawerClose} />
//                         </Box>
//                         <Divider />


//                         <Box m={1.5}>
//                             <Grid container spacing={2}>
//                                 {/* Left Column */}
//                                 <Grid item xs={6}>
//                                     <Grid container spacing={2}>
//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Production No</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     },
//                                                 }}
//                                                 focused
//                                                 value={updateproductNo}

//                                                 size="small"
//                                                 placeholder="Enter Product No"
//                                                 fullWidth
//                                             // disabled
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Operator</Typography>
//                                             <Select
//                                                 fullWidth
//                                                 variant="standard"
//                                                 input={
//                                                     <Input
//                                                         disableUnderline={false}
//                                                         sx={{
//                                                             '&:before': {
//                                                                 borderBottomWidth: 1.5,
//                                                                 borderBottomColor: '#44ad74',
//                                                             },
//                                                             mt: 1,
//                                                         }}
//                                                     />
//                                                 }
//                                                 size="small"
//                                                 value={selectedOperator || ""}
//                                                 onChange={(event) => setSelectedOperator(event.target.value)}
//                                             >
//                                                 {operatorOptions.map((option) => (
//                                                     <MenuItem key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Machine Start Time</Typography>
//                                             <Grid container spacing={1} alignItems="center">
//                                                 <Grid item xs={4}>
//                                                     <TextField
//                                                         variant="standard"
//                                                         sx={{
//                                                             '& .MuiInput-underline:after': {
//                                                                 borderBottomWidth: 1.5,
//                                                                 borderBottomColor: '#44ad74',
//                                                             }, mt: 1
//                                                         }}
//                                                         focused
//                                                         value={updatestartTimeInHour}
//                                                         onChange={(e) => setUpdateStartTimeInHour(e.target.value)}
//                                                         fullWidth size="small"

//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={1} sx={{ textAlign: "center" }}>
//                                                     <Typography variant="body2"><b>:</b></Typography>
//                                                 </Grid>
//                                                 <Grid item xs={4}>
//                                                     <TextField
//                                                         variant="standard"
//                                                         sx={{
//                                                             '& .MuiInput-underline:after': {
//                                                                 borderBottomWidth: 1.5,
//                                                                 borderBottomColor: '#44ad74',
//                                                             }, mt: 1
//                                                         }}
//                                                         focused
//                                                         value={updatestartTimeInMin}
//                                                         onChange={(e) => setUpdateStartTimeMin(e.target.value)}
//                                                         fullWidth size="small"

//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={3}>
//                                                     <Select
//                                                         fullWidth
//                                                         variant="standard"
//                                                         input={
//                                                             <Input
//                                                                 disableUnderline={false}
//                                                                 sx={{
//                                                                     '&:before': {
//                                                                         borderBottomWidth: 1.5,
//                                                                         borderBottomColor: '#44ad74',
//                                                                     }, mt: 1

//                                                                 }}
//                                                             />
//                                                         }
//                                                         size="small"
//                                                         value={updatestartperiod}
//                                                         onChange={handleUpadatStartPeriodChange}
//                                                     >
//                                                         <MenuItem value="AM">AM</MenuItem>
//                                                         <MenuItem value="PM">PM</MenuItem>
//                                                     </Select>
//                                                 </Grid>
//                                             </Grid>
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Product</Typography>
//                                             <Select
//                                                 fullWidth
//                                                 variant="standard"
//                                                 input={
//                                                     <Input
//                                                         disableUnderline={false}
//                                                         sx={{
//                                                             '&:before': {
//                                                                 borderBottomWidth: 1.5,
//                                                                 borderBottomColor: '#44ad74',
//                                                             }, mt: 1

//                                                         }}
//                                                     />
//                                                 }
//                                                 size='small'
//                                                 value={selectedOillSeed || ""}
//                                                 onChange={(event) => setSelectedOillSeed(event.target.value)}
//                                             >
//                                                 {oilseedOptions.map((option) => (
//                                                     <MenuItem key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Brand Name</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1
//                                                 }}
//                                                 focused
//                                                 value={updatebrandName}
//                                                 onChange={(e) => setupdateBrandName(e.target.value)}
//                                                 size="small"

//                                                 fullWidth
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Weight</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1
//                                                 }}
//                                                 focused
//                                                 value={updateweight}
//                                                 onChange={(e) => setupdateWeight(e.target.value)}
//                                                 size="small"

//                                                 fullWidth
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Percentage</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1
//                                                 }}
//                                                 focused
//                                                 value={updatepercentage}
//                                                 onChange={(e) => setUpdatePercentage(e.target.value)}
//                                                 size="small"

//                                                 fullWidth
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>

//                                 {/* Right Column */}
//                                 <Grid item xs={6}>
//                                     <Grid container spacing={2}>
//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Production Date</Typography>
//                                             <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                                 <DatePicker
//                                                     value={updateProductiondate ? new Date(updateProductiondate) : null}
//                                                     onChange={(newValue) => setUpdateProductionDate(newValue)}
//                                                     slotProps={{
//                                                         textField: { size: "small", fullWidth: true },
//                                                     }}
//                                                 />
//                                             </LocalizationProvider>
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Machine</Typography>
//                                             <Autocomplete

//                                                 fullWidth
//                                                 size="small"
//                                                 options={machineOptions}
//                                                 getOptionLabel={(option) => option.label}
//                                                 value={machineOptions.find((option) => option.value === selectedMachine) || null}
//                                                 onChange={(_, newValue) => setSelectedMachine(newValue ? newValue.value : "")}
//                                                 renderInput={(params) => <TextField {...params} variant="standard" sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     },
//                                                 }}
//                                                     focused />}
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Machine End Time</Typography>
//                                             <Grid container spacing={1} alignItems="center">
//                                                 <Grid item xs={4}>
//                                                     <TextField
//                                                         variant="standard"
//                                                         sx={{
//                                                             '& .MuiInput-underline:after': {
//                                                                 borderBottomWidth: 1.5,
//                                                                 borderBottomColor: '#44ad74',
//                                                             },
//                                                         }}
//                                                         focused
//                                                         value={updateendTimeInHour}
//                                                         onChange={(e) => setUpdateEndTimeInHour(e.target.value)}
//                                                         fullWidth
//                                                         size="small"
//                                                         placeholder="Hours"
//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={1} sx={{ textAlign: "center" }}>
//                                                     <Typography variant="body2"><b>:</b></Typography>
//                                                 </Grid>
//                                                 <Grid item xs={4}>
//                                                     <TextField
//                                                         variant="standard"
//                                                         sx={{
//                                                             '& .MuiInput-underline:after': {
//                                                                 borderBottomWidth: 1.5,
//                                                                 borderBottomColor: '#44ad74',
//                                                             },
//                                                         }}
//                                                         focused
//                                                         value={updateendTimeInMin}
//                                                         onChange={(e) => setUpdateEndTimeMin(e.target.value)}
//                                                         fullWidth
//                                                         size="small"
//                                                         placeholder="Minutes"
//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={3}>
//                                                     <Select
//                                                         fullWidth
//                                                         variant="standard"
//                                                         input={
//                                                             <Input
//                                                                 disableUnderline={false}
//                                                                 sx={{
//                                                                     '&:before': {
//                                                                         borderBottomWidth: 1.5,
//                                                                         borderBottomColor: '#44ad74',
//                                                                     },

//                                                                 }}
//                                                             />
//                                                         }
//                                                         size="small"
//                                                         value={updateendperiod}
//                                                         onChange={handleUpadateEndPeriodChange}
//                                                     >
//                                                         <MenuItem value="AM">AM</MenuItem>
//                                                         <MenuItem value="PM">PM</MenuItem>
//                                                     </Select>
//                                                 </Grid>
//                                             </Grid>
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Storage</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1.8
//                                                 }}
//                                                 focused
//                                                 value={updatestorage}
//                                                 onChange={(e) => setupdateStorage(e.target.value)}
//                                                 size="small"

//                                                 fullWidth
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Batch No</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1
//                                                 }}
//                                                 focused
//                                                 value={updatebatchno}
//                                                 onChange={(e) => setupdateBatchNo(e.target.value)}
//                                                 size="small"

//                                                 fullWidth
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Oil Produced (kg)</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1
//                                                 }}
//                                                 focused
//                                                 value={updateoilProduced}
//                                                 onChange={(e) => setupdateOilProduced(e.target.value)}
//                                                 size="small"
//                                                 placeholder="Enter Oil Produced"
//                                                 fullWidth
//                                             />
//                                         </Grid>

//                                         <Grid item xs={12}>
//                                             <Typography variant="body2">Oil (Lit)</Typography>
//                                             <TextField
//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1
//                                                 }}
//                                                 focused
//                                                 value={updateoilInLit}
//                                                 onChange={(e) => setupdateOilInLit(e.target.value)}
//                                                 size="small"
//                                                 placeholder="Enter Oil (Lit)"
//                                                 fullWidth
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                         </Box>

//                         <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//                             <Box>
//                                 <Button sx={{
//                                     background: 'var(--primary-color)',
//                                 }}
//                                     onClick={UpdateProductionEntry}
//                                     variant='contained'

//                                 >Save </Button>
//                             </Box>

//                             <Box>
//                                 <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleEditDrawerClose} variant='outlined'><b>Cancel</b> </Button>
//                             </Box>
//                         </Box>
//                     </LocalizationProvider>
//                 </Drawer>


//             </Box>

//         </Box>
//     )
// }

// export default ProductionEntry



import React, { useMemo, useState, useEffect } from 'react'
import { Grid, Autocomplete, FormControl, useMediaQuery, Box, Button, IconButton, Typography, TextField, Drawer, Divider, Select, MenuItem, Menu } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import { toast } from "react-toastify";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import dayjs from "dayjs";
import Cookies from 'js-cookie';
import { Input } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
const ProductionEntry = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        handleClearTemplate();
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    //table
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);

    const handleMenuOpen = (event, row) => {

        // setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMenuOpen(false);
    };
    const [idwiseData, setIdwiseData] = useState('')

    //for machine start time
    const getTimeParts = (data) => {
        let [datepart, timepart] = data.split(" ");
        let [hour, minute] = timepart.split(":");
        // Determine AM/PM and convert to 12-hour format
        let period = hour < 12 ? "AM" : "PM";
        let hr = hour < 12 ? hour : (hour - 12);
        return {
            date: datepart,
            hour: hr,
            minute: minute,
            period: period,
        };
    };

    //for machine end time
    const getEndTimeParts = (data) => {
        let [datepart, timepart] = data.split(" ");
        let [hour, minute] = timepart.split(":");
        // Determine AM/PM and convert to 12-hour format
        let period = hour < 12 ? "AM" : "PM";
        let hr = hour < 12 ? hour : (hour - 12);

        return {
            date: datepart,
            hour: hr,
            minute: minute,
            period: period,
        };

    };

    const handleEdit = () => {
        if (currentRow) {
            console.log("Editing item with ID:", currentRow.original);

            let updatedproductionDate = currentRow.original.ProductionDate.date || null;
            console.log('updatedproductionDate', updatedproductionDate)
            const updatedproductionDateObject = updatedproductionDate
                ? dayjs(updatedproductionDate).format("YYYY-MM-DD")
                : null;
            console.log('updatedproductionDateObject', updatedproductionDateObject)

            const startTimeParts = getTimeParts(currentRow.original.MachineStartTime.date);
            console.log('startTimeParts', startTimeParts)

            const endTimeParts = getEndTimeParts(currentRow.original.MachineEndTime.date);
            console.log('endTimeParts', endTimeParts)

            setIdwiseData(currentRow.original.Id);
            setUpdateProductNo(currentRow.original.ProductionNo);
            setUpdateProductionDate(updatedproductionDateObject);
            // console.log("productionDateObject", formattedupdatedProductionDate)
            setSelectedOperator(currentRow.original.OperatorId);
            setSelectedMachine(currentRow.original.MachineId);
            // setSelectedOillSeed(currentRow.original.MaterialId);
            setSelectedOillSeed(currentRow.original.MaterialId);

            setupdateStorage(currentRow.original.Storage);
            setupdateBrandName(currentRow.original.BrandName);
            setupdateBatchNo(currentRow.original.BatchNo);
            setupdateWeight(currentRow.original.Weight);
            setupdateOilProduced(currentRow.original.OilProduced);
            setUpdatePercentage(currentRow.original.Percentage);
            setupdateOilInLit(currentRow.original.OilInLitre);
            setUpdateStartTimeInHour(startTimeParts.hour)
            setUpdateStartTimeMin(startTimeParts.minute)
            setupdateStartPeriod(startTimeParts.period);
            setupdateMachineStartTime(startTimeParts.hour + ':' + startTimeParts.minute)
            setUpdateEndTimeInHour(endTimeParts.hour)
            setUpdateEndTimeMin(endTimeParts.minute)
            setupdateEndPeriod(endTimeParts.period)
            setupdatemachineEndtime(endTimeParts.hour + ':' + endTimeParts.minute)

            setEditIsDrawerOpen(true)
            handleMenuOpen(true)
            // handleMenuClose();
        }
    };

    const [data, setData] = useState([]);
    const [pageNo, setPageNo] = useState(1)
    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'SrNo',
                header: 'Sr No',
                size: 150,
                Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
              },
          
            {
                accessorKey: 'ProductionNo',
                header: 'Production No',
                size: 150,
            },
            {
                accessorKey: 'ProductionDate.date',
                header: 'Production Date',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

            {

                accessorKey: 'MachineStartTime.date',
                header: 'Machine Start Time',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('hh:mm A')}</span>,

            },
            {
                accessorKey: 'MachineEndTime.date',
                header: 'Machine End Time',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('hh:mm A')}</span>,
            },
            // {
            //     accessorKey: 'OilSeedId',
            //     header: 'Oil seed',
            //     size: 150,
            // },

            {
                accessorKey: 'Storage',
                header: 'Storage',
                size: 150,
            },

            {
                accessorKey: 'BrandName',
                header: 'Brand Name',
                size: 150,
            },
            {
                accessorKey: 'BatchNo',
                header: 'Batch No',
                size: 150,
            },
            {
                accessorKey: 'Weight',
                header: 'Weight',
                size: 150,
            },
            {
                accessorKey: 'OilProduced',
                header: 'Oil Produced(Kg)',
                size: 150,
            },
            {
                accessorKey: 'Percentage',
                header: 'Percentage',
                size: 150,
            },
            {
                accessorKey: 'OilInLitre',
                header: 'Oil(L)',
                size: 150,
            },

            // {
            //     id: 'actions',
            //     header: 'Actions',
            //     size: 150,
            //     Cell: ({ row }) => (
            //         <IconButton
            //             onClick={(event) => handleMenuOpen(event, row)} // Open the menu on click
            //         >
            //             <MoreVertIcon />
            //         </IconButton>
            //     ),

            // },
        ];
    }, []);

    //integration
    const [productNo, setProductNo] = useState('');
    const [updateproductNo, setUpdateProductNo] = useState('');
    const [productiondate, setProductionDate] = useState(null);
    const [updateProductiondate, setUpdateProductionDate] = useState(null);

    const [machinestarttime, SetMachineStartTime] = useState(null)
    const [updatemachinestarttime, setupdateMachineStartTime] = useState('')
    const [machineEndtime, SetMachineEndTime] = useState(null)
    const [updatemachineEndtime, setupdatemachineEndtime] = useState('')
    const [storage, setStorage] = useState('')
    const [updatestorage, setupdateStorage] = useState('')
    const [brandName, setBrandName] = useState('')
    const [updatebrandName, setupdateBrandName] = useState('')
    const [batchno, setBatchNo] = useState('')
    const [updatebatchno, setupdateBatchNo] = useState('')
    const [weight, setWeight] = useState('')
    const [updateweight, setupdateWeight] = useState('')
    const [oilProduced, setOilProduced] = useState('')
    const [updateoilProduced, setupdateOilProduced] = useState('')
    const [percentage, setPercentage] = useState('')
    const [updatepercentage, setUpdatePercentage] = useState('')
    const [oilInLit, setOilInLit] = useState('')
    const [updateoilInLit, setupdateOilInLit] = useState('')
    const [startTimeInHour, setStartTimeInHour] = useState('')
    const [startTimeInMin, setStartTimeMin] = useState('')
    const [period, setPeriod] = useState('')
    // 
    const [endTimeInHour, setEndTimeInHour] = useState('')
    const [endTimeInMin, setEndTimeMin] = useState('')
    const [endperiod, setEndPeriod] = useState('')


    const handleEndPeriodChange = (e) => {
        const selectedPeriod = e.target.value;
        setEndPeriod(selectedPeriod);

        let formattedTime;
        if (selectedPeriod === "AM") {
            formattedTime = endTimeInHour + ":" + endTimeInMin;
        } else {
            formattedTime = (parseInt(endTimeInHour, 10) + 12) + ":" + endTimeInMin;
        }

        //console.log("Selected Time:", formattedTime);
        SetMachineEndTime(formattedTime)
    };


    //update



    const [updateendperiod, setupdateEndPeriod] = useState('')

    const handleUpadateEndPeriodChange = (e) => {
        const selectedPeriod = e.target.value;
        setupdateEndPeriod(selectedPeriod);

        // let formattedTime;
        // if (selectedPeriod === "AM") {
        //     formattedTime = updateendTimeInHour + ":" + updateendTimeInMin;
        // } else {
        //     formattedTime = (parseInt(updateendTimeInHour, 10) + 12) + ":" + updateendTimeInMin;
        // }

        //console.log("Selected Time:", formattedTime);
        // setupdatemachineEndtime(formattedTime)
    };

    //
    const [updatestartperiod, setupdateStartPeriod] = useState('')

    const handleUpadatStartPeriodChange = (e) => {
        const selectedPeriod = e.target.value;
        setupdateStartPeriod(selectedPeriod);
        console.log(selectedPeriod)
        // let formattedTime;
        // if (selectedPeriod === "AM") {
        //     formattedTime = updatestartTimeInHour + ":" + updateendTimeInMin;
        // } else {
        //     formattedTime = (parseInt(updatestartTimeInHour, 10) + 12) + ":" + updateendTimeInMin;
        // }

        // console.log("Selected Time:", formattedTime);
        // setupdateMachineStartTime(formattedTime)
    };


    //for  Operator
    const [operatorOptions, setOperatorOptions] = useState([]);
    const [selectedOperator, setSelectedOperator] = useState("");

    const fetchAccounts = async () => {
        try {
            const response = await axios.get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=operators");
            const opratorOptions = response.data.map((operator) => ({
                value: operator.Id,
                label: operator.OperatorName,
            }));
            setOperatorOptions(opratorOptions);
        } catch (error) {

        }
    };

    //for Machines
    const [machineOptions, setMachineOptions] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState("");

    const fetchMachines = async () => {
        try {
            const response = await axios.get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=machines");
            const machineOptions = response.data.map((machine) => ({
                value: machine.Id,
                label: machine.MachineName,
            }));
            setMachineOptions(machineOptions);
        } catch (error) {

        }
    };

    //for Oillseed
    const [oilseedOptions, setOilSeedOptions] = useState([]);
    const [selectedOillSeed, setSelectedOillSeed] = useState("");

    const fetchOilseed = async () => {
        try {

            const response = await axios.get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=materialmaster");
            //console.log(response.data)
            const oil = response.data.map((oilseed) => ({
                value: oilseed.Id,
                label: oilseed.MaterialName,
            }));
            setOilSeedOptions(oil);
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchMachines();
        fetchOilseed()
    }, []);


    const handleClearTemplate = () => {
        setProductNo('');
        setProductionDate('');
        setSelectedOperator('');
        setSelectedMachine('');
        SetMachineStartTime('');
        SetMachineEndTime('');
        setSelectedOillSeed('');
        setStorage('');
        setBrandName('');
        setBatchNo('');
        setWeight('');
        setOilProduced('');
        setPercentage('');
        setOilInLit('');
        setErrors('')
    }


    const CreateProductionEntry = () => {

        if (!validateForm()) {
            return;
        }


        // const formattedProductionDate = moment(productiondate).format("YYYY-MM-DD");
        let productionDate = productiondate || null;
        // console.log('productionDate', productionDate)
        const productionDateObject = productionDate
            ? dayjs(productionDate).format("YYYY-MM-DD")
            : null;
        // console.log('productionDateObject', productionDateObject)

        const urlencoded = new URLSearchParams();
        urlencoded.append("ProductionNo", productNo);
        urlencoded.append("ProductionDate", productionDateObject);
        urlencoded.append("OperatorId", selectedOperator);
        // urlencoded.append("MaterialId", selectedOillSeed);
        urlencoded.append("MaterialId", selectedOillSeed);
        urlencoded.append("Storage", storage);
        urlencoded.append("BrandName", brandName);
        urlencoded.append("BatchNo", batchno);
        urlencoded.append("MachineId", selectedMachine);
        urlencoded.append("MachineStartTime", machinestarttime);
        urlencoded.append("Weight", weight);
        urlencoded.append("OilProduced", oilProduced);
        urlencoded.append("Percentage", percentage);
        urlencoded.append("OilInLitre", oilInLit);
        urlencoded.append("MachineEndTime", machineEndtime);

        const requestOptions = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        axios.post(
            "https://arohanagroapi.microtechsolutions.co.in/php/postproduction.php",
            urlencoded,
            requestOptions
        )
            .then((response) => {
                console.log("API Response:", response.data);
                toast.success("Production Entry created successfully");
                handleClearTemplate();
                handleDrawerClose()
                fetchData();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    //tble data
     const [totalPages, setTotalPages] = useState(1);
    const fetchData = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        try {
            const response = await fetch(`https://arohanagroapi.microtechsolutions.co.in/php/get/gettblpage.php?Table=production&PageNo=${pageNo}`, requestOptions);
            // const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=production", requestOptions);
            const result = await response.json();

            // console.log("Fetched result:", result);

            setData(result.data);
            setTotalPages(result.total_pages)
        } catch (error) {
            console.error(error);
        }
    };
    // console.log("result", data);
    useEffect(() => {
        fetchData();
    }, [pageNo]);

    const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);
    const handleEditDrawerOpen = () => {
        handleEdit()
        setEditIsDrawerOpen(true);
        handleMenuOpen(false)

    };

    const handleEditDrawerClose = () => {
        setEditIsDrawerOpen(false);
    };
    // console.log(idwiseData)

    //update 
    // const UpdateProductionEntry = () => {
    //     const urlencoded = new URLSearchParams();
    //     urlencoded.append("ProductionNo", updateproductNo);
    //     urlencoded.append("ProductionDate", productiondate);
    //     urlencoded.append("OperatorId", selectedOperator);
    //     urlencoded.append("OilSeedId", selectedOillSeed);
    //     urlencoded.append("Storage", updatestorage);
    //     urlencoded.append("BrandName", updatebrandName);
    //     urlencoded.append("BatchNo", updatebatchno);
    //     urlencoded.append("MachineId", selectedMachine);
    //     urlencoded.append("MachineStartTime", updatemachinestarttime);
    //     urlencoded.append("Weight", updateweight);
    //     urlencoded.append("OilProduced", updateoilProduced);
    //     urlencoded.append("Percentage", updatepercentage);
    //     urlencoded.append("OilInLitre", updateoilInLit);
    //     urlencoded.append("MachineEndTime", updatemachineEndtime);
    //     urlencoded.append("Id", idwiseData);
    //     const requestOptions = {
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //     };

    //     axios
    //         .post(
    //             "https://arohanagroapi.microtechsolutions.co.in/php/updateproductmaster.php",
    //             urlencoded,
    //             requestOptions
    //         )
    //         .then((response) => {
    //             console.log("UpdateProductionEntry:", response.data);
    //             handleEditDrawerClose()
    //             toast.success("Product Master Updated successfully");
    //         })
    //         .catch((error) => {
    //             console.error("Error:", error);
    //         });
    // };
    // const [ProductionDate, setProductiondate] = useState(null);

    const UpdateProductionEntry = () => {
        const formattedProductiondate = moment(updateProductiondate).format("YYYY-MM-DD");
        const qs = require('qs');
        let formattedTime;
        if (updatestartperiod === "AM") {
            formattedTime = updatestartTimeInHour + ":" + updatestartTimeInMin;
        } else {
            formattedTime = (parseInt(updatestartTimeInHour, 10) + 12) + ":" + updatestartTimeInMin;
        }
        console.log('start', formattedTime, updatestartTimeInHour, updatestartTimeInMin)
        let formattedEndTime;
        if (updateendperiod === "AM") {
            formattedEndTime = updateendTimeInHour + ":" + updateendTimeInMin;
        } else {
            formattedEndTime = (parseInt(updateendTimeInHour, 10) + 12) + ":" + updateendTimeInMin;
        }
        console.log('end', formattedEndTime, updateendTimeInHour, updateendTimeInMin)
        let data = qs.stringify({
            ProductionDate: formattedProductiondate,
            OperatorId: selectedOperator,
            //   MaterialId: selectedOillSeed,
            MaterialId: selectedOillSeed,
            Storage: updatestorage,
            BrandName: updatebrandName,
            BatchNo: updatebatchno,
            MachineId: selectedMachine,
            MachineStartTime: formattedTime,
            Weight: updateweight,
            OilProduced: updateoilProduced,
            Percentage: updatepercentage,
            OilInLitre: updateoilInLit,
            MachineEndTime: formattedEndTime,
            Id: idwiseData
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://arohanagroapi.microtechsolutions.co.in/php/updateproduction.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));

                toast.success("Production Entry updated successfully");
                handleEditDrawerClose()
                fetchData()

            })
            .catch((error) => {
                console.log(error);
            });
    };

    //for delete 
    const DeleteProductionEntry = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        const url = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=production&Id=${currentRow.original.Id}`
        console.log(url)
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                toast.success("Production Entry deleted successfully!");
            })
            .catch((error) => console.error(error));
    }

    const handlePeriodChange = (e) => {
        const selectedPeriod = e.target.value;
        setPeriod(selectedPeriod);

        let formattedTime;
        if (selectedPeriod === "AM") {
            formattedTime = startTimeInHour + ":" + startTimeInMin;
        } else {
            formattedTime = (parseInt(startTimeInHour, 10) + 12) + ":" + startTimeInMin;
        }

        //console.log("Selected Time:", formattedTime);
        SetMachineStartTime(formattedTime)
    };

    //update start
    const [updatestartTimeInHour, setUpdateStartTimeInHour] = useState('')
    const [updatestartTimeInMin, setUpdateStartTimeMin] = useState('')
    //
    const [updateendTimeInHour, setUpdateEndTimeInHour] = useState('')
    const [updateendTimeInMin, setUpdateEndTimeMin] = useState('')


    //validation
    const [errors, setErrors] = useState({
        productiondate: '',
        selectedOperator: '',
        selectedMachine: '',
        startTimeInHour: '',
        startTimeInMin: '',
        selectedOillSeed: '',
        brandName: "",
        weight: '',
        Percentage: '',
        endTimeInHour: '',
        endTimeInMin: '',
        storage: '',
        batchno: '',
        oilProduced: '',
        oilInLit: ''
    })


    const validateForm = () => {
        const newErrors = {
            productiondate: '',
            selectedMachine: '',
            startTimeInHour: '',
            startTimeInMin: '',
            selectedOillSeed: '',
            brandName: "",
            weight: '',
            percentage: '',
            endTimeInHour: '',
            endTimeInMin: '',
            storage: '',
            batchno: '',
            oilProduced: '',
            oilInLit: ''
        };

        let isValid = true;

        if (!productiondate) {
            newErrors.productiondate = 'productiondate  is required';
            isValid = false;
        } else {
            // Convert dates to Date objects for comparison
            const productiondateObj = new Date(productiondate);
            const fromDateObj = new Date(fromdate);
            const toDateObj = new Date(todate);

            // Check if invoice date is before from date
            if (productiondateObj < fromDateObj) {
                newErrors.productiondate = `productiondate  cannot be before ${new Date(fromdate).toLocaleDateString()}`;
                isValid = false;
            }
            // Check if invoice date is after to date
            else if (productiondateObj > toDateObj) {
                newErrors.productiondate = `productiondate cannot be after ${new Date(todate).toLocaleDateString()}`;
                isValid = false;
            }
        };

        if (!selectedOperator) {
            newErrors.selectedOperator = 'Operator is required';
            isValid = false;
        }

        if (!selectedMachine) {
            newErrors.selectedMachine = 'selectedMachine is required';
            isValid = false;
        }

        if (!startTimeInHour) {
            newErrors.startTimeInHour = 'startTimeInHour is required';
            isValid = false;
        }

        if (!startTimeInMin) {
            newErrors.startTimeInMin = 'startTimeInMin is required';
            isValid = false;
        }

        if (!selectedOillSeed) {
            newErrors.selectedOillSeed = 'Product is required';
            isValid = false;
        }

        if (!brandName) {
            newErrors.brandName = 'brandName is required';
            isValid = false;
        }

        if (!weight) {
            newErrors.weight = 'weight is required';
            isValid = false;
        }

        //
        if (!percentage) {
            newErrors.percentage = 'Percentage is required';
            isValid = false;
        }

        if (!endTimeInHour) {
            newErrors.endTimeInHour = 'endTimeInHour is required';
            isValid = false;
        }

        if (!endTimeInMin) {
            newErrors.endTimeInMin = 'endTimeInMin is required';
            isValid = false;
        }

        if (!storage) {
            newErrors.storage = 'storage is required';
            isValid = false;
        }

        if (!batchno) {
            newErrors.batchno = 'batchno is required';
            isValid = false;
        }


        if (!oilProduced) {
            newErrors.oilProduced = 'oilProduced is required';
            isValid = false;
        }

        if (!oilInLit) {
            newErrors.oilInLit = 'oilInLit is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    // for yearId
    const [yearid, setYearId] = useState('');
    const [fromdate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');

    useEffect(() => {
        const storedYearId = Cookies.get("YearId");
        const storedfromdate = Cookies.get("FromDate");
        const storedtodate = Cookies.get("ToDate");

        if (storedYearId) {
            setYearId(storedYearId);
            console.log('storedYearId', storedYearId);
        } else {
            toast.error("Year is not set.");
        };
        if (storedfromdate) {
            setFromDate(storedfromdate);
            console.log('storedfromdate', storedfromdate);
        } else {
            toast.error("FromDate is not set.");
        }

        if (storedtodate) {
            setToDate(storedtodate);
            console.log('storedTodate', storedtodate);
        } else {
            toast.error("ToDate is not set.");
        }

    }, [yearid, fromdate, todate]);


    return (
        <Box>
            <Box textAlign={'center'}>
                <Typography color='var(--complementary-color)' variant='h4'><b>Production Entry</b></Typography>
            </Box>
            <Box sx={{ p: 5, height: 'auto' }}>


                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Production Entry </Button>
                </Box>


                {/* <Box mt={4}>
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        muiTableHeadCellProps={{
                            sx: {

                                color: 'var(--primary-color)',

                            },
                        }}
                    />
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={handleEditDrawerOpen}
                        >Edit
                        </MenuItem>
                        <MenuItem
                            onClick={DeleteProductionEntry}
                        >
                            Delete
                        </MenuItem>
                    </Menu>
                </Box> */}
                <MaterialReactTable
                    columns={columns}
                    data={data}  // Make sure this is your data source
                    enablePagination={false}
                    muiTableHeadCellProps={{
                        sx: {
                            backgroundColor: '#E9ECEF',
                            color: 'black',
                            fontSize: '16px',
                        },
                    }}
                    muiTableBodyRowProps={({ row }) => ({
                        onClick: () => {
                             setCurrentRow(row);
                            handleEdit(row);
                        },
                        sx: {
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        },
                    })}
  renderBottomToolbarCustomActions={() => (
            <Box
              mt={2}
              alignItems="center"
              display="flex"
              justifyContent="flex-end"
              width="100%"
            >
              <FirstPageIcon sx={{ cursor: 'pointer' }} onClick={() => setPageNo(1)} />
              <KeyboardArrowLeftIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo((prev) => Math.max(Number(prev) - 1, 1))}
              />
              <Box ml={1}> Page No </Box>
              <TextField
                sx={{
                  width: '4.5%',
                  ml: 1,
                  '@media (max-width: 768px)': {
                    width: '10%',
                  },
                }}
                value={pageNo}
                onChange={(e) => setPageNo(e.target.value)}
                size="small"
              />
              <KeyboardArrowRightIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo((prev) => Number(prev) + 1)}
              />
              <LastPageIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo(totalPages)}
              />
              <Box ml={1}>Total Pages: {totalPages}</Box>
            </Box>
          )}

                />

                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={handleDrawerClose}
                    PaperProps={{
                        sx: {
                            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : "720px",
                            zIndex: 1000,
                        },
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
                            <Typography m={2} variant="h6"><b>Create Production Entry</b></Typography>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />


                        </Box>
                        <Divider />


                        <Box m={1.5}>
                            <Grid container spacing={2} alignItems="start">
                                {/* Left Column */}
                                <Grid item xs={6}>
                                    <Box mt={2}>
                                        <Typography variant="body2">Production No</Typography>
                                        <TextField
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                }, mt: 1
                                            }}
                                            focused
                                            value={productNo}
                                            placeholder='Production Number'
                                            // disabled
                                            // onChange={(e) => setProductNo(e.target.value)}
                                            size="small"
                                            fullWidth
                                        />
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Operator</Typography>

                                        <Select
                                            variant="standard"
                                            input={
                                                <Input
                                                    disableUnderline={false}
                                                    sx={{
                                                        '&:before': {
                                                            borderBottomWidth: 1.5,
                                                            borderBottomColor: '#44ad74',
                                                        },
                                                        mt: 1,
                                                    }}
                                                />
                                            }
                                            focused
                                            fullWidth
                                            size="small"
                                            value={selectedOperator || ""}
                                            onChange={(e) => setSelectedOperator(e.target.value)}>


                                            {operatorOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Machine Start Time</Typography>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={4}>
                                                <TextField variant="standard"
                                                    sx={{
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomWidth: 1.5,
                                                            borderBottomColor: '#44ad74',
                                                        },
                                                    }}
                                                    focused value={startTimeInHour} onChange={(e) => setStartTimeInHour(e.target.value)} fullWidth size="small" placeholder="Hours" />
                                            </Grid>
                                            <Grid item xs={1} sx={{ textAlign: "center" }}>
                                                <Typography variant="body2"><b>:</b></Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField variant="standard"
                                                    sx={{
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomWidth: 1.5,
                                                            borderBottomColor: '#44ad74',
                                                        },
                                                    }}
                                                    focused value={startTimeInMin} onChange={(e) => setStartTimeMin(e.target.value)} fullWidth size="small" placeholder="Minutes" />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Select
                                                    variant="standard"
                                                    input={
                                                        <Input
                                                            disableUnderline={false}
                                                            sx={{
                                                                '&:before': {
                                                                    borderBottomWidth: 1.5,
                                                                    borderBottomColor: '#44ad74',
                                                                },

                                                            }}
                                                        />
                                                    } fullWidth size="small" value={period} onChange={handlePeriodChange}>
                                                    <MenuItem value="AM">AM</MenuItem>
                                                    <MenuItem value="PM">PM</MenuItem>
                                                </Select>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Product</Typography>
                                        <Select
                                            variant='standard'
                                            input={
                                                <Input
                                                    disableUnderline={false}
                                                    sx={{
                                                        '&:before': {
                                                            borderBottomWidth: 1.5,
                                                            borderBottomColor: '#44ad74',
                                                        },
                                                        mt: 1,
                                                    }}
                                                />
                                            }
                                            fullWidth
                                            size="small"
                                            value={selectedOillSeed}
                                            onChange={(e) => setSelectedOillSeed(e.target.value)}>
                                            {oilseedOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Brand Name</Typography>
                                        <TextField
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                },
                                            }}
                                            focused
                                            value={brandName}
                                            onChange={(e) => setBrandName(e.target.value)}
                                            size="small"
                                            fullWidth />
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Weight</Typography>
                                        <TextField variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                },
                                            }}
                                            focused
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            size="small"
                                            fullWidth />
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Percentage</Typography>
                                        <TextField variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                },
                                            }}
                                            focused
                                            value={percentage}
                                            onChange={(e) => setPercentage(e.target.value)}
                                            size="small"
                                            fullWidth />
                                    </Box>
                                </Grid>

                                {/* Right Column */}
                                <Grid item xs={6}>
                                    <Box mt={2}>
                                        <Typography variant="body2">Production Date</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={productiondate ? new Date(productiondate) : null}
                                                format="dd-MM-yyyy"
                                                onChange={(newValue) => {
                                                    setProductionDate(newValue);
                                                    setErrors({ ...errors, productiondate: undefined })
                                                }}
                                                slotProps={{
                                                    textField: { size: "small", fullWidth: true, error: !!errors.productiondate, helperText: errors.productiondate },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Machine</Typography>
                                        <Select variant="standard"
                                            input={
                                                <Input
                                                    disableUnderline={false}
                                                    sx={{
                                                        '&:before': {
                                                            borderBottomWidth: 1.5,
                                                            borderBottomColor: '#44ad74',
                                                        },
                                                        mt: 0.8,
                                                    }}
                                                />
                                            } fullWidth size="small" value={selectedMachine || ""} onChange={(e) => setSelectedMachine(e.target.value)}>
                                            {machineOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Machine End Time</Typography>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={4}>
                                                <TextField variant="standard"
                                                    sx={{
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomWidth: 1.5,
                                                            borderBottomColor: '#44ad74',
                                                        },
                                                    }}
                                                    focused value={endTimeInHour} onChange={(e) => setEndTimeInHour(e.target.value)} fullWidth size="small" placeholder="Hours" />
                                            </Grid>
                                            <Grid item xs={1} sx={{ textAlign: "center" }}>
                                                <Typography variant="body2"><b>:</b></Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField variant="standard"
                                                    sx={{
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomWidth: 1.5,
                                                            borderBottomColor: '#44ad74',
                                                        },
                                                    }}
                                                    focused value={endTimeInMin} onChange={(e) => setEndTimeMin(e.target.value)} fullWidth size="small" placeholder="Minutes" />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Select
                                                    variant="standard"
                                                    input={
                                                        <Input
                                                            disableUnderline={false}
                                                            sx={{
                                                                '&:before': {
                                                                    borderBottomWidth: 1.5,
                                                                    borderBottomColor: '#44ad74',
                                                                },

                                                            }}
                                                        />
                                                    }
                                                    fullWidth
                                                    size="small"
                                                    value={endperiod}
                                                    onChange={handleEndPeriodChange}
                                                >
                                                    <MenuItem value="AM">AM</MenuItem>
                                                    <MenuItem value="PM">PM</MenuItem>
                                                </Select>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Storage</Typography>
                                        <TextField
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                }, mt: 1
                                            }}
                                            focused
                                            value={storage}
                                            onChange={(e) => setStorage(e.target.value)}
                                            size="small"

                                            fullWidth />
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Batch No</Typography>
                                        <TextField
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                },
                                            }}
                                            focused
                                            value={batchno}
                                            onChange={(e) => setBatchNo(e.target.value)}
                                            size="small"

                                            fullWidth />
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Oil Produced (kg)</Typography>
                                        <TextField
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                },
                                            }}
                                            focused
                                            value={oilProduced}
                                            onChange={(e) => setOilProduced(e.target.value)}
                                            size="small"

                                            fullWidth />
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2">Oil (Lit)</Typography>
                                        <TextField
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomWidth: 1.5,
                                                    borderBottomColor: '#44ad74',
                                                },
                                            }}
                                            focused
                                            value={oilInLit}
                                            onChange={(e) => setOilInLit(e.target.value)}
                                            size="small"

                                            fullWidth />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                            <Box>
                                <Button sx={{
                                    background: 'var(--primary-color)',
                                }}
                                    onClick={CreateProductionEntry}
                                    variant='contained'>Save </Button>
                            </Box>

                            <Box>
                                <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant='outlined'><b>Cancel</b> </Button>
                            </Box>
                        </Box>
                    </LocalizationProvider>
                </Drawer>

                {/* edit drawer */}
                <Drawer
                    anchor="right"
                    open={isEditDrawerOpen}
                    onClose={handleEditDrawerClose}
                    PaperProps={{
                        sx: {
                            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : "720px",
                            zIndex: 1000,
                        },
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
                            <Typography m={2} variant="h6"><b>Update Production Entry</b></Typography>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleEditDrawerClose} />
                        </Box>
                        <Divider />


                        <Box m={1.5}>
                            <Grid container spacing={2}>
                                {/* Left Column */}
                                <Grid item xs={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">Production No</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    },
                                                }}
                                                focused
                                                value={updateproductNo}

                                                size="small"
                                                placeholder="Enter Product No"
                                                fullWidth
                                            // disabled
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Operator</Typography>
                                            <Select
                                                fullWidth
                                                variant="standard"
                                                input={
                                                    <Input
                                                        disableUnderline={false}
                                                        sx={{
                                                            '&:before': {
                                                                borderBottomWidth: 1.5,
                                                                borderBottomColor: '#44ad74',
                                                            },
                                                            mt: 1,
                                                        }}
                                                    />
                                                }
                                                size="small"
                                                value={selectedOperator || ""}
                                                onChange={(event) => setSelectedOperator(event.target.value)}
                                            >
                                                {operatorOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Machine Start Time</Typography>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid item xs={4}>
                                                    <TextField
                                                        variant="standard"
                                                        sx={{
                                                            '& .MuiInput-underline:after': {
                                                                borderBottomWidth: 1.5,
                                                                borderBottomColor: '#44ad74',
                                                            }, mt: 1
                                                        }}
                                                        focused
                                                        value={updatestartTimeInHour}
                                                        onChange={(e) => setUpdateStartTimeInHour(e.target.value)}
                                                        fullWidth size="small"

                                                    />
                                                </Grid>
                                                <Grid item xs={1} sx={{ textAlign: "center" }}>
                                                    <Typography variant="body2"><b>:</b></Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        variant="standard"
                                                        sx={{
                                                            '& .MuiInput-underline:after': {
                                                                borderBottomWidth: 1.5,
                                                                borderBottomColor: '#44ad74',
                                                            }, mt: 1
                                                        }}
                                                        focused
                                                        value={updatestartTimeInMin}
                                                        onChange={(e) => setUpdateStartTimeMin(e.target.value)}
                                                        fullWidth size="small"

                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Select
                                                        fullWidth
                                                        variant="standard"
                                                        input={
                                                            <Input
                                                                disableUnderline={false}
                                                                sx={{
                                                                    '&:before': {
                                                                        borderBottomWidth: 1.5,
                                                                        borderBottomColor: '#44ad74',
                                                                    }, mt: 1

                                                                }}
                                                            />
                                                        }
                                                        size="small"
                                                        value={updatestartperiod}
                                                        onChange={handleUpadatStartPeriodChange}
                                                    >
                                                        <MenuItem value="AM">AM</MenuItem>
                                                        <MenuItem value="PM">PM</MenuItem>
                                                    </Select>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Product</Typography>
                                            <Select
                                                fullWidth
                                                variant="standard"
                                                input={
                                                    <Input
                                                        disableUnderline={false}
                                                        sx={{
                                                            '&:before': {
                                                                borderBottomWidth: 1.5,
                                                                borderBottomColor: '#44ad74',
                                                            }, mt: 1

                                                        }}
                                                    />
                                                }
                                                size='small'
                                                value={selectedOillSeed || ""}
                                                onChange={(event) => setSelectedOillSeed(event.target.value)}
                                            >
                                                {oilseedOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Brand Name</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1
                                                }}
                                                focused
                                                value={updatebrandName}
                                                onChange={(e) => setupdateBrandName(e.target.value)}
                                                size="small"

                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Weight</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1
                                                }}
                                                focused
                                                value={updateweight}
                                                onChange={(e) => setupdateWeight(e.target.value)}
                                                size="small"

                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Percentage</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1
                                                }}
                                                focused
                                                value={updatepercentage}
                                                onChange={(e) => setUpdatePercentage(e.target.value)}
                                                size="small"

                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Right Column */}
                                <Grid item xs={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">Production Date</Typography>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    value={updateProductiondate ? new Date(updateProductiondate) : null}
                                                    onChange={(newValue) => setUpdateProductionDate(newValue)}
                                                    slotProps={{
                                                        textField: { size: "small", fullWidth: true },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Machine</Typography>
                                            <Autocomplete

                                                fullWidth
                                                size="small"
                                                options={machineOptions}
                                                getOptionLabel={(option) => option.label}
                                                value={machineOptions.find((option) => option.value === selectedMachine) || null}
                                                onChange={(_, newValue) => setSelectedMachine(newValue ? newValue.value : "")}
                                                renderInput={(params) => <TextField {...params} variant="standard" sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    },
                                                }}
                                                    focused />}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Machine End Time</Typography>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid item xs={4}>
                                                    <TextField
                                                        variant="standard"
                                                        sx={{
                                                            '& .MuiInput-underline:after': {
                                                                borderBottomWidth: 1.5,
                                                                borderBottomColor: '#44ad74',
                                                            },
                                                        }}
                                                        focused
                                                        value={updateendTimeInHour}
                                                        onChange={(e) => setUpdateEndTimeInHour(e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                        placeholder="Hours"
                                                    />
                                                </Grid>
                                                <Grid item xs={1} sx={{ textAlign: "center" }}>
                                                    <Typography variant="body2"><b>:</b></Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        variant="standard"
                                                        sx={{
                                                            '& .MuiInput-underline:after': {
                                                                borderBottomWidth: 1.5,
                                                                borderBottomColor: '#44ad74',
                                                            },
                                                        }}
                                                        focused
                                                        value={updateendTimeInMin}
                                                        onChange={(e) => setUpdateEndTimeMin(e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                        placeholder="Minutes"
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Select
                                                        fullWidth
                                                        variant="standard"
                                                        input={
                                                            <Input
                                                                disableUnderline={false}
                                                                sx={{
                                                                    '&:before': {
                                                                        borderBottomWidth: 1.5,
                                                                        borderBottomColor: '#44ad74',
                                                                    },

                                                                }}
                                                            />
                                                        }
                                                        size="small"
                                                        value={updateendperiod}
                                                        onChange={handleUpadateEndPeriodChange}
                                                    >
                                                        <MenuItem value="AM">AM</MenuItem>
                                                        <MenuItem value="PM">PM</MenuItem>
                                                    </Select>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Storage</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1.8
                                                }}
                                                focused
                                                value={updatestorage}
                                                onChange={(e) => setupdateStorage(e.target.value)}
                                                size="small"

                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Batch No</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1
                                                }}
                                                focused
                                                value={updatebatchno}
                                                onChange={(e) => setupdateBatchNo(e.target.value)}
                                                size="small"

                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Oil Produced (kg)</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1
                                                }}
                                                focused
                                                value={updateoilProduced}
                                                onChange={(e) => setupdateOilProduced(e.target.value)}
                                                size="small"
                                                placeholder="Enter Oil Produced"
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="body2">Oil (Lit)</Typography>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1
                                                }}
                                                focused
                                                value={updateoilInLit}
                                                onChange={(e) => setupdateOilInLit(e.target.value)}
                                                size="small"
                                                placeholder="Enter Oil (Lit)"
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                            <Box>
                                <Button sx={{
                                    background: 'var(--primary-color)',
                                }}
                                    onClick={UpdateProductionEntry}
                                    variant='contained'

                                >Save </Button>
                            </Box>

                            <Box>
                                <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleEditDrawerClose} variant='outlined'><b>Cancel</b> </Button>
                            </Box>
                        </Box>
                    </LocalizationProvider>
                </Drawer>


            </Box>

        </Box>
    )
}

export default ProductionEntry










































