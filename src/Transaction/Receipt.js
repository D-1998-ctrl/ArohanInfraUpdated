
import React, { useMemo, useState, useEffect } from 'react'
import { Alert, IconButton, Menu, FormLabel, Box, useMediaQuery, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMaterialReactTable, } from "material-react-table";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Receipt = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        // resetForm();
        // handleClearTemplate();
        setIsEditing(false);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };


    
    //table
    const fetchData = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        try {
            const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=User", requestOptions);
            const result = await response.json();
            console.log("Fetched result:", result);
            setData(result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchBranch()
    }, []);


    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
                Cell: ({ row }) => row.index + 1,
            },

            {
                accessorKey: 'Name',
                header: 'FullName',
                size: 150,
            },
            {
                accessorKey: 'UserId',
                header: 'User Name',
                size: 150,
            },

            {
                accessorKey: 'Password',
                header: 'Password',
                size: 150,
            },

            {
                accessorKey: 'LoginStatus',
                header: 'Login Status',
                size: 150,
                Cell: ({ row }) => (row.original.LoginStatus === 1 ? 'True' : 'False'),
            },
        ];
    }, []);

    const [idwiseData, setIdwiseData] = useState('')
    const [data, setData] = useState([]);
    const table = useMaterialReactTable({
        columns,
        data: data,
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

    const handleSubmit = (rowData) => {
        console.log("This row has been clicked:", rowData);
        // console.log("selected Id",idwiseData)
        console.log("rowData.Id:", rowData.Id);
        setIsDrawerOpen(true);
        setIsEditing(!!rowData.Id);
        setIdwiseData(rowData.Id);
        // setName(rowData.Name)
        // setUser(rowData.UserId)
        // setPassword(rowData.Password)
        // setSelectedLevelOption(rowData.LevelId)
        // setSelectedBranchOption(rowData.BranchId)
    };


    //fetch Branch
    const [branchOption, setBranchOption] = useState([]);
    const [selectedBranchOption, setSelectedBranchOption] = useState('');

    const fetchBranch = async () => {
        try {
            const response = await fetch(
                "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=Branch"
            );
            const result = await response.json();

            console.log("Branch info:", result);

            const options = result.map((branch) => ({
                value: branch.Id,
                label: branch.Storelocation,
            }));

            setBranchOption(options);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    return (

        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Receipt Voucher</b></Typography>
            </Box>



            <Box sx={{
                //  background: 'rgb(236, 253, 230)', 
                p: 5, height: 'auto'
            }}>

                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Receipt Voucher </Button>
                </Box>

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
                            width: isSmallScreen ? "100%" : "650px",
                            zIndex: 1000,
                        },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>

                        <Typography m={2} fontWeight="bold" variant="h6">
                            {isEditing ? "Update Receipt Voucher" : "Create Receipt Voucher"}
                        </Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                    </Box>
                    <Divider />
                    <Box m={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Box display={'flex'} gap={2} alignItems={'center'} mt={2}>
                                <Box flex={1}>
                                    <Typography>Receipt No</Typography>
                                    <TextField
                                        // value={name}
                                        // onChange={(e) => setName(e.target.value)}
                                        size="small" placeholder="Enter Account Name" fullWidth />
                                </Box>



                                <Box flex={1} >
                                    <Typography>Receipt Date</Typography>
                                    <DatePicker
                                        // value={PurchaseDate ? new Date(PurchaseDate) : null}
                                        format="dd-MM-yyyy"
                                        // onChange={(newValue) => setPurchaseDate(newValue)}
                                        slotProps={{
                                            textField: { size: "small", fullWidth: true },
                                        }}
                                    />
                                </Box>

                            </Box>

                            <Box mt={2}>
                                <Typography variant="body2" >Cash/Bank</Typography>
                                <FormControl component="fieldset" size="small" margin="none">
                                    <RadioGroup
                                        // value={selectedCashorbank}
                                        // onChange={(e) => setSelectedCashorbank(e.target.value)}
                                        row // This will display the radio buttons in a row
                                    >
                                        <FormControlLabel value="cash" control={<Radio />} label="Cash" size="small" margin="none" />
                                        <FormControlLabel value="bank" control={<Radio />} label="Bank" size="small" margin="none" />
                                        <FormControlLabel value="mbb" control={<Radio />} label="MBB Receipt" size="small" margin="none" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>


                            <Box display={'flex'} gap={2} alignItems={'center'} mt={2}>
                                <Box flex={1}>
                                    <Typography variant="body2">Party Name</Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={selectedBranchOption || ""}
                                            onChange={(event) => setSelectedBranchOption(event.target.value)}
                                        >
                                            {branchOption.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>


                                <Box flex={1}>
                                    <Typography variant="body2">Bank Name</Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={selectedBranchOption || ""}
                                            onChange={(event) => setSelectedBranchOption(event.target.value)}
                                        >
                                            {branchOption.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="body2">Amount</Typography>
                                    <TextField
                                        // value={Amount}
                                        // onChange={(e) => setAmount(e.target.value)}
                                        size="small" margin="none" placeholder='Amount' fullWidth
                                    />
                                </Box>





                            </Box>



                            <Divider sx={{ mt: 2 }} />

                            <Box display={'flex'} gap={2} alignItems={'center'} mt={1} p={1}>
                                <Box>
                                    <Typography variant="body2">Cheque/DD</Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup row
                                        // value={selectedPaymentMode} onChange={(event) => setSelectedPaymentMode(event.target.value)}
                                        >
                                            <FormControlLabel value="cheque" control={<Radio size="small" />} label="Cheque" />
                                            <FormControlLabel value="dd" control={<Radio size="small" />} label="DD" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>

                                {/* <Box flex={1}>
                                    <Typography variant="body2">Bank Name</Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={selectedBranchOption || ""}
                                            onChange={(event) => setSelectedBranchOption(event.target.value)}
                                        >
                                            {branchOption.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box> */}

                                <Box flex={1}>
                                    <Typography variant="body2">Bank Name</Typography>
                                    <TextField
                                        // value={Amount}
                                        // onChange={(e) => setAmount(e.target.value)}
                                        size="small" margin="none" placeholder='Bank Name' fullWidth
                                    />
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="body2">Cheque No</Typography>
                                    <TextField
                                        // value={Amount}
                                        // onChange={(e) => setAmount(e.target.value)}
                                        size="small" margin="none" placeholder='Cheque No' fullWidth
                                    />
                                </Box>

                                <Box flex={1} >
                                    <Typography>Cheque Date</Typography>
                                    <DatePicker
                                        // value={PurchaseDate ? new Date(PurchaseDate) : null}
                                        format="dd-MM-yyyy"
                                        // onChange={(newValue) => setPurchaseDate(newValue)}
                                        slotProps={{
                                            textField: { size: "small", fullWidth: true },
                                        }}
                                    />
                                </Box>



                            </Box>
                            <Divider sx={{ mt: 2 }} />

                         
                        </LocalizationProvider>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                        <Box>
                            <Button
                                sx={{
                                    background: 'var(--primary-color)',
                                }}

                                // onClick={isEditing ? UpdateUserMaster : CreateUserMaster}
                                variant="contained"
                            >
                                {isEditing ? "Update" : "Save"}
                            </Button>
                        </Box>

                        <Box>
                            <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
                                onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>
            </Box>
        </Box>
    )
}
export default Receipt



