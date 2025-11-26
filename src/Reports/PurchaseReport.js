import { useState, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';


const PurchaseReport = () => {
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
        const url = `https://arohanagroapi.microtechsolutions.net.in/php/getpurchasereport.php?fromdate=${formattedFromDate}&todate=${formattedToDate}`;
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


const generatePDF = () => {
  const doc = new jsPDF("landscape");
  if (!salesData || !salesData.length) return;

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 10;

  // Border
  doc.setLineWidth(0.5);
  doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.getHeight() - 10);

  // Logo
  const width = 20, height = 20, x = pageWidth / 2 - width / 2;
  if (logonew) doc.addImage(logonew, "JPEG", x, y, width, height, "", "FAST");
  y += height + 6;

  // Company Info
  doc.setFontSize(16);
  doc.text("Arohan Agro", pageWidth / 2, y, { align: "center" });
  y += 7;
  doc.setFontSize(10);
  doc.text(
    "Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003",
    pageWidth / 2,
    y,
    { align: "center", maxWidth: pageWidth - 20 }
  );
  y += 9;

  // Report Title
  doc.setFontSize(14);
  doc.text("Purchase Report Preview", pageWidth / 2, y, { align: "center" });
  y += 6;

  // Divider Line
  doc.setLineWidth(0.5);
  doc.line(10, y, pageWidth - 10, y);
  y += 6;

  // Helper to safely parse numbers
  const parseNum = (v) => {
    if (v === null || v === undefined) return 0;
    const cleaned = String(v).replace(/,/g, "").trim();
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const tableHeaders = [
    "InvoiceNo","Invoice Date","Order No","Order Date","Account Name","Quantity","Rate","Amount",
    "CGST%","CGST Amt","SGST%","SGST Amt","IGST%","IGST Amt","Total with Tax",
    "Invoice CGST Amt","Invoice SGST Amt","Invoice IGST Amt","InvoiceSubtotal","Transport","Total Amount"
  ];

  const tableData = salesData.map((item) => [
    item.InvoiceNo,
    item.InvoiceDate,
    item.OrderNo || "N/A",
    item.OrderDate || "N/A",
    item.AccountName || "N/A",
    item.Quantity ?? 0,
    item.Rate ?? 0,
    item.Amount ?? 0,
    item.CGSTPercentage ?? 0,
    item["Product CGST AMT"] ?? 0,
    item.SGSTPercentage ?? 0,
    item["Product SGST AMT"] ?? 0,
    item.IGSTPercentage ?? 0,
    item["Product IGST AMT"] ?? 0,
    item["Product Subtotal"] ?? 0,
    item["Total Invoice CGST Amt"] ?? 0,
    item["Total Invoice SGST Amt"] ?? 0,
    item["Total Invoice IGST Amt"] ?? 0,
    item["Total Invoice Subtotal"] ?? 0,
    item.Transport ?? 0,
    item["Total amt"] ?? item["Total Amount"] ?? 0,
  ]);

  // ✅ Calculate Totals
  const totalCGST = salesData.reduce((s, it) => s + parseNum(it["Product CGST AMT"]), 0);
  const totalSGST = salesData.reduce((s, it) => s + parseNum(it["Product SGST AMT"]), 0);
  const totalIGST = salesData.reduce((s, it) => s + parseNum(it["Product IGST AMT"]), 0);
  const totalAmount = salesData.reduce((s, it) => s + parseNum(it["Total amt"] ?? it["Total Amount"]), 0);

  // ✅ Footer Row (totals aligned under respective columns)
  const footerRow = new Array(tableHeaders.length).fill("");
  footerRow[9] = totalCGST.toFixed(2);   // "CGST Amt"
  footerRow[11] = totalSGST.toFixed(2);  // "SGST Amt"
  footerRow[13] = totalIGST.toFixed(2);  // "IGST Amt"
  footerRow[20] = totalAmount.toFixed(2); // "Total Amount"
  footerRow[4] = "TOTAL"; // Label under "Account Name" column

  autoTable(doc, {
    head: [tableHeaders],
    body: [...tableData, footerRow],  // add totals as last row
    startY: y,
    margin: { top: 10, left: 8, right: 8 },
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 1, overflow: "linebreak" },
    headStyles: { fillColor: [230, 230, 230],
         textColor: 20, fontStyle: "bold", halign: "center" },
    bodyStyles: { halign: "center" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 10 }, 1: { cellWidth: 18 }, 2: { cellWidth: 10 }, 3: { cellWidth: 20 },
      4: { cellWidth: 30 }, 5: { cellWidth: 13, halign: "right" }, 6: { cellWidth: 10, halign: "right" },
      7: { cellWidth: 13, halign: "right" }, 8: { cellWidth: 12 }, 9: { cellWidth: 13, halign: "right" },
      10: { cellWidth: 12 }, 11: { cellWidth: 13, halign: "right" }, 12: { cellWidth: 10 },
      13: { cellWidth: 10, halign: "right" }, 14: { cellWidth: 15, halign: "right" },
      15: { cellWidth: 13, halign: "right" }, 16: { cellWidth: 15, halign: "right" },
      17: { cellWidth: 15, halign: "right" }, 18: { cellWidth: 10, halign: "right" },
      19: { cellWidth: 10, halign: "right" }, 20: { cellWidth: 15, halign: "right" }
    },
    didParseCell: (data) => {
      if (data.row.index === tableData.length) {
        data.cell.styles.fillColor = [220, 220, 220]; // grey bg for totals
        data.cell.styles.fontStyle = "bold";
      }
    }
  });

  doc.save("Purchase_Report_Preview.pdf");
};


