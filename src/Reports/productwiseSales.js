
import { useState,useMemo } from 'react';
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


const ProductwiseSales = () => {
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

        const url= `https://arohanagroapi.microtechsolutions.net.in/php/getproductwisereport.php?fromdate=${formattedFromDate}&todate=${formattedToDate}`
        console.log('url',url)
        fetch(url,requestOptions)
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
        doc.text("ProductWise Sales Report ", pageWidth / 2, y, { align: "center" });


        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;


        // Main table with all details
        const tableHeaders = [
            "Product Name",
            "UOM",
            "Sell Price",
            "Invoice Quantity",
            "Invoice Amount",
            "PurchaseOther Quantity",
            "PurchaseOther Amount",
          
        ];

        const tableData = salesData.map((item) => {
            

            return [
                item.ProductName,
                item.UOM,
                item.SellPrice,
                item.InvoiceQuantity,
                item.InvoiceAmount || 0,
                item.PurchaseOtherQuantity || 0,
                item.PurchaseOtherAmount || 0,
              
            ];
        });

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: y,
            margin: { left: 10 },
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 1.5 }, // Smaller font size to fit all columns
            headStyles: { fillColor: [245, 245, 245], textColor: 0, fontStyle: "bold" },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 'auto' },
                5: { cellWidth: 'auto' },
                6: { cellWidth: 'auto' },
               
            }
        });

        y = doc.lastAutoTable.finalY + 10;
      
        // Save
        doc.save("ProductWise Sales.pdf");
    };


    // const exportToExcel = async (data) => {
    //   if (!data || data.length === 0) {
    //     alert("No data available to export");
    //     return;
    //   }
    
    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("SalesReport");
    
    //   // Define header row
    //   const headers = [
    //     "Product Name",
    //     "UOM",
    //     "SellPrice",
    //     "InvoiceQuantity",
    //     "InvoiceAmount",
    //     "PurchaseOtherQuantity",
    //     "PurchaseOtherAmount",

     
    //   ];
    
    //   worksheet.addRow(headers);
    
    //   // Apply header styling
    //   worksheet.getRow(1).eachCell((cell) => {
    //     cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // white bold
    //     cell.fill = {
    //       type: "pattern",
    //       pattern: "solid",
    //       fgColor: { argb: "FF4F81BD" }, // blue background
    //     };
    //     cell.alignment = { horizontal: "center", vertical: "middle" };
    //   });
    
    //   // Add data rows
    //   data.forEach((item) => {
    //     worksheet.addRow([
       
    //       item.ProductName,
    //       item.UOM || "N/A",
    //       item.SellPrice || 0,
    //       item.InvoiceQuantity || 0,
    //       item.InvoiceAmount || 0,
    //       item.PurchaseOtherQuantity || 0,
    //       item.PurchaseOtherAmount || 0,
          
    //     ]);
    //   });
    
    //   // Auto-fit columns
    //   worksheet.columns.forEach((col) => {
    //     let maxLength = 10;
    //     col.eachCell({ includeEmpty: true }, (cell) => {
    //       const columnLength = cell.value ? cell.value.toString().length : 0;
    //       if (columnLength > maxLength) maxLength = columnLength;
    //     });
    //     col.width = maxLength + 5;
    //   });
    
    //   // Write workbook
    //   const buffer = await workbook.xlsx.writeBuffer();
    //   const blob = new Blob([buffer], {
    //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   });
    //   saveAs(blob, `Productwise_SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
    // };
