import  { useMemo, useState, useEffect } from 'react'
import { Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Table, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, useMediaQuery, Button, Typography, TextField, Drawer, Divider, Autocomplete, FormControl, Select, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material';
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
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import logonew from '../imgs/logo_white.png'

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

    const [amount, setAmount] = useState('');

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
            //  console.log('storedUserId', storedUserId);
        } else {
            toast.error("User is not logged in.");
        }

        if (storedYearId) {
            setYearId(storedYearId);
            //console.log('storedYearId', storedYearId);
        } else {
            toast.error("Year is not set.");
        }
    }, [userId, yearid]);



    //fetch Party
    const [branchOption, setBranchOption] = useState([]);
    const [AccountId, setAccountId] = useState('')

    //fetch Bank
    
    const fetchBranch = async () => {
    try {
        const response = await fetch(
            "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=Account"
        );
        const result = await response.json();

        // Filter accounts with GroupId = 7 or 8
        const filtered = result.filter(
            (branch) => branch.GroupId === 7 || branch.GroupId === 8
        );

        const options = filtered.map((branch) => ({
            value: branch.Id,
            label: branch.AccountName,
        }));

        setBranchOption(options);
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
};

    
    
    
    const [bankOptions, setBankOptions] = useState([]);
    const [selectedBankOption, setSelectedBankOption] = useState("");
  useEffect(() => {
        const fetchOptions = async () => {
            try {
                const urls = [
                    "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=GroupId&Colvalue=7",
                    "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=GroupId&Colvalue=8"
                ];

                const responses = await Promise.all(urls.map(url => axios.get(url)));
                const combinedData = responses.flatMap(response => response.data || []);

                const options = combinedData.map(item => ({
                    label: item.AccountName,
                    value: item.GroupId
                }));

                setBankOptions(options);
            } catch (error) {
                console.error("Failed to fetch bank options", error);
            }
        };


        fetchOptions();
    }, []);
const [accountOption, setAccountOption] = useState([]); 
    const fetchAllAccounts = async () => {
    try {
        const response = await fetch(
            "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=Account"
        );

        const result = await response.json();

        const allAccountOptions = result.map((account) => ({
            value: account.Id,
            label: account.AccountName,
        }));

        setAccountOption(allAccountOptions);
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
};



    //table
    const [pageNo, setPageNo] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);
    const fetchData = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        try {
            const response = await fetch(`https://arohanagroapi.microtechsolutions.net.in/php/get/getvoucherbypage.php?VoucherType=PY&PageNo=${pageNo}`, requestOptions);
            const result = await response.json();

            //  console.log("Fetched result:", result.data);

            setData(result.data);
            setTotalPages(result.total_pages)

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [pageNo]);

    useEffect(() => {
       fetchAllAccounts();
        fetchBranch();
        fetchReceiptdetails();
    }, []);


    //  api to call fetchPAYMENTdetails
    const [receiptdetails, setReceiptdetails] = useState([]);

    const fetchReceiptdetails = async () => {
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=VoucherDetail"
            );
            setReceiptdetails(response.data);
            //console.log('detail', response.data)
        } catch (error) { }
    };


    //create and update receipt voucher
    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const [index, row] of rows.entries()) {
            const formattedVoucherdate = moment(receiptDate).format("YYYY-MM-DD");
            const formattedchequedate = row.ChequeDate
                ? moment(row.ChequeDate).format("YYYY-MM-DD")
                : null;

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
                    ? "https://arohanagroapi.microtechsolutions.net.in/php/updatevoucherhd.php"
                    : "https://arohanagroapi.microtechsolutions.net.in/php/postvoucherhd.php";


                const response = await axios.post(
                    invoiceurl,
                    qs.stringify(paymentheaderdata),
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    }
                );
                //console.log('postinwardheaders', paymentheaderdata)

                let PaymentId = rowId ? rowId : parseInt(response.data.ID, 10);
                //console.log("Payment Id ", PaymentId);
                console.log("rows", rows);

                for (const [index, row] of rows.entries()) {
                    const formattedVoucherdate = moment(receiptDate).format("YYYY-MM-DD");
                    const formattedchequedate = row.ChequeDate
                        ? moment(row.ChequeDate).format("YYYY-MM-DD")
                        : null;

                    const rowData = {
                        Id: parseInt(row.Id, 10),
                        VoucherId: parseInt(PaymentId, 10),
                        VoucherType: "PY",
                        SRN: rows.indexOf(row) + 1,
                        VoucherNo: receiptNo ? receiptNo : null,
                        VoucherDate: formattedVoucherdate,
                        AccountId: row.AccountId, 
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
                    //console.log("this row has rowData ", rowData);

                    const paymentdetailurl = row.Id
                        ? "https://arohanagroapi.microtechsolutions.net.in/php/updatevoucherdetail.php"
                        : "https://arohanagroapi.microtechsolutions.net.in/php/postvoucherdetail.php";

                    //console.log(" paymentdetailurl is used ", paymentdetailurl);

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
                        // console.log("Response:", response);
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
        }
    };

    

    const dOrCOptions = [
        { value: "D", label: "D" },
        { value: "C", label: "C" },
    ];

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
                Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
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
                accessorKey: 'ChequeDate.date',
                header: 'ChequeDate',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

              {
                accessorKey: 'AccountName',
                header: 'Party Name',
                size: 150,
                
            },


             {
                accessorKey: 'Amount',
                header: 'Amount',
                size: 150,
              
            },

            {
                header: 'Actions',
                size: 200,
                Cell: ({ row }) => (
                    <Box display="flex" gap={1}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'var(--primary-color)' }}
                            onClick={() => handleEdit(row.original)}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="contained"
                            sx={{ background: 'var(--complementary-color)' }}
                            size="small"
                            onClick={() => {
                                const invdetail = receiptdetails
                                    .filter((detail) => detail.VoucherId === row.original.Id)
                              
                                setPreviewData({ ...row.original, invdetail });
                                setPreviewOpen(true);
                                console.log('previewdata', previewData)
                            }}
                        >
                            Preview
                        </Button>

                    </Box>
                ),
            },

        ];
    }, [data]);



    const table = useMaterialReactTable({
        columns,
        data: data,
        enablePagination: false,
        muiTableHeadCellProps: {
            style: {
                backgroundColor: "#E9ECEF",
                color: "black",
                fontSize: "16px",
            },
        },
       
        renderBottomToolbarCustomActions: () => (
            <Box
                mt={2}
                alignItems="center"
                display="flex"
                justifyContent="flex-end"
                width="100%"
            >
                <FirstPageIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPageNo(1)}
                />
                <KeyboardArrowLeftIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPageNo((prev) => Math.max(Number(prev) - 1, 1))}
                />
                <Box>Page No</Box>
                <TextField
                    sx={{
                        width: "4.5%",
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
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPageNo((prev) => Number(prev) + 1)}
                />
                <LastPageIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPageNo(totalPages)}
                />
                <Box>Total Pages: {totalPages}</Box>
            </Box>
        ),
    });


   

