
import React, { useMemo, useState, useEffect } from 'react'
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Table, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, useMediaQuery, Button, Typography, TextField, Drawer, Divider, Autocomplete, FormControl, Select, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material';
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

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
const Payment = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);



    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        resetForm();
        // setRowId('')
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
    const [narration, setNarration] = useState('');
    const [isOldCheque, setIsoldcheque] = useState(false);
    const [accountPayeeCheque, setAccountpayeecheque] = useState(false);
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
    }, [userId, yearid]);



    //fetch Party
    const [branchOption, setBranchOption] = useState([]);
    const [AccountId, setAccountId] = useState('')

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
                    label: item.GroupName,
                    value: item.GroupCode
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
            const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Table=VoucherHD&Colname=VoucherType&Colvalue=PY", requestOptions);
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


    //  api to call fetchPAYMENTdetails
    const [receiptdetails, setReceiptdetails] = useState([]);

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

        const paymentheaderdata = {
            Id: rowId,
            VoucherType: "PY",
            VoucherNo: receiptNo ? receiptNo : null,
            VoucherDate: formattedVoucherdate,
            ChequeNo: chequeNo,
            ChequeDate: formattedchequedate,
            Narration: narration,
            CreatedBy: !isEditing ? userId : undefined,
            UpdatedBy: isEditing ? userId : undefined,
        };

        try {
            const invoiceurl = rowId
                ? "https://arohanagroapi.microtechsolutions.co.in/php/updatevoucherhd.php"
                : "https://arohanagroapi.microtechsolutions.co.in/php/postvoucherhd.php";


            const response = await axios.post(
                invoiceurl,
                qs.stringify(paymentheaderdata),
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );
            console.log('postinwardheaders', paymentheaderdata)

            let PaymentId = rowId ? rowId : parseInt(response.data.ID, 10);
            console.log("Payment Id ", PaymentId);
            console.log("rows", rows);

            for (const [index, row] of rows.entries()) {

                const formattedVoucherdate = moment(receiptDate).format("YYYY-MM-DD");
                const formattedchequedate = moment(chequeDate).format("YYYY-MM-DD");


                const rowData = {
                    Id: parseInt(row.Id, 10),
                    VoucherId: parseInt(PaymentId, 10),
                    VoucherType: "PY",
                    SRN: rows.indexOf(row) + 1,
                    VoucherNo: receiptNo ? receiptNo : null,
                    VoucherDate: formattedVoucherdate,
                    AccountId: parseInt(row.AccountId, 10),
                    Amount: parseFloat(row.amount),
                    DOrC: index === 0 ? "C" : row.DOrC,
                    Narration: row.narration,
                    CostCenterId: row.CostCenterId,
                    ChequeNo: row.chequeNo,
                    ChequeDate: formattedchequedate,
                    ChequeAmount: row.chequeAmount,
                    MICRCode: row.MICRCode,
                    BankName: row.bankName,
                    BankBranch: row.bankBranch,
                    IsOldCheque: isOldCheque,
                    AccountPayeeCheque: accountPayeeCheque,
                    CreatedBy: !isEditing ? userId : undefined,
                    UpdatedBy: isEditing ? userId : undefined,
                };
                console.log("this row has rowData ", rowData);

                const paymentdetailurl = row.Id
                    ? "https://arohanagroapi.microtechsolutions.co.in/php/updatevoucherdetail.php"
                    : "https://arohanagroapi.microtechsolutions.co.in/php/postvoucherdetail.php";

                console.log(" paymentdetailurl is used ", paymentdetailurl);

                try {
                    const response = await axios.post(
                        paymentdetailurl,
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

            }
            setIsDrawerOpen(false);
            toast.success(
                isEditing
                    ? "payment Voucher updated successfully!"
                    : "payment Voucher Created successfully!"
            );
            resetForm();
            fetchData();
            fetchReceiptdetails();

        } catch (error) {
            console.error("Error submitting payment:", error);
        }
    };
    const dOrCOptions = [
        { value: "D", label: "D" },
        { value: "C", label: "C" },
    ];


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

            // {
            //     accessorKey: 'ChequeNo',
            //     header: 'Cheque No',
            //     size: 150,
            // },

            {
                accessorKey: 'ChequeDate.date',
                header: 'ChequeDate',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

        ];
    }, []);


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
        // setIdwiseData(rowData.Id);
        setAmount(rowData.Amount)
        setReceiptNo(rowData.VoucherNo)
        //receipt date
        const dateStr = rowData.VoucherDate.date.split(" ")[0];
        const [year, month, day] = dateStr.split("-").map(Number); // Convert to numbers
        const formattedDate = `${year}-${month}-${day}`;
        setReceiptDate(formattedDate);

        //Cheque date
        const dateStrc = rowData.ChequeDate.date.split(" ")[0];
        const [yearc, monthc, dayc] = dateStrc.split("-").map(Number); // Convert to numbers
        const formattedChequeDate = `${yearc}-${monthc}-${dayc}`;
        setChequeDate(formattedChequeDate);


        const receiptetail = receiptdetails
            .filter((detail) => detail.VoucherId === rowData.Id);
        if (receiptetail) {
            setAccountId(receiptetail[0].AccountId)
            setNarration(receiptetail[0]?.Narration)
            setAmount(receiptetail[0]?.Amount)
            console.log('amt', receiptetail[0]?.Amount)

        }


        console.log('receiptetail', receiptetail)




        const mappedRows = receiptetail.map((detail) => ({
            Id: detail.Id,
            VoucherId: detail.VoucherId,
            AccountId: detail.AccountId,
            DOrC: detail.DOrC,
            narration: detail.Narration,
            amount: parseFloat(detail.Amount) || 0,
            chequeNo: detail.ChequeNo,
            ChequeDate: detail.ChequeDate?.date.split(" ")[0],
            chequeAmount: parseFloat(detail.ChequeAmount) || 0,
            MICRCode: parseFloat(detail.MICRCode) || 0,
            bankName: detail.BankName,
            bankBranch: detail.BankBranch,
        }));
        console.log('mappedRows', mappedRows)

        setRows(mappedRows)

    };

    const resetForm = () => {
        setReceiptDate('');
        setChequeDate('');
        setAccountId('');
        setSelectedBankOption('');
        setBankName('');
        setAmount('');
        setChequeOrDd('');
        setReceiptNo('');
        setChequeNo('');
        setSelectedCashorbank('');
        setNarration('')

        setRows([{
            AccountId: '',
            DOrC: 'C',
            narration: '',
            amount: '',
            chequeNo: '',
            ChequeDate: '',
            chequeAmount: '',
            MICRCode: '',
            bankName: '',
            bankBranch: ''
        }]);
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
                    "payment Voucher  Deleted successfully!"
                );
            })
            .catch((error) => console.error(error));
    };


    //table drawer
    const [rows, setRows] = useState([
        {
            SerialNo: "",
            AccountId: "",
            amount: "",
            DOrC: "C",
            CostCenterId: 0,
            narration: "",
            chequeNo: 0,
            ChequeDate: "",
            chequeAmount: "",
            MICRCode: "",
            bankName: "",
            bankBranch: "",
            IsOldCheque: "",
            AccountPayeeCheque: "",
        }

    ]);

    ///form table
    //Add Rows
    const handleAddRow = () => {
        const newRow = {
            SerialNo: "",
            AccountId: "",
            amount: "",
            DOrC: "C",
            CostCenterId: 0,
            narration: "",
            chequeNo: "",
            ChequeDate: "",
            chequeAmount: "",
            MICRCode: "",
            bankName: "",
            bankBranch: "",
            IsOldCheque: "",
            AccountPayeeCheque: "",
        };

        console.log("newRow", newRow);
        // Update rows state and ensure the new row is added to the table
        setRows((prevRows) => [...prevRows, newRow]);
    };

    const [TotalDebit, setTotaldebit] = useState("");
    const [TotalCredit, setTotalcredit] = useState("");

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], [field]: value };
        // Special handling for certain fields
        if (field === "DOrC") {
            if (value === "C") {
                updatedRows[index].bankName = bankName; // for Credit
            } else if (value === "D") {
                updatedRows[index].bankName = selectedBankOption; // for Debit
            }
        }
        setRows(updatedRows);
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };
    const [isLoading, setIsLoading] = useState(false);

    return (

        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Payment Voucher</b></Typography>
            </Box>

            <Box sx={{
                //  background: 'rgb(236, 253, 230)', 
                p: 5, height: 'auto'
            }}>

                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Payment Voucher </Button>
                </Box>

                <Box mt={4}>
                    <MaterialReactTable table={table}
                       
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
                            width: isSmallScreen ? "100%" : "80%",
                            zIndex: 1000,
                        },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>

                        <Typography m={2} fontWeight="bold" variant="h6">
                            {isEditing ? "Update Payment Voucher" : "Create Payment Voucher"}
                        </Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                    </Box>
                    <Divider />

                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2 }}>
                                <Box flex={1}>
                                    <Typography>Entry No</Typography>
                                    <TextField
                                        value={receiptNo}
                                        onChange={(e) => setReceiptNo(e.target.value)}
                                        size="small" placeholder="Payment No Autogenrated" fullWidth />
                                </Box>



                                <Box flex={1} >
                                    <Typography>Voucher Date</Typography>
                                    <DatePicker
                                        value={receiptDate ? new Date(receiptDate) : null}
                                        format="dd-MM-yyyy"
                                        onChange={(newValue) => setReceiptDate(newValue)}
                                        slotProps={{
                                            textField: { size: "small", fullWidth: true },
                                        }}
                                    />
                                </Box>


                                <Box flex={2}>
                                    <Typography variant="body2">Cash/Bank Account</Typography>
                                    {/* <Autocomplete
                                        size="small"
                                        options={branchOption}
                                        value={branchOption.find(option => option.value === AccountId) || null}
                                        onChange={(event, newValue) => setAccountId(newValue ? newValue.value : "")}
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.value}>
                                                {option.label}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                        )}
                                    /> */}
                                    <Autocomplete
                                        options={branchOption}
                                        value={
                                            branchOption.find(
                                                (option) => option.value === AccountId
                                            ) || null
                                        }
                                        onChange={(event, newValue) => {
                                            setAccountId(newValue ? newValue.value : null);
                                            if (rows.length > 0) {
                                                handleInputChange(
                                                    0,
                                                    "AccountId",
                                                    newValue ? newValue.value : null
                                                ); // Update first row
                                            }
                                        }}
                                        getOptionLabel={(option) => option.label} // Display only label in dropdown
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select Cash/Bank Name"
                                                size="small"
                                                margin="none"
                                                fullWidth
                                            />
                                        )}
                                    />

                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2, mt: 2 }}>
                                {/* <Box flex={2.2}>
                                    <Typography variant="body2" >Payment Type</Typography>
                                    <FormControl component="fieldset" size="small" margin="none">
                                        <RadioGroup
                                            value={selectedCashorbank}
                                            onChange={(e) => setSelectedCashorbank(e.target.value)}
                                            row // This will display the radio buttons in a row
                                        >
                                            <FormControlLabel value="cash" control={<Radio />} label="Cash" size="small" margin="none" />
                                            <FormControlLabel value="bank" control={<Radio />} label="Bank" size="small" margin="none" />

                                        </RadioGroup>
                                    </FormControl>
                                </Box> */}



                                <Box flex={1}>
                                    <Typography variant="body2">Cheque No</Typography>
                                    <TextField
                                        // value={chequeNo}
                                        // onChange={(e) => setChequeNo(e.target.value)}

                                        value={rows[0]?.chequeNo || ""}
                                        onChange={(e) => handleInputChange(0, "chequeNo", e.target.value)}
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



                            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mr: 19, }}>
                                <Box>
                                    <Typography >
                                        Cash/ Bank Particulars
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isOldCheque}
                                                    onChange={(e) => setIsoldcheque(e.target.checked)}
                                                />
                                            }
                                            label="Is Old Cheque?"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={accountPayeeCheque}
                                                    onChange={(e) => setAccountpayeecheque(e.target.checked)}
                                                />
                                            }
                                            label="Account Payee Cheque?"
                                        />
                                    </Box>
                                </Box>
                            </Box> */}


                            <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2, mt: 2 }}>
                                <Box flex={1}>
                                    <Typography variant="body2">Amount</Typography>
                                    <TextField
                                        value={rows[0]?.amount || ""}
                                        //value={rows.amount}
                                        onChange={(e) => {
                                            handleInputChange(0, "amount", e.target.value);
                                            setTotalcredit(e.target.value);
                                            // If you still need this
                                            setAmount(e.target.value);
                                        }}

                                        size="small" margin="none" placeholder='Amount' fullWidth
                                    />
                                </Box>


                                <Box flex={1}>
                                    <Typography variant="body2">Narration</Typography>
                                    <TextField

                                        value={narration}
                                        onChange={(e) => {
                                            setNarration(e.target.value);
                                            if (rows.length > 0) {
                                                handleInputChange(0, "narration", e.target.value); // Update first row
                                            }
                                        }}

                                        size="small" margin="none" placeholder='Narration' fullWidth
                                    />
                                </Box>
                            </Box>


                            {/* table */}
                            <Box mt={2}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sr No</TableCell>
                                                <TableCell>Account Id</TableCell>
                                                <TableCell>Dr/Cr</TableCell>
                                                <TableCell>Narration</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Cheque No</TableCell>
                                                <TableCell>Cheque Date</TableCell>
                                                <TableCell>Cheque Amount</TableCell>
                                                <TableCell>MICR Code</TableCell>
                                                <TableCell>Bank Name</TableCell>
                                                <TableCell>Bank Branch</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {isLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={12} align="center" sx={{ fontWeight: "bold", color: "blue" }}>
                                                        Loading data...
                                                    </TableCell>
                                                </TableRow>
                                            ) : rows.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={12} align="center" sx={{ fontWeight: "bold", color: "red" }}>
                                                        No data available
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                rows.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{index + 1}</TableCell>

                                                        <TableCell>
                                                            {index === 0 ? (
                                                                branchOption.find(option => option.value === AccountId)?.label || ""
                                                            ) : (
                                                                // <Autocomplete
                                                                //     size="small"
                                                                //     options={branchOption}
                                                                //     value={branchOption.find(option => option.value === AccountId) || null}
                                                                //     onChange={(event, newValue) =>
                                                                //         handleInputChange(
                                                                //           index,
                                                                //           "AccountId",
                                                                //           newValue ? newValue.value : ""
                                                                //         )
                                                                //       }
                                                                //     // onChange={(event, newValue) => setAccountId(newValue ? newValue.value : "")}
                                                                //     getOptionLabel={(option) => option.label}
                                                                //     renderOption={(props, option) => (
                                                                //         <li {...props} key={option.value}>
                                                                //             {option.label}
                                                                //         </li>
                                                                //     )}
                                                                //     renderInput={(params) => (
                                                                //         <TextField {...params} fullWidth />
                                                                //     )}
                                                                // />
                                                                <Autocomplete
                                                                    options={branchOption}
                                                                    value={
                                                                        branchOption.find(
                                                                            (option) => option.value === row.AccountId
                                                                        ) || null
                                                                    }
                                                                    onChange={(event, newValue) =>
                                                                        handleInputChange(
                                                                            index,
                                                                            "AccountId",
                                                                            newValue ? newValue.value : ""
                                                                        )
                                                                    }
                                                                    sx={{ width: "200px" }} // Set width
                                                                    getOptionLabel={(option) => option.label}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            placeholder="Select Acc"
                                                                            size="big"
                                                                            fullWidth
                                                                            sx={{
                                                                                "& .MuiInputBase-root": {
                                                                                    height: "50px",
                                                                                    width: "200px", // Adjust height here
                                                                                },
                                                                                "& .MuiInputBase-input": {
                                                                                    padding: "14px", // Adjust padding for better alignment
                                                                                },
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            {index === 0 ? (
                                                                row.DOrC || "C"
                                                            ) : (
                                                                <Autocomplete
                                                                    options={dOrCOptions}
                                                                    value={
                                                                        dOrCOptions.find((option) => option.value === row.DOrC) || null
                                                                    }
                                                                    onChange={(event, newValue) =>
                                                                        handleInputChange(index, "DOrC", newValue ? newValue.value : "")
                                                                    }
                                                                    getOptionLabel={(option) => option.label}
                                                                    sx={{ width: 150 }}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            placeholder="Select DOrC"
                                                                            size="small"
                                                                            sx={{ width: '80px' }}

                                                                        // sx={{
                                                                        //     "& .MuiInputBase-root": { height: "50px" },
                                                                        //     "& .MuiInputBase-input": { padding: "14px" },
                                                                        // }}
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            {index === 0 ? (
                                                                row.narration
                                                            ) : (
                                                                <TextField
                                                                    type="text"
                                                                    value={row.narration}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (value.length <= 500) {
                                                                            handleInputChange(index, "narration", value);
                                                                        }
                                                                    }}
                                                                    placeholder="Enter Narration"
                                                                    sx={{ width: '150px' }}
                                                                    size="small"

                                                                />
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                value={row.amount}
                                                                onChange={(e) =>
                                                                    handleInputChange(index, "amount", e.target.value)
                                                                }
                                                                placeholder="Amount"
                                                                sx={{ width: '150px' }}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <TextField
                                                                type="text"
                                                                value={row.chequeNo}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value.length <= 15) {
                                                                        handleInputChange(index, "chequeNo", value);
                                                                    }
                                                                }}
                                                                placeholder="ChequeNo"
                                                                sx={{ width: '150px' }}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        {/* <TableCell>
                                                            <TextField
                                                                type="date"
                                                                value={row.ChequeDate}
                                                                onChange={(e) =>
                                                                    handleInputChange(index, "ChequeDate", e.target.value)
                                                                }
                                                                fullWidth
                                                                size="small"
                                                            />
                                                        </TableCell> */}
                                                        <TableCell>
                                                            
                                                                <DatePicker
                                                                    value={row.ChequeDate ? new Date(row.ChequeDate) : null}
                                                                    onChange={(newValue) =>
                                                                        handleInputChange(index, "ChequeDate", newValue)
                                                                    }
                                                                    slotProps={{
                                                                        textField: { 
                                                                            size: "small",
                                                                            sx: { width: '150px' }  // or style: { width: '500px' }
                                                                        },
                                                                    }}
                                                                />
                                                         
                                                        </TableCell>

                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                value={row.chequeAmount}
                                                                onChange={(e) =>
                                                                    handleInputChange(index, "chequeAmount", e.target.value)
                                                                }
                                                                placeholder="Cheque Amount"
                                                                sx={{ width: '150px' }}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <TextField
                                                                type="text"
                                                                value={row.MICRCode}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value.length <= 30) {
                                                                        handleInputChange(index, "MICRCode", value);
                                                                    }
                                                                }}
                                                                placeholder="MICR Code"
                                                                sx={{ width: '150px' }}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        {/* <TableCell>
                                                            <TextField
                                                                type="text"
                                                                value={row.bankName}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value.length <= 50) {
                                                                        handleInputChange(index, "bankName", value);
                                                                    }
                                                                }}
                                                                placeholder="Bank Name"
                                                                fullWidth
                                                                size="small"
                                                            />
                                                        </TableCell> */}
                                                        <TableCell>
                                                            {row.DOrC === "C" ? (
                                                                <TextField
                                                                    type="text"
                                                                    value={row.bankName}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (value.length <= 50) {
                                                                            handleInputChange(index, "bankName", value);
                                                                        }
                                                                    }}
                                                                    placeholder="Bank Name"
                                                                    sx={{ width: '150px' }}
                                                                    size="small"
                                                                />
                                                            ) : (
                                                                <FormControl fullWidth size="small">
                                                                    <Select
                                                                        value={row.bankName || ""}
                                                                        onChange={(event) => {
                                                                            const selectedValue = event.target.value;
                                                                            handleInputChange(index, "bankName", selectedValue);
                                                                        }}
                                                                    >
                                                                        {bankOptions.map((option) => (
                                                                            <MenuItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            )}
                                                        </TableCell>


                                                        <TableCell>
                                                            <TextField
                                                                type="text"
                                                                value={row.bankBranch}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value.length <= 50) {
                                                                        handleInputChange(index, "bankBranch", value);
                                                                    }
                                                                }}
                                                                placeholder="Bank Branch"
                                                                sx={{ width: '150px' }}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <Box style={{ display: "flex", justifyContent: "space-between" }}>
                                                                <Button
                                                                    onClick={handleAddRow}
                                                                    sx={{ backgroundColor: "#074e2c", color: "white", mr: 1 }}
                                                                >
                                                                    <AddIcon />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleDeleteRow(index)}
                                                                    sx={{ backgroundColor: "red", color: "white" }}
                                                                >
                                                                    <DeleteIcon />
                                                                </Button>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

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
            </Box >
        </Box >
    )
}
export default Payment