// const generatePDF = () => {
//   const doc = new jsPDF("landscape"); // Landscape for wide tables
//   if (!salesData) return;

//   const pageWidth = doc.internal.pageSize.getWidth();
//   let y = 10;

//   // Border
//   doc.setLineWidth(0.5);
//   doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.getHeight() - 10);

//   // Logo
//   const width = 20, height = 20, x = pageWidth / 2 - width / 2;
//   doc.addImage(logonew, "JPEG", x, y, width, height, "", "FAST");
//   y += height + 6;

//   // Company Info
//   doc.setFontSize(16);
//   doc.text("Arohan Agro", pageWidth / 2, y, { align: "center" });
//   y += 7;
//   doc.setFontSize(10);
//   doc.text(
//     "Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003",
//     pageWidth / 2,
//     y,
//     { align: "center", maxWidth: pageWidth - 20 }
//   );
//   y += 9;

//   // Report Title
//   doc.setFontSize(14);
//   doc.text("Purchase Report Preview", pageWidth / 2, y, { align: "center" });
//   y += 6;

//   // Divider Line
//   doc.setLineWidth(0.5);
//   doc.line(10, y, pageWidth - 10, y);
//   y += 6;

//   // Table
//   const tableHeaders = [
//     "InvoiceNo",
//     "Invoice Date",
//     "Order No",
//     "Order Date",
//     "Account Name",
//     "Quantity",
//     "Rate",
//     "Amount",
//     "CGST%",
//     "CGST Amt",
//     "SGST%",
//     "SGST Amt",
//     "IGST%",
//     "IGST Amt",
//     "Total with Tax",
//     "Invoice CGST Amt",
//     "Invoice SGST Amt",
//     "Invoice IGST Amt",
//      "InvoiceSubtotal",
//     "Transport",
//     "Total Amount"
//   ];

//   const tableData = salesData.map((item) => [
//     item.InvoiceNo,
//     item.InvoiceDate,
//     item.OrderNo || "N/A",
//     item.OrderDate || "N/A",
//     item.AccountName || "N/A",
//     item.Quantity || 0,
//     item.Rate || 0,
//     item.Amount || 0,
//     item.CGSTPercentage || 0,
//     item["Product CGST AMT"] || 0,
//     item.SGSTPercentage || 0,
//     item["Product SGST AMT"] || 0,
//     item.IGSTPercentage || 0,
//     item["Product IGST AMT"] || 0,
//     item["Product Subtotal"] || 0,
//     item["Total Invoice CGST Amt"] || 0,
//     item["Total Invoice SGST Amt"] || 0,
//     item["Total Invoice IGST Amt"] || 0,
//     item["Total Invoice Subtotal"] || 0,
//     item.Transport || 0,
//     item["Total amt"] || 0,
//   ]);

//   autoTable(doc, {
//     head: [tableHeaders],
//     body: tableData,
//     startY: y,
//     margin: { top: 10, left: 8, right: 8 },
//     theme: "grid",
//     styles: {
//       fontSize: 7, // smaller font for more columns
//       cellPadding: 1,
//       overflow: "linebreak",
//     },
//     headStyles: {
//       fillColor: [230, 230, 230],
//       textColor: 20,
//       fontStyle: "bold",
//       halign: "center",
//     },
//     bodyStyles: {
//       halign: "center",
//     },
//     alternateRowStyles: { fillColor: [245, 245, 245] },
//     columnStyles: {
//       0: { cellWidth: 10 }, // Invoice No
//       1: { cellWidth: 18 }, // Invoice Date
//       2: { cellWidth: 10 }, // Order No
//       3: { cellWidth: 20 }, // Order Date
//       4: { cellWidth: 30 }, // Account Name
//       5: { cellWidth: 13, halign: "right" }, // Quantity
//       6: { cellWidth: 10, halign: "right" }, // Rate
//       7: { cellWidth: 13, halign: "right" }, // Amount
//       8: { cellWidth: 12 }, // CGST%
//       9: { cellWidth: 13, halign: "right" },
//       10: { cellWidth: 12 }, // SGST%
//       11: { cellWidth: 13, halign: "right" },
//       12: { cellWidth: 10 }, // IGST%
//       13: { cellWidth: 10, halign: "right" },
//       14: { cellWidth: 15, halign: "right" }, // Product Subtotal
//       15: { cellWidth: 13, halign: "right" },
//       16: { cellWidth: 15, halign: "right" },
//       17: { cellWidth: 15, halign: "right" },
//       18: { cellWidth: 10, halign: "right" },
//       19: { cellWidth: 10, halign: "right" }, // Transport
//       20: { cellWidth: 10,} // Total Amount
//     },
//   });

