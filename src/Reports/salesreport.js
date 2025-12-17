import { useState, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {Dialog, DialogActions, DialogContent, DialogTitle, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import moment from 'moment';
import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';


const SalesReport = () => {
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
        const url = `https://arohanagroapi.microtechsolutions.net.in/php/getsalesreport.php?fromdate=${formattedFromDate}&todate=${formattedToDate}`;
        console.log("URL:", url);

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(data => {
                // console.log('data', data)
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


    // const generatePDF = () => {
    //     const doc = new jsPDF();
    //     if (!salesData) return;

    //     const pageWidth = doc.internal.pageSize.getWidth();
    //     const pageHeight = doc.internal.pageSize.getHeight();
    //     let y = 10;


    //     doc.setLineWidth(0.5); // Set border thickness
    //     doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle with 5mm margin on all sides

    //     // Convert logo image to data URL (you might need to adjust this based on your logo format)
    //     const logoDataUrl = logonew;
    //     // Header
    //     // Size in jsPDF units (mm for default)
    //     const width = 20; // about 70px
    //     const height = 20;
    //     const x = pageWidth / 2 - width / 2;



    //     doc.addImage(logoDataUrl, 'JPEG', x, y, width, height, '', 'FAST');
    //     // Reset clipping so future drawing isn't affected
    //     doc.discardPath();
    //     y += height + 6;

    //     doc.setFontSize(16);
    //     doc.text("Arohan Agro", pageWidth / 2, y, { align: "center", margin: 2 });
    //     y += 7;
    //     doc.setFontSize(10)
    //     doc.text(" Shop No.5 Atharva Vishwa,  Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003", pageWidth / 2, y, { align: "center" });
    //     y += 9;

    //     doc.setFontSize(16);
    //     doc.text("Sales Report Preview", pageWidth / 2, y, { align: "center" });


    //     y += 6;
    //     doc.setLineWidth(0.5);
    //     doc.line(10, y, 200, y);
    //     y += 6;


    //     // Main table with all details
    //     const tableHeaders = [
    //         "Invoice No",
    //         "Invoice Date",
    //         "Account Name",

    //         "Product  Name",
    //         "Rate",
    //         "Quantity",
    //         "Amount",
    //         "CGST",
    //         "IGST",
    //         "SGST",
    //         "Transport",
    //         "Sub Total",
    //         "Total amount",

    //     ];

    //     const tableData = salesData.map((item) => {


    //         return [
    //             item.InvoiceNo,
    //             item.InvoiceDate,
    //             item.AccountName,

    //             item.ProductName || 0,
    //             item.Rate || 0,
    //             item.Quantity || 0,
    //             item.Amount || 0,
    //             item["Product CGST AMT"] || 0,
    //             item["Product IGST AMT"] || 0,
    //             item["Product SGST AMT"] || 0,
    //             item.Transport || 0,
    //             item["Product Subtotal"],
    //             item["Total amt"],

    //         ];
    //     });

    //     autoTable(doc, {
    //         head: [tableHeaders],
    //         body: tableData,
    //         startY: y,
    //         margin: 8,
    //         theme: "grid",
    //         styles: { fontSize: 8, cellPadding: 1.5 }, // Smaller font size to fit all columns
    //         headStyles: { fillColor: [245, 245, 245], textColor: 0, fontStyle: "bold" },
    //         // columnStyles: {
    //         //     0: { cellWidth: 'auto' },
    //         //     1: { cellWidth: 'auto' },
    //         //     2: { cellWidth: 'auto' },
    //         //     3: { cellWidth: 'auto' },
    //         //     4: { cellWidth: 'auto' },
    //         //     5: { cellWidth: 'auto' },
    //         //     6: { cellWidth: 'auto' },
    //         //     7: { cellWidth: 'auto' },
    //         //     8: { cellWidth: 'auto' },
    //         //     9: { cellWidth: 'auto' },
    //         //      10: { cellWidth: 'auto' },
    //         //     11: { cellWidth: 'auto' },
    //         //     12: { cellWidth: 'auto' },
    //         //     13: { cellWidth: 'auto' },
    //         //     14: { cellWidth: 'auto' },
    //         //     15: { cellWidth: 'auto' },
    //         // }
    //     });

    //     y = doc.lastAutoTable.finalY + 10;

    //     // Save
    //     doc.save("Sales_Report_Preview.pdf");
    // };

    const generatePDF = () => {
        const doc = new jsPDF();
        if (!salesData) return;

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = 10;

        doc.setLineWidth(0.5);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

        const logoDataUrl = logonew;
        const width = 20;
        const height = 20;
        const x = pageWidth / 2 - width / 2;

        doc.addImage(logoDataUrl, 'JPEG', x, y, width, height, '', 'FAST');
        doc.discardPath();
        y += height + 6;

        doc.setFontSize(16);
        doc.text("Arohan Agro", pageWidth / 2, y, { align: "center" });
        y += 7;
        doc.setFontSize(10);
        doc.text("Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003", pageWidth / 2, y, { align: "center" });
        y += 9;

        doc.setFontSize(16);
        doc.text("Sales Report Preview", pageWidth / 2, y, { align: "center" });
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;

        // Table headers
        const tableHeaders = [
            "Invoice No", "Invoice Date", "Account Name",
            "Product Name", "Rate", "Quantity", "Amount",
            "CGST", "IGST", "SGST", "Transport",
            "Sub Total", "Total amount",
        ];

        // Table data
        const tableData = salesData.map((item) => [
            item.InvoiceNo,
            item.InvoiceDate,
            item.AccountName,
            item.ProductName || 0,
            item.Rate || 0,
            item.Quantity || 0,
            item.Amount || 0,
            item["Product CGST AMT"] || 0,
            item["Product IGST AMT"] || 0,
            item["Product SGST AMT"] || 0,
            item.Transport || 0,
            item["Product Subtotal"] || 0,
            item["Total amt"] || 0,
        ]);

        // Calculate grand total
        const grandTotal = salesData?.reduce((acc, row) => acc + (Number(row["Product Subtotal"]) || 0), 0);

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: y,
            margin: 8,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 1.5 },
            headStyles: { fillColor: [245, 245, 245], textColor: 0, fontStyle: "bold" },
            foot: [
                [
                    { content: "Grand Total", colSpan: 11, styles: { halign: "right", fontStyle: "bold" } },
                    { content: grandTotal.toFixed(2), colSpan: 2, styles: { halign: "right", fontStyle: "bold" } }
                ]
            ]
        });

        doc.save("Sales_Report_Preview.pdf");
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
        "Invoice No",
        "Invoice Date",
        "Account Name",
        "Product Name",
        "Rate",
        "Quantity (Nos)",
        "Amount (Rs)",
        "CGST",
        "IGST",
        "SGST",
        "Transport",
        "Sub Total",
        "Total Amount",
    ];

    worksheet.addRow(headers);

    // Style header
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4F81BD" }, // Blue header background
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add data rows
    data.forEach((item) => {
        worksheet.addRow([
            item.InvoiceNo,
            item.InvoiceDate,
            item.AccountName || "N/A",
            item.ProductName || "N/A",
            Number(item.Rate) || 0,
            Number(item.Quantity) || 0,
            Number(item.Amount) || 0,
            Number(item["Product CGST AMT"]) || 0,
            Number(item["Product IGST AMT"]) || 0,
            Number(item["Product SGST AMT"]) || 0,
            Number(item.Transport) || 0,
            Number(item["Product Subtotal"]) || 0,
            Number(item["Total amt"]) || 0,
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
    totalRow.getCell(11).value = "Grand Total";
    totalRow.getCell(11).font = { bold: true, size: 14 };
    totalRow.getCell(11).alignment = { horizontal: "right" };

    totalRow.getCell(12).value = { formula: `SUM(L2:L${worksheet.lastRow.number - 2})` };
    // totalRow.getCell(13).value = { formula: `SUM(M2:M${worksheet.lastRow.number - 2})` };

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

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


    // const exportToExcel = async (data) => {
    //     if (!data || data.length === 0) {
    //         alert("No data available to export");
    //         return;
    //     }

    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet("SalesReport");

    //     // Define header row
    //     const headers = [
    //         "Invoice No",
    //         "Invoice Date",
    //         "Account Name",
    //         "Product Name",
    //         "Rate",
    //         "Quantity (Nos)",
    //         "Amount (Rs)",
    //         "CGST",
    //         "IGST",
    //         "SGST",
    //         "Transport",
    //         "Sub Total",
    //         "Total Amount",
    //     ];

    //     worksheet.addRow(headers);

    //     // Apply header styling
    //     worksheet.getRow(1).eachCell((cell) => {
    //         cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white bold
    //         cell.fill = {
    //             type: "pattern",
    //             pattern: "solid",
    //             fgColor: { argb: "FF4F81BD" }, // blue background
    //         };
    //         cell.alignment = { horizontal: "center", vertical: "middle" };
    //     });

    //     // Add data rows
    //     data.forEach((item) => {
    //         worksheet.addRow([
    //             item.InvoiceNo,
    //             item.InvoiceDate,
    //             item.AccountName || "N/A",
    //             item.ProductName || "N/A",
    //             item.Rate || "N/A",
    //             item.Quantity || 0,
    //             item.Amount || 0,
    //             item["Product CGST AMT"] || 0,
    //             item["Product IGST AMT"] || 0,
    //             item["Product SGST AMT"] || 0,
    //             item.Transport || 0,
    //             item["Product Subtotal"] || 0,
    //             item["Total amt"] || 0,
    //         ]);
    //     });

    //     // Auto-fit columns
    //     worksheet.columns.forEach((col) => {
    //         let maxLength = 10;
    //         col.eachCell({ includeEmpty: true }, (cell) => {
    //             const columnLength = cell.value ? cell.value.toString().length : 0;
    //             if (columnLength > maxLength) maxLength = columnLength;
    //         });
    //         col.width = maxLength + 5;
    //     });

    //     // Write workbook
    //     const buffer = await workbook.xlsx.writeBuffer();
    //     const blob = new Blob([buffer], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     });
    //     saveAs(blob, `SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    // };


    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'InvoiceNo',
                header: 'Invoice No',
                size: 100,
            },

            {
                accessorKey: 'InvoiceDate',
                header: 'Invoice Date',
                size: 50,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

            {
                accessorKey: 'AccountName',
                header: 'Account Name',
                size: 50,
            },

            {
                accessorKey: 'OrderNo',
                header: 'Order No',
                size: 50,
                
            },

            {
                accessorKey: 'OrderDate',
                header: 'Order Date',
                size: 50,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },


            {
                accessorKey: 'ProductName',
                header: 'Product  Name',
                size: 50,
            },


            {
                accessorKey: 'Rate',
                header: 'Rate',
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


            {
                accessorKey: ["Product CGST AMT"],
                header: 'CGST',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: ["Product IGST AMT"],
                header: 'IGST',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },



            {
                accessorKey: ["Product SGST AMT"],
                header: 'SGST',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: 'Transport',
                header: 'Transport',
                size: 50,
            },



            {
                accessorKey: ["Product Subtotal" || 0],
                header: 'Total With Tax',
                size: 50,
            },

            {
                accessorKey: ["Total amt"],
                header: 'Total Amount',
                size: 50,
                 Cell: ({ cell }) => Number(cell.getValue() || 0).toFixed(2),
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
        return salesData?.reduce((acc, row) => acc + (Number(row["Product Subtotal"]) || 0), 0);
    }, [salesData]);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Sales Report</b></Typography>
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
                            Get Sales Report
                        </Button>
                    </Box>

                </Box>


                {/* table */}
                {/* {showTable && salesData.length > 0 && ( */}
                    <>
                        {showTable && salesData.length > 0 && (
                            <>
                                <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>
                                    <DialogTitle sx={{ textAlign: 'center' }}>
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                            <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} />
                                            <Typography >Arohan Agro Kolhapur</Typography>
                                        </Box>
                                        <Typography sx={{ mt: 1 }}>
                                            Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold', mt: 1 }}>
                                            Sales Report Preview for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
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
                                                                    <TableCell><b>Invoice No</b></TableCell>
                                                                    <TableCell><b>Invoice Date</b></TableCell>
                                                                    <TableCell><strong>Account Name</strong></TableCell>
                                                                    
                                                                    <TableCell> <b>Product  Name</b></TableCell>
                                                                    <TableCell><b>Rate</b></TableCell>
                                                                    <TableCell><strong>Quantity (Nos)</strong></TableCell>
                                                                    <TableCell><strong>Amount (Rs)</strong></TableCell>
                                                                    <TableCell><strong>CGST</strong></TableCell>
                                                                    <TableCell><strong>IGST</strong></TableCell>
                                                                    <TableCell><strong>SGST</strong></TableCell>
                                                                    <TableCell><strong>Transport</strong></TableCell>

                                                                    <TableCell><strong>Sub Total</strong></TableCell>
                                                                    <TableCell><strong>Total Amount</strong></TableCell>

                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {salesData.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{item.InvoiceNo}</TableCell>
                                                                        <TableCell>{item.InvoiceDate}</TableCell>
                                                                        <TableCell>{item.AccountName || 'N/A'}</TableCell>

                                                                        
                                                                        <TableCell>{item.ProductName || 'N/A'}</TableCell>
                                                                        <TableCell>{item.Rate || 'N/A'}</TableCell>
                                                                        <TableCell>{item.Quantity || 0}</TableCell>
                                                                        <TableCell>{item.Amount || 0}</TableCell>

                                                                        <TableCell>{item["Product CGST AMT"] || "0"}</TableCell>
                                                                        <TableCell>{item["Product IGST AMT"] || "0"}</TableCell>
                                                                        <TableCell>{item["Product SGST AMT"] || "0"}</TableCell>
                                                                        <TableCell>{item.Transport || 0}</TableCell>
                                                                        <TableCell>{item["Product Subtotal" || 0]}</TableCell>
                                                                        <TableCell>{item["Total amt"]}</TableCell>

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


                                                    {/* <Box>
                                                        <Typography variant="h6" sx={{ mr: 2 }}>
                                                            Grand Total:
                                                        </Typography>
                                                        <Typography variant="h6" color="primary">
                                                            {grandTotal.toLocaleString("en-IN")}
                                                        </Typography>
                                                    </Box> */}





                                                </Box>
                                            ) : (
                                                <Typography>No data to preview</Typography>
                                            )}
                                        </Box>
                                    </DialogContent>
                                    {/* <DialogActions>
                                        <Box display="flex"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            mt={2}
                                            p={2}
                                            sx={{
                                                borderTop: "2px solid #ddd",
                                                fontWeight: "bold",
                                                backgroundColor: "#f8f9fa",
                                            }}>
                                            <Typography variant="h6" sx={{ mr: 2 }}>
                                                Grand Total:
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {grandTotal.toLocaleString("en-IN")}
                                            </Typography>
                                        </Box>



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
                {/* )} */}
            </Box >
        </Box >
    );
};

export default SalesReport;
