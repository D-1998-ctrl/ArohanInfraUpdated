
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
import moment from 'moment';
import { useMaterialReactTable, } from "material-react-table";
import { MaterialReactTable, } from 'material-react-table';


const ProductionReport = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [productionData, setProductionData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);


    const getProductionReport = () => {
        // Format dates to 'YYYY-MM-DD' using split
        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-CA');
        };
        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);
        const url = `https://arohanagroapi.microtechsolutions.net.in/php/get/getproductionreport.php?FromDate=${formattedFromDate}&ToDate=${formattedToDate}`;
        console.log("URL:", url);

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(data => {
                 console.log('data', data)
                setProductionData(data);
                setShowTable(true);
                setPreviewOpen(true)
            })
            .catch((error) => console.error(error));
    };

    const handleGetProductionReport = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }
        getProductionReport();
    };


    const generatePDF = () => {
        const doc = new jsPDF();
        if (!productionData) return;

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
        doc.text("Production Report Preview", pageWidth / 2, y, { align: "center" });
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;

        // Table headers
        const tableHeaders = [
            "Prod No", "Prod Date", "Operator",
            "Machine", "Start Time", "End Time", "Product",
            "Storage", "Brand Name", "BatchNo", "Weight",
            "Oil Prod", "Percentage","Oil Ltr"
        ];

        // Table data
        const tableData = productionData.map((item) => [
            item.ProductionNo,
            item.ProductionDate,
            item.Operator,
            item.Machine,
            item.MachineStartTime ,
            item.MachineEndTime,
            item.Product ,
            item.Storage ,
            item.BrandName ,
            item.BatchNo ,
            item.Weight,
            item.OilProduced,
            item.Percentage,
            item.OilInLitre
        ]);

        // Calculate grand total
        // const grandTotal = productionData?.reduce((acc, row) => acc + (Number(row["Product Subtotal"]) || 0), 0);

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: y,
            margin: 8,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 1.5 },
            headStyles: { fillColor: [245, 245, 245], textColor: 0, fontStyle: "bold" },
            // foot: [
            //     [
            //         { content: "Grand Total", colSpan: 11, styles: { halign: "right", fontStyle: "bold" } },
            //         { content: grandTotal.toFixed(2), colSpan: 2, styles: { halign: "right", fontStyle: "bold" } }
            //     ]
            // ]
        });

        doc.save("Production_Report_Preview.pdf");
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
            "Production No",
            "Production Date",
            "Operator",
            "Machine",
            "Machine Start Time",
            "Machine End Time",
            "Product",
            "Storage",
            "Brand Name",
            "BatchNo",
            "Weight",
            "Oil Produced",
            "Percentage",
            "OilInLitre"
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
                item.ProductionNo,
                item.ProductionDate,
                item.Operator || "N/A",
                item.Machine || "N/A",
                Number(item.MachineStartTime) || 0,
                Number(item.MachineEndTime) || 0,
                item.Product || 0,
                item.Storage || 0,
                item.BrandName || 0,
                item.BatchNo || 0,
                Number(item.Weight) || 0,
                Number(item.OilProduced) || 0,
                Number(item.Percentage) || 0,
                Number(item.OilInLitre) || 0
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
        // totalRow.getCell(11).value = "Grand Total";
        // totalRow.getCell(11).font = { bold: true, size: 14 };
        // totalRow.getCell(11).alignment = { horizontal: "right" };

        // totalRow.getCell(12).value = { formula: `SUM(L2:L${worksheet.lastRow.number - 2})` };
        // // totalRow.getCell(13).value = { formula: `SUM(M2:M${worksheet.lastRow.number - 2})` };

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
        // });

        // Generate file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `ProductionReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };



    const columns = useMemo(() => {
        return [

            {
                accessorKey: 'ProductionNo',
                header: 'Production No',
                size: 100,
            },

            {
                accessorKey: 'ProductionDate',
                header: 'Production Date',
                size: 50,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },

            {
                accessorKey: 'Operator',
                header: 'Operator',
                size: 50,
            },

            {
                accessorKey: 'Machine',
                header: 'Machine',
                size: 50,
                
            },

            {
                accessorKey: 'MachineStartTime',
                header: 'Machine Start Time',
                size: 50,
              
            },


            {
                accessorKey: 'MachineEndTime',
                header: 'Machine End Time',
                size: 50,
            },


            {
                accessorKey: 'Product',
                header: 'Product',
                size: 50,
            },

            {
                accessorKey: 'Storage',
                header: 'Storage',
                size: 50,
            },


            {
                accessorKey: 'BrandName',
                header: 'BrandName',
                size: 50,
            },


            {
                accessorKey: 'BatchNo',
                header: 'Batch No',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: 'Weight',
                header: 'Weight',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },



            {
                accessorKey: 'OilProduced',
                header: 'OilProduced',
                size: 50,
                 Cell: ({ cell }) => cell.getValue() || 0,
            },


            {
                accessorKey: 'Percentage',
                header: 'Percentage',
                size: 50,
            },



            {
                accessorKey: 'OilInLitre',
                header: 'Oil In Litre',
                size: 50,
            },

        ];
    }, []);

    const table = useMaterialReactTable({
        columns,
        data: productionData,
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
        return productionData?.reduce((acc, row) => acc + (Number(row["Product Subtotal"]) || 0), 0);
    }, [productionData]);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Production Report</b></Typography>
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

                            onClick={handleGetProductionReport}
                            variant="contained"
                        >
                            Get Production Report
                        </Button>
                    </Box>

                </Box>


                {/* table */}
                {/* {showTable && productionData.length > 0 && ( */}
                    <>
                        {showTable && productionData.length > 0 && (
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
                                            Production Report Preview for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
                                        </Typography>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Box>
                                            {productionData.length > 0 ? (
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
                                                    onClick={() => exportToExcel(productionData)}
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
                                            {/* <Box display="flex" alignItems="center" fontWeight="bold">
                                                <Typography variant="h6" sx={{ mr: 2 }}>
                                                   <b>Grand Total:</b> 
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                   <b> {grandTotal.toLocaleString("en-IN")} </b> 
                                                </Typography>
                                            </Box> */}
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

export default ProductionReport;
