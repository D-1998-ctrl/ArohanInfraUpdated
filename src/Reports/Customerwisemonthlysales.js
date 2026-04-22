
import { useState, useEffect, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField,  Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';
import moment from 'moment';
import { MRT_TablePagination as MUITablePagination } from "material-react-table";


const Customerwisemonthlysales = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [accountOptions, setAccountOptions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchAccounts = async (text) => {
        if (!text) {
            setAccountOptions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://arohanagroapi.microtechsolutions.co.in/php/get/searchaccount.php?TypeCode=C&Text=${text}`
            );
            const result = await response.json();
            setAccountOptions(result || []);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };


    useEffect(() => {
        if (!searchText || searchText.length < 1) {
            setAccountOptions([]);
            return;
        }

        fetchAccounts(searchText);
    }, [searchText]);



    const getCustomerwisemonthlysalesReport = () => {
        if (!selectedAccount || !selectedAccount.value) {
            alert("Please select customer");
            return;
        }

        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-CA'); 
        };

        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);

        const url = `https://arohanagroapi.microtechsolutions.net.in/php/get/getCustomerwiseMonthlySales.php?FromDate=${formattedFromDate}&ToDate=${formattedToDate}&CustomerId=${selectedAccount.value}`;

        console.log("URL:", url);

        fetch(url)
            .then(res => res.json())
            
            .then(data => {
                setSalesData(data);
                setShowTable(true);
                setPreviewOpen(true);
            })
            .catch(error => {
                console.error("Error fetching sales report:", error);
            });
    };



    const handleGetSalesReport = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        getCustomerwisemonthlysalesReport();
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        if (!salesData) return;

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = 10;


        doc.setLineWidth(0.5); // Set border thickness
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle with 5mm margin on all sides

        // Convert logo image to data URL (you might need to adjust this based on your logo format)
        const logoDataUrl = logonew;
        // Header
        // Size in jsPDF units (mm for default)
        const width = 20; // about 70px
        const height = 20;
        const x = pageWidth / 2 - width / 2;



        doc.addImage(logoDataUrl, 'JPEG', x, y, width, height, '', 'FAST');
        // Reset clipping so future drawing isn't affected
        doc.discardPath();
        y += height + 6;

        doc.setFontSize(16);
        doc.text("Aarohan Agro", pageWidth / 2, y, { align: "center", margin: 2 });
        y += 7;
        doc.setFontSize(10)
        doc.text(" Shop No.5 Atharva Vishwa,  Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003", pageWidth / 2, y, { align: "center" });
        y += 9;

        doc.setFontSize(16);
        doc.text("Account Receivable ", pageWidth / 2, y, { align: "center" });


        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;


        // Main table with all details
        const tableHeaders = [
            "Date",
            "DocNo",
            "Contact",
            " Amount",
            "Source",


        ];

        const tableData = salesData.map((item) => {


            return [
                item.Date,
                item.DocNo || " - ",
                item.Contact,
                item.Amount,

                item.Source || 0,

            ];
        });

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: y,
            margin: 8,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 1.5 }, // Smaller font size to fit all columns
            headStyles: { fillColor: [245, 245, 245], textColor: 0, fontStyle: "bold" },

        });

        y = doc.lastAutoTable.finalY + 10;

        // Save
        doc.save("Account_receivable.pdf");
    };



    const exportToExcel = async (data) => {
        if (!data || data.length === 0) {
            alert("No data available to export");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("AccountReceivable");

        // Updated header row
        const headers = [
            "Date",
            "DocNo",
            "Contact",
            "Credit Amount",
            "Debit Amount",
            "Source",
            "Closing Balance", // 👈 Added this new column
        ];

        worksheet.addRow(headers);

        // Style header
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF4F81BD" },
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // Add data rows
        data.forEach((item) => {
            let creditAmount = 0;
            let debitAmount = 0;

            // 👇 segregate Credit/Debit
            if (item.Source?.toLowerCase() === "credit") {
                creditAmount = Number(item.Amount) || 0;
            } else if (item.Source?.toLowerCase() === "debit") {
                debitAmount = Number(item.Amount) || 0;
            }

            const closingBal = debitAmount - creditAmount; // 👈 Formula applied per row

            worksheet.addRow([
                item.Date || "",
                item.DocNo || "",
                item.Contact || "",
                creditAmount,
                debitAmount,
                item.Source || "",
                closingBal, // 👈 Inserted here
            ]);
        });

        // Auto-fit columns
        worksheet.columns.forEach((col) => {
            let maxLength = 10;
            col.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 0;
                if (columnLength > maxLength) maxLength = columnLength;
            });
            col.width = maxLength + 5;
        });

        // Add Grand Total row
        const totalRowIndex = worksheet.lastRow.number + 2;
        const totalRow = worksheet.getRow(totalRowIndex);
        totalRow.getCell(3).value = "Grand Total";
        totalRow.getCell(3).font = { bold: true, size: 14 };
        totalRow.getCell(3).alignment = { horizontal: "right" };

        // Calculate totals dynamically based on data length
        const dataStartRow = 2;
        const dataEndRow = worksheet.lastRow.number - 2; // Adjust for totals

        totalRow.getCell(4).value = { formula: `SUM(D${dataStartRow}:D${dataEndRow})` };
        totalRow.getCell(5).value = { formula: `SUM(E${dataStartRow}:E${dataEndRow})` };
        totalRow.getCell(7).value = { formula: `E${totalRowIndex} - D${totalRowIndex}` }; // 👈 Closing Bal total

        // Style Grand Total row
        totalRow.eachCell((cell) => {
            cell.font = { bold: true, size: 14, color: { argb: "FF000000" } }; // Black bold text
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFE699" }, // Light yellow background
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
            };
        });

        // Save workbook
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `AccountReceivable_Report.xlsx`);
    };




    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'MonthYear',
                header: 'Date',
                size: 50,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

            {
                accessorKey: 'ProductName',
                header: 'Product Name',
                size: 50,

            },

            {
                accessorKey: 'Quantity',
                header: 'Quantity',
                size: 50,

            },

            {
                accessorKey: 'Amount',
                header: 'Amount',
                size: 50,


            },

        ];
    }, []);

    // const table = useMaterialReactTable({
    //     columns,
    //     data: salesData,
    //     enablePagination: true,
    //     muiTableHeadCellProps: {
    //         style: {
    //             backgroundColor: "#E9ECEF",
    //             color: "black",
    //             fontSize: "16px",
    //         },
    //     },
    // });



    const table = useMaterialReactTable({
    columns,
    data: salesData,
    enablePagination: true,

        muiTableHeadCellProps: {
            style: {
                backgroundColor: "#E9ECEF",
                color: "black",
                fontSize: "16px",
            },
        },
        renderBottomToolbar: ({ table }) => (
            <Box
            
                display="flex"
                justifyContent="space-between"
                alignItems="center"
               mr={4}

            >
                {/* ⬅️ Pagination on Left */}
                <MUITablePagination table={table} />

                {/* ➡️ Grand Total on Right */}
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" >
                        <b>Grand Total:</b>
                    </Typography>

                    <Typography variant="subtitle1" color="primary">
                        <b>{grandTotal.toLocaleString("en-IN")}</b>
                    </Typography>
                </Box>
            </Box>
        ),
});