const handleEdit = (rowData) => {
    console.log("This row has been clicked:", rowData);
    setRowId(rowData.Id);
    setIsDrawerOpen(true);
    setIsEditing(!!rowData.Id);
    setAmount(rowData.Amount);
    setReceiptNo(rowData.VoucherNo);

    // Receipt date (safe check)
    if (rowData.VoucherDate?.date) {
        const dateStr = rowData.VoucherDate.date.split(" ")[0];
        const [year, month, day] = dateStr.split("-").map(Number);
        const formattedDate = `${year}-${month}-${day}`;
        setReceiptDate(formattedDate);
    } else {
        setReceiptDate(""); // or null
    }


    // Cheque date (safe check)
    if (rowData.ChequeDate?.date) {
        const dateStrc = rowData.ChequeDate.date.split(" ")[0];
        const [yearc, monthc, dayc] = dateStrc.split("-").map(Number);
        const formattedChequeDate = `${yearc}-${monthc}-${dayc}`;
        setChequeDate(formattedChequeDate);
    } else {
        setChequeDate(""); 
    }

    // Receipt details
    const receiptetail = receiptdetails.filter(
        (detail) => detail.VoucherId === rowData.Id
    );

    if (receiptetail.length > 0) {
        setAccountId(receiptetail[0].AccountId);
        setNarration(receiptetail[0]?.Narration);
        setAmount(receiptetail[0]?.Amount);
    }

    console.log("receiptetail", receiptetail);

    const mappedRows = receiptetail.map((detail) => ({
        Id: detail.Id,
        VoucherId: detail.VoucherId,
        AccountId: detail.AccountId,
        DOrC: detail.DOrC,
        narration: detail.Narration,
        amount: parseFloat(detail.Amount) || 0,
        chequeNo: detail.ChequeNo,
        ChequeDate: detail.ChequeDate?.date
            ? detail.ChequeDate.date.split(" ")[0]
            : "",
        chequeAmount: parseFloat(detail.ChequeAmount) || 0,
        MICRCode: parseFloat(detail.MICRCode) || 0,
        bankName: detail.BankName,
        bankBranch: detail.BankBranch,
    }));

    setRows(mappedRows);
};





    const resetForm = () => {
        setReceiptDate('');
        setChequeDate('');
        setAccountId('');
        setSelectedBankOption('');
        setBankName('');
        setAmount('');
       
        setReceiptNo('');
        setChequeNo('');
   
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

        // console.log("Deleted Id:", rowId);

        fetch(`https://arohanagroapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=VoucherHD&Id=${rowId}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log(result);
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
            // DOrC: "C",
            DOrC: rows.length === 0 ? "C" : "D", 
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

        // console.log("newRow", newRow);
        // Update rows state and ensure the new row is added to the table
        setRows((prevRows) => [...prevRows, newRow]);
    };

    
const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    
    // Special handling for certain fields
    if (field === "DOrC") {
        if (value === "C") {
            updatedRows[index].bankName = bankName; // for Credit
        } else if (value === "D") {
            updatedRows[index].bankName = selectedBankOption; // for Debit
            
            // Fetch all accounts when switching to Debit
            if (index !== 0) { // Don't fetch for first row if it's special
                fetchAllAccounts();
            }
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


                {/* ///for preview///////// */}.
                <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} />
                            <Typography variant="h6">Arohan Agro Kolhapur</Typography>

                        </Box>
                        <Typography sx={{ mt: 1 }}>
                            Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Payment Voucher Preview
                        </Typography>



                    </DialogTitle>
                    <DialogContent dividers>
                        <Box>
                            {previewData ? (
                                <Box>
                                    <Box display={'flex'} justifyContent={'space-between'} gap={2}>
                                        <Typography><strong>Entry No:</strong> {previewData.VoucherNo}</Typography>
                                        <Typography>
                                            <strong>Voucher Date:</strong>{" "}
                                            {new Date(previewData.VoucherDate.date).toLocaleDateString()}
                                        </Typography>
                                    </Box>

                                    <Box display={'flex'} justifyContent={'space-between'} gap={2} mt={2}>

                                        {/* <Box><Typography><strong>Cheque No:</strong> {previewData.ChequeNo}</Typography></Box> */}
                                        <Box><Typography><strong>Cheque Date:</strong>{" "} {new Date(previewData.ChequeDate.date).toLocaleDateString()}</Typography></Box>
                                        <Box><Typography> <strong>Amount:</strong> {previewData?.invdetail?.[0]?.Amount ?? 'N/A'}</Typography></Box>
                                        <Box><Typography><strong>Narration:</strong> {previewData.Narration}</Typography></Box>
                                    </Box>
                                    <Divider sx={{ mt: 2 }} />



                                    {/* ////////// */}

                                    <Grid item xs={12} md={8}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom mt={2}>
                                            Payment Voucher Details
                                        </Typography>

                                        <TableContainer component={Paper} elevation={2} sx={{ width: '100%', mt: 2 }}>
                                            <Table size="small">
                                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                                    <TableRow>
                                                        <TableCell><strong>Account</strong></TableCell>
                                                        <TableCell><strong>Dr/Cr</strong></TableCell>
                                                        <TableCell><strong>Narration</strong></TableCell>
                                                        <TableCell><strong>Amount (Rs)</strong></TableCell>
                                                        <TableCell><strong>Cheque No</strong></TableCell>
                                                        <TableCell><strong>Cheque Date</strong></TableCell>
                                                        <TableCell><strong>Cheque Amount(Rs)</strong></TableCell>
                                                        <TableCell><strong>MICR Code</strong></TableCell>
                                                        <TableCell><strong>Bank Name</strong></TableCell>
                                                        <TableCell><strong>Bank Branch</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {previewData.invdetail.map((item, index) => {
                                                        const accountName = branchOption.find(
                                                            (opt) => opt.value.toString() === item.AccountId?.toString()
                                                        )?.label || "Unknown";

                                                        // Get bank name - similar logic to your edit table
                                                        const bankNameDisplay = item.DOrC === "C"
                                                            ? item.BankName || "0"
                                                            : (bankOptions.find(opt => opt.value === item.BankName)?.label || item.BankName || "0");

                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>{accountName}</TableCell>
                                                                <TableCell>{item.DOrC}</TableCell>
                                                                <TableCell>{item.Narration}</TableCell>
                                                                <TableCell>{item.Amount}</TableCell>
                                                                <TableCell>{item.ChequeNo || "0"}</TableCell>
                                                                <TableCell>{item.ChequeDate?.date ? item.ChequeDate.date.substring(0, 10) : "0"}</TableCell>
                                                                <TableCell>{item.ChequeAmount || "0"}</TableCell>
                                                                <TableCell>{item.MICRCode || "0"}</TableCell>
                                                                <TableCell>{bankNameDisplay}</TableCell>
                                                                <TableCell>{item.BankBranch || "0"}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>

                                </Box>
                            ) : (
                                <Typography>No data to preview</Typography>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        {/* <Button onClick={generatePDF} color="primary" ><PrintIcon sx={{fontSize:35}}/></Button> */}
                        <Button variant='contained' onClick={() => setPreviewOpen(false)} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>


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
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:after': {
                                                borderBottomWidth: 1.5,
                                                borderBottomColor: '#44ad74',
                                            }, mt: 1
                                        }}
                                        focused
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

                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomWidth: 1.5,
                                                        borderBottomColor: '#44ad74',
                                                    }, mt: 1
                                                }}
                                                focused
                                            />
                                        )}
                                    />

                                  
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2, mt: 2 }}>




                                <Box flex={1}>
                                    <Typography variant="body2">Cheque No</Typography>
                                    <TextField
                                        // value={chequeNo}
                                        // onChange={(e) => setChequeNo(e.target.value)}
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:after': {
                                                borderBottomWidth: 1.5,
                                                borderBottomColor: '#44ad74',
                                            }, mt: 1
                                        }}
                                        focused
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
                                        onChange={(newValue) => {
                                            setChequeDate(newValue);

                                            // Update only row 0's ChequeDate
                                            const updatedRows = [...rows];
                                            if (updatedRows.length > 0) {
                                                updatedRows[0] = {
                                                    ...updatedRows[0],
                                                    ChequeDate: newValue,
                                                };
                                            }
                                            setRows(updatedRows);
                                        }}
                                        slotProps={{
                                            textField: { size: "small", fullWidth: true },
                                        }}
                                    />

                                </Box>
                            </Box>



                         

                            <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2, mt: 2 }}>
                                <Box flex={1}>
                                    <Typography variant="body2">Amount</Typography>
                                    <TextField
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:after': {
                                                borderBottomWidth: 1.5,
                                                borderBottomColor: '#44ad74',
                                            }, mt: 1
                                        }}
                                        focused
                                        value={rows[0]?.amount || ""}
                                        
                                        onChange={(e) => {
                                            handleInputChange(0, "amount", e.target.value);
                                           
                                            setAmount(e.target.value);
                                        }}

                                        size="small" margin="none" placeholder='Amount' fullWidth
                                    />
                                </Box>


                                <Box flex={1}>
                                    <Typography variant="body2">Narration</Typography>
                                    <TextField
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:after': {
                                                borderBottomWidth: 1.5,
                                                borderBottomColor: '#44ad74',
                                            }, mt: 1
                                        }}
                                        focused
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
                                                                <Autocomplete
                                                                    options={row.DOrC === "D" ? accountOption : branchOption}
                                                                    value={
                                                                        (row.DOrC === "D" ? accountOption : branchOption).find(
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
                                                                    sx={{ width: "200px" }}
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
                                                                                    width: "200px",
                                                                                },
                                                                                "& .MuiInputBase-input": {
                                                                                    padding: "14px",
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

                                                     
                                                        <TableCell>
                                                            {index === 0 ? (
                                                               
                                                                <DatePicker
                                                                    value={chequeDate ? new Date(chequeDate) : null}
                                                                    format="dd-MM-yyyy"
                                                                    onChange={(newValue) => {
                                                                        setChequeDate(newValue);
                                                                        handleInputChange(0, "ChequeDate", newValue); 
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            size: "small",
                                                                            sx: { width: '150px' },
                                                                        },
                                                                    }}
                                                                />
                                                            ) : (
                                                                
                                                                <DatePicker
                                                                    value={row.ChequeDate ? new Date(row.ChequeDate) : null}
                                                                    format="dd-MM-yyyy"
                                                                    onChange={(newValue) => handleInputChange(index, "ChequeDate", newValue)}
                                                                    slotProps={{
                                                                        textField: {
                                                                            size: "small",
                                                                            sx: { width: '150px' },
                                                                        },
                                                                    }}
                                                                />
                                                            )}
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








































//main

// import React, { useMemo, useState, useEffect } from 'react'
// import { Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Table, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, useMediaQuery, Button, Typography, TextField, Drawer, Divider, Autocomplete, FormControl, Select, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { MaterialReactTable, } from 'material-react-table';
// import { useTheme } from "@mui/material/styles";
// import { toast } from "react-toastify";
// import axios from 'axios';
// import { useMaterialReactTable, } from "material-react-table";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import Cookies from 'js-cookie';
// import moment from 'moment';
// import qs from "qs";
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import LastPageIcon from '@mui/icons-material/LastPage';
// import FirstPageIcon from '@mui/icons-material/FirstPage';
// import autoTable from 'jspdf-autotable';
// import jsPDF from 'jspdf';
// import PrintIcon from '@mui/icons-material/Print';
// import logonew from '../imgs/logo_white.png'

// const Payment = () => {
//     const theme = useTheme();
//     const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);



//     const handleDrawerOpen = () => {
//         setIsDrawerOpen(true);
//         resetForm();
//         // setRowId('')
//         setIsEditing(false);
//     };

//     const handleDrawerClose = () => {
//         setRowId('')
//         setIsDrawerOpen(false);
//         resetForm()
//     };
//     const [rowId, setRowId] = useState('');

//     const [receiptNo, setReceiptNo] = useState();
//     const [receiptDate, setReceiptDate] = useState(null);
//     const [selectedCashorbank, setSelectedCashorbank] = useState("");
//     const [amount, setAmount] = useState('');
//     // const [chequeOrDD, setChequeOrDd] = useState('cheque');
//     const [bankName, setBankName] = useState('');
//     const [chequeNo, setChequeNo] = useState();
//     const [chequeDate, setChequeDate] = useState(null);
//     const [narration, setNarration] = useState('');
//     const [isOldCheque, setIsoldcheque] = useState(false);
//     const [accountPayeeCheque, setAccountpayeecheque] = useState(false);
//     //yearId and userId
//     const [userId, setUserId] = useState('')
//     const [yearid, setYearId] = useState('');

//     useEffect(() => {
//         const storedUserId = sessionStorage.getItem("UserId");
//         const storedYearId = Cookies.get("YearId");

//         if (storedUserId) {
//             setUserId(storedUserId);
//             //  console.log('storedUserId', storedUserId);
//         } else {
//             toast.error("User is not logged in.");
//         }

//         if (storedYearId) {
//             setYearId(storedYearId);
//             //console.log('storedYearId', storedYearId);
//         } else {
//             toast.error("Year is not set.");
//         }
//     }, [userId, yearid]);



//     //fetch Party
//     const [branchOption, setBranchOption] = useState([]);
//     const [AccountId, setAccountId] = useState('')

//     // const fetchBranch = async () => {
//     //     try {
//     //         const response = await fetch(
//     //             "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=Account"
//     //         );
//     //         const result = await response.json();
//     //         //  console.log("Branch info:", result);
//     //         const options = result.map((branch) => ({
//     //             value: branch.Id,
//     //             label: branch.AccountName,
//     //         }));
//     //         setBranchOption(options);
//     //     } catch (error) {
//     //         console.error("Error fetching accounts:", error);
//     //     }
//     // };


//     //fetch Bank
    
//     const fetchBranch = async () => {
//     try {
//         const response = await fetch(
//             "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=Account"
//         );
//         const result = await response.json();

//         // Filter accounts with GroupId = 7 or 8
//         const filtered = result.filter(
//             (branch) => branch.GroupId === 7 || branch.GroupId === 8
//         );

//         const options = filtered.map((branch) => ({
//             value: branch.Id,
//             label: branch.AccountName,
//         }));

//         setBranchOption(options);
//     } catch (error) {
//         console.error("Error fetching accounts:", error);
//     }
// };

    
    
    
//     const [bankOptions, setBankOptions] = useState([]);
//     const [selectedBankOption, setSelectedBankOption] = useState("");
//   useEffect(() => {
//         const fetchOptions = async () => {
//             try {
//                 const urls = [
//                     "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=GroupId&Colvalue=7",
//                     "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=GroupId&Colvalue=8"
//                 ];

//                 const responses = await Promise.all(urls.map(url => axios.get(url)));
//                 const combinedData = responses.flatMap(response => response.data || []);

//                 const options = combinedData.map(item => ({
//                     label: item.AccountName,
//                     value: item.GroupId
//                 }));

//                 setBankOptions(options);
//             } catch (error) {
//                 console.error("Failed to fetch bank options", error);
//             }
//         };


//         fetchOptions();
//     }, []);
//     // useEffect(() => {
//     //     const fetchOptions = async () => {
//     //         try {
//     //             const urls = [
//     //                 "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=AccountGroup&Colname=GroupCode&Colvalue=7",
//     //                 "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=AccountGroup&Colname=GroupCode&Colvalue=8"
//     //             ];

//     //             const responses = await Promise.all(urls.map(url => axios.get(url)));
//     //             const combinedData = responses.flatMap(response => response.data || []);

//     //             const options = combinedData.map(item => ({
//     //                 label: item.GroupName,
//     //                 value: item.GroupCode
//     //             }));

//     //             setBankOptions(options);
//     //         } catch (error) {
//     //             console.error("Failed to fetch bank options", error);
//     //         }
//     //     };

//     //     fetchOptions();
//     // }, []);

//     //table
//     const [pageNo, setPageNo] = useState(1)
//     const [totalPages, setTotalPages] = useState(1);
//     const [data, setData] = useState([]);
//     const fetchData = async () => {
//         const requestOptions = {
//             method: "GET",
//             redirect: "follow"
//         };

//         try {
//             const response = await fetch(`https://arohanagroapi.microtechsolutions.net.in/php/get/getvoucherbypage.php?VoucherType=PY&PageNo=${pageNo}`, requestOptions);
//             const result = await response.json();

//             //  console.log("Fetched result:", result.data);

//             setData(result.data);
//             setTotalPages(result.total_pages)

//         } catch (error) {
//             console.error(error);
//         }
//     };
//     useEffect(() => {
//         fetchData();
//     }, [pageNo]);

//     useEffect(() => {

//         fetchBranch();
//         fetchReceiptdetails();
//     }, []);


//     //  api to call fetchPAYMENTdetails
//     const [receiptdetails, setReceiptdetails] = useState([]);

//     const fetchReceiptdetails = async () => {
//         try {
//             const response = await axios.get(
//                 "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=VoucherDetail"
//             );
//             setReceiptdetails(response.data);
//             //console.log('detail', response.data)
//         } catch (error) { }
//     };


//     //create and update receipt voucher
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         for (const [index, row] of rows.entries()) {
//             const formattedVoucherdate = moment(receiptDate).format("YYYY-MM-DD");
//             const formattedchequedate = row.ChequeDate
//                 ? moment(row.ChequeDate).format("YYYY-MM-DD")
//                 : null;

//             const paymentheaderdata = {
//                 Id: rowId,
//                 VoucherType: "PY",
//                 VoucherNo: receiptNo ? receiptNo : null,
//                 VoucherDate: formattedVoucherdate,
//                 ChequeNo: chequeNo,
//                 ChequeDate: formattedchequedate,
//                 Narration: narration,
//                 CreatedBy: !isEditing ? userId : undefined,
//                 UpdatedBy: isEditing ? userId : undefined,
//             };

//             try {
//                 const invoiceurl = rowId
//                     ? "https://arohanagroapi.microtechsolutions.net.in/php/updatevoucherhd.php"
//                     : "https://arohanagroapi.microtechsolutions.net.in/php/postvoucherhd.php";


//                 const response = await axios.post(
//                     invoiceurl,
//                     qs.stringify(paymentheaderdata),
//                     {
//                         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//                     }
//                 );
//                 //console.log('postinwardheaders', paymentheaderdata)

//                 let PaymentId = rowId ? rowId : parseInt(response.data.ID, 10);
//                 //console.log("Payment Id ", PaymentId);
//                 console.log("rows", rows);

//                 for (const [index, row] of rows.entries()) {
//                     const formattedVoucherdate = moment(receiptDate).format("YYYY-MM-DD");
//                     const formattedchequedate = row.ChequeDate
//                         ? moment(row.ChequeDate).format("YYYY-MM-DD")
//                         : null;

//                     const rowData = {
//                         Id: parseInt(row.Id, 10),
//                         VoucherId: parseInt(PaymentId, 10),
//                         VoucherType: "PY",
//                         SRN: rows.indexOf(row) + 1,
//                         VoucherNo: receiptNo ? receiptNo : null,
//                         VoucherDate: formattedVoucherdate,
//                         AccountId: parseInt(row.AccountId, 10),
//                         Amount: parseFloat(row.amount),
//                         DOrC: index === 0 ? "C" : row.DOrC,
//                         Narration: row.narration,
//                         CostCenterId: row.CostCenterId,
//                         ChequeNo: row.chequeNo,
//                         ChequeDate: formattedchequedate,
//                         ChequeAmount: row.chequeAmount,
//                         MICRCode: row.MICRCode,
//                         BankName: row.bankName,
//                         BankBranch: row.bankBranch,
//                         IsOldCheque: isOldCheque,
//                         AccountPayeeCheque: accountPayeeCheque,
//                         CreatedBy: !isEditing ? userId : undefined,
//                         UpdatedBy: isEditing ? userId : undefined,
//                     };
//                     //console.log("this row has rowData ", rowData);

//                     const paymentdetailurl = row.Id
//                         ? "https://arohanagroapi.microtechsolutions.net.in/php/updatevoucherdetail.php"
//                         : "https://arohanagroapi.microtechsolutions.net.in/php/postvoucherdetail.php";

//                     //console.log(" paymentdetailurl is used ", paymentdetailurl);

//                     try {
//                         const response = await axios.post(
//                             paymentdetailurl,
//                             qs.stringify(rowData),
//                             {
//                                 headers: {
//                                     "Content-Type": "application/x-www-form-urlencoded",
//                                 },
//                             }
//                         );
//                         // console.log("Response:", response);
//                     } catch (error) {
//                         console.error("Error:", error);
//                     }

//                 }
//                 setIsDrawerOpen(false);
//                 toast.success(
//                     isEditing
//                         ? "payment Voucher updated successfully!"
//                         : "payment Voucher Created successfully!"
//                 );
//                 resetForm();
//                 fetchData();
//                 fetchReceiptdetails();

//             } catch (error) {
//                 console.error("Error submitting payment:", error);
//             }
//         }
//     };

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();

//     //     try {
//     //         // Format header date safely
//     //         const formattedVoucherDate = receiptDate
//     //             ? moment(receiptDate).format("YYYY-MM-DD HH:mm:ss")
//     //             : null;

//     //         // Build header payload
//     //         const paymentHeaderData = {
//     //             Id: rowId || null,
//     //             VoucherType: "PY",
//     //             VoucherNo: receiptNo || null,
//     //             VoucherDate: formattedVoucherDate,
//     //             ChequeNo: chequeNo || null,
//     //             ChequeDate: null, // header-level cheque date (optional, can be set if needed)
//     //             Narration: narration || null,
//     //             CreatedBy: !isEditing ? userId : null,
//     //             UpdatedBy: isEditing ? userId : null,
//     //         };

//     //         // Remove undefined values
//     //         Object.keys(paymentHeaderData).forEach(
//     //             (key) =>
//     //                 paymentHeaderData[key] === undefined &&
//     //                 delete paymentHeaderData[key]
//     //         );

//     //         // Decide header URL
//     //         const invoiceUrl = rowId
//     //             ? "https://arohanagroapi.microtechsolutions.net.in/php/updatevoucherhd.php"
//     //             : "https://arohanagroapi.microtechsolutions.net.in/php/postvoucherhd.php";

//     //         // Post header
//     //         const headerResponse = await axios.post(
//     //             invoiceUrl,
//     //             qs.stringify(paymentHeaderData),
//     //             {
//     //                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     //             }
//     //         );

//     //         // Get PaymentId
//     //         const PaymentId = rowId ? rowId : parseInt(headerResponse.data.ID, 10);

//     //         console.log("PaymentId:", PaymentId);

//     //         // Loop through detail rows
//     //         for (const [index, row] of rows.entries()) {
//     //             const formattedVoucherDateDetail = receiptDate
//     //                 ? moment(receiptDate).format("YYYY-MM-DD HH:mm:ss")
//     //                 : null;

//     //             const formattedChequeDateDetail = row.ChequeDate
//     //                 ? moment(row.ChequeDate).format("YYYY-MM-DD HH:mm:ss")
//     //                 : null;

//     //             const rowData = {
//     //                 Id: row.Id ? parseInt(row.Id, 10) : null,
//     //                 VoucherId: parseInt(PaymentId, 10),
//     //                 VoucherType: "PY",
//     //                 SRN: index + 1,
//     //                 VoucherNo: receiptNo || null,
//     //                 VoucherDate: formattedVoucherDateDetail,
//     //                 AccountId: row.AccountId ? parseInt(row.AccountId, 10) : null,
//     //                 Amount: row.amount ? parseFloat(row.amount) : 0,
//     //                 DOrC: index === 0 ? "C" : row.DOrC || "D",
//     //                 Narration: row.narration || null,
//     //                 CostCenterId: row.CostCenterId || null,
//     //                 ChequeNo: row.chequeNo || null,
//     //                 ChequeDate: formattedChequeDateDetail,
//     //                 ChequeAmount: row.chequeAmount ? parseFloat(row.chequeAmount) : 0,
//     //                 MICRCode: row.MICRCode || null,
//     //                 BankName: row.bankName || null,
//     //                 BankBranch: row.bankBranch || null,
//     //                 IsOldCheque: isOldCheque || null,
//     //                 AccountPayeeCheque: accountPayeeCheque || null,
//     //                 CreatedBy: !isEditing ? userId : null,
//     //                 UpdatedBy: isEditing ? userId : null,
//     //             };

//     //             // Remove undefined values
//     //             Object.keys(rowData).forEach(
//     //                 (key) => rowData[key] === undefined && delete rowData[key]
//     //             );

//     //             // Decide detail URL
//     //             const paymentDetailUrl = row.Id
//     //                 ? "https://arohanagroapi.microtechsolutions.net.in/php/updatevoucherdetail.php"
//     //                 : "https://arohanagroapi.microtechsolutions.net.in/php/postvoucherdetail.php";

//     //             try {
//     //                 const detailResponse = await axios.post(
//     //                     paymentDetailUrl,
//     //                     qs.stringify(rowData),
//     //                     {
//     //                         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     //                     }
//     //                 );
//     //                 console.log("Detail response:", detailResponse.data);
//     //             } catch (error) {
//     //                 if (error.response) {
//     //                     console.error(
//     //                         "Detail API error:",
//     //                         error.response.status,
//     //                         error.response.data
//     //                     );
//     //                 } else if (error.request) {
//     //                     console.error("No response received:", error.request);
//     //                 } else {
//     //                     console.error("Axios setup error:", error.message);
//     //                 }
//     //             }
//     //         }

//     //         // Success actions
//     //         setIsDrawerOpen(false);
//     //         toast.success(
//     //             isEditing
//     //                 ? "Payment Voucher updated successfully!"
//     //                 : "Payment Voucher created successfully!"
//     //         );
//     //         resetForm();
//     //         fetchData();
//     //         fetchReceiptdetails();
//     //     } catch (error) {
//     //         if (error.response) {
//     //             console.error(
//     //                 "Header API error:",
//     //                 error.response.status,
//     //                 error.response.data
//     //             );
//     //         } else if (error.request) {
//     //             console.error("No response received:", error.request);
//     //         } else {
//     //             console.error("Axios setup error:", error.message);
//     //         }
//     //     }
//     // };

//     const dOrCOptions = [
//         { value: "D", label: "D" },
//         { value: "C", label: "C" },
//     ];

//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [previewData, setPreviewData] = useState(null);

//     const columns = useMemo(() => {
//         return [
//             {
//                 accessorKey: 'srNo',
//                 header: 'Sr No',
//                 size: 100,
//                 Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
//             },

//             {
//                 accessorKey: 'VoucherType',
//                 header: 'Voucher Type',
//                 size: 150,
//             },
//             {
//                 accessorKey: 'VoucherNo',
//                 header: 'Voucher No',
//                 size: 150,
//             },

//             {
//                 accessorKey: 'VoucherDate.date',
//                 header: 'Voucher Date',
//                 size: 150,
//                 Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
//             },

//             // {
//             //     accessorKey: 'ChequeNo',
//             //     header: 'Cheque No',
//             //     size: 150,
//             // },

//             {
//                 accessorKey: 'ChequeDate.date',
//                 header: 'ChequeDate',
//                 size: 150,
//                 Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
//             },

//               {
//                 accessorKey: 'AccountName',
//                 header: 'Party Name',
//                 size: 150,
//                 // Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
//             },


//              {
//                 accessorKey: 'Amount',
//                 header: 'Amount',
//                 size: 150,
//                 // Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
//             },

//             {
//                 header: 'Actions',
//                 size: 200,
//                 Cell: ({ row }) => (
//                     <Box display="flex" gap={1}>
//                         <Button
//                             variant="contained"
//                             size="small"
//                             sx={{ background: 'var(--primary-color)' }}
//                             onClick={() => handleEdit(row.original)}
//                         >
//                             Edit
//                         </Button>

//                         <Button
//                             variant="contained"
//                             sx={{ background: 'var(--complementary-color)' }}
//                             size="small"
//                             onClick={() => {
//                                 const invdetail = receiptdetails
//                                     .filter((detail) => detail.VoucherId === row.original.Id)
//                                 //   .map((detail) => {
//                                 //     const matchedMaterial = productOptions.find(
//                                 //       (item) => item.value.toString() === detail.ProductId?.toString()
//                                 //     );
//                                 //     return {
//                                 //       ...detail,
//                                 //       ProductName: matchedMaterial?.label || "Unknown",
//                                 //     };
//                                 //   });
//                                 setPreviewData({ ...row.original, invdetail });
//                                 setPreviewOpen(true);
//                                 console.log('previewdata', previewData)
//                             }}
//                         >
//                             Preview
//                         </Button>

//                     </Box>
//                 ),
//             },

//         ];
//     }, [data]);



//     const table = useMaterialReactTable({
//         columns,
//         data: data,
//         enablePagination: false,
//         muiTableHeadCellProps: {
//             style: {
//                 backgroundColor: "#E9ECEF",
//                 color: "black",
//                 fontSize: "16px",
//             },
//         },
       
//         renderBottomToolbarCustomActions: () => (
//             <Box
//                 mt={2}
//                 alignItems="center"
//                 display="flex"
//                 justifyContent="flex-end"
//                 width="100%"
//             >
//                 <FirstPageIcon
//                     sx={{ cursor: "pointer" }}
//                     onClick={() => setPageNo(1)}
//                 />
//                 <KeyboardArrowLeftIcon
//                     sx={{ cursor: "pointer" }}
//                     onClick={() => setPageNo((prev) => Math.max(Number(prev) - 1, 1))}
//                 />
//                 <Box>Page No</Box>
//                 <TextField
//                     sx={{
//                         width: "4.5%",
//                         ml: 1,
//                         '@media (max-width: 768px)': {
//                             width: '10%',
//                         },
//                     }}
//                     value={pageNo}
//                     onChange={(e) => setPageNo(e.target.value)}
//                     size="small"
//                 />
//                 <KeyboardArrowRightIcon
//                     sx={{ cursor: "pointer" }}
//                     onClick={() => setPageNo((prev) => Number(prev) + 1)}
//                 />
//                 <LastPageIcon
//                     sx={{ cursor: "pointer" }}
//                     onClick={() => setPageNo(totalPages)}
//                 />
//                 <Box>Total Pages: {totalPages}</Box>
//             </Box>
//         ),
//     });


//     // const handleEdit = (rowData) => {
//     //     console.log("This row has been clicked:", rowData);

//     //     console.log("rowData.Id:", rowData.Id);
//     //     setRowId(rowData.Id)
//     //     setIsDrawerOpen(true);
//     //     setIsEditing(!!rowData.Id);
//     //     // setIdwiseData(rowData.Id);
//     //     setAmount(rowData.Amount)
//     //     setReceiptNo(rowData.VoucherNo)
//     //     //receipt date
//     //     const dateStr = rowData.VoucherDate.date.split(" ")[0];
//     //     const [year, month, day] = dateStr.split("-").map(Number); // Convert to numbers
//     //     const formattedDate = `${year}-${month}-${day}`;
//     //     setReceiptDate(formattedDate);

//     //     //Cheque date
//     //     const dateStrc = rowData.ChequeDate.date.split(" ")[0];
//     //     const [yearc, monthc, dayc] = dateStrc.split("-").map(Number); // Convert to numbers
//     //     const formattedChequeDate = `${yearc}-${monthc}-${dayc}`;
//     //     setChequeDate(formattedChequeDate);


//     //     const receiptetail = receiptdetails
//     //         .filter((detail) => detail.VoucherId === rowData.Id);
//     //     if (receiptetail) {
//     //         setAccountId(receiptetail[0].AccountId)
//     //         setNarration(receiptetail[0]?.Narration)
//     //         setAmount(receiptetail[0]?.Amount)
//     //         //  console.log('amt', receiptetail[0]?.Amount)

//     //     }


//     //     console.log('receiptetail', receiptetail)




//     //     const mappedRows = receiptetail.map((detail) => ({
//     //         Id: detail.Id,
//     //         VoucherId: detail.VoucherId,
//     //         AccountId: detail.AccountId,
//     //         DOrC: detail.DOrC,
//     //         narration: detail.Narration,
//     //         amount: parseFloat(detail.Amount) || 0,
//     //         chequeNo: detail.ChequeNo,
//     //         ChequeDate: detail.ChequeDate?.date.split(" ")[0],
//     //         chequeAmount: parseFloat(detail.ChequeAmount) || 0,
//     //         MICRCode: parseFloat(detail.MICRCode) || 0,
//     //         bankName: detail.BankName,
//     //         bankBranch: detail.BankBranch,
//     //     }));
//     //     // console.log('mappedRows', mappedRows)

//     //     setRows(mappedRows)

//     // };

// const handleEdit = (rowData) => {
//     console.log("This row has been clicked:", rowData);
//     setRowId(rowData.Id);
//     setIsDrawerOpen(true);
//     setIsEditing(!!rowData.Id);
//     setAmount(rowData.Amount);
//     setReceiptNo(rowData.VoucherNo);

//     // Receipt date (safe check)
//     if (rowData.VoucherDate?.date) {
//         const dateStr = rowData.VoucherDate.date.split(" ")[0];
//         const [year, month, day] = dateStr.split("-").map(Number);
//         const formattedDate = `${year}-${month}-${day}`;
//         setReceiptDate(formattedDate);
//     } else {
//         setReceiptDate(""); // or null
//     }
// //         const receiptDateStr = rowData.VoucherDate ? rowData.VoucherDate.split(" ")[0] : "";
// //   console.log("Setting receipt date to:", receiptDateStr);
// //   setReceiptDate(receiptDateStr);

//     // Cheque date (safe check)
//     if (rowData.ChequeDate?.date) {
//         const dateStrc = rowData.ChequeDate.date.split(" ")[0];
//         const [yearc, monthc, dayc] = dateStrc.split("-").map(Number);
//         const formattedChequeDate = `${yearc}-${monthc}-${dayc}`;
//         setChequeDate(formattedChequeDate);
//     } else {
//         setChequeDate(""); // or null
//     }

//     // Receipt details
//     const receiptetail = receiptdetails.filter(
//         (detail) => detail.VoucherId === rowData.Id
//     );

//     if (receiptetail.length > 0) {
//         setAccountId(receiptetail[0].AccountId);
//         setNarration(receiptetail[0]?.Narration);
//         setAmount(receiptetail[0]?.Amount);
//     }

//     console.log("receiptetail", receiptetail);

//     const mappedRows = receiptetail.map((detail) => ({
//         Id: detail.Id,
//         VoucherId: detail.VoucherId,
//         AccountId: detail.AccountId,
//         DOrC: detail.DOrC,
//         narration: detail.Narration,
//         amount: parseFloat(detail.Amount) || 0,
//         chequeNo: detail.ChequeNo,
//         ChequeDate: detail.ChequeDate?.date
//             ? detail.ChequeDate.date.split(" ")[0]
//             : "",
//         chequeAmount: parseFloat(detail.ChequeAmount) || 0,
//         MICRCode: parseFloat(detail.MICRCode) || 0,
//         bankName: detail.BankName,
//         bankBranch: detail.BankBranch,
//     }));

//     setRows(mappedRows);
// };




//     const resetForm = () => {
//         setReceiptDate('');
//         setChequeDate('');
//         setAccountId('');
//         setSelectedBankOption('');
//         setBankName('');
//         setAmount('');
//         // setChequeOrDd('');
//         setReceiptNo('');
//         setChequeNo('');
//         // setSelectedCashorbank('');
//         setNarration('')

//         setRows([{
//             AccountId: '',
//             DOrC: 'C',
//             narration: '',
//             amount: '',
//             chequeNo: '',
//             ChequeDate: '',
//             chequeAmount: '',
//             MICRCode: '',
//             bankName: '',
//             bankBranch: ''
//         }]);
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

//         // console.log("Deleted Id:", rowId);

//         fetch(`https://arohanagroapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=VoucherHD&Id=${rowId}`, requestOptions)
//             .then((response) => response.text())
//             .then((result) => {
//                 // console.log(result);
//                 setOpen(false);
//                 handleDrawerClose();
//                 fetchData();
//                 toast.success(
//                     "payment Voucher  Deleted successfully!"
//                 );
//             })
//             .catch((error) => console.error(error));
//     };


//     //table drawer
//     const [rows, setRows] = useState([
//         {
//             SerialNo: "",
//             AccountId: "",
//             amount: "",
//             DOrC: "C",
//             CostCenterId: 0,
//             narration: "",
//             chequeNo: 0,
//             ChequeDate: "",
//             chequeAmount: "",
//             MICRCode: "",
//             bankName: "",
//             bankBranch: "",
//             IsOldCheque: "",
//             AccountPayeeCheque: "",
//         }

//     ]);

//     ///form table
//     //Add Rows
//     const handleAddRow = () => {
//         const newRow = {
//             SerialNo: "",
//             AccountId: "",
//             amount: "",
//             // DOrC: "C",
//             DOrC: rows.length === 0 ? "C" : "D", 
//             CostCenterId: 0,
//             narration: "",
//             chequeNo: "",
//             ChequeDate: "",
//             chequeAmount: "",
//             MICRCode: "",
//             bankName: "",
//             bankBranch: "",
//             IsOldCheque: "",
//             AccountPayeeCheque: "",
//         };

//         // console.log("newRow", newRow);
//         // Update rows state and ensure the new row is added to the table
//         setRows((prevRows) => [...prevRows, newRow]);
//     };

//     const handleInputChange = (index, field, value) => {
       
//         const updatedRows = [...rows];
//         updatedRows[index] = { ...updatedRows[index], [field]: value };
//         // Special handling for certain fields
//         if (field === "DOrC") {
//             if (value === "C") {
//                 updatedRows[index].bankName = bankName; // for Credit
//             } else if (value === "D") {
//                 updatedRows[index].bankName = selectedBankOption; // for Debit
//             }
//         }
//         setRows(updatedRows);
//     };

//     const handleDeleteRow = (index) => {
//         const updatedRows = rows.filter((_, i) => i !== index);
//         setRows(updatedRows);
//     };
//     const [isLoading, setIsLoading] = useState(false);

//     return (

//         <Box >
//             <Box textAlign={'center'}>
//                 <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Payment Voucher</b></Typography>
//             </Box>

//             <Box sx={{
//                 //  background: 'rgb(236, 253, 230)', 
//                 p: 5, height: 'auto'
//             }}>

//                 <Box sx={{ display: 'flex', gap: 3 }}>
//                     <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Payment Voucher </Button>
//                 </Box>

//                 <Box mt={4}>
//                     <MaterialReactTable table={table}

//                         muiTableHeadCellProps={{
//                             sx: { color: 'var(--primary-color)', },
//                         }}
//                     />
//                 </Box>


//                 {/* ///for preview///////// */}.
//                 <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>
//                     <DialogTitle sx={{ textAlign: 'center' }}>
//                         <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
//                             <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} />
//                             <Typography variant="h6">Arohan Agro Kolhapur</Typography>

//                         </Box>
//                         <Typography sx={{ mt: 1 }}>
//                             Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
//                         </Typography>

//                         <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
//                             Payment Voucher Preview
//                         </Typography>



//                     </DialogTitle>
//                     <DialogContent dividers>
//                         <Box>
//                             {previewData ? (
//                                 <Box>
//                                     <Box display={'flex'} justifyContent={'space-between'} gap={2}>
//                                         <Typography><strong>Entry No:</strong> {previewData.VoucherNo}</Typography>
//                                         <Typography>
//                                             <strong>Voucher Date:</strong>{" "}
//                                             {new Date(previewData.VoucherDate.date).toLocaleDateString()}
//                                         </Typography>
//                                     </Box>

//                                     <Box display={'flex'} justifyContent={'space-between'} gap={2} mt={2}>

//                                         {/* <Box><Typography><strong>Cheque No:</strong> {previewData.ChequeNo}</Typography></Box> */}
//                                         <Box><Typography><strong>Cheque Date:</strong>{" "} {new Date(previewData.ChequeDate.date).toLocaleDateString()}</Typography></Box>
//                                         <Box><Typography> <strong>Amount:</strong> {previewData?.invdetail?.[0]?.Amount ?? 'N/A'}</Typography></Box>
//                                         <Box><Typography><strong>Narration:</strong> {previewData.Narration}</Typography></Box>
//                                     </Box>
//                                     <Divider sx={{ mt: 2 }} />



//                                     {/* ////////// */}

//                                     <Grid item xs={12} md={8}>
//                                         <Typography variant="h6" fontWeight="bold" gutterBottom mt={2}>
//                                             Payment Voucher Details
//                                         </Typography>

//                                         <TableContainer component={Paper} elevation={2} sx={{ width: '100%', mt: 2 }}>
//                                             <Table size="small">
//                                                 <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                                                     <TableRow>
//                                                         <TableCell><strong>Account</strong></TableCell>
//                                                         <TableCell><strong>Dr/Cr</strong></TableCell>
//                                                         <TableCell><strong>Narration</strong></TableCell>
//                                                         <TableCell><strong>Amount (Rs)</strong></TableCell>
//                                                         <TableCell><strong>Cheque No</strong></TableCell>
//                                                         <TableCell><strong>Cheque Date</strong></TableCell>
//                                                         <TableCell><strong>Cheque Amount(Rs)</strong></TableCell>
//                                                         <TableCell><strong>MICR Code</strong></TableCell>
//                                                         <TableCell><strong>Bank Name</strong></TableCell>
//                                                         <TableCell><strong>Bank Branch</strong></TableCell>
//                                                     </TableRow>
//                                                 </TableHead>
//                                                 <TableBody>
//                                                     {previewData.invdetail.map((item, index) => {
//                                                         const accountName = branchOption.find(
//                                                             (opt) => opt.value.toString() === item.AccountId?.toString()
//                                                         )?.label || "Unknown";

//                                                         // Get bank name - similar logic to your edit table
//                                                         const bankNameDisplay = item.DOrC === "C"
//                                                             ? item.BankName || "0"
//                                                             : (bankOptions.find(opt => opt.value === item.BankName)?.label || item.BankName || "0");

//                                                         return (
//                                                             <TableRow key={index}>
//                                                                 <TableCell>{accountName}</TableCell>
//                                                                 <TableCell>{item.DOrC}</TableCell>
//                                                                 <TableCell>{item.Narration}</TableCell>
//                                                                 <TableCell>{item.Amount}</TableCell>
//                                                                 <TableCell>{item.ChequeNo || "0"}</TableCell>
//                                                                 <TableCell>{item.ChequeDate?.date ? item.ChequeDate.date.substring(0, 10) : "0"}</TableCell>
//                                                                 <TableCell>{item.ChequeAmount || "0"}</TableCell>
//                                                                 <TableCell>{item.MICRCode || "0"}</TableCell>
//                                                                 <TableCell>{bankNameDisplay}</TableCell>
//                                                                 <TableCell>{item.BankBranch || "0"}</TableCell>
//                                                             </TableRow>
//                                                         );
//                                                     })}
//                                                 </TableBody>
//                                             </Table>
//                                         </TableContainer>
//                                     </Grid>

//                                 </Box>
//                             ) : (
//                                 <Typography>No data to preview</Typography>
//                             )}
//                         </Box>
//                     </DialogContent>
//                     <DialogActions>
//                         {/* <Button onClick={generatePDF} color="primary" ><PrintIcon sx={{fontSize:35}}/></Button> */}
//                         <Button variant='contained' onClick={() => setPreviewOpen(false)} color="primary">Close</Button>
//                     </DialogActions>
//                 </Dialog>


//                 <Drawer
//                     anchor="right"
//                     open={isDrawerOpen}
//                     onClose={handleDrawerClose}
//                     PaperProps={{
//                         sx: {
//                             borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//                             width: isSmallScreen ? "100%" : "80%",
//                             zIndex: 1000,
//                         },
//                     }}
//                 >
//                     <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>

//                         <Typography m={2} fontWeight="bold" variant="h6">
//                             {isEditing ? "Update Payment Voucher" : "Create Payment Voucher"}
//                         </Typography>
//                         <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
//                     </Box>
//                     <Divider />

//                     <Box>
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2 }}>
//                                 <Box flex={1}>
//                                     <Typography>Entry No</Typography>
//                                     <TextField
//                                         variant="standard"
//                                         sx={{
//                                             '& .MuiInput-underline:after': {
//                                                 borderBottomWidth: 1.5,
//                                                 borderBottomColor: '#44ad74',
//                                             }, mt: 1
//                                         }}
//                                         focused
//                                         value={receiptNo}
//                                         onChange={(e) => setReceiptNo(e.target.value)}
//                                         size="small" placeholder="Payment No Autogenrated" fullWidth />
//                                 </Box>



//                                 <Box flex={1} >
//                                     <Typography>Voucher Date</Typography>
//                                     <DatePicker
//                                         value={receiptDate ? new Date(receiptDate) : null}
//                                         format="dd-MM-yyyy"
//                                         onChange={(newValue) => setReceiptDate(newValue)}
//                                         slotProps={{
//                                             textField: { size: "small", fullWidth: true },
//                                         }}
//                                     />
//                                 </Box>


//                                 <Box flex={2}>
//                                     <Typography variant="body2">Cash/Bank Account</Typography>

//                                     <Autocomplete
//                                         options={branchOption}
//                                         value={
//                                             branchOption.find(
//                                                 (option) => option.value === AccountId
//                                             ) || null
//                                         }
//                                         onChange={(event, newValue) => {
//                                             setAccountId(newValue ? newValue.value : null);
//                                             if (rows.length > 0) {
//                                                 handleInputChange(
//                                                     0,
//                                                     "AccountId",
//                                                     newValue ? newValue.value : null
//                                                 ); // Update first row
//                                             }
//                                         }}
//                                         getOptionLabel={(option) => option.label} // Display only label in dropdown
//                                         renderInput={(params) => (
//                                             <TextField
//                                                 {...params}
//                                                 placeholder="Select Cash/Bank Name"
//                                                 size="small"
//                                                 margin="none"
//                                                 fullWidth

//                                                 variant="standard"
//                                                 sx={{
//                                                     '& .MuiInput-underline:after': {
//                                                         borderBottomWidth: 1.5,
//                                                         borderBottomColor: '#44ad74',
//                                                     }, mt: 1
//                                                 }}
//                                                 focused
//                                             />
//                                         )}
//                                     />

                                  
//                                 </Box>
//                             </Box>

//                             <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2, mt: 2 }}>




//                                 <Box flex={1}>
//                                     <Typography variant="body2">Cheque No</Typography>
//                                     <TextField
//                                         // value={chequeNo}
//                                         // onChange={(e) => setChequeNo(e.target.value)}
//                                         variant="standard"
//                                         sx={{
//                                             '& .MuiInput-underline:after': {
//                                                 borderBottomWidth: 1.5,
//                                                 borderBottomColor: '#44ad74',
//                                             }, mt: 1
//                                         }}
//                                         focused
//                                         value={rows[0]?.chequeNo || ""}
//                                         onChange={(e) => handleInputChange(0, "chequeNo", e.target.value)}
//                                         size="small" margin="none" placeholder='Cheque No' fullWidth
//                                     />
//                                 </Box>

//                                 <Box flex={1} >
//                                     <Typography>Cheque Date</Typography>
//                                     <DatePicker
//                                         value={chequeDate ? new Date(chequeDate) : null}
//                                         format="dd-MM-yyyy"
//                                         onChange={(newValue) => {
//                                             setChequeDate(newValue);

//                                             // Update only row 0's ChequeDate
//                                             const updatedRows = [...rows];
//                                             if (updatedRows.length > 0) {
//                                                 updatedRows[0] = {
//                                                     ...updatedRows[0],
//                                                     ChequeDate: newValue,
//                                                 };
//                                             }
//                                             setRows(updatedRows);
//                                         }}
//                                         slotProps={{
//                                             textField: { size: "small", fullWidth: true },
//                                         }}
//                                     />

//                                 </Box>
//                             </Box>



                         

//                             <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2, mt: 2 }}>
//                                 <Box flex={1}>
//                                     <Typography variant="body2">Amount</Typography>
//                                     <TextField
//                                         variant="standard"
//                                         sx={{
//                                             '& .MuiInput-underline:after': {
//                                                 borderBottomWidth: 1.5,
//                                                 borderBottomColor: '#44ad74',
//                                             }, mt: 1
//                                         }}
//                                         focused
//                                         value={rows[0]?.amount || ""}
//                                         //value={rows.amount}
//                                         onChange={(e) => {
//                                             handleInputChange(0, "amount", e.target.value);
//                                             // setTotalcredit(e.target.value);
//                                             // If you still need this
//                                             setAmount(e.target.value);
//                                         }}

//                                         size="small" margin="none" placeholder='Amount' fullWidth
//                                     />
//                                 </Box>


//                                 <Box flex={1}>
//                                     <Typography variant="body2">Narration</Typography>
//                                     <TextField
//                                         variant="standard"
//                                         sx={{
//                                             '& .MuiInput-underline:after': {
//                                                 borderBottomWidth: 1.5,
//                                                 borderBottomColor: '#44ad74',
//                                             }, mt: 1
//                                         }}
//                                         focused
//                                         value={narration}
//                                         onChange={(e) => {
//                                             setNarration(e.target.value);
//                                             if (rows.length > 0) {
//                                                 handleInputChange(0, "narration", e.target.value); // Update first row
//                                             }
//                                         }}

//                                         size="small" margin="none" placeholder='Narration' fullWidth
//                                     />
//                                 </Box>
//                             </Box>


//                             {/* table */}
//                             <Box mt={2}>
//                                 <TableContainer component={Paper}>
//                                     <Table>
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell>Sr No</TableCell>
//                                                 <TableCell>Account Id</TableCell>
//                                                 <TableCell>Dr/Cr</TableCell>
//                                                 <TableCell>Narration</TableCell>
//                                                 <TableCell>Amount</TableCell>
//                                                 <TableCell>Cheque No</TableCell>
//                                                 <TableCell>Cheque Date</TableCell>
//                                                 <TableCell>Cheque Amount</TableCell>
//                                                 {/* <TableCell>MICR Code</TableCell>
//                                                 <TableCell>Bank Name</TableCell>
//                                                 <TableCell>Bank Branch</TableCell> */}
//                                                 <TableCell>Actions</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {isLoading ? (
//                                                 <TableRow>
//                                                     <TableCell colSpan={12} align="center" sx={{ fontWeight: "bold", color: "blue" }}>
//                                                         Loading data...
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ) : rows.length === 0 ? (
//                                                 <TableRow>
//                                                     <TableCell colSpan={12} align="center" sx={{ fontWeight: "bold", color: "red" }}>
//                                                         No data available
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ) : (
//                                                 rows.map((row, index) => (
//                                                     <TableRow key={index}>
//                                                         <TableCell>{index + 1}</TableCell>

//                                                         <TableCell>
//                                                             {index === 0 ? (
//                                                                 branchOption.find(option => option.value === AccountId)?.label || ""
//                                                             ) : (
                                                                
//                                                                 <Autocomplete
//                                                                     options={branchOption}
//                                                                     value={
//                                                                         branchOption.find(
//                                                                             (option) => option.value === row.AccountId
//                                                                         ) || null
//                                                                     }
//                                                                     onChange={(event, newValue) =>
//                                                                         handleInputChange(
//                                                                             index,
//                                                                             "AccountId",
//                                                                             newValue ? newValue.value : ""
//                                                                         )
//                                                                     }
//                                                                     sx={{ width: "200px" }} // Set width
//                                                                     getOptionLabel={(option) => option.label}
//                                                                     renderInput={(params) => (
//                                                                         <TextField
//                                                                             {...params}
//                                                                             placeholder="Select Acc"
//                                                                             size="big"
//                                                                             fullWidth
//                                                                             sx={{
//                                                                                 "& .MuiInputBase-root": {
//                                                                                     height: "50px",
//                                                                                     width: "200px", // Adjust height here
//                                                                                 },
//                                                                                 "& .MuiInputBase-input": {
//                                                                                     padding: "14px", // Adjust padding for better alignment
//                                                                                 },
//                                                                             }}
//                                                                         />
//                                                                     )}
//                                                                 />
//                                                             )}
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             {index === 0 ? (
//                                                                 row.DOrC || "C"
//                                                             ) : (
//                                                                 <Autocomplete
//                                                                     options={dOrCOptions}
//                                                                     value={
//                                                                         dOrCOptions.find((option) => option.value === row.DOrC) || null
//                                                                     }
//                                                                     onChange={(event, newValue) =>
//                                                                         handleInputChange(index, "DOrC", newValue ? newValue.value : "")
//                                                                     }
//                                                                     getOptionLabel={(option) => option.label}
//                                                                     sx={{ width: 150 }}
//                                                                     renderInput={(params) => (
//                                                                         <TextField
//                                                                             {...params}
//                                                                             placeholder="Select DOrC"
//                                                                             size="small"
//                                                                             sx={{ width: '80px' }}

//                                                                         // sx={{
//                                                                         //     "& .MuiInputBase-root": { height: "50px" },
//                                                                         //     "& .MuiInputBase-input": { padding: "14px" },
//                                                                         // }}
//                                                                         />
//                                                                     )}
//                                                                 />
//                                                             )}
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             {index === 0 ? (
//                                                                 row.narration
//                                                             ) : (
//                                                                 <TextField
//                                                                     type="text"
//                                                                     value={row.narration}
//                                                                     onChange={(e) => {
//                                                                         const value = e.target.value;
//                                                                         if (value.length <= 500) {
//                                                                             handleInputChange(index, "narration", value);
//                                                                         }
//                                                                     }}
//                                                                     placeholder="Enter Narration"
//                                                                     sx={{ width: '150px' }}
//                                                                     size="small"

//                                                                 />
//                                                             )}
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <TextField
//                                                                 type="number"
//                                                                 value={row.amount}
//                                                                 onChange={(e) =>
//                                                                     handleInputChange(index, "amount", e.target.value)
//                                                                 }
//                                                                 placeholder="Amount"
//                                                                 sx={{ width: '150px' }}
//                                                                 size="small"
//                                                             />
//                                                         </TableCell>

//                                                         <TableCell>
//                                                             <TextField
//                                                                 type="text"
//                                                                 value={row.chequeNo}
//                                                                 onChange={(e) => {
//                                                                     const value = e.target.value;
//                                                                     if (value.length <= 15) {
//                                                                         handleInputChange(index, "chequeNo", value);
//                                                                     }
//                                                                 }}
//                                                                 placeholder="ChequeNo"
//                                                                 sx={{ width: '150px' }}
//                                                                 size="small"
//                                                             />
//                                                         </TableCell>

                                                     
//                                                         <TableCell>
//                                                             {index === 0 ? (
                                                               
//                                                                 <DatePicker
//                                                                     value={chequeDate ? new Date(chequeDate) : null}
//                                                                     format="dd-MM-yyyy"
//                                                                     onChange={(newValue) => {
//                                                                         setChequeDate(newValue);
//                                                                         handleInputChange(0, "ChequeDate", newValue); 
//                                                                     }}
//                                                                     slotProps={{
//                                                                         textField: {
//                                                                             size: "small",
//                                                                             sx: { width: '150px' },
//                                                                         },
//                                                                     }}
//                                                                 />
//                                                             ) : (
                                                                
//                                                                 <DatePicker
//                                                                     value={row.ChequeDate ? new Date(row.ChequeDate) : null}
//                                                                     format="dd-MM-yyyy"
//                                                                     onChange={(newValue) => handleInputChange(index, "ChequeDate", newValue)}
//                                                                     slotProps={{
//                                                                         textField: {
//                                                                             size: "small",
//                                                                             sx: { width: '150px' },
//                                                                         },
//                                                                     }}
//                                                                 />
//                                                             )}
//                                                         </TableCell>



//                                                         <TableCell>
//                                                             <TextField
//                                                                 type="number"
//                                                                 value={row.chequeAmount}
//                                                                 onChange={(e) =>
//                                                                     handleInputChange(index, "chequeAmount", e.target.value)
//                                                                 }
//                                                                 placeholder="Cheque Amount"
//                                                                 sx={{ width: '150px' }}
//                                                                 size="small"
//                                                             />
//                                                         </TableCell>

//                                                         {/* <TableCell>
//                                                             <TextField
//                                                                 type="text"
//                                                                 value={row.MICRCode}
//                                                                 onChange={(e) => {
//                                                                     const value = e.target.value;
//                                                                     if (value.length <= 30) {
//                                                                         handleInputChange(index, "MICRCode", value);
//                                                                     }
//                                                                 }}
//                                                                 placeholder="MICR Code"
//                                                                 sx={{ width: '150px' }}
//                                                                 size="small"
//                                                             />
//                                                         </TableCell>

                                                       
//                                                         <TableCell>
//                                                             {row.DOrC === "C" ? (
//                                                                 <TextField
//                                                                     type="text"
//                                                                     value={row.bankName}
//                                                                     onChange={(e) => {
//                                                                         const value = e.target.value;
//                                                                         if (value.length <= 50) {
//                                                                             handleInputChange(index, "bankName", value);
//                                                                         }
//                                                                     }}
//                                                                     placeholder="Bank Name"
//                                                                     sx={{ width: '150px' }}
//                                                                     size="small"
//                                                                 />
//                                                             ) : (
//                                                                 <FormControl fullWidth size="small">
//                                                                     <Select
//                                                                         value={row.bankName || ""}
//                                                                         onChange={(event) => {
//                                                                             const selectedValue = event.target.value;
//                                                                             handleInputChange(index, "bankName", selectedValue);
//                                                                         }}
//                                                                     >
//                                                                         {bankOptions.map((option) => (
//                                                                             <MenuItem key={option.value} value={option.value}>
//                                                                                 {option.label}
//                                                                             </MenuItem>
//                                                                         ))}
//                                                                     </Select>
//                                                                 </FormControl>
//                                                             )}
//                                                         </TableCell>


//                                                         <TableCell>
//                                                             <TextField
//                                                                 type="text"
//                                                                 value={row.bankBranch}
//                                                                 onChange={(e) => {
//                                                                     const value = e.target.value;
//                                                                     if (value.length <= 50) {
//                                                                         handleInputChange(index, "bankBranch", value);
//                                                                     }
//                                                                 }}
//                                                                 placeholder="Bank Branch"
//                                                                 sx={{ width: '150px' }}
//                                                                 size="small"
//                                                             />
//                                                         </TableCell> */}

//                                                         <TableCell>
//                                                             <Box style={{ display: "flex", justifyContent: "space-between" }}>
//                                                                 <Button
//                                                                     onClick={handleAddRow}
//                                                                     sx={{ backgroundColor: "#074e2c", color: "white", mr: 1 }}
//                                                                 >
//                                                                     <AddIcon />
//                                                                 </Button>
//                                                                 <Button
//                                                                     onClick={() => handleDeleteRow(index)}
//                                                                     sx={{ backgroundColor: "red", color: "white" }}
//                                                                 >
//                                                                     <DeleteIcon />
//                                                                 </Button>
//                                                             </Box>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))
//                                             )}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                             </Box>

//                         </LocalizationProvider>
//                     </Box>

//                     <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//                         <Box>
//                             <Button
//                                 sx={{
//                                     background: 'var(--primary-color)',
//                                 }}

//                                 onClick={handleSubmit}
//                                 variant="contained"
//                             >
//                                 {isEditing ? "Update" : "Save"}
//                             </Button>
//                         </Box>

//                         <Box>
//                             <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
//                                 onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
//                         </Box>



//                         <Box>
//                             {isEditing && (
//                                 <Button variant="contained" color="error" onClick={handleClickOpen}>
//                                     Delete
//                                 </Button>
//                             )}

//                             <Dialog open={open} onClose={handleClose}>
//                                 <DialogTitle>Confirm Deletion</DialogTitle>
//                                 <DialogContent>
//                                     <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
//                                 </DialogContent>
//                                 <DialogActions>
//                                     <Button onClick={handleClose} color="primary">
//                                         Cancel
//                                     </Button>
//                                     <Button onClick={handleConfirmDelete} color="error" autoFocus>
//                                         Delete
//                                     </Button>
//                                 </DialogActions>
//                             </Dialog>
//                         </Box>
//                     </Box>

//                 </Drawer>
//             </Box >
//         </Box >
//     )
// }
// export default Payment








































