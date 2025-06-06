
import  { useMemo, useState, useEffect } from "react";
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
  MenuItem,
  InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
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
 
} from "material-react-table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Cookies from 'js-cookie';



const SalesEntry = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState([]);
  const [rows, setRows] = useState([]);



  useEffect(() => {
    fetchInvdetails();
  }, []);

  //get of Invoice header
 

  // const fetchInvoiceHeader = async () => {
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow"
  //   };

  //   try {
  //     const response = await fetch(
  //       `https://arohanagroapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${pageNo}`,
  //       requestOptions
  //     );
  //     const result = await response.json();
  //     setInvoiceheaders(result.data);
  //     setTotalPages(result.total_pages);
  //     //console.log('invoice header', result.data);
  //   } catch (error) {
  //     console.error('Error fetching invoice headers:', error);
  //   }
  // };

  const fetchInvoiceHeader = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    const response = await fetch(
      `https://arohanagroapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=invoiceheader&PageNo=${pageNo}`,
      requestOptions
    );
    const result = await response.json();

    const invoiceData = result.data || [];

    // Fetch account details for each invoice
    const InvoicesList = await Promise.all(
      invoiceData.map(async (invoice) => {
        try {
          const acctResponse = await fetch(
            `https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${invoice.AccountId}`, // assuming AccountId is the linking field
            requestOptions
          );
          const acctResult = await acctResponse.json();
          const accountDetails = Array.isArray(acctResult) ? acctResult[0] : null;

          return {
            ...invoice,
            accountDetails // merged account info into invoice
          };
        } catch (error) {
          console.error(`Failed to fetch account for invoice ${invoice.Id}:`, error);
          return invoice; // fallback to original invoice
        }
      })
    );

    setInvoiceheaders(InvoicesList);
    setTotalPages(result.total_pages);

    console.log(' invoice header:', InvoicesList);
  } catch (error) {
    console.error('Error fetching invoice headers:', error);
  }
};


  //get of Invoice details
  const fetchInvdetails = async () => {
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=invoicedetail"
      );
      // console.log('detail', response.data)
      setInvoicedetails(response.data);
    } catch (error) { }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event, row) => {

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
    setOpen(false);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setShowDropdown(false)
    resetForm();
  };

  const [currentRow, setCurrentRow] = useState(null);
  //for delete Header
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleConfirmDelete = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    // const itemId = currentRow.original.Id;
    // console.log('itemId',currentRow.original.Id)

    fetch(`https://arohanagroapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=invoiceheader&Id=${editId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);

        handleDrawerClose();
        fetchInvoiceHeader();
        handleMenuClose()
        toast.success(
          "Sales Entry Deleted successfully!"
        );
      })
      .catch((error) => console.error(error));
  };


  const [editId, setEditId] = useState("");

  //update form
  const handleEdit = (row) => {
    if (!row) {
      console.error("No row selected for editing.");
      // toast.error("No row selected!");
      return;
    }
    // console.log("Editing item with ID:", row.original?.Id);
    // Ensure currentRow.index exists
    if (typeof row.index !== "number") {
      console.error("Invalid row index:", row.index);
      toast.error("Invalid row index.");
      return;
    }
    const invheader = invoiceheaders[row.index];
    if (!invheader) {
      console.error("No invoice header found for the selected row.");
      toast.error("Invoice header not found.");
      return;
    }
    const invdetail = invoicedetails.filter(
      (detail) => detail.InvoiceId === invheader.Id
    );
    // console.log("header", invheader);
    // console.log("detail", invdetail);


    //
    fetchAccounts(invheader.AccountId)
    fetchAccountName(invheader.AccountId)
    setCustomerName(invheader.AccountId)
    setSelectedAccount(invheader.AccountId)


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

    // setacctGSTNo(selectedItem ? selectedItem.GSTNo : "")
    // console.log("gstno", selectedItem.GSTNo)
    // console.log("GSTNO",invheader);
    // console.log("accountOptions", accountOptions)

    setPaymentMode(invheader.PaymentMode);
    setTransport(invheader.Transport);
    // Set the rows for the table with all the details
    setRows(mappedRows);
    // Set editing state
    // setEditingIndex(row.index);
    setIsDrawerOpen(true);
    handleMenuClose();
    setIsEditing(true);
    setEditId(row.original?.Id);
    handleMenuOpen(true)
    fetchInvoiceHeader();
  };

  //table
  const [pageNo, setPageNo] = useState(1)
  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 50,
        Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
      },
    
      {
        accessorKey: "InvoiceDate.date",
        header: "Invoice Date",
        size: 50,
        Cell: ({ cell }) => (
          <span>{moment(cell.getValue()).format("DD-MM-YYYY")}</span>
        ),
      },

       {
      header: "Account Name",
      size: 100,
      accessorFn: (row) => row.accountDetails?.AccountName || "N/A",
      Cell: ({ cell }) => <span>{cell.getValue()}</span>,
    },
      // {
      //   accessorKey: "AccountId",
      //   header: "Account Id",
      //   size: 50,
      // },
      
     
     
      {
        accessorKey: "Total",
        header: "Total",
        size: 50,
      },
    
     
    ],
    [pageNo]
  );

  useEffect(() => {
    fetchInvoiceHeader();
  }, [pageNo]);


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


  useEffect(() => {
    // fetchAccounts();
    fetchProduct();
    fetchInvoiceHeader();
  }, []);

  //fetch customer from  account table
  const [productOptions, setProductOptions] = useState([]);


  const fetchProduct = async () => {
    try {
      const response = await fetch(
        "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=productmaster"
      );

      const data = await response.json();
      // console.log("API Response:", data);
      productvalidation(data)

    } catch (error) {
      console.error("Error fetching accounts:", error);
    }

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
    setErrors("")
    setAccountOptions([])
    setRows([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedInvoicedate = moment(invoiceDate).format("YYYY-MM-DD");
    const formattedorderdate = moment(orderDate).format("YYYY-MM-DD");
    const invoiceheaderdata = {
      Id: isEditing ? editId : "",
      InvoiceNo: invoiceNo,
      InvoiceDate: formattedInvoicedate,
      AccountId: selectedAccount ? selectedAccount : customerName,
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
    // console.log("invoiceheaderdata", invoiceheaderdata);
    try {
      const invoiceurl = isEditing
        ? "https://arohanagroapi.microtechsolutions.net.in/php/updateinvoiceheader.php"
        : "https://arohanagroapi.microtechsolutions.net.in/php/postinvoiceheader.php";

      const response = await axios.post(
        invoiceurl,
        qs.stringify(invoiceheaderdata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const invoiceId = isEditing ? editId : parseInt(response.data.Id, 10);
      // console.log("invioce id ", invoiceId);
      // console.log("rows", rows);

      for (const row of rows) {
        // console.log("this row   ", row);
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

        // console.log("this row has rowData ", rowData);

        const invoicdedetailurl =
          row.Id
            ? "https://arohanagroapi.microtechsolutions.net.in/php/updateinvoicedetail.php"
            : "https://arohanagroapi.microtechsolutions.net.in/php/postinvoicedetail.php";

        // console.log(" invoicdedetailurl is used ", invoicdedetailurl);
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

          // console.log("Response:", response);
        } catch (error) {
          console.error("Error:", error);
        }


      }

      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Sales Entry Updated successfully!"
          : "Sales Entry Created successfully!"
      );
      resetForm();
      fetchInvoiceHeader();
      fetchInvdetails();

      // console.log("Invoice Header Data:", invoiceheaderdata);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      setIsDrawerOpen(false);
      toast.error(
        isEditing
          ? "Sales Entry Updated unsuccessfully!"
          : "Sales Entry Created unsuccessfully!"
      );

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
    // console.log("Selected Product ID:", selectedProductID);
    // console.log("Selected Product Name:", selectedProductName);

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
    // console.log("newRow", newRow);
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


    const transportValue = !isNaN(parseFloat(transport)) ? parseFloat(transport) : 0;
    const grandTotal =
      subtotal + totalCGST + totalSGST + totalIGST + 
      // (parseFloat(transport) || 0);
      // (!isNaN(parseFloat(transport)) ? parseFloat(transport) : 0); 
      transportValue
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

    //console.log('row.ProductId', row.ProductId)
    setProductName(row.ProductName);
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
    if (!selectedProductID) {
      alert("Please select an product before adding or saving the row.");
      return;
    }

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
    // if (editingRow === null) {
    //   resetFields(); 
    // }
    resetFields();
  };

  const resetFields = () => {
    setSelectedProductId("");  
    setProductName("");       
    setSelectedProductName("");
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

  const fetchCompanyMaster = async () => {
    try {
      const response = await axios.get(
        'https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=companymaster',
        { maxBodyLength: Infinity }
      );
      ////  console.log(response.data);
      setGstNO(response.data[0].GSTNo);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyMaster();
  }, []);

  //for serchApi
  const [showDropdown, setShowDropdown] = useState(false);
  const [text, setText] = useState("");


  const serchCustomers = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`https://arohanagroapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=C&Text=${text}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //setAccountOptions(result);
        setAccountOptions(Array.isArray(result) ? result : []);


      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    serchCustomers();
  }, [text]);

  // create new Customer
  const [accountName, setAccountName] = useState("");
  const [customerName, setCustomerName] = useState("");


  const Namevalidation = () => {
    let temp = accountName.split(" ")
    let surname = temp[1]
    if (surname && surname.length >= 1) {
      return true;
    } else {
      toast.error("Need to Insert First and last Name ");
      return false;
    }
  }

  const CreateCustomerMaster = () => {

    if (!Namevalidation()) {
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("AccountName", accountName);
    urlencoded.append("GroupId", "3");
    urlencoded.append("SubGroupId", "1");
    urlencoded.append("OpeningBalance", "100");
    urlencoded.append("DrORCr", "D");
    urlencoded.append("TypeCode", "C");
    urlencoded.append("IsSystem", "false");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("https://arohanagroapi.microtechsolutions.net.in/php/postaccount.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log("Customer Created:", result);

        if (result && result.Id) {
          //console.log(result.Id)
          toast.success('user created')
          // Now set the address and GSTNo for this customer
          const addressData = new URLSearchParams();

          addressData.append("AccountId", result.Id);

          addressData.append("GSTNo", "270000000000000");

          return fetch("https://arohanagroapi.microtechsolutions.net.in/php/postaddress.php", {
            method: "POST",
            headers: myHeaders,
            body: addressData,
            redirect: "follow",
          });
        } else {
          throw new Error("Customer ID not received from API.");
        }
      })
      .then((response) => response.json())
      .then((addressResult) => {
        //console.log("Address Added:", addressResult);
        // Clear the input field after successful creation
        setAccountName("");
      })
      .catch((error) => console.error("Error:", error));
  };


  //set GSTno
  const fetchAccounts = (customerId) => {

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Address&Colname=AccountId&Colvalue=${customerId}`, requestOptions)

      .then((response) => response.json())
      .then((result) => {
       // console.log(result)
        let temp = result[0]
        // console.log("gstno", temp.GSTNo)
        setacctGSTNo(temp.GSTNo)
      }

      )
      .catch((error) => console.error(error));
  };


  const fetchAccountName = (acctname) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`https://arohanagroapi.microtechsolutions.net.in/php/getbyid.php?Table=Account&Colname=Id&Colvalue=${acctname}`, requestOptions)

      .then((response) => response.json())
      .then((result) => {
        // console.log('accountname', result)

        setAccountOptions(Array.isArray(result) ? result : []);
      }

      )
      .catch((error) => console.error(error));
  };

  //

  const handleItemChange = (newValue) => {

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
  }
  ///Pagination
  const [totalPages, setTotalPages] = useState(1);
  //validation
  const [errors, setErrors] = useState({
    invoiceDate: '',
    selectedAccount: '',
    orderNo: '',
    orderDate: '',
    paymentMode: '',
    rows: ''
  });

  const validateForm = () => {
    const newErrors = {
      invoiceDate: '',
      selectedAccount: '',
      orderNo: '',
      orderDate: '',
      paymentMode: '',
      // rows: ''
    };

    let isValid = true;

    if (!invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
      isValid = false;
    } else {
      // Convert dates to Date objects for comparison
      const invoiceDateObj = new Date(invoiceDate);
      const fromDateObj = new Date(fromdate);
      const toDateObj = new Date(todate);

      // Check if invoice date is before from date
      if (invoiceDateObj < fromDateObj) {
        newErrors.invoiceDate = `Invoice date cannot be before ${new Date(fromdate).toLocaleDateString()}`;
        isValid = false;
      }
      // Check if invoice date is after to date
      else if (invoiceDateObj > toDateObj) {
        newErrors.invoiceDate = `Invoice date cannot be after ${new Date(todate).toLocaleDateString()}`;
        isValid = false;
      }
    };

    if (!selectedAccount) {
      newErrors.selectedAccount = 'Customer is required';
      isValid = false;
    }

    if (!orderNo) {
      newErrors.orderNo = 'Order number is required';
      isValid = false;
    }

    if (!orderDate) {
      newErrors.orderDate = 'Order date is required';
      isValid = false;
    }

    if (!paymentMode) {
      newErrors.paymentMode = 'Payment mode is required';
      isValid = false;
    }

    // if (rows.length === 0) {
    //   newErrors.rows = 'At least one product must be added';
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  //for yearId
  const [yearid, setYearId] = useState('');
  const [fromdate, setFromDate] = useState('');
  const [todate, setToDate] = useState('');

  useEffect(() => {
    const storedYearId = Cookies.get("YearId");
    const storedfromdate = Cookies.get("FromDate");
    const storedtodate = Cookies.get("ToDate");

    if (storedYearId) {
      setYearId(storedYearId);
      //console.log('storedYearId', storedYearId);
    } else {
      toast.error("Year is not set.");
    };
    if (storedfromdate) {
      setFromDate(storedfromdate);
      //console.log('storedfromdate', storedfromdate);
    } else {
      toast.error("FromDate is not set.");
    }

    if (storedtodate) {
      setToDate(storedtodate);
     // console.log('storedTodate', storedtodate);
    } else {
      toast.error("ToDate is not set.");
    }

  }, [yearid, fromdate, todate]);


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

        <MaterialReactTable
          columns={columns}
          data={invoiceheaders}
          enablePagination={false}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#E9ECEF',
              color: 'black',
              fontSize: '16px',
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => {
              // Set the currentRow before calling handleEdit
              setCurrentRow(row);
              handleEdit(row);
            },
            style: { cursor: 'pointer' },
          })}
          renderBottomToolbarCustomActions={() => (
            <Box
              mt={2}
              alignItems="center"
              display="flex"
              justifyContent="flex-end"
              width="100%"
            >
              <FirstPageIcon sx={{ cursor: 'pointer' }} onClick={() => setPageNo(1)} />
              <KeyboardArrowLeftIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo((prev) => Math.max(Number(prev) - 1, 1))}
              />
              <Box ml={1}> Page No </Box>
              <TextField
                sx={{
                  width: '4.5%',
                  ml: 1,
                  '@media (max-width: 768px)': {
                    width: '10%',
                  },
                }}
                value={pageNo}
                onChange={(e) => setPageNo(e.target.value)}
                size="small"
              />
              <KeyboardArrowRightIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo((prev) => Number(prev) + 1)}
              />
              <LastPageIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setPageNo(totalPages)}
              />
              <Box ml={1}>Total Pages: {totalPages}</Box>
            </Box>
          )}
        />

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
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={invoiceNo}
                  size="small"
                  margin="none"
                  placeholder="Invoice No Autogerated"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Invoice Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker

                    value={invoiceDate ? new Date(invoiceDate) : null}

                    format="dd-MM-yyyy"
                    onChange={(newValue) => { setInvoiceDate(newValue); setErrors({ ...errors, invoiceDate: undefined }) }}
                    slotProps={{
                      textField: {
                        size: "small", fullWidth: true, error: !!errors.invoiceDate,
                        helperText: errors.invoiceDate
                      },
                    }}
                    renderInput={(params) => <TextField />}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            
              <Box flex={1} position="relative">
                <Typography variant="body2">Customer</Typography>
                <TextField

                  fullWidth
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:before': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                      opacity: 1,
                    }, mt: 1
                  }}
                  size="small"
                  //value={selectedAccount || ""} 
                  value={selectedAccount
                    ? accountOptions.find(({ Id }) => String(Id) === selectedAccount)?.AccountName || accountOptions.map((option) => option.AccountName)
                    : " "}
                  placeholder="Select Customer"
                  onClick={() =>

                    setShowDropdown(true)}

                  error={!!errors.selectedAccount}
                  helperText={errors.selectedAccount}

                />

                {showDropdown && (
                  <Paper
                    sx={{ position: "absolute", width: "100%", maxHeight: 250, overflowY: "auto", zIndex: 10, mt: 1, p: 2 }}
                  >
                    <TextField
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Search Customer Name"
                      fullWidth
                    />
                    <Box display="flex" gap={1} mt={1}>
                      <TextField value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        size="small" placeholder="Create New Customer" fullWidth />

                      <Button sx={{
                        background: 'var(--primary-color)',
                      }}
                        onClick={CreateCustomerMaster}

                        variant="contained"
                        startIcon={<AddCircleIcon sx={{ fontSize: '20px' }} />}
                      >

                        Add
                      </Button>
                    </Box>
                    <Box mt={1}>

                      {accountOptions.map((option) => (
                        <MenuItem
                          key={option.Id}
                          onClick={() => {
                            setSelectedAccount(option.Id.toString());
                            fetchAccounts(option.Id.toString())
                            // console.log('options', option)
                            setShowDropdown(false);
                          }}
                        >
                          {option.AccountName}
                        </MenuItem>
                      ))}
                    </Box>
                  </Paper>
                )}
              </Box>



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
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={orderNo}
                  onChange={(e) => { setOrderNo(e.target.value); setErrors({ ...errors, orderNo: undefined }) }}
                  size="small"
                  margin="none"
                  placeholder="Order No"
                  error={!!errors.orderNo}
                  helperText={errors.orderNo}
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2">Order Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={orderDate ? new Date(orderDate) : null} // Convert to Date object
                    format="dd-MM-yyyy"
                    onChange={(newValue) => { setOrderDate(newValue); setErrors({ ...errors, orderDate: undefined }) }}
                    slotProps={{
                      textField: {
                        size: "small", fullWidth: true, error: !!errors.orderDate,
                        helperText: errors.orderDate
                      },
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
                  // onChange={(event, newValue) => {
                  //   if (newValue) {
                  //     setSelectedProductId(newValue.value);
                  //     setProductName(newValue.label);
                  //     setRate(newValue.purchaseRate);
                  //     setSelectedProductName(newValue.label);
                  //     setCGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? newValue.cgst : "0");
                  //     setSGST(gstNo?.substring(0, 2) === acctGSTNo?.substring(0, 2) ? newValue.sgst : "0");
                  //     setIGST(gstNo?.substring(0, 2) !== acctGSTNo?.substring(0, 2) ? newValue.igst : "0");

                  //     // Recalculate the amount with the existing quantity
                  //     calculateAmount(quantity, newValue.purchaseRate);
                  //   } else {
                  //     setSelectedProductId("");
                  //     setProductName("");
                  //     setRate("");
                  //     setSelectedProductName("");
                  //     setCGST("0");
                  //     setSGST("0");
                  //     setIGST("0");
                  //   }
                  // }}

                  onChange={(event, newValue) => {
                    if (!selectedAccount) {
                      alert("Please select a Customer before selecting an item.");
                      return;
                    }
                    handleItemChange(newValue);
                  }}

                  renderInput={(params) => <TextField {...params} variant="standard" sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }} focused />}
                />


              </Box>

              <Box flex={1}>
                <Typography variant="body2">Quantity</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
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
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
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
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={amount}
                  size="small"

                  // placeholder="Amount"
                  fullWidth


                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Box flex={1}>
                <Typography variant="body2">CGST%</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={cgst}
                  onChange={(e) => setCGST(e.target.value)}
                  // onChange={handleCgstChange}
                  size="small"
                  margin="none"
                  //  placeholder="CGST"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">CGST Amount</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={cgstAmount}
                  size="small"
                  margin="none"
                  // placeholder="CGST Amount"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">SGST%</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={sgst}
                  // onChange={handleSgstChange}
                  onChange={(e) => setSGST(e.target.value)}
                  size="small"
                  margin="none"
                  //  placeholder="SGST"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">SGST Amount</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={sgstAmount}
                  size="small"
                  margin="none"
                  // placeholder="SGST Amount"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">IGST %</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={igst}
                  // onChange={handleIgstChange}
                  onChange={(e) => setIGST(e.target.value)}
                  size="small"
                  margin="none"
                  // placeholder="IGST%"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography variant="body2">IGST Amount</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={igstAmount}
                  size="small"
                  margin="none"
                  // placeholder=" IGST Amount"
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
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
                  value={paymentMode}
                  onChange={(e) => { setPaymentMode(e.target.value); setErrors({ ...errors, paymentMode: undefined }) }}
                  size="small"
                  placeholder="Payment Mode"
                  error={!!errors.paymentMode}
                  helperText={errors.paymentMode}
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="body2">Transport</Typography>
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                      borderBottomColor: '#44ad74',
                    }, mt: 1
                  }}
                  focused
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
                {/* <Box sx={{ fontSize: '20px', mr: 4, }} ><b>{total} Rs</b></Box> */}
                <Box sx={{ fontSize: '20px', mr: 4, }} ><b>{Math.ceil(total)} Rs</b></Box>
 

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

            <Box>
              {isEditing && (
                <Button variant="contained" color="error" onClick={handleClickOpen}>
                  Delete
                </Button>
              )}

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmDelete} color="error" autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default SalesEntry;




























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