//
    const grandTotal = useMemo(() => {
        return salesData?.reduce((acc, row) => acc + (Number(row.Amount) || 0), 0);
    }, [salesData]);




    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Customerwise Monthly Sales</b></Typography>
            </Box>

            <Box sx={{ p: 5, height: 'auto' }}>

                <Box >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', gap: 10, }}>

                            <Box >
                                <Typography>From Date</Typography>
                                <DatePicker
                                    value={fromDate ? new Date(fromDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setFromDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", },
                                    }}
                                />
                            </Box>

                            <Box >
                                <Typography>To Date</Typography>
                                <DatePicker
                                    value={toDate ? new Date(toDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setToDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", },
                                    }}
                                />
                            </Box>

                            {/* <Box sx={{ width: 300 }}>
                                <Typography>Customers</Typography>
                                <Autocomplete
                                    size="small"

                                    options={accountOption}
                                    value={selectedAccountOption}
                                    onChange={(e, newValue) => setSelectedAccountOption(newValue)}
                                    onInputChange={(e, newInput) => fetchAccounts(newInput)}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Type Customer Name" variant="standard" />
                                    )}
                                />
                            </Box> */}

                            <Box sx={{ width: 300 }}>


                                <Box sx={{ width: 300 }}>
                                    <Typography>Customers</Typography>

                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        size="small"
                                        placeholder="Select Customer"
                                        value={searchText}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSearchText(value);
                                            fetchAccounts(value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => {
                                            if (searchText) setShowDropdown(true);
                                        }}
                                        sx={{
                                            '& .MuiInput-underline:before': {
                                                borderBottomWidth: 1.5,
                                                borderBottomColor: '#44ad74',
                                                opacity: 1,
                                            },
                                            mt: 1,
                                        }}
                                    // error={!!errors?.selectedAccount}
                                    // helperText={errors?.selectedAccount}
                                    />
                                    {showDropdown && accountOptions.length > 0 && (
                                        <Box
                                            sx={{
                                                border: "1px solid #ccc",
                                                borderRadius: 1,
                                                mt: 1,
                                                maxHeight: 200,
                                                overflowY: "auto",
                                                backgroundColor: "#fff",
                                                zIndex: 10,
                                                position: "absolute",
                                                width: "100%",
                                            }}
                                        >
                                            {accountOptions.map((account) => (
                                                <Box
                                                    key={account.Id}
                                                    sx={{
                                                        p: 1,
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            backgroundColor: "#f5f5f5",
                                                        },
                                                    }}
                                                    // onClick={() => {
                                                    //      setSelectedAccount(account.Id);
                                                    //     setSearchText(account.AccountName);
                                                    //     setShowDropdown(false);
                                                    // }}

                                                    onClick={() => {
                                                        setSelectedAccount({
                                                            value: account.Id,
                                                            label: account.AccountName
                                                        });
                                                        setSearchText(account.AccountName);
                                                        setShowDropdown(false);
                                                    }}

                                                >
                                                    {account.AccountName}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                </Box>


                            </Box>

                        </Box>
                    </LocalizationProvider>
                </Box>

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                    <Box>
                        <Button
                            sx={{
                                background: 'var(--primary-color)',
                            }}

                            onClick={handleGetSalesReport}
                            variant="contained"
                        >
                            Get Data
                        </Button>
                    </Box>

                </Box>
                {showTable && salesData.length === 0 && (
                    <Typography textAlign="center" mt={5} color="error">
                        No data found for the selected details.
                    </Typography>
                )}

                {/* table */}

                <>
                    {showTable && salesData.length > 0 && (
                        <>
                            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>
                                <DialogTitle sx={{ textAlign: 'center' }}>
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                        <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} />
                                        <Typography >Aarohan Agro Kolhapur</Typography>
                                    </Box>
                                    <Typography sx={{ mt: 1 }}>
                                        Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
                                    </Typography>
                                    <Typography sx={{ fontWeight: 'bold', mt: 1 }}>
                                        CutomerWise Monthly Sales Report  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'} For  {selectedAccount
                                            ? (selectedAccount.label)
                                            : '-'}
                                    </Typography>
                                </DialogTitle>
                                <DialogContent dividers>
                                    <Box>
                                        {salesData.length > 0 ? (
                                            <Box>
                                                <Box>
                                                    <MaterialReactTable table={table}
                                                        enableColumnResizing
                                                        muiTableHeadCellProps={{
                                                            sx: { color: 'var(--primary-color)', },
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Typography>No data to preview</Typography>
                                        )}
                                    </Box>
                                </DialogContent>

                                <DialogActions sx={{ p: 0 }}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        width="100%"
                                        sx={{ borderTop: "2px solid #ddd", backgroundColor: "#f8f9fa", p: 2 }}
                                    >
                                        {/* ✅ Left side: Buttons */}
                                        <Box display="flex" gap={2}>
                                            <Button onClick={generatePDF} color="primary">
                                                <PrintIcon sx={{ fontSize: 35 }} />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                endIcon={<FileDownloadIcon />}
                                                onClick={() => exportToExcel(salesData)}
                                            >
                                                Excel Data
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => setPreviewOpen(false)}
                                                color="primary"
                                            >
                                                Close
                                            </Button>
                                        </Box>
                                    </Box>
                                </DialogActions>
                            </Dialog>
                        </>
                    )}
                </>

            </Box>
        </Box >
    );
};

export default Customerwisemonthlysales;
