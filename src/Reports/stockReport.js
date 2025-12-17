import { useState, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Paper, Dialog, DialogActions, DialogContent, DialogTitle, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Typography, Button } from '@mui/material';
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

const StockReport = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [stockData, setStockData] = useState([]);
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

        const url = `https://arohanagroapi.microtechsolutions.net.in/php/getstockreport.php?fromdate=${formattedFromDate}&todate=${formattedToDate}`
        console.log("url", url)
        fetch(url, requestOptions)

            .then((response) => response.json())
            .then(data => {
                //console.log('data', data)
                setStockData(data);
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
        if (!stockData) return;

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


        doc.setFillColor(255, 255, 255);
        doc.circle(x + width / 2, y + height / 2, width / 2, 'F'); // White background circle
        doc.setDrawColor(0);
        doc.circle(x + width / 2, y + height / 2, width / 2); // Optional: draw border circle
        doc.clip(); // Clip following drawing to circle
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
        doc.text("Stock Report Preview", pageWidth / 2, y, { align: "center" });


        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;


        // Main table with all details
        const tableHeaders = [
            "Product Name",
            "Sell Price",
            "Opening Balance",

            "Inward Total",
            "Purchase Total",
            "Invoice Total",
            "Balance",
            "Value",


        ];

        const tableData = stockData.map((item) => {


            return [
                item.ProductName,
                item.SellPrice,
                item.OpeningBalance,

                item.InwardTotal || 0,
                item.PurchaseTotal || 0,
                item.InvoiceTotal || 0,
                item.Balance || 0,

                item.Value || 0,

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
        doc.save("Stock_Report_Preview.pdf");
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
            "ProductName",
            "SellPrice",
            "OpeningBalance",
            "InwardTotal",
            "PurchaseTotal",
            "InvoiceTotal",
            "Balance",
            // "Value",

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
                item.ProductName,
                Number(item.SellPrice),
                Number(item.OpeningBalance) || 0,
                Number(item.InwardTotal) || 0,
                Number(item.PurchaseTotal) || 0,
                Number(item.InvoiceTotal) || 0,
                Number(item.Balance) || 0,

                // item.Value || 0,

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




/// // Add Grand Total row
    const totalRowIndex = worksheet.lastRow.number + 2;
    const totalRow = worksheet.getRow(totalRowIndex);
    totalRow.getCell(3).value = "Grand Total";
    totalRow.getCell(3).font = { bold: true, size: 14 };
    totalRow.getCell(3).alignment = { horizontal: "right" };

    totalRow.getCell(4).value = { formula: `SUM(D2:D${worksheet.lastRow.number - 2})` };
     totalRow.getCell(5).value = { formula: `SUM(E2:E${worksheet.lastRow.number - 2})` };
     totalRow.getCell(6).value = { formula: `SUM(F2:F${worksheet.lastRow.number - 2})` };

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





        // Write workbook
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `StockReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };


    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'ProductName',
                header: 'Product Name',
                size: 100,
            },

            {
                accessorKey: 'SellPrice',
                header: 'SellPrice',
                size: 50,
                // Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

            {
                accessorKey: 'OpeningBalance',
                header: 'OpeningBalance',
                size: 50,
            },



            // {
            //     accessorKey: 'OrderDate',
            //     header: 'Order Date',
            //     size: 50,
            //     Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            // },


            {
                accessorKey: 'InwardTotal',
                header: 'Inward Total',
                size: 50,
                Cell: ({ cell }) => Number(cell.getValue() || 0).toFixed(2),
            },


            {
                accessorKey: 'PurchaseTotal',
                header: 'PurchaseTotal',
                size: 50,
                Cell: ({ cell }) => Number(cell.getValue() || 0).toFixed(2),
            },

            {
                accessorKey: 'InvoiceTotal',
                header: 'InvoiceTotal ',
                size: 50,
                Cell: ({ cell }) => Number(cell.getValue() || 0).toFixed(2),
            },


            {
                accessorKey: 'ClosingBalance',
                header: 'ClosingBalance',
                size: 50,
            },


            // {
            //     accessorKey: 'Value',
            //     header: 'Value',
            //     size: 50,
            //     // Cell: ({ cell }) => cell.getValue() || 0,
            //     Cell: ({ cell }) => Number(cell.getValue() || 0).toFixed(2),
            // },
        ];
    }, []);
    const table = useMaterialReactTable({
        columns,
        data: stockData,
        enablePagination: true,
        muiTableHeadCellProps: {
            style: {
                backgroundColor: "#E9ECEF",
                color: "black",
                fontSize: "16px",
            },
        },
    });

    const grandTotal = useMemo(() => {
        return stockData?.reduce((acc, row) => acc + (Number(row.InwardTotal) || 0), 0);
    }, [stockData]);

    const PurchaseTotal = useMemo(() => {
        return stockData?.reduce((acc, row) => acc + (Number(row.PurchaseTotal) || 0), 0);
    }, [stockData]);


    const InvoiceTotal = useMemo(() => {
        return stockData?.reduce((acc, row) => acc + (Number(row.InvoiceTotal) || 0), 0);
    }, [stockData]);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Stock Report</b></Typography>
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
                            Get Stock Report
                        </Button>
                    </Box>

                </Box>


                {/* table */}
                {/* {showTable && stockData.length > 0 && ( */}
                    <>
                        {showTable && stockData.length > 0 && (
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
                                            Stock Report Preview for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
                                        </Typography>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Box>
                                            {stockData.length > 0 ? (
                                                <Box>


                                                    {/* Table to display sales data */}
                                                    {/* <TableContainer fullWidth component={Paper} sx={{ mt: 3 }}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><b>Product Name</b></TableCell>
                                                                    <TableCell><b>Sell Price</b></TableCell>
                                                                    <TableCell><strong>Opening Balance</strong></TableCell>
                                                                   
                                                                    <TableCell> <b>Inward Total</b></TableCell>
                                                                    <TableCell><b>Purchase Total</b></TableCell>
                                                                    <TableCell><strong>Invoice Total</strong></TableCell>
                                                                    <TableCell><strong>Balance</strong></TableCell>
                                                                    <TableCell><strong>Value</strong></TableCell>


                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {stockData.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{item.ProductName}</TableCell>
                                                                        <TableCell>{item.SellPrice}</TableCell>
                                                                        <TableCell>{item.OpeningBalance || 0}</TableCell>

                                                                       
                                                                        <TableCell>{item.InwardTotal || 0}</TableCell>
                                                                        <TableCell>{item.PurchaseTotal || 0}</TableCell>
                                                                        <TableCell>{item.InvoiceTotal || 0}</TableCell>
                                                                        <TableCell>{item.Balance || 0}</TableCell>


                                                                        <TableCell>{item.Value || 0}</TableCell>


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
                                        <Button variant='contained' endIcon={<FileDownloadIcon />} onClick={() => exportToExcel(stockData)}>Excel Data</Button>
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
                                                    onClick={() => exportToExcel(stockData)}
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
                                            <Box display="flex" alignItems="center" fontWeight="bold" gap={2}>
                                                <Box display={'flex'}>
                                                    <Typography variant="h6" sx={{ mr: 2 }}>
                                                        <b>Inward Total:</b>
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        <b> {grandTotal.toLocaleString("en-IN")} </b>
                                                    </Typography>
                                                </Box>


                                                <Box display={'flex'}>
                                                    <Typography variant="h6" sx={{ mr: 2 }}>
                                                        <b>Purchase Total:</b>
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        <b> {PurchaseTotal.toLocaleString("en-IN")} </b>
                                                    </Typography>
                                                </Box>


                                                <Box display={'flex'}>
                                                    <Typography variant="h6" sx={{ mr: 2 }}>
                                                        <b>Invoice Total:</b>
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        <b> {InvoiceTotal.toLocaleString("en-IN")} </b>
                                                    </Typography>
                                                </Box>

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

export default StockReport;
