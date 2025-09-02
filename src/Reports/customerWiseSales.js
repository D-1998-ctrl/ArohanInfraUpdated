
import { useState,useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Paper, Dialog, DialogActions, DialogContent, DialogTitle, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';

const CustomerWiseSales = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [salesData, setSalesData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);




    const getSalesReport = () => {
        // Format dates to 'YYYY-MM-DD' using split
        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-CA');
        };

        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const url = `https://arohanagroapi.microtechsolutions.net.in/php/getcustomerwisereport.php?fromdate=${formattedFromDate}&todate=${formattedToDate}`
        console.log("URL:", url);
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(data => {
                console.log('data', data)
                setSalesData(data);
                setShowTable(true);
                setPreviewOpen(true)
            })
            .catch((error) => console.error(error));
    };

    const handleGetSalesReport = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        getSalesReport();
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
        doc.text("Arohan Agro", pageWidth / 2, y, { align: "center", margin: 2 });
        y += 7;
        doc.setFontSize(10)
        doc.text(" Shop No.5 Atharva Vishwa,  Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003", pageWidth / 2, y, { align: "center" });
        y += 9;

        doc.setFontSize(16);
        doc.text("customerwise Sales Report ", pageWidth / 2, y, { align: "center" });


        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;


        // Main table with all details
        const tableHeaders = [
            "Customer Name",
            "Contact No",
            "Product Name",
            " Rate",
            "Quantity",
            "Amount",

            "CGST",
            "IGST",
            "SGST",
            "Payment Mode",
            "Transport",
            "Sub Total",
            "Total",

        ];

        const tableData = salesData.map((item) => {


            return [
                item.AccountName,
                item.ContactNo || " - ",
                item.ProductName,
                item.Rate,
                item["Ttl qtd"] || 0,
                item["Ttl Amt"] || 0,
                item["Ttl CGST Amt"] || 0,
                item["Ttl IGST Amt"] || 0,
                item["Ttl SGST Amt"] || 0,
                item.PaymentMode || 0,
                item.Transport || 0,
                item["Product Subtotal"] || 0,
                item.Total || 0,
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
        doc.save("customerwise Sales.pdf");
    };


    const exportToExcel = async (data) => {
        if (!data || data.length === 0) {
            alert("No data available to export");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("SalesReport");

        // Define header row
        const headers = [
            "Customer Name",
            "Contact No",
            "ProductName",
            "Rate",
            "Quantity",
            "Amount",
            "CGST",
            "SGST",
            "IGST",
            "Payment Mode",
            "Transport",
            "Sub Total",
            "Total",
        ];

        worksheet.addRow(headers);

        // Apply header styling
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white bold
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF4F81BD" }, // blue background
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // Add data rows
        data.forEach((item) => {
            worksheet.addRow([
                item.AccountName,
                item.ContactNo,
                item.ProductName || "N/A",
                item.Rate || 0,
                item["Ttl qtd"] || "N/A",
                item["Ttl Amt"] || 0,
                item["Ttl CGST Amt"] || 0,
                item["Ttl SGST Amt"] || 0,
                item["Ttl IGST Amt"] || 0,
                item.PaymentMode || 0,
                item.Transport || 0,
                item["Product Subtotal"] || 0,


                item.Total || 0,
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

        // Write workbook
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Customer_SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };


    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'AccountName',
                header: 'Customer Name',
                size: 100,
            },

            {
                accessorKey: 'ContactNo',
                header: 'Contact No',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || "-",


            },

            {
                accessorKey: 'ProductName',
                header: 'Product Name',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || "-",
            },

            {
                accessorKey: 'Rate',
                header: 'Rate',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || 0,

            },

            {
                accessorKey: ["Ttl qtd"],
                header: 'Quantity',
                size: 50,

            },


            {
                accessorKey: ["Ttl Amt"],
                header: 'Amount',
                size: 50,
            },


            {
                accessorKey: ["Ttl CGST Amt"],
                header: 'CGST',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || 0,
            },

            {
                accessorKey: ["Ttl SGST Amt"],
                header: 'SGST',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: ["Ttl IGST Amt"],
                header: 'IGST',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: 'PaymentMode',
                header: 'PaymentMode',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || "-",
            },


            {
                accessorKey: 'Transport',
                header: 'Transport',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || 0,
            },



            {
                accessorKey: ["Product Subtotal"],
                header: 'Sub total',
                size: 50,
                Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: 'Total',
                header: 'Total',
                size: 50,
            },




        ];
    }, []);
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
    });

    //grand Total
    const grandTotal = useMemo(() => {
        return salesData?.reduce((acc, row) => acc + (Number(row.Total) || 0), 0);
    }, [salesData]);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Customerwise Sales Report</b></Typography>
            </Box>

            <Box sx={{ p: 5, height: 'auto' }}>

                <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', alignItems: 'center', m: 1, gap: 2 }}>

                            <Box flex={1} >
                                <Typography>From Date</Typography>
                                <DatePicker
                                    value={fromDate ? new Date(fromDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setFromDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", fullWidth: true },
                                    }}
                                />
                            </Box>



                            <Box flex={1} >
                                <Typography>To Date</Typography>
                                <DatePicker
                                    value={toDate ? new Date(toDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setToDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small", fullWidth: true },
                                    }}
                                />
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
                            Get Customerwise Sales
                        </Button>
                    </Box>

                </Box>


                {/* table */}
                {showTable && salesData.length > 0 && (
                    <>
                        {showTable && salesData.length > 0 && (
                            <>
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
                                            Customerwise Sales Report
                                        </Typography>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Box>
                                            {salesData.length > 0 ? (
                                                <Box>


                                                    {/* Table to display sales data */}
                                                    {/* <TableContainer fullWidth component={Paper} sx={{ mt: 3 }}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><b>Customer Name</b></TableCell>
                                                                    <TableCell><b>Contact No</b></TableCell>
                                                                    <TableCell><strong>ProductName</strong></TableCell>
                                                                    <TableCell><b>Rate</b></TableCell>
                                                                    <TableCell><b>Quantity</b></TableCell>
                                                                    <TableCell> <b>Amount</b></TableCell>
                                                                    <TableCell><b>CGST</b></TableCell>
                                                                    <TableCell><b>SGST</b></TableCell>
                                                                    <TableCell><b>IGST</b></TableCell>
                                                                    <TableCell><b>Payment Mode</b></TableCell>
                                                                    <TableCell><b>Transport</b></TableCell>
                                                                    <TableCell><b>Sub total</b></TableCell>
                                                                    <TableCell><b>Total</b></TableCell>

                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {salesData.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{item.AccountName}</TableCell>
                                                                        <TableCell>{item.ContactNo || "-"}</TableCell>
                                                                        <TableCell>{item.ProductName}</TableCell>

                                                                        <TableCell>{item.Rate || 0}</TableCell>
                                                                        <TableCell>{item["Ttl qtd"] || 0}</TableCell>
                                                                        <TableCell>{item["Ttl Amt"] || 0}</TableCell>
                                                                        <TableCell>{item["Ttl CGST Amt"] || 0}</TableCell>


                                                                        <TableCell>{item["Ttl SGST Amt"] || 0}</TableCell>
                                                                        <TableCell>{item["Ttl IGST Amt"] || 0}</TableCell>
                                                                        <TableCell>{item.PaymentMode || 0}</TableCell>
                                                                        <TableCell>{item.Transport || 0}</TableCell>

                                                                        <TableCell>{item["Product Subtotal"] || 0}</TableCell>
                                                                        <TableCell>{item.Total || 0}</TableCell>

                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer> */}

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
                                    {/* <DialogActions>
                                        <Button onClick={generatePDF} color="primary" ><PrintIcon sx={{ fontSize: 35 }} /></Button>
                                        <Button variant='contained' endIcon={<FileDownloadIcon />} onClick={() => exportToExcel(salesData)}>Excel Data</Button>

                                        <Button variant='contained' onClick={() => setPreviewOpen(false)} color="primary">Close</Button>
                                    </DialogActions> */}
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
                                    
                                                                                {/* ✅ Right side: Grand Total */}
                                                                                <Box display="flex" alignItems="center" fontWeight="bold">
                                                                                    <Typography variant="h6" sx={{ mr: 2 }}>
                                                                                       <b>Grand Total:</b> 
                                                                                    </Typography>
                                                                                    <Typography variant="h6" color="primary">
                                                                                       <b> {grandTotal.toLocaleString("en-IN")} </b> 
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </DialogActions>
                                </Dialog>
                            </>
                        )}
                    </>
                )}
            </Box >
        </Box >
    );
};

export default CustomerWiseSales;