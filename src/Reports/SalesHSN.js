import { useState, useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button } from '@mui/material';
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

const SalesHSN = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);


    const getSalesHSNReport = () => {
        // Format dates to 'YYYY-MM-DD' using split
        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-CA');
        };
        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);
        const url = `https://arohanagroapi.microtechsolutions.net.in/php/get/getSalesHSNwise.php/?FromDate=${formattedFromDate}&ToDate=${formattedToDate}`;
        console.log("URL:", url);

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(data => {
                //   console.log('data', data)
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
        getSalesHSNReport();
    };



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
        doc.text("Aarohan Agro", pageWidth / 2, y, { align: "center" });
        y += 7;
        doc.setFontSize(10);
        doc.text("Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003", pageWidth / 2, y, { align: "center" });
        y += 9;

        doc.setFontSize(16);
        doc.text("Sales HSN Wise Report Preview", pageWidth / 2, y, { align: "center" });
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;

        // Table headers
        const tableHeaders = [
            "HSN Code", "CGST%", "CGST Amount",
            "SGST%", "SGST Amount", "IGST%", "IGST Amount",

        ];

        // Table data
        const tableData = salesData.map((item) => [
            item.HSNCode,
            Number(item.CGSTPercentage || 0).toFixed(2),
            Number(item.TotalCGSTAmount || 0).toFixed(2),
            // item.TotalCGSTAmount,
            Number(item.SGSTPercentage || 0).toFixed(2),
            Number(item.TotalSGSTAmount || 0).toFixed(2),
            Number(item.IGSTPercentage || 0).toFixed(2),
            Number(item.TotalIGSTAmount || 0).toFixed(2),

        ]);

        // Calculate grand total
        const CGSTTotal = salesData?.reduce((acc, row) => acc + (Number(row.TotalCGSTAmount) || 0), 0);
        const SGSTTotal = salesData?.reduce((acc, row) => acc + (Number(row.TotalSGSTAmount) || 0), 0);
        const IGSTTotal = salesData?.reduce((acc, row) => acc + (Number(row.TotalIGSTAmount) || 0), 0);
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: y,
            margin: 7,

            theme: "grid",
            styles: { fontSize: 8, },
            headStyles: {
                fillColor: [245, 245, 245],
                textColor: 0,
                fontStyle: "bold"
            },
            foot: [
                [
                    { content: "Total CGST Amount", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
                    { content: CGSTTotal.toFixed(2), styles: { halign: "right", fontStyle: "bold" } },

                    { content: "Total SGST Amount", colSpan: 1, styles: { halign: "right", fontStyle: "bold" } },
                    { content: SGSTTotal.toFixed(2), styles: { halign: "right", fontStyle: "bold" } },


                    { content: "Total IGST Amount", styles: { halign: "right", fontStyle: "bold" } },
                    { content: IGSTTotal.toFixed(2), styles: { halign: "right", fontStyle: "bold" } }
                ]
            ]
        });


        doc.save("SalesHSN_Report_Preview.pdf");
    };


    const exportToExcel = async (data) => {
        if (!data || data.length === 0) {
            alert("No data available to export");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("SalesHSNReport");

        // Define header row
        const headers = [
            "HSNCode",
            "CGST%",
            "CGST Amount",
            "SGST%",
            "SGST Amount",
            "IGST%",
            "IGST Amount",

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
                Number(item.TotalSGSTAmount) || 0,
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
        // const totalRowIndex = worksheet.lastRow.number + 2;
        // const totalRow = worksheet.getRow(totalRowIndex);
        // totalRow.getCell(2).value = "Grand Total";
        // totalRow.getCell(2).font = { bold: true, size: 14 };
        // totalRow.getCell(2).alignment = { horizontal: "right" };

        // totalRow.getCell(3).value = { formula: `SUM(L2:L${worksheet.lastRow.number - 2})` };
        // totalRow.getCell(6).value = { formula: `SUM(M2:M${worksheet.lastRow.number - 2})` };

        // // Style Grand Total row
        // totalRow.eachCell((cell) => {
        //     cell.font = { bold: true, size: 14, color: { argb: "FF000000" } }; // Black bold text
        //     cell.fill = {
        //         type: "pattern",
        //         pattern: "solid",
        //         fgColor: { argb: "FFFFE699" }, // Light yellow background
        //     };
        //     cell.alignment = { horizontal: "center", vertical: "middle" };
        //     cell.border = {
        //         top: { style: "thin" },
        //         bottom: { style: "thin" },
        //     };
        const dataLastRow = worksheet.lastRow.number;
const totalRowIndex = dataLastRow + 2;
const totalRow = worksheet.getRow(totalRowIndex);

// Label
totalRow.getCell(2).value = "Grand Total";
totalRow.getCell(2).font = { bold: true, size: 14 };
totalRow.getCell(2).alignment = { horizontal: "right" };

// CGST Amount Total (Column C)
totalRow.getCell(3).value = {
    formula: `SUM(C2:C${dataLastRow})`
};

// SGST Amount Total (Column E)
totalRow.getCell(5).value = {
    formula: `SUM(E2:E${dataLastRow})`
};

// IGST Amount Total (Column G)
totalRow.getCell(7).value = {
    formula: `SUM(G2:G${dataLastRow})`
};

// Style Grand Total row
totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 14 };
    cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE699" }, // light yellow
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
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return value ? Number(value).toFixed(2) : "0.00";
                },
            },

            {
                accessorKey: 'TotalCGSTAmount',
                header: 'CGSTAmount',
                size: 50,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return value ? Number(value).toFixed(2) : "0.00";
                },

            },


            {
                accessorKey: 'SGSTPercentage',
                header: 'SGST%',
                size: 50,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return value ? Number(value).toFixed(2) : "0.00";
                },
            },


            {
                accessorKey: 'TotalSGSTAmount',
                header: 'SGSTAmount',
                size: 50,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return value ? Number(value).toFixed(2) : "0.00";
                },

            },


            {
                accessorKey: 'IGSTPercentage',
                header: 'IGST%',
                size: 50,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return value ? Number(value).toFixed(2) : "0.00";
                },
            },

            {
                accessorKey: 'TotalIGSTAmount',
                header: 'IGSTAmount',
                size: 50,
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return value ? Number(value).toFixed(2) : "0.00";
                },
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

     renderBottomToolbar: ({ table }) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mr:4

                    }}
                >
                    {/* ⬅️ Pagination on Left */}
                    <MUITablePagination table={table} />

                    {/* ➡️ Totals on Right */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            fontWeight: "bold",
                        }}
                    >
                        
                        <Box sx={{display: "flex",alignItems: "center",}}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                CGST Total :
                            </Typography>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                {CGSTTotal.toLocaleString("en-IN")}
                            </Typography>
                        </Box>

                       
                        <Box sx={{display: "flex",alignItems: "center",}}>
                            <Typography variant="subtitle1" fontWeight="bold">
                             SGST Total :
                            </Typography>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                               {SGSTTotal.toLocaleString("en-IN")}
                            </Typography>
                        </Box>

                         <Box sx={{display: "flex",alignItems: "center",}}>
                            <Typography variant="subtitle1" fontWeight="bold">
                             IGST Total :
                            </Typography>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                               {IGSTTotal.toLocaleString("en-IN")}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )
    });

    //grand Total
    const CGSTTotal = useMemo(() => {
        return salesData?.reduce((acc, row) => acc + (Number(row.TotalCGSTAmount) || 0), 0);
    }, [salesData]);

    const SGSTTotal = useMemo(() => {
        return salesData?.reduce((acc, row) => acc + (Number(row.TotalSGSTAmount) || 0), 0);
    }, [salesData]);

    const IGSTTotal = useMemo(() => {
        return salesData?.reduce((acc, row) => acc + (Number(row.TotalIGSTAmount) || 0), 0);
    }, [salesData]);


    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Sales HSN Wise Report</b></Typography>
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
                            Get Sales HSN Report
                        </Button>
                    </Box>

                </Box>


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
                                        Sales HSN Wise Report Preview for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
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
                                        {/* <Typography variant="h6">
                                            <b>CGST Total :</b>{" "}
                                            <span style={{ color: "#1976d2", marginRight: 16 }}>
                                                {CGSTTotal.toLocaleString("en-IN")}
                                            </span>


                                            <b>SGST Total :</b>{" "}
                                            <span style={{ color: "#1976d2", marginRight: 16 }}>
                                                {SGSTTotal.toLocaleString("en-IN")}
                                            </span>

                                            <b>IGST Total :</b>{" "}
                                            <span style={{ color: "#1976d2" }}>
                                                {IGSTTotal.toLocaleString("en-IN")}
                                            </span>
                                        </Typography> */}

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

export default SalesHSN;

