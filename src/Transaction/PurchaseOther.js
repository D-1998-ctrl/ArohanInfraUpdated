
import React, { useMemo, useState, useEffect } from 'react'
import { Dialog, FormHelperText, InputAdornment, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Grid, Menu, Table, Autocomplete, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Box, useMediaQuery, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Input } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import qs from "qs";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';

const PurchaseOtherEntry = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [purchaheaders, setPurchaseheaders] = useState([]);
  const [purchasedetails, setPurchasedetails] = useState([]);
  const [invdetailId, setInvdetailId] = useState("");
  const [PurchaseNo, setPurchaseNo] = useState()
  const [brandName, setBrandName] = useState()
  const [billNo, setBillNo] = useState('')
  const [rows, setRows] = useState([]);
  const [rowId, setRowId] = useState('');

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    resetForm()
  };

  /*
    api to call fetchpurchaseHeader
  */

  const [pageNo, setPageNo] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const fetchpurchaseHeader = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch(
        `https://arohanagroapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=PurchaseOtherHeader&PageNo=${pageNo}`,
        requestOptions
      );
      const result = await response.json();
      setPurchaseheaders(result.data);
      setTotalPages(result.total_pages);
      //console.log('purchase other header', result.data);
    } catch (error) {
      console.error('Error fetching purchase other headers:', error);
    }
  };
     useEffect(() => {
        fetchpurchaseHeader();
      }, [pageNo]);

  // const fetchpurchaseHeader = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=PurchaseOtherHeader"
  //     );
  //     setPurchaseheaders(response.data);
  //     // console.log('header', response.data)
  //   } catch (error) { }
  // };


  //fetchInvdetails
  const fetchpurchasedetails = async () => {
    try {
      const response = await axios.get(
        "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=purchaseotherdetail"
      );
      setPurchasedetails(response.data);
      // console.log('detail', response.data)
    } catch (error) { }
  };


  useEffect(() => {
    // fetchpurchaseHeader();
    fetchpurchasedetails();
    fetchLocation();
  }, []);


  //table
  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'srNo',
        header: 'Sr No',
        size: 100,
        // Cell: ({ row }) => row.index + 1,
        Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
      },
      {
        accessorKey: 'PurchaseNo',
        header: 'Purchase No',
        size: 150,
      },
      {
        accessorKey: 'BillNo',
        header: 'Bill No',
        size: 150,
      },
      {
        accessorKey: 'CGSTAmount',
        header: 'CGST Amount',
        size: 150,
      },
      {
        accessorKey: 'SGSTAmount',
        header: 'SGST Amount',
        size: 150,
      },
      {
        accessorKey: 'IGSTAmount',
        header: 'IGST Amount',
        size: 150,
      },
      {
        accessorKey: 'TransportCharges',
        header: 'Transport Charges',
        size: 150,
      },

      {
        accessorKey: 'Other',
        header: 'Other',
        size: 150,
      },
      {
        accessorKey: 'Total',
        header: 'Total',
        size: 150,
      },
      {
        accessorKey: 'SubTotal',
        header: 'SubTotal',
        size: 150,
      },

      // {
      //   id: 'actions',
      //   header: 'Actions',
      //   size: 150,
      //   // Cell: ({ row }) => (
      //   //   // <div>
      //   //   //   <IconButton onClick={(event) => handleMenuOpen(event, row)}>
      //   //   //     <MoreVertIcon />
      //   //   //   </IconButton>
      //   //   // </div>
      //   // ),

      // },
    ];
  }, [purchaheaders]);



  const handleMenuOpen = (row) => {
    //  setAnchorEl(event.currentTarget);
    // setCurrentRow(row);
    setIsDrawerOpen(false);
    setShowEntry(3)
    handleEdit()

  };

  const handleNewClick = () => {
    setIsDrawerOpen(true);
    resetForm();
    setIsEditing(false);
    setShowEntry(1)
  };

  //
  const [rate, setRate] = useState(0);
  const [gstNoComp, setGstNoComp] = useState(0);
  const [productOptions, setProductOptions] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [amount, SetAmount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCGST, setSelectedCGST] = useState("0");
  const [selectedSGST, setSelectedSGST] = useState("0");
  const [selectedIGST, setSelectedIGST] = useState("");
  const [cgstAmount, setCGSTAmount] = useState(0);
  const [sgstAmount, setSGSTAmount] = useState(0);
  const [igstAmount, setIGSTAmount] = useState(0);
  const [ProductName, setProductName] = useState('');
  const [transport, setTransport] = useState("");
  const [other, setOther] = useState('')

  const [showEntry, setShowEntry] = useState(0)
  const [total, setTotal] = useState()
  const [subTotalcal, setSubTotalCal] = useState()
  const [cgstTotal, setCgstTotal] = useState()
  const [igstTotal, setIgstTotal] = useState()
  const [sgstTotal, setSgstTotal] = useState()

  const [totalshow, setTotalshow] = useState()
  const [subTotalcalshow, setSubTotalCalshow] = useState()
  const [cgstTotalshow, setCgstTotalshow] = useState()
  const [igstTotalshow, setIgstTotalshow] = useState()
  const [sgstTotalshow, setSgstTotalshow] = useState()

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
      subtotal + totalCGST + totalSGST + totalIGST + (parseFloat(transport) || 0) + (parseFloat(other) || 0);
    let totals = grandTotal.toFixed(2)
    setTotal(totals)
  }

  useEffect(() => {
    calculations()
  }, [rows, transport, other]);

  const fetchMaterialMaster = async () => {
    try {
      const response = await axios.get(
        'https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster',
      );
      // console.log(response.data);
      processMaterialData(response.data)
    } catch (error) {
      console.error(error);

    }
  };

  const [options, setOptions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedGSTNo, setSelectedGSTNo] = useState(0);

  const processMaterialData = (data) => {
    if (Array.isArray(data)) {

      const options = data.map((account) => ({
        value: account?.Id || "",
        label: account?.ProductName || "",
        cgstpercent: account?.CGSTPercentage,
        sgstpercent: account?.SGSTPercentage,
        igstpercent: account?.IGSTPercentage,
        purchaseRate: account?.SellPrice,
      }));

      // console.log('options', options)
      setProductOptions(options);
    }
  };





  const fetchCompanyMaster = async () => {
    try {
      const response = await axios.get(
        'https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=companymaster',
        { maxBodyLength: Infinity }
      );
      // console.log(response.data);
      setGstNoComp(response.data[0].GSTNo);

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchCompanyMaster();
    fetchMaterialMaster();
    // fetchTypeCodeS();
  }, []);

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    calculateAmount(qty, rate);
  };

  const handleRateChange = (e) => {
    const rt = e.target.value;
    setRate(rt);
    calculateAmount(quantity, rt);
  };

  const calculateAmount = (qty, rt) => {
    const qtyNum = parseFloat(qty) || 0;
    const rateNum = parseFloat(rt) || 0;
    const amt = qtyNum * rateNum;
    SetAmount(amt);
    calculateCgstAmount(selectedCGST, amt);
    calculateSgstAmount(selectedSGST, amt);
    calculateIgstAmount(selectedIGST, amt);
  };

  const calculateCgstAmount = (cgstValue, amt) => {
    let cgstNum = parseFloat(cgstValue) || 0;
    let cgstAmt = (cgstNum * amt) / 100;
    setCGSTAmount(cgstAmt);
  };

  const calculateSgstAmount = (sgstValue, amt) => {
    let sgstNum = parseFloat(sgstValue) || 0;
    let sgstAmt = (sgstNum * amt) / 100;
    setSGSTAmount(sgstAmt);
  };

  const calculateIgstAmount = (igstValue, amt) => {
    let igstNum = parseFloat(igstValue) || 0;
    let igstAmt = (igstNum * amt) / 100;
    setIGSTAmount(igstAmt);
  };

  const [editingRow, setEditingRow] = useState(null);

  const handleAddRow = () => {
    const newRow = {
      ProductId: selectedProduct,
      ProductName: ProductName,
      Quantity: quantity,
      Rate: rate,
      Amount: amount,
      CGSTPercentage: selectedCGST,
      CGSTAmount: cgstAmount,
      SGSTPercentage: selectedSGST,
      SGSTAmount: sgstAmount,
      IGSTPercentage: selectedIGST,
      IGSTAmount: igstAmount,
    };
    console.log('ProductId', selectedProduct);
    console.log('ProductName', ProductName);
    console.log("newRow", newRow);
    // Update rows state and ensure the new row is added to the table
    setRows((prevRows) => [...prevRows, newRow]);

  };

  const handleSaveOrAddRow = () => {
    if (!selectedProduct) {
      alert("Please select an item before adding or saving the row.");
      return;
    }

    if (editingRow !== null) {
      // Update the existing row
      const updatedRows = [...rows];
      updatedRows[editingRow] = {
        ...updatedRows[editingRow],
        ProductId: selectedProduct,
        ProductName: ProductName,

        Quantity: quantity,
        Rate: rate,
        Amount: amount,
        CGSTPercentage: selectedCGST,
        CGSTAmount: cgstAmount,
        SGSTPercentage: selectedSGST,
        SGSTAmount: sgstAmount,
        IGSTPercentage: selectedIGST,
        IGSTAmount: igstAmount,
      };

      setRows(updatedRows);
      setEditingRow(null);


    } else {
      // Add a new row
      handleAddRow();
    }
    resetFields()
  };


  const resetFields = () => {
    setSelectedProduct("");
    setProductName("");
    setQuantity("");
    setRate("");
    SetAmount("");
    setSelectedCGST("");
    setCGSTAmount("");
    setSelectedSGST("");
    setSGSTAmount("");
    setSelectedIGST("");
    setIGSTAmount("");
  };


  //for  Update Purchase Entry
  const handleSubmit213 = (rowData) => {
   //console.log("This row has been clicked:", rowData);
    setRowId(rowData.Id)
    setIsDrawerOpen(true);
    setIsEditing(false);
    setShowEntry(2)
    setPurchaseNo(rowData.PurchaseNo)
    setTotalshow(rowData.Total);

    setIgstTotalshow(rowData.IGSTAmount);
    setCgstTotalshow(rowData.CGSTAmount)
    setSubTotalCalshow(rowData.SubTotal)
    setSgstTotalshow(rowData.SGSTAmount)
    setTransport(rowData.TransportCharges)
    setOther(rowData.Other)
    setSelectedId(rowData.SupplierId)
    setSelectedLocation(rowData.StorelocId)



    fetchAccounts(rowData.SupplierId)
    fetchAccountName(rowData.SupplierId)
    setCustomerName(rowData.SupplierId)




    const dateStr = rowData.PurchaseDate.date.split(" ")[0];
    const [year, month, day] = dateStr.split("-").map(Number);
    const formattedDate = `${year}-${month}-${day}`;
    setPurchaseDate(formattedDate);
    setBillNo(rowData.BillNo)
    const billdateStr = rowData.BillDate.date.split(" ")[0];
    const [billyear, billmonth, billday] = billdateStr.split("-").map(Number);
    const formattedBillDate = `${billyear}-${billmonth}-${billday}`;
    setBillDate(formattedBillDate);
    const invdetail = purchasedetails.filter((detail) => detail.PurchaseotherId === rowData.Id)
    setBrandName(invdetail[0]?.Brandname ?? null);

  };

  // const table = useMaterialReactTable({
  //   columns,
  //   data: purchaheaders,
  //   muiTableHeadCellProps: {
  //     style: {
  //       backgroundColor: "#E9ECEF",
  //       color: "black",
  //       fontSize: "16px",
  //     },
  //   },
  //   muiTableBodyRowProps: ({ row }) => ({
  //     onClick: () => handleSubmit213(row.original),
  //     style: { cursor: "pointer" },
  //   }),
  // });
  const table = useMaterialReactTable({
  columns,
  data: purchaheaders,
  enablePagination: false, // if you're doing full manual pagination, set this to false
  muiTableHeadCellProps: {
    style: {
      backgroundColor: "#E9ECEF",
      color: "black",
      fontSize: "16px",
    },
  },
  muiTableBodyRowProps: ({ row }) => ({
    onClick: () => handleSubmit213(row.original),
    style: { cursor: "pointer" },
  }),
  renderBottomToolbarCustomActions: () => (
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
  ),
});

  const [editId, setEditId] = useState("");
  const [PurchaseDate, setPurchaseDate] = useState(null);
  const [BillDate, setBillDate] = useState(null);


  ///create and update purchase entry
  const handleSubmit = async (e) => {
    e.preventDefault();



    if (!validateForm()) {
      return;
    }

    const formattedPurchasedate = moment(PurchaseDate).format("YYYY-MM-DD");
    const formattedBillDate = moment(BillDate).format("YYYY-MM-DD");

    const purchaseheaderdata = {
      Id: rowId,
      PurchaseNo: parseInt(PurchaseNo),
      PurchaseDate: formattedPurchasedate,
      SupplierId: parseInt(selectedId) ? parseInt(selectedId) : customerName,
      BillNo: parseInt(billNo),
      BillDate: formattedBillDate,
      StorelocId: selectedLocation,
      CGSTAmount: cgstTotal,
      SGSTAmount: sgstTotal,
      IGSTAmount: igstTotal,
      TransportCharges: parseFloat(transport),
      Other: parseInt(other),
      Total: total,
      SubTotal: subTotalcal,
      IsLocked: 'true'
    };
    //("purchaseheaderdata", purchaseheaderdata);
    try {
      const invoiceurl = isEditing
        ? "https://arohanagroapi.microtechsolutions.net.in/php/updatepurchaseotherheader.php"
        : "https://arohanagroapi.microtechsolutions.net.in/php/postpurchaseotherheader.php";

      const response = await axios.post(
        invoiceurl,
        qs.stringify(purchaseheaderdata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      let PurchaseId = isEditing ? rowId : parseInt(response.data.ID, 10);


      for (const row of rows) {
        //("this row   ", row);
        const rowData = {
          Id: parseInt(row.Id, 10),
          PurchaseotherId: parseInt(PurchaseId, 10),
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
          Brandname: brandName
        };


        //("this row has rowData ", rowData);

        const invoicdedetailurl =
          row.Id
            ? "https://arohanagroapi.microtechsolutions.net.in/php/updatepurchaseotherdetail.php"
            : "https://arohanagroapi.microtechsolutions.net.in/php/postpurchaseotherdetail.php";

        //(" invoicdedetailurl is used ", invoicdedetailurl);
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

          //("Response:", response);
        } catch (error) {
          console.error("Error:", error);
        }


      }

      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Purchase Entry updated successfully!"
          : "Purchase Entry Created successfully!"
      );
      resetForm();
      fetchpurchaseHeader();
      fetchpurchasedetails();
      //("Purchase Header Data:", purchaseheaderdata);

    } catch (error) {
      console.error("Error submitting Purchase:", error);
    }
  };

  const resetForm = () => {
    setPurchaseNo("");
    setPurchaseDate("");
    setSelectedId("")
    setBrandName('')
    setBillNo('')
    setBillDate('')
    setSelectedProduct('')
    setQuantity("");
    setRate("");
    SetAmount("");
    setSelectedCGST("");
    setCGSTAmount("");
    setSelectedSGST("");
    setSGSTAmount("");
    setSelectedSGST("");
    setIGSTAmount("");
    setOther("");
    setTransport("");
    setSelectedLocation("");
    setErrors("");
    setOptions([]);
    setRows([]);

  };


  const handleEdit = () => {
    //("Editing item with ID:", rowId);

    const invdetail = purchasedetails.filter(
      (detail) => detail.PurchaseotherId === rowId);
    //('invdetail', invdetail)

    const mappedRows = invdetail.map((detail) => ({
      Id: detail.Id,
      PurchaseotherId: detail.PurchaseotherId,
      ProductId: detail.ProductId,
      ProductName: productOptions.find((data) => data.value === detail.ProductId)?.label || "",
      Quantity: parseFloat(detail.Quantity) || 0,
      Rate: parseFloat(detail.Rate) || 0,
      Amount: parseFloat(detail.Amount) || 0,
      CGSTPercentage: parseFloat(detail.CGSTPercentage) || 0,
      CGSTAmount: parseFloat(detail.CGSTAmount) || 0,
      SGSTPercentage: parseFloat(detail.SGSTPercentage) || 0,
      SGSTAmount: parseFloat(detail.SGSTAmount) || 0,
      IGSTPercentage: parseFloat(detail.IGSTPercentage) || 0,
      IGSTAmount: parseFloat(detail.IGSTAmount) || 0,
    }));

    //('mappedRows', mappedRows)
    // // Set the rows for the table with all the details
    setRows(mappedRows);
    // // Set editing state
    setIsDrawerOpen(true);
    // handleMenuClose();
    setIsEditing(true);
    setEditId(rowId.original?.Id);

    // Find the specific invoice detail
    const specificDetail = invdetail.find(
      (detail) => detail.Id === rowId.original?.Id
    );
    if (specificDetail) {
      setInvdetailId(specificDetail.Id);
      //("specificDetail.Id", specificDetail.Id);
    }
    fetchpurchaseHeader();
    setIsDrawerOpen(true);
  };


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

  //
  const handleEditRow = (index) => {
    const row = rows[index];
    setEditingRow(index);
    setQuantity(row.Quantity || "");
    setRate(row.Rate || "");
    SetAmount(row.Amount || "");
    setSelectedCGST(row.CGSTPercentage || "0");
    setCGSTAmount(row.CGSTAmount || "0");
    setSelectedSGST(row.SGSTPercentage || "0");
    setSGSTAmount(row.SGSTAmount || "0");
    setSelectedIGST(row.IGSTPercentage || "0");
    setIGSTAmount(row.IGSTAmount || "0");
    setSelectedProduct(row.ProductId);
    setProductName(row.ProductName);
  };


  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  //for Store locations
  const [storeoptions, setStoreOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();

  const fetchLocation = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=Branch",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // //("API Response:", result); // Debugging log
        const storelocationOptions = result.map((storelocation) => ({
          value: storelocation?.Id || "",
          label: storelocation?.Storelocation,
        }));

        setStoreOptions(storelocationOptions);

      })
      .catch((error) => console.error("Error fetching Storelocation:", error));
  };



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

    //("Deleted Id:", rowId);

    fetch(`https://arohanagroapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=PurchaseOtherHeader&Id=${rowId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        //(result);
        setOpen(false);
        handleDrawerClose();
        fetchpurchaseHeader();
        toast.success(
          "Purchase  Other  Deleted successfully!"
        );
      })
      .catch((error) => console.error(error));
  };
  ///


  //serchapi for Party
  const [text, setText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const serchParty = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`https://arohanagroapi.microtechsolutions.net.in/php/get/searchaccount.php?TypeCode=S&Text=${text}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        setOptions(Array.isArray(result) ? result : []);


      })
      .catch((error) => console.error(error));
  }
  useEffect(() => {
    serchParty();
  }, [text]);




  //create new Party 
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

  const CreateSupplierMaster = () => {

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
    urlencoded.append("TypeCode", "S");
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
        //  //("Customer Created:", result);
        toast.success('User created')
        if (result && result.Id) {
          //  //(result.Id)


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
        setSelectedGSTNo(temp.GSTNo)
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
        //  console.log('accountname', result)

        setOptions(Array.isArray(result) ? result : []);
      }

      )
      .catch((error) => console.error(error));
  };



  //
  const handleItemChange = (event) => {

    const selectedValue = event.target.value;
    setSelectedProduct(selectedValue);

    const selectedItem = productOptions.find(option => option.value.toString() === selectedValue);
   // console.log("selected Items", selectedItem)
    setProductName(selectedItem.label)

    setRate(selectedItem.purchaseRate);
    //console.log("Purchase rate:", selectedItem.purchaseRate);

    if (selectedItem) {
      let gstfromCompanyInfo = gstNoComp?.substring(0, 2) || "";
      let gstfromAccount = selectedGSTNo?.substring(0, 2) || "";
      setSelectedCGST(gstfromCompanyInfo === gstfromAccount ? selectedItem.cgstpercent : "0");
      setSelectedSGST(gstfromCompanyInfo === gstfromAccount ? selectedItem.sgstpercent : "0");
      setSelectedIGST(gstfromCompanyInfo !== gstfromAccount ? selectedItem.igstpercent : "0");


      // Recalculate the amount with the existing quantity
      calculateAmount(quantity, selectedItem.purchaseRate);
    } else {
      setSelectedCGST("0");
      setSelectedSGST("0");
      setSelectedIGST("0");
    }
  }

  //validation
  const [errors, setErrors] = useState({
    selectedId: '',
    PurchaseDate: '',
    billDate: '',
    selectedLocation: ''
  })


  const validateForm = () => {
    const newErrors = {
      selectedId: '',
      PurchaseDate: '',
      BillDate: '',
      selectedLocation: '',
      // rows: ''
    };

    let isValid = true;

    if (!selectedId) {
      newErrors.selectedId = 'Party is required';
      isValid = false;
    }

    if (!PurchaseDate) {
      newErrors.PurchaseDate = 'PurchaseDate  is required';
      isValid = false;
    } else {
      // Convert dates to Date objects for comparison
      const purchaseDateObj = new Date(PurchaseDate);
      const fromDateObj = new Date(fromdate);
      const toDateObj = new Date(todate);

      // Check if invoice date is before from date
      if (purchaseDateObj < fromDateObj) {
        newErrors.PurchaseDate = `PurchaseDate  cannot be before ${new Date(fromdate).toLocaleDateString()}`;
        isValid = false;
      }
      // Check if invoice date is after to date
      else if (purchaseDateObj > toDateObj) {
        newErrors.PurchaseDate = `PurchaseDate cannot be after ${new Date(todate).toLocaleDateString()}`;
        isValid = false;
      }
    };

    if (!BillDate) {
      newErrors.BillDate = 'BillDate is required';
      isValid = false;
    }

    if (!selectedLocation) {
      newErrors.selectedLocation = 'Storelocation is required';
      isValid = false;
    }

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
    // console.log('storedYearId', storedYearId);
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
      <Box textAlign={'center'}>
        <Typography variant='h4' color='var(--complementary-color)'><b>Other Purchase Entry</b></Typography>
      </Box>
      <Box
        sx={{
          p: 5, height: 'auto'
        }} >
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleNewClick}>Create Other Purchase Entry </Button>
        </Box>

        <Box mt={4}>
          <MaterialReactTable table={table}
            enableColumnResizing
            muiTableHeadCellProps={{
              sx: {
                color: 'var(--primary-color)',
              },
            }}
          />
        </Box>

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
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>

            <Box>
              {showEntry === 1 &&
                <Typography m={2} variant="h6"><b>Create Other Purchase Entry</b></Typography>
              }
              {showEntry === 2 && <Box

              >
                <Box display="flex" justifyContent="space-between" alignItems="center" m={2}>
                  <Typography fontWeight="bold" variant="h6">
                    Other Purchase Entry Detail
                  </Typography>
                  <IconButton color='#000' onClick={handleMenuOpen}>
                    <BorderColorIcon />
                  </IconButton>
                </Box>


              </Box>
              }
              {showEntry === 3 &&
                <Typography m={2} variant="h6"><b>Update Other Purchase Entry </b></Typography>


              }

            </Box>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />
          {(showEntry === 1 || showEntry === 3) &&
            <Box>

              <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, m: 1 }}>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography>Purchase No</Typography>
                      <TextField
                        value={PurchaseNo}
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:after': {
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#44ad74',
                          }, mt: 1
                        }}
                        focused
                        size="small"
                        margin="none"
                        placeholder="Purchase No Autogenrated"
                        fullWidth
                      />
                    </Box>

                    <Box flex={1} position="relative">
                      <Typography variant="body2">Party</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:after': {
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#44ad74',
                          }, mt: 1
                        }}
                        focused
                        value={selectedId
                          ? options.find(({ Id }) => String(Id) === selectedId)?.AccountName || options.map((option) => option.AccountName)
                          : ''}

                        // onClick={() => setShowDropdown(true)}
                        onClick={() =>

                          setShowDropdown(true)}

                        error={!!errors.selectedId}
                        helperText={errors.selectedId}

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
                            <TextField
                              value={accountName}
                              onChange={(e) => setAccountName(e.target.value)}
                              size="small" placeholder="Create New Customer" fullWidth />

                            <Button
                              sx={{
                                background: 'var(--primary-color)',
                              }}


                              onClick={CreateSupplierMaster}

                              variant="contained"
                              startIcon={<AddCircleIcon sx={{ fontSize: '20px' }} />}
                            >

                              Add
                            </Button>
                          </Box>
                          <Box mt={1}>

                            {options.map((option) => (
                              <MenuItem
                                key={option.Id}
                                onClick={() => {
                                  setSelectedId(option.Id.toString());
                                  fetchAccounts(option.Id.toString())
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

                    <Box>
                      <Typography>Bill No</Typography>
                      <TextField
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:after': {
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#44ad74',
                          }, mt: 1
                        }}
                        focused
                        value={billNo}
                        onChange={(e) => setBillNo(e.target.value)}
                        size="small"
                        margin="none"
                        placeholder='Bill No'
                        fullWidth
                      />
                    </Box>
                  </Box>


                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography>Purchase Date</Typography>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={PurchaseDate ? new Date(PurchaseDate) : null}
                          format="dd-MM-yyyy"
                          onChange={(newValue) => { setPurchaseDate(newValue); setErrors({ ...errors, PurchaseDate: undefined }) }}
                          slotProps={{
                            textField: { size: "small", fullWidth: true, error: !!errors.PurchaseDate, helperText: errors.PurchaseDate },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>

                    <Box>
                      <Typography>Brand Name</Typography>
                      <TextField
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:after': {
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#44ad74',
                          },
                        }}
                        focused
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        size="small"
                        margin="none"

                        fullWidth
                      />
                    </Box>

                    <Box>
                      <Typography>Bill Date</Typography>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={BillDate ? new Date(BillDate) : null}
                          format="dd-MM-yyyy"
                          onChange={(newValue) => { setBillDate(newValue); setErrors({ ...errors, BillDate: undefined }) }}
                          slotProps={{
                            textField: { size: "small", fullWidth: true, error: !!errors.BillDate, helperText: errors.BillDate },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Box>
                </Box>


                <Box m={1} >
                  <Typography variant="body2">Store Location</Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    variant="standard"
                    error={!!errors.selectedLocation}
                    sx={{
                      '& .MuiInput-underline:before': {
                        borderBottomWidth: 1.5,
                        borderBottomColor: '#44ad74 ',
                      },
                      mt: 1
                    }}
                  >
                    <Select
                      value={selectedLocation || ""}
                      onChange={(event) => {
                        setSelectedLocation(event.target.value); if (errors.selectedLocation) {
                          setErrors({ ...errors, selectedLocation: undefined });
                        }
                      }
                      }
                    >
                      {storeoptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.selectedLocation && (
                      <FormHelperText>{errors.selectedLocation}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                <Box mt={3}>
                  <Box >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, m: 1 }}>
                      <Box flex={1}>
                        <Box>
                          <Typography>Item</Typography>

                          <Select
                            fullWidth
                            variant="standard"
                            input={
                              <Input
                                disableUnderline={false}
                                sx={{
                                  '&:before': {
                                    borderBottomWidth: 1.5,
                                    borderBottomColor: '#44ad74',
                                  },
                                  mt: 1,
                                }}
                              />
                            }
                            size="small"
                            value={selectedProduct || ""}
                            // onChange={(event) => {
                            //   const selectedValue = event.target.value;
                            //   setSelectedProduct(selectedValue);

                            //   const selectedItem = productOptions.find(option => option.value.toString() === selectedValue);
                            //   console.log("selected Items", selectedItem)
                            //   setProductName(selectedItem.label)

                            //   setRate(selectedItem.purchaseRate);
                            //   console.log("Purchase rate:", selectedItem.purchaseRate);

                            //   if (selectedItem) {
                            //     let gstfromCompanyInfo = gstNoComp?.substring(0, 2) || "";
                            //     let gstfromAccount = selectedGSTNo?.substring(0, 2) || "";
                            //     setSelectedCGST(gstfromCompanyInfo === gstfromAccount ? selectedItem.cgstpercent : "0");
                            //     setSelectedSGST(gstfromCompanyInfo === gstfromAccount ? selectedItem.sgstpercent : "0");
                            //     setSelectedIGST(gstfromCompanyInfo !== gstfromAccount ? selectedItem.igstpercent : "0");


                            //     // Recalculate the amount with the existing quantity
                            //     calculateAmount(quantity, selectedItem.purchaseRate);
                            //   } else {
                            //     setSelectedCGST("0");
                            //     setSelectedSGST("0");
                            //     setSelectedIGST("0");
                            //   }
                            // }}
                            onChange={(event) => {
                              if (!selectedId) {
                                alert("Please select a party before selecting an item."); // Alert if party is not selected
                                return;
                              }
                              handleItemChange(event);
                            }}

                          >
                            {productOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>




                          {/* <Autocomplete
  fullWidth
  size="small"
  options={productOptions}
  getOptionLabel={(option) => option.label}
  value={productOptions.find(option => option.value.toString() === selectedProduct) || null}
  onChange={(event, newValue) => {
    if (newValue) {
      setSelectedProduct(newValue.value.toString());
      setProductName(newValue.label);
      setRate(newValue.purchaseRate);
      console.log("Selected Item:", newValue);
      console.log("Purchase rate:", newValue.purchaseRate);

      let gstfromCompanyInfo = gstNoComp?.substring(0, 2) || "";
      let gstfromAccount = selectedGSTNo?.substring(0, 2) || "";
      setSelectedCGST(gstfromCompanyInfo === gstfromAccount ? newValue.cgstpercent : "0");
      setSelectedSGST(gstfromCompanyInfo === gstfromAccount ? newValue.sgstpercent : "0");
      setSelectedIGST(gstfromCompanyInfo !== gstfromAccount ? newValue.igstpercent : "0");

      // Recalculate the amount with the existing quantity
      calculateAmount(quantity, newValue.purchaseRate);
    } else {
      setSelectedProduct("");
      setProductName("");
      setRate("");
      setSelectedCGST("0");
      setSelectedSGST("0");
      setSelectedIGST("0");
    }
  }}
  renderInput={(params) => <TextField {...params} label="Select Product" variant="outlined" />}
/> */}



                        </Box>
                      </Box>

                      <Box flex={1}>
                        <Typography variant="body2">Quantity</Typography>
                        <TextField
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:after': {
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#44ad74',
                            opacity: 1,
                          }, mt: 1
                        }}
                        focused
                          value={quantity}
                          onChange={handleQuantityChange}
                          size="small"
                          margin="none"
                         
                          fullWidth
                        />
                      </Box>

                      <Box flex={1}>
                        <Typography>Rate</Typography>
                        <TextField
                        variant="standard"
                        sx={{
                          '& .MuiInput-underline:after': {
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#44ad74',
                            opacity: 1,
                          }, mt: 1
                        }}
                        focused
                          value={rate}
                          onChange={handleRateChange}

                          size="small" margin="none"  fullWidth />
                      </Box>

                      <Box flex={1}>
                        <Typography>Amount</Typography>
                        <TextField
                          value={amount}
                          variant="standard"
                          sx={{
                            '& .MuiInput-underline:after': {
                              borderBottomWidth: 1.5,
                              borderBottomColor: '#44ad74',
                              opacity: 1,
                            }, mt: 1
                          }}
                          focused
                          size="small" margin="none"  fullWidth />
                      </Box>

                    </Box>

                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, m: 1 }}>
                    <Box flex={1}>
                      <Typography variant="body2">CGST%</Typography>
                      <TextField
                       variant="standard"
                       sx={{
                         '& .MuiInput-underline:after': {
                           borderBottomWidth: 1.5,
                           borderBottomColor: '#44ad74',
                           opacity: 1,
                         }, mt: 1
                       }}
                       focused
                        value={selectedCGST}
                        size="small"
                        margin="none"
                        
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
                           opacity: 1,
                         }, mt: 1
                       }}
                       focused
                        value={cgstAmount}
                        size="small"
                        margin="none"
                       
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
                           opacity: 1,
                         }, mt: 1
                       }}
                       focused
                        value={selectedSGST}
                        size="small"
                        margin="none"
                        
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
                           opacity: 1,
                         }, mt: 1
                       }}
                       focused
                        value={sgstAmount}
                        size="small"
                        margin="none"
                        
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
                           opacity: 1,
                         }, mt: 1
                       }}
                       focused
                        value={selectedIGST}
                        size="small"
                        margin="none"
                        
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
                           opacity: 1,
                         }, mt: 1
                       }}
                       focused
                        value={igstAmount}
                        size="small"
                        margin="none"
                        
                        fullWidth
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box m={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveOrAddRow}


                  sx={{ background: 'var(--complementary-color)', mb: 2, gap: 1 }}
                >
                  <AddCircleOutlineIcon />
                  {editingRow !== null ? "Update Row" : "Add to Table"}
                </Button>
              </Box>

              <Box m={1}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr No</TableCell>
                        {/* <TableCell>InvoiceID</TableCell> */}
                        <TableCell>Item</TableCell>
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
                        // console.log(rows),
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          {/* <TableCell><TextField value={row.InvoiceId || ""} size="small" fullWidth /></TableCell> */}
                          <TableCell>
                            <Box>{row.ProductName}</Box>
                          </TableCell>

                          <TableCell>
                            {row.Quantity}
                          </TableCell>

                          <TableCell>
                            {row.Rate}
                          </TableCell>

                          <TableCell>
                            {row.Amount}
                          </TableCell>

                          <TableCell>
                            {row.CGSTPercentage}
                          </TableCell>

                          <TableCell>
                            {row.CGSTAmount}
                          </TableCell>

                          <TableCell>
                            {row.SGSTPercentage}
                          </TableCell>

                          <TableCell>
                            {row.SGSTAmount}
                          </TableCell>

                          <TableCell>
                            {row.IGSTPercentage}
                          </TableCell>

                          <TableCell>
                            {row.IGSTAmount}
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
                              <MenuItem
                                onClick={() => handleEditRow(index)}
                              >
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
                    <Typography variant="body2">Transport</Typography>
                    <TextField
                     variant="standard"
                     sx={{
                       '& .MuiInput-underline:after': {
                         borderBottomWidth: 1.5,
                         borderBottomColor: '#44ad74',
                         opacity: 1,
                       }, mt: 1
                     }}
                     focused
                      value={transport}
                      onChange={(e) => {
                        setTransport(e.target.value);

                      }
                      }
                      size="small"
                      placeholder="Transport"
                      fullWidth
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2">Other</Typography>
                    <TextField
                     variant="standard"
                     sx={{
                       '& .MuiInput-underline:after': {
                         borderBottomWidth: 1.5,
                         borderBottomColor: '#44ad74',
                         opacity: 1,
                       }, mt: 1
                     }}
                     focused
                      value={other}
                      onChange={(e) => { setOther(e.target.value) }}
                      size="small"
                      placeholder="Other"
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
                    <Box sx={{ fontSize: '20px', mr: 4, }} >
                      {/* <b>{total} Rs</b> */}
                       <b>{Math.ceil(total)} Rs</b>
                      </Box>
                  </Box>
                </Box>
              </Box>


              <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mb={5}>
                <Box>
                  <Button sx={{
                    background: 'var(--primary-color)',
                  }} onClick={handleSubmit} variant="contained">
                    {isEditing ? "update" : "save"}{" "}
                  </Button>
                </Box>

                <Box>
                  <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant='outlined'> <b>Cancel</b>
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

            </Box>
          }

          {showEntry === 2 &&
            <Box sx={{ p: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>Purchase No:</Typography>
                  <b>{PurchaseNo}</b>
                </Grid>

                <Grid item xs={6}>
                  <Typography>Purchase Date:</Typography>
                  <b>{PurchaseDate}</b>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>


                <Grid container spacing={2} sx={{ display: "flex", alignItems: "center", gap: 15, p: 2, mt: 1 }}>
                  <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Bill No:</Typography>
                    <b>{billNo}</b>
                  </Grid>

                  <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Bill Date:</Typography>
                    <b>{BillDate}</b>
                  </Grid>

                  {/* <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Party:</Typography>
                    <Typography variant="body1">
                      {options.find((option) => option.Id === selectedId)?.AccountName}
                    </Typography>
                  </Grid> */}
                </Grid>


                <Grid item xs={12}>
                  <Divider />
                </Grid>


                <Box width={'100%'} p={2} mt={1} display={'flex'} flexDirection={'column'} gap={2}>

                  {/* Total, Sub Total, Transport & Other */}
                  <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                    <Box>
                      <Typography>Total:</Typography>
                      {/* <b>{totalshow} Rs</b> */}
                           <b>{Math.ceil(totalshow)} Rs</b>
                    </Box>
                    <Box>
                      <Typography>Sub Total:</Typography>
                      <b>{subTotalcalshow} Rs</b>
                    </Box>
                    <Box>
                      <Typography>Transport Charges:</Typography>
                      <b>{transport} Rs</b>
                    </Box>
                    <Box>
                      <Typography>Other:</Typography>
                      <b>{other} Rs</b>
                    </Box>
                  </Box>

                  {/* GST Amounts */}
                  <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                    <Box>
                      <Typography>CGST Amount:</Typography>
                      <b>{cgstTotalshow} Rs</b>
                    </Box>
                    <Box>
                      <Typography>IGST Amount:</Typography>
                      <b>{igstTotalshow} Rs</b>
                    </Box>
                    <Box>
                      <Typography>SGST Amount:</Typography>
                      <b>{sgstTotalshow} Rs</b>
                    </Box>
                  </Box>

                </Box>




                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* <Grid item xs={6}>
                <Typography>Subtotal:</Typography>
                <b>{subtotal} Rs</b>
              </Grid>

              <Grid item xs={6}>
                <Typography>Total:</Typography>
                <b>{grandTotal} RS</b>
              </Grid> */}


              </Grid>
            </Box>
          }
        </Drawer>
      </Box>
    </Box>


  )
}
export default PurchaseOtherEntry







