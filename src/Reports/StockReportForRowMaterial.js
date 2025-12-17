
import { useState, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {Dialog, DialogActions, DialogContent, DialogTitle, Box,Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';


const StockReportForRowMaterial = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [rawMaterialReportData, setRawMaterialReportData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);


    const getRawMaterialReport = () => {
        // Format dates to 'YYYY-MM-DD' using split
        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-CA');
        };
        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);
        const url = `https://arohanagroapi.microtechsolutions.net.in/php/get/getstockreportrawmaterial.php?FromDate=${formattedFromDate}&ToDate=${formattedToDate}`;
        console.log("URL:", url);

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(data => {
                 console.log('data', data)
                setRawMaterialReportData(data);
                setShowTable(true);
                setPreviewOpen(true)
            })
            .catch((error) => console.error(error));
    };

    const handlegetRawMaterialReport = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        getRawMaterialReport();
    };


    const generatePDF = () => {
        const doc = new jsPDF();
        if (!rawMaterialReportData) return;

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
        doc.text("Stock report for row material", pageWidth / 2, y, { align: "center" });
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;

        // Table headers
        const tableHeaders = [
            "Material Name", "Opening Bal", "Quenty",
            "Weight", "Closing Bal"
        ];

        // Table data
        const tableData = rawMaterialReportData.map((item) => [
            item.MaterialName,
            item['Opening Bal'],
            item.Qty,
            item.Weight,
            item['Closing Bal'] ,
          
        ]);

        // Calculate grand total
         const grandTotal = rawMaterialReportData?.reduce((acc, row) => acc + (Number(row["Closing Bal"]) || 0), 0);

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
                    { content: "Grand Total (Closing Bal)", colSpan: 4, styles: { halign: "right", fontStyle: "bold" } },
                     { content: grandTotal.toFixed(2), colSpan: 1, styles: { halign: "right", fontStyle: "bold" } }
                ]
            ]
        });

        doc.save("stockreport_for_row_material.pdf");
    };



    const exportToExcel = async (data) => {
        if (!data || data.length === 0) {
            alert("No data available to export");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("ProductionReport");

        // Define header row
        const headers = [
            "Material Name",
            "Opening Bal",
            "Quenty",
            "Weight",
            "Closing Bal",
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
                item.MaterialName,
                Number(item['Opening Bal']),
                Number(item.Qty || "N/A"),
                Number(item.Weight || "N/A"),
                Number(item['Closing Bal']) || 0,
               
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
        totalRow.getCell(4).value = "Closing Bal Total ";
        totalRow.getCell(4).font = { bold: true, size: 14 };
        totalRow.getCell(4).alignment = { horizontal: "right" };

        totalRow.getCell(5).value = { formula: `SUM(E2:E${worksheet.lastRow.number - 2})` };
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
        saveAs(blob, `stockreport_raw_material${new Date().toISOString().slice(0, 10)}.xlsx`);
    };



    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'MaterialName',
                header: 'Material Name',
                size: 100,
            },

            {
                accessorKey: ['Opening Bal'],
                header: 'Opening Bal',
                size: 50,
                // Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

            {
                accessorKey: 'Qty',
                header: 'Quenty',
                size: 50,
            },

            {
                accessorKey: 'Weight',
                header: 'Weight',
                size: 50,
                
            },

            {
                accessorKey: ["Closing Bal"],
                header: 'Closing Bal',
                size: 50,
              
            },


           

        ];
    }, []);

    const table = useMaterialReactTable({
        columns,
        data: rawMaterialReportData,
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
        return rawMaterialReportData?.reduce((acc, row) => acc + (Number(row["Closing Bal"]) || 0), 0);
    }, [rawMaterialReportData]);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Stock Report For Row Material </b></Typography>
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

                            onClick={handlegetRawMaterialReport}
                            variant="contained"
                        >
                            Get Report
                        </Button>
                    </Box>

                </Box>


                {/* table */}
                
                    <>
                        {showTable && rawMaterialReportData.length > 0 && (
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
                                            Preview of stock report for row material {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
                                        </Typography>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Box>
                                            {rawMaterialReportData.length > 0 ? (
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
                                                    onClick={() => exportToExcel(rawMaterialReportData)}
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
                                                   <b>Grand Total Of Closing Bal:</b> 
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
               
            </Box >
        </Box >
    );
};

export default StockReportForRowMaterial;

