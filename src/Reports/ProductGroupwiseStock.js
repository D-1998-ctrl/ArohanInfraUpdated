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


const ProductGroupwiseStock = () => {
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
    const url = `https://arohanagroapi.microtechsolutions.net.in/php/getGroupSummary.php?fromdate=${formattedFromDate}&todate=${formattedToDate}`;
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
    doc.text("Product Groupwise Stock Report Preview", pageWidth / 2, y, { align: "center" });


    y += 6;
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 6;


    // Main table with all details
    const tableHeaders = [
      "ProductGroupId", "Group Name", "Total Invoice Quantity", "Total Invoice Amount", "Total PurchaseOther Quantity", "Total PurchaseOther Amount", "Total Unique Products",
    ];

    const tableData = salesData.map((item) => {


      return [
        item.ProductGroupId,
        item.GroupName,
        item.TotalInvoiceQuantity || "N/A",
        item.TotalInvoiceAmount || "N/A",
        item.TotalPurchaseOtherQuantity || "N/A",
        item.TotalPurchaseOtherAmount ?? 0,
        item.TotalUniqueProducts ?? 0,

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
    doc.save("Product Groupwise Stock Report_Preview.pdf");
  };


  const exportToExcel = async (data) => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Product_Groupwise_StockReport");

    // Define header row
    const headers = [
      "Product GroupId",
      "GroupName",
      "Total Invoice Quantity",
      "Total Invoice Amount",
      "Total PurchaseOther Quantity",
      "Total PurchaseOther Amount",
      "Total Unique Products",

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
        item.ProductGroupId,
        item.GroupName,
        Number(item.TotalInvoiceQuantity) || "N/A",
        Number(item.TotalInvoiceAmount) || "N/A",
        Number(item.TotalPurchaseOtherQuantity) || "N/A",
        Number(item.TotalPurchaseOtherAmount) || 0,
        Number(item.TotalUniqueProducts) || 0,
      ]);
    });


    /// // Add Grand Total row
    const totalRowIndex = worksheet.lastRow.number + 2;
    const totalRow = worksheet.getRow(totalRowIndex);
    totalRow.getCell(3).value = "Grand Total";
    totalRow.getCell(3).font = { bold: true, size: 14 };
    totalRow.getCell(3).alignment = { horizontal: "right" };

    totalRow.getCell(4).value = { formula: `SUM(D2:D${worksheet.lastRow.number - 2})` };
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
    saveAs(blob, `Product_Groupwise_StockReport${new Date().toISOString().slice(0, 10)}.xlsx`);
  };


  const columns = useMemo(() => {
    return [

      {
        accessorKey: 'ProductGroupId',
        header: 'Product GroupId',
        size: 50,
      },



      {
        accessorKey: 'GroupName',
        header: 'Group Name',
        size: 50,
      },

      {
        accessorKey: 'TotalInvoiceQuantity',
        header: 'TotalInvoiceQuantity',
        size: 50,

      },


      {
        accessorKey: 'TotalInvoiceAmount',
        header: 'TotalInvoiceAmount',
        size: 50,
      },


      {
        accessorKey: 'TotalPurchaseOtherQuantity',
        header: 'TotalPurchaseOtherQuantity',
        size: 50,
      },

      {
        accessorKey: 'TotalPurchaseOtherAmount',
        header: 'TotalPurchaseOtherAmount',
        size: 50,
      },


      {
        accessorKey: 'TotalUniqueProducts',
        header: 'TotalUniqueProducts',
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
    return salesData?.reduce((acc, row) => acc + (Number(row.TotalInvoiceAmount) || 0), 0);
  }, [salesData]);

  const grandTotalofPurchaseOtherAmount = useMemo(() => {
    return salesData?.reduce((acc, row) => acc + (Number(row.TotalPurchaseOtherAmount) || 0), 0)
  }, [salesData]);


  return (
    <Box >
      <Box textAlign={'center'}>
        <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Product Groupwise Stock Report</b></Typography>
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
              Get Product Groupwise Stock Report
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
                      Product Groupwise Stock Report Preview for  {fromDate ? new Date(fromDate).toLocaleDateString('en-GB') : '-'}  to  {toDate ? new Date(toDate).toLocaleDateString('en-GB') : '-'}
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
                      <Box>
                        <Box display="flex" alignItems="center" fontWeight="bold">
                          <Typography variant="h6" sx={{ mr: 2 }}>
                            <b>Grand Total Of Invoice Amount:</b>
                          </Typography>
                          <Typography variant="h6" color="primary">
                            <b> {grandTotal.toLocaleString("en-IN")} </b>
                          </Typography>
                        </Box>


                        <Box display="flex" alignItems="center" fontWeight="bold">
                          <Typography variant="h6" sx={{ mr: 2 }}>
                            <b>Grand Total Of PurchaseOther Amount:</b>
                          </Typography>
                          <Typography variant="h6" color="primary">
                            <b> {grandTotalofPurchaseOtherAmount.toLocaleString("en-IN")} </b>
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
      </Box>
    </Box >
  );
};

export default ProductGroupwiseStock;
