
import React, { useMemo, useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, useMediaQuery, Button, Typography, TextField, Drawer, Divider, Autocomplete, FormControl, Select, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import axios from 'axios';

import { useMaterialReactTable, } from "material-react-table";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Cookies from 'js-cookie';
import moment from 'moment';
import qs from "qs";
const Receipt = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        resetForm();
        setRowId('')
        setIsEditing(false);
    };

    const handleDrawerClose = () => {
        setRowId('')
        setIsDrawerOpen(false);
        resetForm()
    };
    const [rowId, setRowId] = useState('');

    const [receiptNo, setReceiptNo] = useState();
    const [receiptDate, setReceiptDate] = useState(null);
    const [selectedCashorbank, setSelectedCashorbank] = useState("");
    const [amount, setAmount] = useState('');
    const [chequeOrDD, setChequeOrDd] = useState('cheque');
    const [bankName, setBankName] = useState('');
    const [chequeNo, setChequeNo] = useState();
    const [chequeDate, setChequeDate] = useState(null);


    //yearId and userId
    const [userId, setUserId] = useState('')
    const [yearid, setYearId] = useState('');

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("UserId");
        const storedYearId = Cookies.get("YearId");

        if (storedUserId) {
            setUserId(storedUserId);
            console.log('storedUserId', storedUserId);
        } else {
            toast.error("User is not logged in.");
        }

        if (storedYearId) {
            setYearId(storedYearId);
            console.log('storedYearId', storedYearId);
        } else {
            toast.error("Year is not set.");
        }
        // fetchVouchers();
    }, [userId, yearid]);



    //fetch Party
    const [branchOption, setBranchOption] = useState([]);
    const [selectedBranchOption, setSelectedBranchOption] = useState('');

    const fetchBranch = async () => {
        try {
            const response = await fetch(
                "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=Account"
            );
            const result = await response.json();

            console.log("Branch info:", result);

            const options = result.map((branch) => ({
                value: branch.Id,
                label: branch.AccountName,
            }));

            setBranchOption(options);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };


    //fetch Bank
    const [bankOptions, setBankOptions] = useState([]);
    const [selectedBankOption, setSelectedBankOption] = useState("");

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const urls = [
                    "https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Table=AccountGroup&Colname=GroupCode&Colvalue=7",
                    "https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Table=AccountGroup&Colname=GroupCode&Colvalue=8"
                ];

                const responses = await Promise.all(urls.map(url => axios.get(url)));
                const combinedData = responses.flatMap(response => response.data || []);

                const options = combinedData.map(item => ({
                    label: item.GroupName, // update this field based on your API response
                    value: item.GroupCode  // update this field based on your API response
                }));

                setBankOptions(options);
            } catch (error) {
                console.error("Failed to fetch bank options", error);
            }
        };

        fetchOptions();
    }, []);

    //table
    const fetchData = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        try {
            const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Table=VoucherHD&Colname=VoucherType&Colvalue=RE", requestOptions);
            const result = await response.json();
            console.log("Fetched result:", result);
            setData(result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchBranch();
        fetchReceiptdetails();
    }, []);



    const [receiptdetails, setReceiptdetails] = useState([]);
    //  api to call fetchInwarddetails
    const fetchReceiptdetails = async () => {
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=VoucherDetail"
            );
            setReceiptdetails(response.data);
            console.log('detail', response.data)
        } catch (error) { }
    };

    //create and update receipt voucher
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedVoucherdate = moment(receiptDate).format("YYYY-MM-DD");
        const formattedchequedate = moment(chequeDate).format("YYYY-MM-DD");

        const headerData = {
            Id: rowId,
            VoucherType: "RE",
            VoucherNo: receiptNo ? receiptNo : null,
            VoucherDate: formattedVoucherdate,
            ChequeNo: chequeNo,
            ChequeDate: formattedchequedate,
            RefNo: "RefNo",
            Narration: ' ',
            CreatedBy: !isEditing ? userId : undefined,
            UpdatedBy: isEditing ? userId : undefined,
        };

        try {
            const voucherurl = isEditing
                ? "https://arohanagroapi.microtechsolutions.co.in/php/updatevoucherhd.php"
                : "https://arohanagroapi.microtechsolutions.co.in/php/postvoucherhd.php";

            // Submit purchase header data
            // const response = await axios.post(voucherurl, qs.stringify(headerData), {
            const response = await axios.post(voucherurl, headerData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            console.log(response.data, "receipt response");

            // const voucherid = isEditing ? id : parseInt(response.data.Id, 10);
            const voucherId = isEditing ? rowId : parseInt(response.data.ID, 10);

            const srn1Id = voucherId; // Same ID for SRN:1
            const srn2Id = srn1Id + 1; // Generate a different ID for SRN:2 (You can modify this logic)

            const formattedVoucherdate = moment(receiptDate).format("YYYY-MM-DD");
            const formattedchequedate = moment(chequeDate).format("YYYY-MM-DD");

            const detailsData = [
                {
                    Id: isEditing ? srn1Id : null,
                    VoucherId: voucherId,
                    VoucherType: "RE",
                    SRN: 1,
                    VoucherNo: receiptNo ? receiptNo : null,
                    VoucherDate: formattedVoucherdate,
                    AccountId: parseInt(selectedBranchOption, 10),
                    Amount: parseFloat(amount),
                    DOrC: "D",
                    Narration: 'yes',
                    CostCenterId: 1,
                    ChequeNo: chequeNo,
                    ChequeDate: formattedchequedate,
                    ChequeAmount: '',
                    MICRCode: "",
                    BankName: selectedBankOption,
                    BankBranch: '',

                    CreatedBy: !isEditing ? userId : undefined,
                    UpdatedBy: isEditing ? userId : undefined,
                },
                {
                    Id: isEditing ? srn2Id : null,
                    VoucherId: voucherId,
                    VoucherType: "RE",
                    SRN: 2,
                    VoucherNo: receiptNo ? receiptNo : null,
                    VoucherDate: formattedVoucherdate,
                    AccountId: parseInt(selectedBranchOption, 10),
                    Amount: parseFloat(amount),
                    DOrC: "C",
                    Narration: 'yes',
                    CostCenterId: 1,
                    ChequeNo: chequeNo,
                    ChequeDate: formattedchequedate,
                    ChequeAmount: '',
                    MICRCode: " ",
                    BankName: bankName,
                    BankBranch: '',

                    CreatedBy: !isEditing ? userId : undefined,
                    UpdatedBy: isEditing ? userId : undefined,
                },
            ];

            const voucherdetailurl =
                isEditing && voucherId
                    ? "https://arohanagroapi.microtechsolutions.co.in/php/updatevoucherdetail.php"
                    : "https://arohanagroapi.microtechsolutions.co.in/php/postvoucherdetail.php";

            // Send the detailsData in two separate API requests
            await axios.post(voucherdetailurl, qs.stringify(detailsData[0]), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            await axios.post(voucherdetailurl, qs.stringify(detailsData[1]), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });


            toast.success(
                isEditing
                    ? "Receipt Voucher updated successfully!"
                    : "Receipt Voucher Created successfully!"
            );
            resetForm();
            fetchData();
            fetchReceiptdetails();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error("Error saving record:", error);
            // toast.error('Error saving record!');
        }
    };



    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
                Cell: ({ row }) => row.index + 1,
            },

            {
                accessorKey: 'VoucherType',
                header: 'Voucher Type',
                size: 150,
            },
            {
                accessorKey: 'VoucherNo',
                header: 'Voucher No',
                size: 150,
            },

            {
                accessorKey: 'VoucherDate.date',
                header: 'Voucher Date',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

            {
                accessorKey: 'ChequeNo',
                header: 'ChequeNo',
                size: 150,

            },

            {
                accessorKey: 'ChequeDate.date',
                header: 'ChequeDate',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

        ];
    }, []);

    const [idwiseData, setIdwiseData] = useState('')
    const [data, setData] = useState([]);
    const table = useMaterialReactTable({
        columns,
        data: data,
        enablePagination: true,
        muiTableHeadCellProps: {
            style: {
                backgroundColor: "#E9ECEF",
                color: "black",
                fontSize: "16px",
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => handleEdit(row.original),
            style: { cursor: "pointer" },
        }),
    });

    const handleEdit = (rowData) => {
        console.log("This row has been clicked:", rowData);
        // console.log("selected Id",idwiseData)
        console.log("rowData.Id:", rowData.Id);
        setRowId(rowData.Id)
        setIsDrawerOpen(true);
        setIsEditing(!!rowData.Id);
        setIdwiseData(rowData.Id);

        setReceiptNo(rowData.VoucherNo)
        //receipt date
        const dateStr = rowData.VoucherDate.date.split(" ")[0];
        const [year, month, day] = dateStr.split("-").map(Number); // Convert to numbers
        const formattedDate = `${year}-${month}-${day}`;
        setReceiptDate(formattedDate);
        setChequeNo(rowData.ChequeNo);
        //Cheque date
        const dateStrc = rowData.ChequeDate.date.split(" ")[0];
        const [yearc, monthc, dayc] = dateStrc.split("-").map(Number); // Convert to numbers
        const formattedChequeDate = `${yearc}-${monthc}-${dayc}`;
        setChequeDate(formattedChequeDate);


        const receiptetail = receiptdetails
            .filter((detail) => detail.VoucherId === rowData.Id)
        if (receiptetail) {
            setSelectedBranchOption(receiptetail[0].AccountId);
            setSelectedBankOption(receiptetail[0].BankName);
            setBankName(receiptetail[1].BankName);

            setAmount(receiptetail[0].Amount)
            setChequeOrDd(receiptetail[0].DOrC)
            console.log('DOrC', receiptetail[0].DOrC)
        }
        console.log('receiptetail', receiptetail)
    };

    const resetForm = () => {
        setReceiptDate('');
        setChequeDate('');
        setSelectedBranchOption('');
        setSelectedBankOption('');
        setBankName('');
        setAmount('');
        setChequeOrDd('');
        setReceiptNo('');
        setChequeNo('');
        setSelectedCashorbank('')
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

        fetch(`https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=VoucherHD&Id=${rowId}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setOpen(false);
                handleDrawerClose();
                fetchData();
                toast.success(
                    "Receipt Voucher  Deleted successfully!"
                );
            })
            .catch((error) => console.error(error));
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
                                        value={receiptNo}
                                        onChange={(e) => setReceiptNo(e.target.value)}
                                        size="small" placeholder="Receipt No Autogenrated" fullWidth />
                                </Box>



                                <Box flex={1} >
                                    <Typography>Receipt Date</Typography>
                                    <DatePicker
                                        value={receiptDate ? new Date(receiptDate) : null}
                                        format="dd-MM-yyyy"
                                        onChange={(newValue) => setReceiptDate(newValue)}
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
                                        value={selectedCashorbank}
                                        onChange={(e) => setSelectedCashorbank(e.target.value)}
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
                                    <Autocomplete
                                        size="small"
                                        options={branchOption}
                                        value={branchOption.find(option => option.value === selectedBranchOption) || null}
                                        onChange={(event, newValue) => setSelectedBranchOption(newValue ? newValue.value : "")}
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.value}>
                                                {option.label}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                        )}
                                    />

                                    {/* 
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
                                    </FormControl> */}
                                </Box>


                                <Box flex={1}>
                                    <Typography variant="body2">Bank Name</Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={selectedBankOption}
                                            onChange={(event) => setSelectedBankOption(event.target.value)}
                                        >
                                            {bankOptions.map((option) => (
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
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
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
                                            value={chequeOrDD} onChange={(event) => setChequeOrDd(event.target.value)}
                                        >
                                            <FormControlLabel value="C" control={<Radio size="small" />} label="Cheque" />
                                            <FormControlLabel value="D" control={<Radio size="small" />} label="DD" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>



                                <Box flex={1}>
                                    <Typography variant="body2">Bank Name</Typography>
                                    <TextField
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        size="small" margin="none" placeholder='Bank Name' fullWidth
                                    />
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="body2">Cheque No</Typography>
                                    <TextField
                                        value={chequeNo}
                                        onChange={(e) => setChequeNo(e.target.value)}
                                        size="small" margin="none" placeholder='Cheque No' fullWidth
                                    />
                                </Box>

                                <Box flex={1} >
                                    <Typography>Cheque Date</Typography>
                                    <DatePicker
                                        value={chequeDate ? new Date(chequeDate) : null}
                                        format="dd-MM-yyyy"
                                        onChange={(newValue) => setChequeDate(newValue)}
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

                                onClick={handleSubmit}
                                variant="contained"
                            >
                                {isEditing ? "Update" : "Save"}
                            </Button>
                        </Box>

                        <Box>
                            <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
                                onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
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

                </Drawer>
            </Box>
        </Box>
    )
}
export default Receipt