//   doc.save("Purchase_Report_Preview.pdf");
// };


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
            "Order No",
            "Order Date",
            "Account Name",
            "Quantity",
            "Rate",
            "Amount",
            "CGST%",
            "Product CGST AMT",
            "SGST%",
            "Product SGST AMT",
            "IGST%",
            "Product IGST AMT",
            "Product Subtotal",
            "Total Invoice CGST Amt",
            "Total Invoice SGST Amt",
            "Total Invoice IGST Amt",
            "Total Invoice Subtotal",
            "Transport",
            "Total amount"
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
                item.InvoiceNo,
                item.InvoiceDate,
                item.OrderNo || "N/A",
                item.OrderDate || "N/A",
                item.AccountName || "N/A",
                Number(item.Quantity) || 0,
                Number(item.Rate) || 0,
                Number(item.Amount) || 0,
                Number(item.CGSTPercentage) || 0,
                Number(item["Product CGST AMT"]) || 0,
                Number(item.SGSTPercentage) || 0,
                Number(item["Product SGST AMT"]) || 0,
                Number(item.IGSTPercentage) || 0,
                Number(item["Product IGST AMT"]) || 0,
                //
                Number(item["Product Subtotal"]) || 0,
                Number(item["Total Invoice CGST Amt"]) || 0,
                Number(item["Total Invoice SGST Amt"]) || 0,
                Number(item["Total Invoice IGST Amt"]) || 0,
                Number(item["Total Invoice Subtotal"] )|| 0,
                Number(item.Transport) ||0,
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
    totalRow.getCell(20).value = "Grand Total";
    totalRow.getCell(20).font = { bold: true, size: 14 };
    totalRow.getCell(20).alignment = { horizontal: "right" };

    totalRow.getCell(21).value = { formula: `SUM(U2:U${worksheet.lastRow.number - 2})` };
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







        // Write workbook
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `PurchaseReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };


    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'InvoiceNo',
                header: 'Invoice No',
                size: 100,
            },

            {
                accessorKey: 'InvoiceDate',
                // 'InvoiceDate.date',
                header: 'Invoice Date',
                size: 50,
                // Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
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
                // 'OrderDate.date',
                header: 'Order Date',
                size: 50,
                // Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },


            {
                accessorKey: 'Quantity',
                header: 'Quantity',
                size: 50,
            },


            {
                accessorKey: 'Rate',
                header: 'Rate',
                size: 50,
            },

            {
                accessorKey: 'Amount',
                header: 'Amount',
                size: 50,
            },


            {
                accessorKey: 'CGSTPercentage',
                header: 'CGST%',
                size: 50,
            },


            {
                accessorKey: ["Product CGST AMT"],
                header: 'CGST Amount ',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: 'SGSTPercentage',
                header: 'SGST%',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },



            {
                accessorKey: ["Product SGST AMT"],
                header: 'SGST Amount',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },
            //
            
            {
                accessorKey: 'IGSTPercentage',
                header: 'IGST%',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },



            {
                accessorKey: ["Product IGST AMT"],
                header: 'IGST Amount',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },

            {
                accessorKey: ["Product Subtotal" || 0],
                header: 'Total With Tax',
                size: 50,
            },


             {
                accessorKey: ["Total Invoice CGST Amt" || 0],
                header: 'Total Invoice CGST Amt',
                size: 250,
            },

            //
            
             {
                accessorKey: ["Total Invoice SGST Amt" || 0],
                header: 'Total Invoice SGST Amt',
                size: 250,
            },
            
             {
                accessorKey: ["Total Invoice IGST Amt" || 0],
                header: 'Total Invoice IGST Amt',
                size: 250,
            },

            
             {
                accessorKey: ["Total Invoice Subtotal" || 0],
                header: 'Total Invoice Subtotal',
                size: 250,
            },

            {
                accessorKey: 'Transport',
                header: 'Transport',
                size: 50,
                 Cell: ({ cell }) => Number(cell.getValue() || 0).toFixed(2),
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
        return salesData?.reduce((acc, row) => acc + (Number(row["Total amt"]) || 0), 0);
    }, [salesData]);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Purchase Report</b></Typography>
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
                            Get Purchase Report
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
                                            <Typography >Arohan Agro Kolhapur</Typography>
                                        </Box>
                                        <Typography sx={{ mt: 1 }}>
                                            Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold', mt: 1 }}>
                                            Purchase Report Preview for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
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

export default PurchaseReport;
