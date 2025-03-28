import React, { useMemo, useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  Table,
  Autocomplete,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "react-phone-input-2/lib/style.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import qs from "qs";
import moment from "moment";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale'

const SalesEntry = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState([]);
  const [invdetailId, setInvdetailId] = useState("");
  const [rows, setRows] = useState([]);



  useEffect(() => {
    fetchInvoiceHeader();
    fetchInvdetails();
  }, []);

  //get of Invoice header
  const fetchInvoiceHeader = async () => {
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=invoiceheader"
      );
      setInvoiceheaders(response.data);
      console.log('ivoice header', response.data)
    } catch (error) { }
  };


  //get of Invoice details
  const fetchInvdetails = async () => {
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=invoicedetail"
      );
      console.log('detail', response.data)
      setInvoicedetails(response.data);
    } catch (error) { }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMenuOpen(false);
  };

  const handleNewClick = () => {
    setIsDrawerOpen(true);
    resetForm();
    setIsEditing(false);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    resetForm();
  };

  const [currentRow, setCurrentRow] = useState(null);

  const handleDelete = () => {
    if (!currentRow) {
      console.error("No row selected for deletion.");
      return;
    }
    const itemId = currentRow.original.Id; // Get the ID directly
    console.log("Deleting item with ID:", itemId);

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=invoiceheader&Id=${itemId}`,
      requestOptions
    )
      .then((response) => {
        // Check if the response is JSON
        return response.json().then((text) => {
          try {
            return JSON.parse(text);
          } catch (error) {
            throw new Error(`Invalid JSON response: ${text}`);
          }
        });
      })
      .then((result) => console.log("Delete response:", result))
      .catch((error) => console.error("Error:", error));
  };





  const [editId, setEditId] = useState("");
  //update form
  const handleEdit = () => {
    if (!currentRow) {
      console.error("No row selected for editing.");
      // toast.error("No row selected!");
      return;
    }

    console.log("Editing item with ID:", currentRow.original?.Id);

    // Ensure currentRow.index exists
    if (typeof currentRow.index !== "number") {
      console.error("Invalid row index:", currentRow.index);
      toast.error("Invalid row index.");
      return;
    }

    const invheader = invoiceheaders[currentRow.index];

    if (!invheader) {
      console.error("No invoice header found for the selected row.");
      toast.error("Invoice header not found.");
      return;
    }

    const invdetail = invoicedetails.filter(
      (detail) => detail.InvoiceId === invheader.Id
    );

    console.log("header", invheader);
    console.log("detail", invdetail);

    // Convert date strings to DD-MM-YYYY format
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        toast.error(`Invalid date format: ${dateStr}`);
        return "";
      }
    };



    // Map the details to rows
    const mappedRows = invdetail.map((detail) => ({
      Id: detail.Id,
      InvoiceId: detail.InvoiceId,
      ProductId: detail.ProductId,
      ProductName: productOptions.find((data) => data.value === detail.ProductId)?.label || "",
      Quantity: parseFloat(detail.Quantity) || '0',
      Rate: parseFloat(detail.Rate) || '0',
      Amount: parseFloat(detail.Amount) || '0',
      CGSTPercentage: parseFloat(detail.CGSTPercentage) || '0',
      CGSTAmount: parseFloat(detail.CGSTAmount) || '0',
      SGSTPercentage: parseFloat(detail.SGSTPercentage) || '0',
      SGSTAmount: parseFloat(detail.SGSTAmount) || '0',
      IGSTPercentage: parseFloat(detail.IGSTPercentage) || '0',
      IGSTAmount: parseFloat(detail.IGSTAmount) || '0',
    }));
    const invoiceDate = convertDateForInput(invheader.InvoiceDate?.date);
    const orderdate = convertDateForInput(invheader.OrderDate?.date);
    // Set form fields
    setInvoiceNo(invheader.InvoiceNo);
    setInvoiceDate(invoiceDate);
    setSelectedAccount(invheader.AccountId);
    setPhone(invheader.ContactNo);
    setOrderNo(invheader.OrderNo);
    setOrderDate(orderdate);
    //setSelectedProductId(invheader.ProductId);
    setQuantity(0);
    setRate(0);
    SetAmount(0);
    setCGST(0);
    setCGSTAmount(0);
    setSGST(0);
    setSGSTAmount(0);
    setIGST(0);
    setIGSTAmount(0);

   
    const selectedItem = accountOptions.find(option => option.Id.toString() === invheader.AccountId.toString());
    console.log("AccountId:", invheader.AccountId);
    console.log("selectedItem",selectedItem)
     setacctGSTNo(selectedItem ? selectedItem.GSTNo : "")
     console.log("gstno",selectedItem.GSTNo)
    // console.log("GSTNO",invheader);
    console.log("accountOptions",accountOptions)

    setPaymentMode(invheader.PaymentMode);
    setTransport(invheader.Transport);
    // Set the rows for the table with all the details
    setRows(mappedRows);
    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    handleMenuClose();
    setIsEditing(true);
    setEditId(currentRow.original?.Id);
    // Find the specific invoice detail
    const specificDetail = invdetail.find(
      (detail) => detail.Id === currentRow.original?.Id
    );
    if (specificDetail) {
      setInvdetailId(specificDetail.Id);
      console.log("specificDetail.Id", specificDetail.Id);
    }
    fetchInvoiceHeader();
  };

  //table
  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "InvoiceNo",
        header: "Invoice No",
        size: 50,
      },
      {
        accessorKey: "InvoiceDate.date",
        header: "Invoice Date",
        size: 50,
        Cell: ({ cell }) => (
          <span>{moment(cell.getValue()).format("DD-MM-YYYY")}</span>
        ),
      },
      // {
      //   accessorKey: "AccountId",
      //   header: "Account Id",
      //   size: 50,
      // },
      {
        accessorKey: "OrderNo",
        header: "Order No",
        size: 50,
      },
      {
        accessorKey: "OrderDate.date",
        header: "Order Date",
        size: 50,
        Cell: ({ cell }) => (
          <span>{moment(cell.getValue()).format("DD-MM-YYYY")}</span>
        ),
      },
      {
        accessorKey: "ContactNo",
        header: "Contact No",
        size: 50,
      },
      {
        accessorKey: "Transport",
        header: "Transport",
        size: 50,
      },
      {
        accessorKey: "CGSTAmount",
        header: "CGST Amount",
        size: 50,
      },
      {
        accessorKey: "SGSTAmount",
        header: "SGST Amount",
        size: 50,
      },
      {
        accessorKey: "IGSTAmount",
        header: "IGST Amount",
        size: 50,
      },
      {
        accessorKey: "Total",
        header: "Total",
        size: 50,
      },
      {
        accessorKey: "PaymentMode",
        header: "Payment Mode",
        size: 50,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <IconButton onClick={(event) => handleMenuOpen(event, row)}>
              <MoreVertIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    [invoiceheaders]
  );

  const table = useMaterialReactTable({
    columns,
    data: invoiceheaders,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });

  // Integration
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(null);

  const [phone, setPhone] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [orderDate, setOrderDate] = useState(null);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [amount, SetAmount] = useState("");
  const [cgst, setCGST] = useState(0);
  const [cgstAmount, setCGSTAmount] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [sgstAmount, setSGSTAmount] = useState(0);
  const [igst, setIGST] = useState(0);
  const [igstAmount, setIGSTAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState(null);
  const [transport, setTransport] = useState("");
  const [productName, setProductName] = useState("");

  //fetch customer from  account table
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  const [acctGSTNo, setacctGSTNo] = useState("");

  const fetchAccounts = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      // "https://arohanagroapi.microtechsolutions.co.in/php/getaccountinfo.php",
      "https://arohanagroapi.microtechsolutions.co.in/php/gettypecode.php?TypeCode=C",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("account info:", result);

        setAccountOptions(result);

      })
      .catch((error) => console.error("Error fetching accounts:", error));
  };

  useEffect(() => {
    fetchAccounts();
    fetchProduct();
    fetchInvoiceHeader();
  }, []);

  //fetch customer from  account table
  const [productOptions, setProductOptions] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);


  const fetchProduct = async () => {
    try {
      const response = await fetch(
        "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productmaster"
      );

      const data = await response.json();
      console.log("API Response:", data);
      productvalidation(data)

    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
    setLoadingProduct(false);
  };

  const [selectedProductID, setSelectedProductId] = useState('');
  const [selectedProductName, setSelectedProductName] = useState(null);




  const productvalidation = (data) => {
    const options = data.map((account) => ({
      value: account?.Id,
      label: account?.ProductName,
      cgst: account?.CGSTPercentage,
      sgst: account?.SGSTPercentage,
      igst: account?.IGSTPercentage,
      purchaseRate: account?.SellPrice,
    }));
    setProductOptions(options);
  }

  const resetForm = () => {
    setInvoiceNo("");
    setInvoiceDate("");
    setPhone("");
    setSelectedAccount("");
    setOrderDate("");
    setOrderNo("");
    setProduct("");
    setQuantity("");
    setRate("");
    SetAmount("");
    setCGST("");
    setCGSTAmount("");
    setSGST("");
    setSGSTAmount("");
    setIGST("");
    setIGSTAmount("");
    setPaymentMode("");
    setTransport("");

    setRows([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedInvoicedate = moment(invoiceDate).format("YYYY-MM-DD");
    const formattedorderdate = moment(orderDate).format("YYYY-MM-DD");
    const invoiceheaderdata = {
      Id: isEditing ? editId : "",
      InvoiceNo: invoiceNo,
      InvoiceDate: formattedInvoicedate,
      AccountId: selectedAccount,
      OrderNo: orderNo,
      OrderDate: formattedorderdate,
      ContactNo: phone,
      Transport: parseFloat(transport),
      CGSTAmount: cgstTotal,
      SGSTAmount: sgstTotal,
      IGSTAmount: igstTotal,
      Total: total,
      PaymentMode: paymentMode,
      SubTotal: subTotalcal,
    };
    console.log("invoiceheaderdata", invoiceheaderdata);
    try {
      const invoiceurl = isEditing
        ? "https://arohanagroapi.microtechsolutions.co.in/php/updateinvoiceheader.php"
        : "https://arohanagroapi.microtechsolutions.co.in/php/postinvoiceheader.php";

      const response = await axios.post(
        invoiceurl,
        qs.stringify(invoiceheaderdata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const invoiceId = isEditing ? editId : parseInt(response.data.Id, 10);
      console.log("invioce id ", invoiceId);
      console.log("rows", rows);

      for (const row of rows) {
        console.log("this row   ", row);
        const rowData = {
          Id: parseInt(row.Id, 10),
          InvoiceId: parseInt(invoiceId, 10),
          SerialNo: rows.indexOf(row) + 1,
          ProductId: parseInt(row.ProductId, 10),
          Quantity: parseFloat(row.Quantity),
          Rate: parseFloat(row.Rate),
          Amount: parseInt(row.Amount),
          CGSTPercentage: parseFloat(row.CGSTPercentage),
          CGSTAmount: parseFloat(row.CGSTAmount),
          SGSTPercentage: parseFloat(row.SGSTPercentage),
          SGSTAmount: parseFloat(row.SGSTAmount),
          IGSTPercentage: parseFloat(row.IGSTPercentage),
          IGSTAmount: parseFloat(row.IGSTAmount),
        };
        console.log({
          Quantity: typeof row.Quantity,
          Rate: typeof row.Rate
        });

        console.log("this row has rowData ", rowData);

        const invoicdedetailurl =
          row.Id
            ? "https://arohanagroapi.microtechsolutions.co.in/php/updateinvoicedetail.php"
            : "https://arohanagroapi.microtechsolutions.co.in/php/postinvoicedetail.php";

        console.log(" invoicdedetailurl is used ", invoicdedetailurl);
        try {
          const response = await axios.post(
            invoicdedetailurl,
            qs.stringify(rowData),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          console.log("Response:", response);
        } catch (error) {
          console.error("Error:", error);
        }

        if (isEditing && row.Id) {
          handleSaveOrAddRow();
        }
      }

      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Sales Entry updated successfully!"
          : "Sales Entry Created successfully!"
      );
      resetForm();

      console.log("Invoice Header Data:", invoiceheaderdata);
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    calculateAmount(qty, rate);
  };

  const handleRateChange = (e) => {
    const rt = e.target.value;
    setRate(rt);
    // console.log("rateee", rate);
    calculateAmount(quantity, rt);
  };

  const calculateAmount = (qty, rt) => {
    const qtyNum = parseFloat(qty) || 0;
    const rateNum = parseFloat(rt) || 0;
    const amt = qtyNum * rateNum;
    SetAmount(amt);
    calculateCgstAmount(cgst, amt);
    calculateSgstAmount(sgst, amt);
    calculateIgstAmount(igst, amt);
  };



  const calculateSgstAmount = (sgstValue, amt) => {
    let sgstNum = parseFloat(sgstValue) || 0;
    let sgstAmt = (sgstNum * amt) / 100;
    setSGSTAmount(sgstAmt);
  };

  

  const calculateCgstAmount = (cgstValue, amt) => {
    let cgstNum = parseFloat(cgstValue) || 0;
    let cgstAmt = (cgstNum * amt) / 100;
    setCGSTAmount(cgstAmt);
  };



  const calculateIgstAmount = (igstValue, amt) => {
    let igstNum = parseFloat(igstValue) || 0;
    let igstAmt = (igstNum * amt) / 100;
    setIGSTAmount(igstAmt);
  };

  const handleAddRow = () => {
    console.log("Selected Product ID:", selectedProductID);
    console.log("Selected Product Name:", selectedProductName);

    let newRow = {
      // id: rows.length + 1,
      InvoiceId: null,
      ProductId: selectedProductID,
      ProductName: productName,
      Quantity: quantity,
      Rate: rate,
      Amount: amount,
      CGSTPercentage: cgst,
      CGSTAmount: cgstAmount,
      SGSTPercentage: sgst,
      SGSTAmount: sgstAmount,
      IGSTPercentage: igst,
      IGSTAmount: igstAmount,
    };
    console.log("newRow", newRow);
    // Update rows state and ensure the new row is added to the table
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const [subTotalcal, setSubTotalCal] = useState()
  const [cgstTotal, setCgstTotal] = useState()
  const [igstTotal, setIgstTotal] = useState()
  const [sgstTotal, setSgstTotal] = useState()
  const [total, setTotal] = useState()
  const calculations = () => {
    const subtotal = rows.reduce(
      (acc, row) => acc + (parseFloat(row.Amount) || 0),
      0,
    );
    const subTotalCalculations = subtotal.toFixed(2)
    setSubTotalCal(subTotalCalculations)

    const totalCGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.CGSTAmount) || 0),
      0
    );
    const cgstTotals = totalCGST.toFixed(2)
    setCgstTotal(cgstTotals)

    const totalSGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.SGSTAmount) || 0),
      0
    );
    const sgstTotals = totalSGST.toFixed(2)
    setSgstTotal(sgstTotals)



    const totalIGST = rows.reduce(
      (acc, row) => acc + (parseFloat(row.IGSTAmount) || 0),
      0
    );
    const igstTotals = totalIGST.toFixed(2)
    setIgstTotal(igstTotals)

    const grandTotal =
      subtotal + totalCGST + totalSGST + totalIGST + (parseFloat(transport) || 0);
    let totals = grandTotal.toFixed(2)
    setTotal(totals)
  }

  useEffect(() => {
    calculations()
  }, [rows, transport]);

  //
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenutableOpen = (event, index) => {
    setAnchorEl1(event.currentTarget);
    setSelectedRow(index);
  };

  const handletableMenuClose = () => {
    setAnchorEl1(null);
    setSelectedRow(null);
  };

  const [editingRow, setEditingRow] = useState(null);

  const handleEditRow = (index) => {
    const row = rows[index];
    setEditingRow(index);
    setSelectedProductId(row.ProductId);
    console.log('row.ProductId', row.ProductId)
    setQuantity(row.Quantity || "");
    setRate(row.Rate || "");
    SetAmount(row.Amount || "");
    setCGST(row.CGSTPercentage || "0");
    setCGSTAmount(row.CGSTAmount || "0");
    setSGST(row.SGSTPercentage || "0");
    setSGSTAmount(row.SGSTAmount || "0");
    setIGST(row.IGSTPercentage || "0");
    setIGSTAmount(row.IGSTAmount || "0");
   
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleSaveOrAddRow = () => {
    if (editingRow !== null) {
      // Update the existing row
      const updatedRows = [...rows];
      updatedRows[editingRow] = {
        ...updatedRows[editingRow],
        ProductId: selectedProductID,
        ProductName: productName,
        Quantity: quantity,
        Rate: rate,
        Amount: amount,
        CGSTPercentage: cgst,
        CGSTAmount: cgstAmount,
        SGSTPercentage: sgst,
        SGSTAmount: sgstAmount,
        IGSTPercentage: igst,
        IGSTAmount: igstAmount,
      };
      setRows(updatedRows);
      setEditingRow(null);
    } else {
      // Add a new row
      handleAddRow();
    }

    if (editingRow === null) {
      resetFields(); // Clear fields only when adding a new row
    }
  };

  const resetFields = () => {
    // setSelectedProductName("");
    setSelectedProductId("");
    setQuantity("");
    setRate("");
    SetAmount("");
    setCGST("");
    setCGSTAmount("");
    setSGST("");
    setSGSTAmount("");
    setIGST("");
    setIGSTAmount("");
  };


  //get company master
  const [gstNo, setGstNO] = useState("");

  const fetchGST = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=companymaster",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        let results = result[0];
        // console.log(results.GSTNo)
        setGstNO(results.GSTNo);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchGST();
  }, []);





  return (
    <Box>

      <Box textAlign={"center"}>
        <Typography color='var(--complementary-color)' variant="h4">
          <b>Sales Entry</b>
        </Typography>
      </Box>
      <Box
        sx={{
          //  background: 'rgb(236, 253, 230)', 
          p: 5, height: 'auto'
        }}
      >


        <Box sx={{ display: "flex", gap: 3 }}>
          <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleNewClick}>
            Create Sales Entry
          </Button>
        </Box>

        <MaterialReactTable table={table}
          enableColumnResizing
          muiTableHeadCellProps={{
            sx: {

              color: 'var(--primary-color)',

            },
          }}

        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>

          {/* <MenuItem onClick={handlePrint}>Print</MenuItem> */}
        </Menu>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "65%",
              zIndex: 1000,
            },
          }}
        >
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: 'rgb(236, 253, 230)'
            }}
          >
            <Typography m={2} fontWeight="bold" variant="h6">
              {isEditing ? "Update Sales Entry" : "Create Sales Entry"}
            </Typography>

            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, m: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">Invoice No</Typography>
                <TextField
                  value={invoiceNo}
                  size="small"
                  margin="none"
                  placeholder="Invoice No"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Invoice Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={invoiceDate ? new Date(invoiceDate) : null}

                    format="dd-MM-yyyy"
                    onChange={(newValue) => setInvoiceDate(newValue)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    renderInput={(params) => <TextField />}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">Customer </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={selectedAccount || ""}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    setSelectedAccount(selectedValue);

                    const selectedItem = accountOptions.find(option => option.Id.toString() === selectedValue);
                    setacctGSTNo(selectedItem ? selectedItem.GSTNo : "")

                  }} >
                  {accountOptions.map((option) => (
                    <MenuItem key={option.Id} value={option.Id.toString()}>
                      {option.AccountName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* using Autocomplete */}
              {/* <Box flex={1}>
                <Typography variant="body2">Customer</Typography>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={accountOptions}
                  getOptionLabel={(option) => option.AccountName || ""}
                  value={accountOptions.find(option => option.Id.toString() === selectedAccount) || null}
                  onChange={(event, newValue) => {
                    setSelectedAccount(newValue ? newValue.Id.toString() : "");
                    setacctGSTNo(newValue ? newValue.GSTNo : "");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                />
              </Box> */}

              <Box flex={1}>
                <Typography variant="body2">Contact Number</Typography>
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputProps={{ name: "phone", required: true }}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    fontSize: "16px",
                    borderRadius: "5px",
                  }}
                  buttonStyle={{ borderRadius: "5px" }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">Order No</Typography>
                <TextField
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Order No"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Order Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={orderDate ? new Date(orderDate) : null} // Convert to Date object
                    format="dd-MM-yyyy"
                    onChange={(newValue) => setOrderDate(newValue)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    renderInput={(params) => <TextField />}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>

              <Box flex={1}>
                <Typography variant="body2">Product </Typography>
                {/* <Select
                  fullWidth
                  size="small"
                  value={selectedProductID} // Ensure only ID is stored
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    setSelectedProductId(selectedValue);

                    const selectedItem = productOptions.find((option) => option.value === selectedValue);
                    setProductName(selectedItem.label)
                    setRate(selectedItem.purchaseRate)

                    if (selectedItem) {
                      setSelectedProductName(selectedItem.label); // Store the name separately
                      setCGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? selectedItem.cgst : "0");
                      setSGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? selectedItem.sgst : "0");
                      setIGST(gstNo?.substring(0, 2) !== acctGSTNo?.substring(0, 2) ? selectedItem.igst : "0");
                    } else {
                      setSelectedProductName(""); // Reset if no product is found
                      setCGST("0");
                      setSGST("0");
                      setIGST("0");
                    }
                  }}
                >
                 
                  {productOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select> */}

                <Autocomplete
                  fullWidth
                  size="small"
                  options={productOptions}
                  getOptionLabel={(option) => option.label}
                  value={productOptions.find((option) => option.value === selectedProductID) || null}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSelectedProductId(newValue.value);
                      setProductName(newValue.label);
                      setRate(newValue.purchaseRate);
                      setSelectedProductName(newValue.label);
                      setCGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? newValue.cgst : "0");
                      setSGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? newValue.sgst : "0");
                      setIGST(gstNo?.substring(0, 2) !== acctGSTNo?.substring(0, 2) ? newValue.igst : "0");

                      // Recalculate the amount with the existing quantity
                      calculateAmount(quantity, newValue.purchaseRate);
                    } else {
                      setSelectedProductId("");
                      setProductName("");
                      setRate("");
                      setSelectedProductName("");
                      setCGST("0");
                      setSGST("0");
                      setIGST("0");
                    }
                  }}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                />


              </Box>

              <Box flex={1}>
                <Typography variant="body2">Quantity</Typography>
                <TextField
                  value={quantity}
                  onChange={handleQuantityChange}
                  size="small"
                  margin="none"
                  placeholder="Quantity"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">Rate</Typography>
                <TextField
                  value={rate}
                  onChange={handleRateChange}
                  size="small"
                  margin="none"
                  placeholder="Rate"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">Amount</Typography>
                <TextField
                  value={amount}
                  size="small"
                  margin="none"
                  placeholder="Amount"
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">CGST%</Typography>
                <TextField
                  value={cgst}
                  onChange={(e) => setCGST(e.target.value)}
                  // onChange={handleCgstChange}
                  size="small"
                  margin="none"
                  placeholder="CGST"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">CGST Amount</Typography>
                <TextField
                  value={cgstAmount}
                  size="small"
                  margin="none"
                  placeholder="CGST Amount"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">SGST%</Typography>
                <TextField
                  value={sgst}
                  // onChange={handleSgstChange}
                  onChange={(e) => setSGST(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="SGST"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">SGST Amount</Typography>
                <TextField
                  value={sgstAmount}
                  size="small"
                  margin="none"
                  placeholder="SGST Amount"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">IGST %</Typography>
                <TextField
                  value={igst}
                  // onChange={handleIgstChange}
                  onChange={(e) => setIGST(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="IGST%"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">IGST Amount</Typography>
                <TextField
                  value={igstAmount}
                  size="small"
                  margin="none"
                  placeholder=" IGST Amount"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>

          <Box m={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveOrAddRow}


              sx={{ background: 'var(--complementary-color)', mb: 2, gap: 1 }}
            >
              <AddCircleOutlineIcon />
              {editingRow !== null ? "Update Row" : "Add to Table"}
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr No</TableCell>
                    {/* <TableCell>InvoiceID</TableCell> */}
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>CGST %</TableCell>
                    <TableCell>CGST Amount</TableCell>
                    <TableCell>SGST %</TableCell>
                    <TableCell>SGST Amount</TableCell>
                    <TableCell>IGST %</TableCell>
                    <TableCell>IGST Amount</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      {/* <TableCell><TextField value={row.InvoiceId || ""} size="small" fullWidth /></TableCell> */}
                      <TableCell>


                        {row.ProductName}

                      </TableCell>
                      <TableCell>

                        {row.Quantity || ""}


                      </TableCell>
                      <TableCell>

                        {row.Rate || ""}

                      </TableCell>
                      <TableCell>

                        {row.Amount || ""}

                      </TableCell>
                      <TableCell>

                        {row.CGSTPercentage || ""}

                      </TableCell>
                      <TableCell>

                        {row.CGSTAmount || ""}

                      </TableCell>
                      <TableCell>

                        {row.SGSTPercentage || ""}

                      </TableCell>
                      <TableCell>

                        {row.SGSTAmount || ""}

                      </TableCell>
                      <TableCell>

                        {row.IGSTPercentage || ""}

                      </TableCell>
                      <TableCell>

                        {row.IGSTAmount || ""}

                      </TableCell>

                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenutableOpen(event, index)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl1}
                          open={Boolean(anchorEl1) && selectedRow === index}
                          onClose={handletableMenuClose}
                        >
                          <MenuItem onClick={() => handleEditRow(index)}>
                            Edit
                          </MenuItem>

                          <MenuItem onClick={() => handleDeleteRow(index)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ display: "flex", gap: 10, m: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2">Payment Mode</Typography>
                <TextField
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  size="small"
                  placeholder="Payment Mode"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="body2">Transport</Typography>
                <TextField
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  size="small"
                  placeholder="Transport"
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 6, mt: 2 }}>
              <Box>
                <Typography variant="h6">SubTotal</Typography>
                <Box sx={{ fontSize: '20px' }}><b>{subTotalcal}</b></Box>



              </Box>
              <Box>
                <Typography variant="h6">CGST</Typography>
                <Box sx={{ fontSize: '20px' }}><b> {cgstTotal}</b></Box>


              </Box>
              <Box>
                <Typography variant="h6">SGST</Typography>
                <Box sx={{ fontSize: '20px' }}><b>{sgstTotal}</b></Box>


              </Box>
              <Box>
                <Typography variant="h6">IGST</Typography>
                <Box sx={{ fontSize: '20px' }}><b>{igstTotal}</b></Box>


              </Box>

              <Box>
                <Typography variant="h6">Total</Typography>
                <Box sx={{ fontSize: '20px', mr: 4, }} ><b>{total} Rs</b></Box>


              </Box>
            </Box>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            mb={5}
          >
            <Box>
              <Button sx={{
                background: 'var(--primary-color)',
              }} onClick={handleSubmit} variant="contained">
                {isEditing ? "update" : "save"}{" "}
              </Button>
            </Box>

            <Box>
              <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant="outlined">
                <b>Cancel</b>{" "}
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default SalesEntry;



















