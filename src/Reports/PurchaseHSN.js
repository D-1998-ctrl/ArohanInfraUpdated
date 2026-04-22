
import { useState, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {Dialog, DialogActions, DialogContent, DialogTitle, Box,  Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';
import { MRT_TablePagination as MUITablePagination } from "material-react-table";

const PurchaseHSN = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [hSNPurchaseData, setHSNPurchaseData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);


    const getPurchaseHSNwise = () => {
        // Format dates to 'YYYY-MM-DD' using split
        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-CA');
        };
        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);
        const url = `https://arohanagroapi.microtechsolutions.net.in/php/get/getPurchaseHSNwise.php?FromDate=${formattedFromDate}&ToDate=${formattedToDate}`;
        console.log("URL:", url);

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(data => {
                // console.log('data', data)
                setHSNPurchaseData(data);
                setShowTable(true);
                setPreviewOpen(true)
            })
            .catch((error) => console.error(error));
    };

    const handleGetPurchaseHSNwise = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        getPurchaseHSNwise();
    };


    
    const generatePDF = () => {
        const doc = new jsPDF();
        if (!hSNPurchaseData) return;

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
        doc.text("Aarohan Agro", pageWidth / 2, y, { align: "center" });
        y += 7;
        doc.setFontSize(10);
        doc.text("Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003", pageWidth / 2, y, { align: "center" });
        y += 9;

        doc.setFontSize(16);
        doc.text("Purchase HSN Wise Report Preview", pageWidth / 2, y, { align: "center" });
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;

        // Table headers
        const tableHeaders = [
              "HSN Code", "CGST%", "CGSTAmount",
            "SGST%", "IGST%", "IGSTAmount",
        ];

        // Table data
        const tableData = hSNPurchaseData.map((item) => [
            item.HSNCode,
            item.CGSTPercentage,
            item.TotalCGSTAmount,
            item.SGSTPercentage || 0,
            item.IGSTPercentage || 0,
            item.TotalIGSTAmount || 0,
           
        ]);

        // Calculate grand total
        const grandTotal = hSNPurchaseData?.reduce((acc, row) => acc + (Number(row.TotalCGSTAmount) || 0), 0);
        const grandIGSTTotal = hSNPurchaseData?.reduce((acc, row) => acc + (Number(row.TotalIGSTAmount) || 0), 0);

      autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: y,
            margin: 8,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 1.5 },
            headStyles: {
                fillColor: [245, 245, 245],
                textColor: 0,
                fontStyle: "bold"
            },
            foot: [
                [
                    { content: "Total CGST Amount", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
                    { content: grandTotal.toFixed(2), styles: { halign: "right", fontStyle: "bold" } },

                    { content: "Total IGST Amount", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
                    { content: grandIGSTTotal.toFixed(2), styles: { halign: "right", fontStyle: "bold" } }
                ]
            ]
        });

        doc.save("PurchaseHSN_Report_Preview.pdf");
    };

   
const exportToExcel = async (data) => {
    if (!data || data.length === 0) {
        alert("No data available to export");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PurchaseHSNReport");

    // Define header row
    const headers = [
         "HSNCode",
            "CGST%",
            "CGSTAmount",
            "SGST%",
            "IGST%",
            "IGSTAmount",
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
             item.HSNCode,
                Number(item.CGSTPercentage) || 0,
                Number(item.TotalCGSTAmount) || 0,
                Number(item.SGSTPercentage) || 0,
                Number(item.IGSTPercentage) || 0,
                Number(item.TotalIGSTAmount) || 0,
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
    totalRow.getCell(2).value = "Grand Total";
    totalRow.getCell(2).font = { bold: true, size: 14 };
    totalRow.getCell(2).alignment = { horizontal: "right" };

    totalRow.getCell(3).value = { formula: `SUM(L2:L${worksheet.lastRow.number - 2})` };
     totalRow.getCell(6).value = { formula: `SUM(M2:M${worksheet.lastRow.number - 2})` };
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
    saveAs(blob, `PurchaseHSNReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


    


    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'HSNCode',
                header: 'HSN Code',
                size: 100,
            },

            

            {
                accessorKey: 'CGSTPercentage',
                header: 'CGST%',
                size: 50,
            },

            {
                accessorKey: 'TotalCGSTAmount',
                header: 'CGST Amount',
                size: 50,
                
            },

          

            {
                accessorKey: 'SGSTPercentage',
                header: 'SGST%',
                size: 50,
            },


            {
                accessorKey: 'IGSTPercentage',
                header: 'IGST%',
                size: 50,
            },

            {
                accessorKey: 'TotalIGSTAmount',
                header: 'IGST Amount',
                size: 50,
            },


          
        ];
    }, []);


    const table = useMaterialReactTable({
        columns,
        data: hSNPurchaseData,
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
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mr: 4

                }}
                
                >
                    {/* ⬅️ Pagination on Left */}
                    <MUITablePagination table={table} />
        
                    {/* ➡️ Grand Total on Right */}
                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                            <b>CGST Total:</b>
                        </Typography>
        
                        <Typography variant="subtitle1" color="primary">
                            <b>{CGSTTotal.toLocaleString("en-IN")}</b>
                        </Typography>
                    </Box>


                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                            <b>SGST Total:</b>
                        </Typography>
        
                        <Typography variant="subtitle1" color="primary">
                            <b>{SGSTTotal.toLocaleString("en-IN")}</b>
                        </Typography>
                    </Box>




                    <Box display="flex" alignItems="center">
                        <Typography variant="h6" sx={{ mr: 2 }}>
                            <b>IGST Total:</b>
                        </Typography>
        
                        <Typography variant="h6" color="primary">
                            <b>{IGSTTotal.toLocaleString("en-IN")}</b>
                        </Typography>
                    </Box>
                </Box>
            ),
    });

    //grand Total
    const CGSTTotal = useMemo(() => {
        return hSNPurchaseData?.reduce((acc, row) => acc + (Number(row.TotalCGSTAmount) || 0), 0);
    }, [hSNPurchaseData]);


    const SGSTTotal = useMemo(() => {
        return hSNPurchaseData?.reduce((acc, row) => acc + (Number(row.TotalSGSTAmount) || 0), 0);
    }, [hSNPurchaseData]);



    const IGSTTotal = useMemo(() => {
        return hSNPurchaseData?.reduce((acc, row) => acc + (Number(row.TotalIGSTAmount) || 0), 0);
    }, [hSNPurchaseData]);



    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Purchase HSN Wise Report</b></Typography>
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

                            onClick={handleGetPurchaseHSNwise}
                            variant="contained"
                        >
                            Get Purchase HSN Report
                        </Button>
                    </Box>

                </Box>


                {/* table */}
                
                    <>
                        {showTable && hSNPurchaseData.length > 0 && (
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
                                            Purchase HSN Wise Report Preview for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
                                        </Typography>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Box>
                                            {hSNPurchaseData.length > 0 ? (
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
                                                    onClick={() => exportToExcel(hSNPurchaseData)}
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
                                      
                                        </Box>
                                    </DialogActions>

                                </Dialog>
                            </>
                        )}
                    </>

            </Box >
        </Box >
    );
};

export default PurchaseHSN;