const exportToExcel = async (data) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("SalesReport");

  // Define headers
  const headers = [
    "Product Name",
    "UOM",
    "SellPrice",
    "InvoiceQuantity",
    "InvoiceAmount",
    "PurchaseOtherQuantity",
    "PurchaseOtherAmount",
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
    worksheet.addRow([
      item.ProductName,
      item.UOM || "N/A",
      Number(item.SellPrice) || 0,
      Number(item.InvoiceQuantity) || 0,
      Number(item.InvoiceAmount) || 0,
      Number(item.PurchaseOtherQuantity) || 0,
      Number(item.PurchaseOtherAmount) || 0,
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

  // === Add Grand Total Row ===
  const lastRow = worksheet.lastRow.number + 1;
  const totalRow = worksheet.addRow([]);

  totalRow.getCell(1).value = "Grand Total";
  totalRow.getCell(1).font = { bold: true, size: 13 };
  totalRow.getCell(1).alignment = { horizontal: "right" };

  // Add SUM formulas
  // Column 5 = InvoiceAmount (E), Column 7 = PurchaseOtherAmount (G)
  totalRow.getCell(5).value = { formula: `SUM(E2:E${lastRow - 1})` };
  totalRow.getCell(5).font = { bold: true };

  totalRow.getCell(7).value = { formula: `SUM(G2:G${lastRow - 1})` };
  totalRow.getCell(7).font = { bold: true };

  // Apply styling to total row
  totalRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE699" }, // light blue shade
    };
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
  saveAs(blob, `Productwise_SalesReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


     const columns = useMemo(() => {
            return [
    
                {
                    accessorKey: 'ProductName',
                    header: 'Product Name',
                    size: 50,
                },
    
                {
                    accessorKey: 'UOM',
                    header: 'UOM',
                    size: 30,
                    Cell: ({ cell }) => cell.getValue() || "-",
                },
    
                {
                    accessorKey: 'SellPrice',
                    header: 'SellPrice',
                    size: 30,
                    Cell:({cell})=>cell.getValue()||0
                },
    
                {
                    accessorKey: 'InvoiceQuantity',
                    header: 'Invoice Quantity',
                    size: 30,
                    Cell:({cell})=>cell.getValue()||0
                },
    
                {
                    accessorKey: 'InvoiceAmount',
                    header: 'InvoiceAmount',
                    size: 30,
                
                    Cell: ({ cell }) => Number(cell.getValue() || 0).toFixed(2),
                },
    
    
                {
                    accessorKey: 'PurchaseOtherQuantity',
                    header: 'PurchaseOtherQuantity',
                    size: 30,
                    Cell:({cell})=>cell.getValue()||0
                },
    
    
                {
                    accessorKey: 'PurchaseOtherAmount',
                    header: 'PurchaseOtherAmount',
                    size: 30,
                    // Cell:({cell})=>cell.getValue()||0
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
    const grandTotalOfInvoice = useMemo(() => {
        return salesData?.reduce((acc, row) => acc + (Number(row.InvoiceAmount) || 0), 0);
    }, [salesData]);

    const grandTotalOfPurchaseOther = useMemo(() => {
        return salesData?.reduce((acc, row) => acc + (Number(row.PurchaseOtherAmount) || 0), 0);
    }, [salesData]);


    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>ProductWise Sales Report</b></Typography>
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
                            Get ProductWise Sales
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
                                         ProductWise   Sales Report for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
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
                                                                    <TableCell><b>Product Name</b></TableCell>
                                                                    <TableCell><b>UOM</b></TableCell>
                                                                    <TableCell><strong>SellPrice</strong></TableCell>
                                                                    <TableCell><b>InvoiceQuantity</b></TableCell>
                                                                    <TableCell><b>InvoiceAmount</b></TableCell>
                                                                    <TableCell> <b>PurchaseOtherQuantity</b></TableCell>
                                                                    <TableCell><b>PurchaseOtherAmount</b></TableCell>
                                                                    
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {salesData.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{item.ProductName}</TableCell>
                                                                        <TableCell>{item.UOM}</TableCell>
                                                                        <TableCell>{item.SellPrice || 0}</TableCell>

                                                                        <TableCell>{item.InvoiceQuantity|| 0}</TableCell>
                                                                        <TableCell>{item.InvoiceAmount || 0}</TableCell>
                                                                        <TableCell>{item.PurchaseOtherQuantity || 0}</TableCell>
                                                                        <TableCell>{item.PurchaseOtherAmount || 0}</TableCell>
                                                                        
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
                                         <Button onClick={generatePDF} color="primary" ><PrintIcon sx={{fontSize:35}}/></Button>
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
                                            <Box display="flex" alignItems="center" fontWeight="bold" gap={2}>
                                                <Box display="flex">
                                                    <Typography variant="h6" sx={{ mr: 2 }}>
                                                        <b>Grand Total Of Invoice:</b>
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        <b> {grandTotalOfInvoice.toLocaleString("en-IN")} </b>
                                                    </Typography>
                                                </Box>


                                                 <Box display="flex">
                                                    <Typography variant="h6" sx={{ mr: 2 }}>
                                                        <b>Grand Total Of PurchaseOther:</b>
                                                    </Typography>
                                                    <Typography variant="h6" color="primary">
                                                        <b> {grandTotalOfPurchaseOther.toLocaleString("en-IN")} </b>
                                                    </Typography>
                                                </Box>

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

export default ProductwiseSales;