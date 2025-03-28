
import React, { useMemo, useState, useEffect } from 'react'
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Table, useMediaQuery, Box, Button, IconButton, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, Menu } from '@mui/material';
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
import qs from "qs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {

    useMaterialReactTable,
} from "material-react-table";


const DeliveryChallan = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [challanheaders, setChallanheaders] = useState([]);
    const [challandetails, setChallandetails] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [challanNo, setChallanNo] = useState('');
    const [challanDate, setChallanDate] = useState(null);
    const [batchNo, setBatchNo] = useState(null);
    const [batchDate, setBatchDate] = useState(null);
    const [quentity, setQuantity] = useState(0);
    const [rate, setRate] = useState(0);
    const [amount, setAmount] = useState(0);
    const [vehicleNo, setVehicleNo] = useState('');

    const resetForm = () => {
        setChallanNo('');
        setChallanNo('');
        setChallanDate('');
        setBatchNo('');
        setBatchDate('');
        setQuantity('');
        setRate('');
        setAmount('');
        setVehicleNo('');
        setSelectedLocation('')
        setRows([]);
    };

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);

        setIsEditing(false);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        resetForm();
    };

    //main table
    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'ChallanNo',
                header: 'Challan No',
                size: 150,
            },
            {
                accessorKey: 'ChallanDate.date',
                header: 'Challan Date',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },


            {
                accessorKey: 'Total',
                header: 'Total',
                size: 150,
            },

            {
                accessorKey: 'VehicleNo',
                header: 'VehicleNo',
                size: 150,
            },

        ];
    }, [challanheaders]);

    //for get data in main table and form
    const handleSubmit = (rowData) => {
        // console.log("This row has been clicked:", rowData);
        setRowId(rowData.Id)
        setIsDrawerOpen(true);
        //setIsEditing(false);
        setIsEditing(!!rowData.Id);

        setChallanNo(rowData.ChallanNo)
        setChallanDate(rowData.ChallanDate?.date.split(" ")[0])
        setVehicleNo(rowData.VehicleNo)
        setSelectedLocation(rowData.StoreLocation);
        // console.log("storelocation", rowData.StoreLocation);

        const deliverychallandetail = challandetails.filter(
            (detail) => detail.ChallanId === rowData.Id);
        // console.log('invdetail', deliverychallandetail)

        const mappedRows = deliverychallandetail.map((detail) => ({
            Id: detail.Id,
            InwardId: detail.InwardId,
            ProductId: detail.ProductId,
            BatchNo: detail.BatchNo,
            BatchDate: detail.BatchDate?.date.split(" ")[0],
            Quantity: parseFloat(detail.Quantity) || 0,
            Rate: parseFloat(detail.Rate) || 0,
            Amount: parseFloat(detail.Amount) || 0,
        }));

        // console.log('mappedRows', mappedRows)
        setRows(mappedRows);
    };

    const table = useMaterialReactTable({
        columns,
        data: challanheaders,
        muiTableHeadCellProps: {
            style: {
                backgroundColor: "#E9ECEF",
                color: "black",
                fontSize: "16px",
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => handleSubmit(row.original),
            style: { cursor: "pointer" },
        }),
    });


    ////api to call fetchInwardHeader
    const fetchChallanHeader = async () => {
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=DeliveryChallanHeader"
            );
            setChallanheaders(response.data);
            // console.log('header', response.data)
        } catch (error) { }
    };

    //  api to call fetchInwarddetails
    const fetchChallandetails = async () => {
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=DeliveryChallanDetail"
            );
            setChallandetails(response.data);
            // console.log('detail', response.data)
        } catch (error) { }
    };



    //for Store locations
    const [options, setOptions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState();

    const fetchLocation = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        fetch(
            "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=Branch",
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                // console.log("API Response:", result); // Debugging log
                const storelocationOptions = result.map((storelocation) => ({
                    value: storelocation?.Id || "",
                    label: storelocation?.Storelocation,
                }));

                setOptions(storelocationOptions);

            })
            .catch((error) => console.error("Error fetching Storelocation:", error));
    };


    //for Product
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");

    // const fetchProduct = async () => {
    //     const requestOptions = {
    //         method: "GET",
    //         redirect: "follow",
    //     };

    //     fetch(
    //         "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productmaster",
    //         requestOptions
    //     )
    //         .then((response) => response.json())
    //         .then((result) => {
    //             // console.log("API Response:", result); // Debugging log


    //             const productsOptions = result.map((product) => ({
    //                 value: product?.Id || "",
    //                 label: product?.ProductName,
    //             }));

    //             setProductOptions(productsOptions);

    //         })
    //         .catch((error) => console.error("Error fetching Storelocation:", error));
    // };

    const fetchProduct = async () => {
        try {
            const response = await axios.get(
                'https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productmaster',
            );
            // console.log(response.data);
            processMaterialData(response.data)
        } catch (error) {
            console.error(error);

        }
    };

    const processMaterialData = (data) => {
        if (Array.isArray(data)) {

            const productsOptions = data.map((product) => ({
                value: product?.Id || "",
                label: product?.ProductName,
                purchaseRate: product?.SellPrice,
            }));

            console.log('options', productsOptions)
            setProductOptions(productsOptions);
        }
    };

    useEffect(() => {
        fetchChallanHeader();
        fetchChallandetails();
        fetchLocation();
        fetchProduct();
    }, []);


    //for amount calculation
    const handleQuantityChange = (e) => {
        const qty = e.target.value;
        setQuantity(qty);
        calculateAmount(qty, rate);
    };

    const handleRateChange = (e) => {
        const rt = e.target.value;
        setRate(rt);
        calculateAmount(quentity, rt);
    };

    const calculateAmount = (qty, rt) => {
        const qtyNum = parseFloat(qty) || 0;
        const rateNum = parseFloat(rt) || 0;
        const amt = qtyNum * rateNum;
        setAmount(amt);
    };

    const [rows, setRows] = useState([]);
    //create and update Delivery challan
    const totalAmount = rows.reduce((total, row) => total + (row.Amount || 0), 0).toFixed(2);

    //create and update Inword At Store
    const handleSubmitDelivery = async (e) => {
        e.preventDefault();
        const formattedChallanDate = moment(challanDate).format("YYYY-MM-DD");

        const purchaseheaderdata = {
            Id: rowId,
            ChallanNo: parseInt(challanNo),
            ChallanDate: formattedChallanDate,
            StoreLocation: selectedLocation,
            VehicleNo: vehicleNo,
            Total: totalAmount,
        };
        // console.log("ChallanNo", challanNo)
        // console.log("deliveryheders", challanheaders);
        try {
            const invoiceurl = rowId
                ? "https://arohanagroapi.microtechsolutions.co.in/php/updatedeliverychallanheader.php"
                : "https://arohanagroapi.microtechsolutions.co.in/php/postdeliverychallanheader.php";

            const response = await axios.post(
                invoiceurl,
                qs.stringify(purchaseheaderdata),
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );
            console.log('postchallanheders', response.data)
            let InwardId = rowId ? rowId : parseInt(response.data.ID, 10);
            // console.log("Inward Id ", InwardId);
            console.log("rows", rows);

            for (const row of rows) {
                console.log("this row   ", row);
                const formattedBatchDate = moment(row.BatchDate).format("YYYY-MM-DD");

                const rowData = {
                    Id: parseInt(row.Id, 10),
                    ChallanId: parseInt(InwardId, 10),

                    ProductId: parseInt(row.ProductId, 10),

                    BatchNo: parseInt(row.BatchNo),
                    BatchDate: formattedBatchDate,
                    Quantity: parseFloat(row.Quantity),
                    Rate: parseFloat(row.Rate),
                    Amount: parseInt(row.Amount),
                };
                // console.log("this row has rowData ", rowData);
                const invoicdedetailurl =
                    row.Id
                        ? "https://arohanagroapi.microtechsolutions.co.in/php/updatedeliverychallandetail.php"
                        : "https://arohanagroapi.microtechsolutions.co.in/php/postdeliverychallandetail.php";
                console.log(" invoicdedetailurl is used ", invoicdedetailurl);
                try {
                    const response = await axios.post(
                        invoicdedetailurl,
                        qs.stringify(rowData),
                        {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                        }
                    );
                    console.log("Response:", response);
                } catch (error) {
                    console.error("Error:", error);
                }
                if (isEditing && row.Id) {
                    handleSaveOrAddRow();
                }
            }
            setIsDrawerOpen(false);
            toast.success(
                isEditing
                    ? "Delivery challan detail updated successfully!"
                    : "Delivery challan detail Created successfully!"
            );
            resetForm();
            fetchChallanHeader();
            // console.log("Inword Header Data:", purchaseheaderdata);
        } catch (error) {
            console.error("Error submitting Inword:", error);
        }
    };

    //for drawer table row btn

    const [rowId, setRowId] = useState('');
    //for drawer table menu btn
    const [anchorEl1, setAnchorEl1] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleMenutableOpen = (event, index) => {
        setAnchorEl1(event.currentTarget);
        setSelectedRow(index);
    };

    const handletableMenuClose = () => {
        setAnchorEl1(null);
        setSelectedRow(null);
    };

    //for add data in table after click on Add to table
    const [editingRow, setEditingRow] = useState(null);
    //Add Rows
    const handleAddRow = () => {
        const newRow = {
            ProductId: selectedProduct,
            Quantity: quentity,
            Rate: rate,
            Amount: amount,
            BatchNo: batchNo,
            BatchDate: batchDate,
        };
        // console.log("newRow", newRow);
        // Update rows state and ensure the new row is added to the table
        setRows((prevRows) => [...prevRows, newRow]);
        // console.log("Updated Rows:", rows);
    };


    //for updaterows
    const handleSaveOrAddRow = () => {
        if (editingRow !== null) {
            // Update the existing row
            const updatedRows = [...rows];
            updatedRows[editingRow] = {
                ...updatedRows[editingRow],
                ProductId: selectedProduct,

                Quantity: quentity,
                Rate: rate,
                Amount: amount,
                BatchNo: batchNo,
                BatchDate: batchDate,
            };
            setRows(updatedRows);
            setEditingRow(null);
        }
        else {
            // Add a new row
            handleAddRow();
        }

        // Ensure state is not cleared when editing
    if (editingRow === null) {
        resetFields(); // Clear fields only when adding a new row
      }
    };


    // Function to reset form fields (only for new row addition)
  const resetFields = () => {
    setSelectedProduct("");
   setBatchNo('');
   setBatchDate('');
    setQuantity("");
    setRate("");
    setAmount("");

  };



    //update rows
    const handleEditRow = (index) => {
        const row = rows[index];
        setEditingRow(index);
        setQuantity(row.Quantity || "");
        setRate(row.Rate || "");
        setAmount(row.Amount || "");
        setBatchNo(row.BatchNo);
        setSelectedProduct(row.ProductId);
        setBatchDate(row.BatchDate);
    };


    const handleDeleteRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };


    //for delete Header

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirmDelete = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        console.log("Deleted Id:", rowId);

        fetch(`https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=DeliveryChallanHeader&Id=${rowId}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setOpen(false);
                handleDrawerClose();
                fetchChallanHeader();
                toast.success(
                    "DeliveryChallan Deleted successfully!"
                );
            })
            .catch((error) => console.error(error));
    };


    return (
        <Box>
            <Box textAlign={'center'}>
                <Typography color='var(--complementary-color)' variant='h4'><b>Delivery Challan At Godown</b></Typography>
            </Box>
            <Box sx={{ p: 5, height: 'auto' }}>

                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Delivery Challan </Button>
                </Box>

                {/* main table */}
                <Box mt={4}>
                    <MaterialReactTable table={table}
                        enableColumnResizing
                        muiTableHeadCellProps={{
                            sx: { color: 'var(--primary-color)', },
                        }}
                    />
                </Box>

                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={handleDrawerClose}
                    PaperProps={{
                        sx: {
                            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : "65%",
                            zIndex: 1000,
                        },
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>

                            <Typography m={2} fontWeight="bold" variant="h6">
                                {isEditing ? "Update Delivery Challan At Godown" : "Create Delivery Challan At Godown"}
                            </Typography>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                        </Box>
                        <Divider />

                        <Box>
                            <Box display={'flex'} alignItems={'center'} mt={2} m={2} gap={2} >
                                <Box flex={1} >
                                    <Box >
                                        <Typography variant="body2">Challan No</Typography>
                                        <TextField
                                            value={challanNo}
                                            disabled
                                            onChange={(e) => setChallanNo(e.target.value)}
                                            size="small"
                                            fullWidth />
                                    </Box>
                                </Box>


                                <Box flex={1} >
                                    <Box>
                                        <Typography variant="body2">Challan Date</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={challanDate ? new Date(challanDate) : null}
                                                format="dd-MM-yyyy"
                                                onChange={(newValue) => setChallanDate(newValue)}
                                                slotProps={{
                                                    textField: { size: "small", fullWidth: true },
                                                }}
                                                renderInput={(params) => <TextField />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>


                                <Box flex={1} >
                                    <Typography variant="body2">VehicalNo</Typography>
                                    <TextField
                                        value={vehicleNo}
                                        onChange={(e) => setVehicleNo(e.target.value)}
                                        size="small" fullWidth placeholder='VehicalNo' />
                                </Box>



                            </Box>

                            <Box m={2} >
                                <Typography variant="body2">Store Location</Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={selectedLocation || ""}
                                        onChange={(event) => setSelectedLocation(event.target.value)}
                                    >
                                        {options.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, m: 2 }}>
                                {/* First Row: Product, Batch No, Batch Date */}
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography>Product</Typography>
                                        <FormControl fullWidth size="small">
                                            {/*                                     
                                            <Select
                                                fullWidth
                                                size="small"
                                                value={selectedProduct || ""}
                                                onChange={(event) => {
                                                    const selectedValue = event.target.value;
                                                    const selectedItem = productOptions.find(option => option.value.toString() === selectedValue);

                                                    if (selectedItem) {
                                                        setSelectedProduct(selectedItem.value);
                                                        setRate(selectedItem.purchaseRate);
                                                        console.log("Selected Product:", selectedItem.label);
                                                        console.log("Purchase Rate:", selectedItem.purchaseRate);

                                                        // Recalculate the amount with the existing quantity
                                                        calculateAmount(quentity, selectedItem.purchaseRate);
                                                    }
                                                }}
                                            >
                                                {productOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value.toString()}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select> */}

                                            <Autocomplete
                                                fullWidth
                                                size="small"
                                                options={productOptions}
                                                value={productOptions.find(option => option.value.toString() === selectedProduct?.toString()) || null}
                                                getOptionLabel={(option) => option.label}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        setSelectedProduct(newValue.value);
                                                        setRate(newValue.purchaseRate);
                                                        console.log("Selected Product:", newValue.label);
                                                        console.log("Purchase Rate:", newValue.purchaseRate);

                                                        // Recalculate the amount with the existing quantity
                                                        calculateAmount(quentity, newValue.purchaseRate);
                                                    } else {
                                                        setSelectedProduct(null);
                                                        setRate(0);
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" />
                                                )}
                                                isOptionEqualToValue={(option, value) => option.value.toString() === value?.toString()}
                                            />


                                        </FormControl>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2">Batch No</Typography>
                                        <TextField
                                            value={batchNo}
                                            onChange={(e) => setBatchNo(e.target.value)}
                                            size="small"
                                            fullWidth
                                            placeholder="Batch No"
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2">Batch Date</Typography>
                                        <DatePicker
                                            value={batchDate ? new Date(batchDate) : null}
                                            format="dd-MM-yyyy"
                                            onChange={(newValue) => setBatchDate(newValue)}
                                            slotProps={{
                                                textField: { size: "small", fullWidth: true },
                                            }}
                                        />
                                    </Box>
                                </Box>

                                {/* Second Row: Quantity, Rate, Amount */}
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2">Quantity</Typography>
                                        <TextField
                                            value={quentity}
                                            onChange={handleQuantityChange}
                                            size="small"
                                            fullWidth
                                            placeholder="Quantity"
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2">Rate</Typography>
                                        <TextField
                                            value={rate}
                                            onChange={handleRateChange}
                                            size="small"
                                            fullWidth
                                            placeholder="Rate"
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2">Amount</Typography>
                                        <TextField
                                            value={amount}
                                            size="small"
                                            fullWidth
                                            placeholder="Amount"
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <Box m={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveOrAddRow}


                                    sx={{ background: 'var(--complementary-color)', mb: 2, gap: 1 }}
                                >
                                    <AddCircleOutlineIcon />
                                    {editingRow !== null ? "Update Row" : "Add to Table"}
                                </Button>
                            </Box>
                        </Box>

                        {/* table */}
                        <Box m={1}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sr No</TableCell>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Batch No</TableCell>
                                            <TableCell>Batch Date</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Rate</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    {productOptions.find(option => option.value === row.ProductId)?.label || "N/A"}
                                                </TableCell>
                                                <TableCell>{row.BatchNo}</TableCell>
                                                <TableCell>{row.BatchDate ? new Date(row.BatchDate).toLocaleDateString() : ""}</TableCell>
                                                <TableCell>{row.Quantity}</TableCell>
                                                <TableCell>{row.Rate}</TableCell>
                                                <TableCell>{row.Amount}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={(event) => handleMenutableOpen(event, index)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl1}
                                                        open={Boolean(anchorEl1) && selectedRow === index}
                                                        onClose={handletableMenuClose}
                                                    >
                                                        <MenuItem onClick={() => handleEditRow(index)}>Edit</MenuItem>

                                                        <MenuItem onClick={() => handleDeleteRow(index)}>Delete</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        ))}


                                        <TableRow>
                                            <TableCell colSpan={6} align="right"><strong>Total:</strong></TableCell>
                                            <TableCell><strong>{totalAmount}</strong></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5} m={2}>
                            <Box>
                                <Button
                                    sx={{
                                        background: 'var(--primary-color)',
                                    }} onClick={handleSubmitDelivery}

                                    variant="contained"
                                >
                                    {isEditing ? "Update" : "Save"}
                                </Button>
                            </Box>

                            <Box>
                                <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant='outlined'><b>Cancel</b> </Button>
                            </Box>



                            <Box>
                                {isEditing && (
                                    <Button variant="contained" color="error" onClick={handleClickOpen}>
                                        Delete
                                    </Button>
                                )}

                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleConfirmDelete} color="error" autoFocus>
                                            Delete
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Box>
                    </LocalizationProvider>
                </Drawer>

            </Box>

        </Box>
    )
}

export default DeliveryChallan















































// import React, { useMemo, useState, useEffect } from 'react'
// import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Table, useMediaQuery, Box, Button, IconButton, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, Menu } from '@mui/material';
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
// import qs from "qs";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// import {

//     useMaterialReactTable,
// } from "material-react-table";


// const DeliveryChallan = () => {
//     const theme = useTheme();
//     const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const [challanheaders, setChallanheaders] = useState([]);
//     const [challandetails, setChallandetails] = useState([]);
//     const [isEditing, setIsEditing] = useState(false);
//     const [challanNo, setChallanNo] = useState('');
//     const [challanDate, setChallanDate] = useState(null);
//     const [batchNo, setBatchNo] = useState(null);
//     const [batchDate, setBatchDate] = useState(null);
//     const [quentity, setQuantity] = useState(0);
//     const [rate, setRate] = useState(0);
//     const [amount, setAmount] = useState(0);
//     const [vehicleNo, setVehicleNo] = useState('');

//     const resetForm = () => {
//         setChallanNo('');
//         setChallanNo('');
//         setChallanDate('');
//         setBatchNo('');
//         setBatchDate('');
//         setQuantity('');
//         setRate('');
//         setAmount('');
//         setVehicleNo('');
//         setSelectedLocation('')
//         setRows([]);
//     };

//     const handleDrawerOpen = () => {
//         setIsDrawerOpen(true);

//         setIsEditing(false);
//     };

//     const handleDrawerClose = () => {
//         setIsDrawerOpen(false);
//         resetForm();
//     };

//     //main table
//     const columns = useMemo(() => {
//         return [

//             {
//                 accessorKey: 'ChallanNo',
//                 header: 'Challan No',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'ChallanDate.date',
//                 header: 'Challan Date',
//                 size: 150,
//                 Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
//             },


//             {
//                 accessorKey: 'Total',
//                 header: 'Total',
//                 size: 150,
//             },

//             {
//                 accessorKey: 'VehicleNo',
//                 header: 'VehicleNo',
//                 size: 150,
//             },

//         ];
//     }, [challanheaders]);

//     //for get data in main table and form
//     const handleSubmit = (rowData) => {
//         // console.log("This row has been clicked:", rowData);
//         setRowId(rowData.Id)
//         setIsDrawerOpen(true);
//         //setIsEditing(false);
//         setIsEditing(!!rowData.Id);

//         setChallanNo(rowData.ChallanNo)
//         setChallanDate(rowData.ChallanDate?.date.split(" ")[0])
//         setVehicleNo(rowData.VehicleNo)
//         setSelectedLocation(rowData.StoreLocation);
//         // console.log("storelocation", rowData.StoreLocation);

//         const deliverychallandetail = challandetails.filter(
//             (detail) => detail.ChallanId === rowData.Id);
//         // console.log('invdetail', deliverychallandetail)

//         const mappedRows = deliverychallandetail.map((detail) => ({
//             Id: detail.Id,
//             InwardId: detail.InwardId,
//             ProductId: detail.ProductId,
//             BatchNo: detail.BatchNo,
//             BatchDate: detail.BatchDate?.date.split(" ")[0],
//             Quantity: parseFloat(detail.Quantity) || 0,
//             Rate: parseFloat(detail.Rate) || 0,
//             Amount: parseFloat(detail.Amount) || 0,
//         }));

//         // console.log('mappedRows', mappedRows)
//         setRows(mappedRows);
//     };

//     const table = useMaterialReactTable({
//         columns,
//         data: challanheaders,
//         muiTableHeadCellProps: {
//             style: {
//                 backgroundColor: "#E9ECEF",
//                 color: "black",
//                 fontSize: "16px",
//             },
//         },
//         muiTableBodyRowProps: ({ row }) => ({
//             onClick: () => handleSubmit(row.original),
//             style: { cursor: "pointer" },
//         }),
//     });


//     ////api to call fetchInwardHeader
//     const fetchChallanHeader = async () => {
//         try {
//             const response = await axios.get(
//                 "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=DeliveryChallanHeader"
//             );
//             setChallanheaders(response.data);
//             // console.log('header', response.data)
//         } catch (error) { }
//     };

//     //  api to call fetchInwarddetails
//     const fetchChallandetails = async () => {
//         try {
//             const response = await axios.get(
//                 "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=DeliveryChallanDetail"
//             );
//             setChallandetails(response.data);
//             // console.log('detail', response.data)
//         } catch (error) { }
//     };



//     //for Store locations
//     const [options, setOptions] = useState([]);
//     const [selectedLocation, setSelectedLocation] = useState();

//     const fetchLocation = async () => {
//         const requestOptions = {
//             method: "GET",
//             redirect: "follow",
//         };

//         fetch(
//             "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=Branch",
//             requestOptions
//         )
//             .then((response) => response.json())
//             .then((result) => {
//                 // console.log("API Response:", result); // Debugging log
//                 const storelocationOptions = result.map((storelocation) => ({
//                     value: storelocation?.Id || "",
//                     label: storelocation?.Storelocation,
//                 }));

//                 setOptions(storelocationOptions);

//             })
//             .catch((error) => console.error("Error fetching Storelocation:", error));
//     };


//     //for Product
//     const [productOptions, setProductOptions] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState(null);

//     // const fetchProduct = async () => {
//     //     const requestOptions = {
//     //         method: "GET",
//     //         redirect: "follow",
//     //     };

//     //     fetch(
//     //         "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productmaster",
//     //         requestOptions
//     //     )
//     //         .then((response) => response.json())
//     //         .then((result) => {
//     //             // console.log("API Response:", result); // Debugging log


//     //             const productsOptions = result.map((product) => ({
//     //                 value: product?.Id || "",
//     //                 label: product?.ProductName,
//     //             }));

//     //             setProductOptions(productsOptions);

//     //         })
//     //         .catch((error) => console.error("Error fetching Storelocation:", error));
//     // };

//     const fetchProduct = async () => {
//         try {
//             const response = await axios.get(
//                 'https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productmaster',
//             );
//             // console.log(response.data);
//             processMaterialData(response.data)
//         } catch (error) {
//             console.error(error);

//         }
//     };

//     const processMaterialData = (data) => {
//         if (Array.isArray(data)) {

//             const productsOptions = data.map((product) => ({
//                 value: product?.Id || "",
//                 label: product?.ProductName,
//                 purchaseRate: product?.SellPrice,
//             }));

//             console.log('options', productsOptions)
//             setProductOptions(productsOptions);
//         }
//     };

//     useEffect(() => {
//         fetchChallanHeader();
//         fetchChallandetails();
//         fetchLocation();
//         fetchProduct();
//     }, []);


//     //for amount calculation
//     const handleQuantityChange = (e) => {
//         const qty = e.target.value;
//         setQuantity(qty);
//         calculateAmount(qty, rate);
//     };

//     const handleRateChange = (e) => {
//         const rt = e.target.value;
//         setRate(rt);
//         calculateAmount(quentity, rt);
//     };

//     const calculateAmount = (qty, rt) => {
//         const qtyNum = parseFloat(qty) || 0;
//         const rateNum = parseFloat(rt) || 0;
//         const amt = qtyNum * rateNum;
//         setAmount(amt);
//     };

//     const [rows, setRows] = useState([]);
//     //create and update Delivery challan
//     const totalAmount = rows.reduce((total, row) => total + (row.Amount || 0), 0).toFixed(2);

//     //create and update Inword At Store
//     const handleSubmitDelivery = async (e) => {
//         e.preventDefault();
//         const formattedChallanDate = moment(challanDate).format("YYYY-MM-DD");

//         const purchaseheaderdata = {
//             Id: rowId,
//             ChallanNo: parseInt(challanNo),
//             ChallanDate: formattedChallanDate,
//             StoreLocation: selectedLocation,
//             VehicleNo: vehicleNo,
//             Total: totalAmount,
//         };
//         // console.log("ChallanNo", challanNo)
//         // console.log("deliveryheders", challanheaders);
//         try {
//             const invoiceurl = rowId
//                 ? "https://arohanagroapi.microtechsolutions.co.in/php/updatedeliverychallanheader.php"
//                 : "https://arohanagroapi.microtechsolutions.co.in/php/postdeliverychallanheader.php";

//             const response = await axios.post(
//                 invoiceurl,
//                 qs.stringify(purchaseheaderdata),
//                 {
//                     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//                 }
//             );
//             console.log('postchallanheders', response.data)
//             let InwardId = rowId ? rowId : parseInt(response.data.ID, 10);
//             // console.log("Inward Id ", InwardId);
//             console.log("rows", rows);

//             for (const row of rows) {
//                 console.log("this row   ", row);
//                 const formattedBatchDate = moment(row.BatchDate).format("YYYY-MM-DD");

//                 const rowData = {
//                     Id: parseInt(row.Id, 10),
//                     ChallanId: parseInt(InwardId, 10),

//                     ProductId: parseInt(row.ProductId, 10),

//                     BatchNo: parseInt(row.BatchNo),
//                     BatchDate: formattedBatchDate,
//                     Quantity: parseFloat(row.Quantity),
//                     Rate: parseFloat(row.Rate),
//                     Amount: parseInt(row.Amount),
//                 };
//                 // console.log("this row has rowData ", rowData);
//                 const invoicdedetailurl =
//                     row.Id
//                         ? "https://arohanagroapi.microtechsolutions.co.in/php/updatedeliverychallandetail.php"
//                         : "https://arohanagroapi.microtechsolutions.co.in/php/postdeliverychallandetail.php";
//                 console.log(" invoicdedetailurl is used ", invoicdedetailurl);
//                 try {
//                     const response = await axios.post(
//                         invoicdedetailurl,
//                         qs.stringify(rowData),
//                         {
//                             headers: {
//                                 "Content-Type": "application/x-www-form-urlencoded",
//                             },
//                         }
//                     );
//                     console.log("Response:", response);
//                 } catch (error) {
//                     console.error("Error:", error);
//                 }
//                 if (isEditing && row.Id) {
//                     handleSaveOrAddRow();
//                 }
//             }
//             setIsDrawerOpen(false);
//             toast.success(
//                 isEditing
//                     ? "Delivery challan detail updated successfully!"
//                     : "Delivery challan detail Created successfully!"
//             );
//             resetForm();
//             fetchChallanHeader();
//             // console.log("Inword Header Data:", purchaseheaderdata);
//         } catch (error) {
//             console.error("Error submitting Inword:", error);
//         }
//     };

//     //for drawer table row btn

//     const [rowId, setRowId] = useState('');
//     //for drawer table menu btn
//     const [anchorEl1, setAnchorEl1] = useState(null);
//     const [selectedRow, setSelectedRow] = useState(null);

//     const handleMenutableOpen = (event, index) => {
//         setAnchorEl1(event.currentTarget);
//         setSelectedRow(index);
//     };

//     const handletableMenuClose = () => {
//         setAnchorEl1(null);
//         setSelectedRow(null);
//     };

//     //for add data in table after click on Add to table
//     const [editingRow, setEditingRow] = useState(null);
//     //Add Rows
//     const handleAddRow = () => {
//         const newRow = {
//             ProductId: selectedProduct,
//             Quantity: quentity,
//             Rate: rate,
//             Amount: amount,
//             BatchNo: batchNo,
//             BatchDate: batchDate,
//         };
//         // console.log("newRow", newRow);
//         // Update rows state and ensure the new row is added to the table
//         setRows((prevRows) => [...prevRows, newRow]);
//         // console.log("Updated Rows:", rows);
//     };


//     //for updaterows
//     const handleSaveOrAddRow = () => {
//         if (editingRow !== null) {
//             // Update the existing row
//             const updatedRows = [...rows];
//             updatedRows[editingRow] = {
//                 ...updatedRows[editingRow],
//                 ProductId: selectedProduct,

//                 Quantity: quentity,
//                 Rate: rate,
//                 Amount: amount,
//                 BatchNo: batchNo,
//                 BatchDate: batchDate,
//             };
//             setRows(updatedRows);
//             setEditingRow(null);
//         }
//         else {
//             // Add a new row
//             handleAddRow();
//         }
//     };


//     //update rows
//     const handleEditRow = (index) => {
//         const row = rows[index];
//         setEditingRow(index);
//         setQuantity(row.Quantity || "");
//         setRate(row.Rate || "");
//         setAmount(row.Amount || "");
//         setBatchNo(row.BatchNo);
//         setSelectedProduct(row.ProductId);
//         setBatchDate(row.BatchDate);
//     };


//     const handleDeleteRow = (index) => {
//         const updatedRows = [...rows];
//         updatedRows.splice(index, 1);
//         setRows(updatedRows);
//     };


//     //for delete Header

//     const [open, setOpen] = useState(false);

//     const handleClickOpen = () => {
//         setOpen(true);
//     };
//     const handleClose = () => {
//         setOpen(false);
//     };
//     const handleConfirmDelete = () => {
//         const requestOptions = {
//             method: "GET",
//             redirect: "follow"
//         };

//         console.log("Deleted Id:", rowId);

//         fetch(`https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=DeliveryChallanHeader&Id=${rowId}`, requestOptions)
//             .then((response) => response.text())
//             .then((result) => {
//                 console.log(result);
//                 setOpen(false);
//                 handleDrawerClose();
//                 fetchChallanHeader();
//                 toast.success(
//                     "DeliveryChallan Deleted successfully!"
//                 );
//             })
//             .catch((error) => console.error(error));
//     };


//     return (
//         <Box>
//             <Box textAlign={'center'}>
//                 <Typography color='var(--complementary-color)' variant='h4'><b>Delivery Challan At Godown</b></Typography>
//             </Box>
//             <Box sx={{ p: 5, height: 'auto' }}>

//                 <Box sx={{ display: 'flex', gap: 3 }}>
//                     <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Delivery Challan </Button>
//                 </Box>

//                 {/* main table */}
//                 <Box mt={4}>
//                     <MaterialReactTable table={table}
//                         enableColumnResizing
//                         muiTableHeadCellProps={{
//                             sx: { color: 'var(--primary-color)', },
//                         }}
//                     />
//                 </Box>

//                 <Drawer
//                     anchor="right"
//                     open={isDrawerOpen}
//                     onClose={handleDrawerClose}
//                     PaperProps={{
//                         sx: {
//                             borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//                             width: isSmallScreen ? "100%" : "65%",
//                             zIndex: 1000,
//                         },
//                     }}
//                 >
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>

//                             <Typography m={2} fontWeight="bold" variant="h6">
//                                 {isEditing ? "Update Delivery Challan At Godown" : "Create Delivery Challan At Godown"}
//                             </Typography>
//                             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
//                         </Box>
//                         <Divider />

//                         <Box>
//                             <Box display={'flex'} alignItems={'center'} mt={2} m={2} gap={2} >
//                                 <Box flex={1} >
//                                     <Box >
//                                         <Typography variant="body2">Challan No</Typography>
//                                         <TextField
//                                             value={challanNo}
//                                             disabled
//                                             onChange={(e) => setChallanNo(e.target.value)}
//                                             size="small"
//                                             fullWidth />
//                                     </Box>
//                                 </Box>


//                                 <Box flex={1} >
//                                     <Box>
//                                         <Typography variant="body2">Challan Date</Typography>
//                                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                             <DatePicker
//                                                 value={challanDate ? new Date(challanDate) : null}
//                                                 format="dd-MM-yyyy"
//                                                 onChange={(newValue) => setChallanDate(newValue)}
//                                                 slotProps={{
//                                                     textField: { size: "small", fullWidth: true },
//                                                 }}
//                                                 renderInput={(params) => <TextField />}
//                                             />
//                                         </LocalizationProvider>
//                                     </Box>
//                                 </Box>


//                                 <Box flex={1} >
//                                     <Typography variant="body2">VehicalNo</Typography>
//                                     <TextField
//                                         value={vehicleNo}
//                                         onChange={(e) => setVehicleNo(e.target.value)}
//                                         size="small" fullWidth placeholder='VehicalNo' />
//                                 </Box>



//                             </Box>

//                             <Box m={2} >
//                                 <Typography variant="body2">Store Location</Typography>
//                                 <FormControl fullWidth size="small">
//                                     <Select
//                                         value={selectedLocation || ""}
//                                         onChange={(event) => setSelectedLocation(event.target.value)}
//                                     >
//                                         {options.map((option) => (
//                                             <MenuItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Box>

//                             {/* <Box display={'flex'} alignItems={'center'} mt={2} m={2} gap={2}>
//                                 <Box flex={1} >
//                                     <Box >
//                                         <Typography variant="body2">Challan No</Typography>
//                                         <TextField
//                                             // value={challanNo}
//                                             // onChange={(e) => setChallanNo(e.target.value)}
//                                             size="small" fullWidth />
//                                     </Box>
//                                 </Box>


//                                 <Box flex={1} >
//                                     <Box>
//                                         <Typography variant="body2">Challan Date</Typography>
//                                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                             <DatePicker
//                                                 // value={challanDate ? new Date(challanDate) : null}
//                                                 // onChange={(newValue) => setChallanDate(newValue)}
//                                                 slotProps={{
//                                                     textField: { size: "small", fullWidth: true },
//                                                 }}
//                                                 renderInput={(params) => <TextField />}
//                                             />
//                                         </LocalizationProvider>
//                                     </Box>
//                                 </Box>

//                             </Box> */}



//                             <Box sx={{ display: "flex", flexDirection: "column", gap: 2, m: 2 }}>
//                                 {/* First Row: Product, Batch No, Batch Date */}
//                                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography>Product</Typography>
//                                         <FormControl fullWidth size="small">
//                                             {/* <Select
//                                                 value={selectedProduct || ""}
//                                                 onChange={(event) => setSelectedProduct(event.target.value)}
//                                             >
//                                                 {productOptions.map((option) => (
//                                                     <MenuItem key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select> */}

//                                             <Select
//                                                 fullWidth
//                                                 size="small"
//                                                 value={selectedProduct || ""}
//                                                 onChange={(event) => {
//                                                     const selectedValue = event.target.value;
//                                                     // setSelectedProduct(selectedValue);
                                                    
//                                                     const selectedItem = productOptions.find(option => option.value.toString() === selectedValue);
//                                                     console.log("selected Items", selectedItem)
//                                                     // setSelectedProduct(selectedItem.label)
//                                                     console.log('selected product',selectedItem.label)
//                                                     setRate(selectedItem.purchaseRate);
//                                                     console.log("Purchase rate:", selectedItem.purchaseRate);

                                   
//                                                 }}
//                                             >
//                                                 {productOptions.map((option) => (
//                                                     <MenuItem key={option.value} value={option.value.toString()}>
//                                                         {option.label}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                     </Box>

//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography variant="body2">Batch No</Typography>
//                                         <TextField
//                                             value={batchNo}
//                                             onChange={(e) => setBatchNo(e.target.value)}
//                                             size="small"
//                                             fullWidth
//                                             placeholder="Batch No"
//                                         />
//                                     </Box>

//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography variant="body2">Batch Date</Typography>
//                                         <DatePicker
//                                             value={batchDate ? new Date(batchDate) : null}
//                                             format="dd-MM-yyyy"
//                                             onChange={(newValue) => setBatchDate(newValue)}
//                                             slotProps={{
//                                                 textField: { size: "small", fullWidth: true },
//                                             }}
//                                         />
//                                     </Box>
//                                 </Box>

//                                 {/* Second Row: Quantity, Rate, Amount */}
//                                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography variant="body2">Quantity</Typography>
//                                         <TextField
//                                             value={quentity}
//                                             onChange={handleQuantityChange}
//                                             size="small"
//                                             fullWidth
//                                             placeholder="Quantity"
//                                         />
//                                     </Box>

//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography variant="body2">Rate</Typography>
//                                         <TextField
//                                             value={rate}
//                                             onChange={handleRateChange}
//                                             size="small"
//                                             fullWidth
//                                             placeholder="Rate"
//                                         />
//                                     </Box>

//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography variant="body2">Amount</Typography>
//                                         <TextField
//                                             value={amount}
//                                             size="small"
//                                             fullWidth
//                                             placeholder="Amount"
//                                         />
//                                     </Box>
//                                 </Box>
//                             </Box>

//                             <Box m={2}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleSaveOrAddRow}


//                                     sx={{ background: 'var(--complementary-color)', mb: 2, gap: 1 }}
//                                 >
//                                     <AddCircleOutlineIcon />
//                                     {editingRow !== null ? "Update Row" : "Add to Table"}
//                                 </Button>
//                             </Box>
//                         </Box>

//                         {/* table */}
//                         <Box m={1}>
//                             <TableContainer component={Paper}>
//                                 <Table>
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell>Sr No</TableCell>
//                                             <TableCell>Product</TableCell>
//                                             <TableCell>Batch No</TableCell>
//                                             <TableCell>Batch Date</TableCell>
//                                             <TableCell>Quantity</TableCell>
//                                             <TableCell>Rate</TableCell>
//                                             <TableCell>Amount</TableCell>
//                                             <TableCell>Actions</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {rows.map((row, index) => (
//                                             <TableRow key={index}>
//                                                 <TableCell>{index + 1}</TableCell>
//                                                 <TableCell>
//                                                     {productOptions.find(option => option.value === row.ProductId)?.label || "N/A"}
//                                                 </TableCell>
//                                                 <TableCell>{row.BatchNo}</TableCell>
//                                                 <TableCell>{row.BatchDate ? new Date(row.BatchDate).toLocaleDateString() : ""}</TableCell>
//                                                 <TableCell>{row.Quantity}</TableCell>
//                                                 <TableCell>{row.Rate}</TableCell>
//                                                 <TableCell>{row.Amount}</TableCell>
//                                                 <TableCell>
//                                                     <IconButton onClick={(event) => handleMenutableOpen(event, index)}>
//                                                         <MoreVertIcon />
//                                                     </IconButton>
//                                                     <Menu
//                                                         anchorEl={anchorEl1}
//                                                         open={Boolean(anchorEl1) && selectedRow === index}
//                                                         onClose={handletableMenuClose}
//                                                     >
//                                                         <MenuItem onClick={() => handleEditRow(index)}>Edit</MenuItem>

//                                                         <MenuItem onClick={() => handleDeleteRow(index)}>Delete</MenuItem>
//                                                     </Menu>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}


//                                         <TableRow>
//                                             <TableCell colSpan={6} align="right"><strong>Total:</strong></TableCell>
//                                             <TableCell><strong>{totalAmount}</strong></TableCell>
//                                             <TableCell></TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </Box>

//                         <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5} m={2}>
//                             <Box>
//                                 <Button
//                                     sx={{
//                                         background: 'var(--primary-color)',
//                                     }} onClick={handleSubmitDelivery}

//                                     variant="contained"
//                                 >
//                                     {isEditing ? "Update" : "Save"}
//                                 </Button>
//                             </Box>

//                             <Box>
//                                 <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant='outlined'><b>Cancel</b> </Button>
//                             </Box>



//                             <Box>
//                                 {isEditing && (
//                                     <Button variant="contained" color="error" onClick={handleClickOpen}>
//                                         Delete
//                                     </Button>
//                                 )}

//                                 <Dialog open={open} onClose={handleClose}>
//                                     <DialogTitle>Confirm Deletion</DialogTitle>
//                                     <DialogContent>
//                                         <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
//                                     </DialogContent>
//                                     <DialogActions>
//                                         <Button onClick={handleClose} color="primary">
//                                             Cancel
//                                         </Button>
//                                         <Button onClick={handleConfirmDelete} color="error" autoFocus>
//                                             Delete
//                                         </Button>
//                                     </DialogActions>
//                                 </Dialog>
//                             </Box>
//                         </Box>
//                     </LocalizationProvider>
//                 </Drawer>

//             </Box>

//         </Box>
//     )
// }

// export default DeliveryChallan







































