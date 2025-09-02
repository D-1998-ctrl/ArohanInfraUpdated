 
import { useState ,useEffect} from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {FormControl, Select, MenuItem, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Typography, Button } from '@mui/material';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import logonew from '../imgs/logo_white.png'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const AccountPayable = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [salesData, setSalesData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [accountOption, setAccountOption] = useState('');
      const [selectedAccountOption, setSelectedAccountOption] = useState('');
    //CUSTOMER ACCOUNTS

 const fetchAccounts  = async () => {
    try {
      const response = await fetch(
        "https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=TypeCode&Colvalue=s"
      );
      const result = await response.json();

       console.log("grp info:", result);

      const options = result.map((account) => ({
        value: account.Id,
        label: account.AccountName,
      }));

      setAccountOption(options);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

    useEffect(() => {
        fetchAccounts();
    }, []);


const getSalesReport = () => {
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-CA'); // Local YYYY-MM-DD
    };

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    const url = `https://arohanagroapi.microtechsolutions.net.in/php/accountpayable.php?fromdate=${formattedFromDate}&todate=${formattedToDate}&AccountId=${selectedAccountOption}`;
    
    console.log(" URL:", url); 

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then(data => {
            //console.log('data', data);
            setSalesData(data);
            setShowTable(true);
            setPreviewOpen(true);
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
        doc.text("Account Payable ", pageWidth / 2, y, { align: "center" });


        y += 6;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;


        // Main table with all details
        const tableHeaders = [
            "Date",
            "DocNo",
            "Bill No",
            "Amount",
            "Source",
        ];

        const tableData = salesData.map((item) => {
            

            return [
                item.Date,
                item.DocNo,
                item["Bill No"],
                item.Amount,
              
                item.Source ,
               
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
        doc.save("Account_payable.pdf");
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
    "Date",
    "DocNo",
    "BillNo",
    "Amount",
    "Source",
    
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
      item.Date,
      item.DocNo,
      item.BillNo || 0,
      item.Amount || 0,
      item.Source || 0,
      
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
  saveAs(blob, `AccountPayable_Report.xlsx`);
};


    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Account Payable</b></Typography>
            </Box>

            <Box sx={{ p: 5, height: 'auto' }}>

                <Box >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', gap:10,  }}>

                            <Box >
                                <Typography>From Date</Typography>
                                <DatePicker
                                    value={fromDate ? new Date(fromDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setFromDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small",  },
                                    }}
                                />
                            </Box>



                            <Box >
                                <Typography>To Date</Typography>
                                <DatePicker
                                    value={toDate ? new Date(toDate) : null}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => setToDate(newValue)}
                                    slotProps={{
                                        textField: { size: "small",  },
                                    }}
                                />
                            </Box>


                            <Box sx={{ width: '300px' }}>
                                <Typography>Customers</Typography>
                                <FormControl fullWidth size="small" variant="standard"
                                    sx={{
                                        '& .MuiInput-underline:after': {
                                            borderBottomWidth: 1.5,
                                            borderBottomColor: '#44ad74',
                                          
                                        }, mt: 1
                                    }}

                                    focused>
                                    <Select
                                   
                                        value={selectedAccountOption}
                                        onChange={(event) => setSelectedAccountOption(event.target.value)}
                                    >
                                        
                                        {accountOption.length > 0 ? (
                                            accountOption.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No options available</MenuItem>
                                        )}
                                        
                                    </Select>
                                </FormControl>
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
                            Get Data
                        </Button>
                    </Box>


                </Box>
                {showTable && salesData.length === 0 && (
                    <Typography textAlign="center" mt={5} color="error">
                        No data found for the selected details.
                    </Typography>
                )}

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
                                        <Typography  sx={{ fontWeight: 'bold', mt: 1 }}>
                                         Account Payable
                                        </Typography>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Box>
                                            {salesData.length > 0 ? (
                                                <Box>


                                                    {/* Table to display sales data */}
                                                    <TableContainer fullWidth component={Paper} sx={{ mt: 3 }}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><b>Date</b></TableCell>
                                                                    <TableCell><b>DocNo</b></TableCell>
                                                                    <TableCell><strong>Bill No</strong></TableCell>
                                                                    <TableCell><b>Amount</b></TableCell>
                                                                    <TableCell><b>Source</b></TableCell>
                                                                 
                                                                   
                                                                    
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {salesData.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{item.Date}</TableCell>
                                                                        <TableCell>{item.DocNo || "-"}</TableCell>
                                                                        <TableCell>{item["Bill No"]}</TableCell>
                                                                        <TableCell>{item.Amount|| 0}</TableCell>
                                                                       
                                                                        <TableCell>{item.Source || 0}</TableCell>
                                                                       
                                                                        
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>


                                                </Box>
                                            ) : (
                                                <Typography>No data to preview</Typography>
                                            )}
                                        </Box>
                                    </DialogContent>
                                    <DialogActions>
                                         <Button onClick={generatePDF} color="primary" ><PrintIcon sx={{fontSize:35}}/></Button>
                                          <Button variant='contained' endIcon={<FileDownloadIcon />} onClick={() => exportToExcel(salesData)}>Excel Data</Button>
                                        <Button variant='contained' onClick={() => setPreviewOpen(false)} color="primary">Close</Button>
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

export default AccountPayable;