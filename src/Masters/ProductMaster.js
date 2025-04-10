import React, { useMemo, useState, useEffect } from 'react'
import { Alert, Autocomplete, useMediaQuery, Box, Button, IconButton, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, Menu } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import suppliermaster from './suppliermaster.json'
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import { toast } from "react-toastify";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../Components/common.css'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';

const ProductMaster = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };



  //fetch groupId
  const [groupOption, setGroupOption] = useState('');
  const [selectedGroupOption, setSelectedGroupOption] = useState('');

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productgroup"
      );
      const result = await response.json();

      // console.log("grp info:", result);

      const options = result.map((grp) => ({
        value: grp.Id,
        label: grp.GroupName,
      }));

      setGroupOption(options);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };


  useEffect(() => {
    fetchGroup();
  }, []);

  //table
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [idwiseData, setIdwiseData] = useState('')
  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original);
      setIdwiseData(currentRow.original.Id)
      setUpdateProductCode(currentRow.original.ProductCode)
      setSelectedGroupOption(currentRow.original.ProductGroupId)
      setUpdateProductName(currentRow.original.ProductName)
      setUpdateUOM(currentRow.original.UOM)
      setUpdateSalesPrice(currentRow.original.SellPrice)
      setUpdatePurchasePrice(currentRow.original.PurchasePrice)
      setUpdateLocation(currentRow.original.Location)
      setUpdateOpeningValue(currentRow.original.OpeningValue)
      setUpdateReorderLevel(currentRow.original.ReOrderLevel)
      setUpdateMinBal(currentRow.original.MinBalance)
      setUpdateMaxBal(currentRow.original.MaxBalance)
      setUpdateHsnCode(currentRow.original.HSNCode)
      setUpdateCGST(currentRow.original.CGSTPercentage)
      setUpdateIGST(currentRow.original.IGSTPercentage)
      setUpdateSGST(currentRow.original.SGSTPercentage)
    }
  };
  // console.log('idwiseData', idwiseData)

  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1)
  const columns = useMemo(() => {
    return [

      {
        accessorKey: 'ProductCode',
        header: 'Product Code',
        size: 150,
        Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
      },
      // {
      //   accessorKey: 'ProductGroupId',
      //   header: 'Product GroupId',
      //   size: 150,
      // },
      {
        accessorKey: 'ProductName',
        header: 'ProductName',
        size: 150,
      },


      {
        accessorKey: 'UOM',
        header: 'UOM',
        size: 150,
      },
      {
        accessorKey: 'SellPrice',
        header: 'Sell Price',
        size: 150,
      },
      {
        accessorKey: 'PurchasePrice',
        header: 'Purchase Price',
        size: 150,
      },
      {
        accessorKey: 'Location',
        header: 'Location',
        size: 150,
      },
      {
        accessorKey: 'OpeningValue',
        header: 'OpeningValue',
        size: 150,
      },
      {
        accessorKey: 'ReOrderLevel',
        header: 'Reorder Level',
        size: 150,
      },

      {
        accessorKey: 'MinBalance',
        header: 'Min Balance',
        size: 150,
      },
      {
        accessorKey: 'MaxBalance',
        header: 'Max Balance',
        size: 150,
      },
      {
        accessorKey: 'HSNCode',
        header: 'HSN',
        size: 150,
      },
      {
        accessorKey: 'CGSTPercentage',
        header: 'CGST%',
        size: 150,
      },
      {
        accessorKey: 'SGSTPercentage',
        header: 'SGST%',
        size: 150,
      },
      {
        accessorKey: 'IGSTPercentage',
        header: 'IGST%',
        size: 150,
      },


      {
        id: 'actions',
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => (
          <IconButton
            onClick={(event) => handleMenuOpen(event, row)} // Open the menu on click
          >
            <MoreVertIcon />
          </IconButton>
        ),

      },
    ];
  }, [pageNo]);

  //integration
  const [productCode, setProductCode] = useState('');
  const [updateproductCode, setUpdateProductCode] = useState('');
  const [productGroup, setProductGroup] = useState('');
  const [updateproductGroup, setUpdateProductGroup] = useState('');
  const [productName, setProductName] = useState('');
  const [updateproductName, setUpdateProductName] = useState('');
  const [UOM, setUOM] = useState('');
  const [updateUOM, setUpdateUOM] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  const [updatesalesPrice, setUpdateSalesPrice] = useState('');

  const [purchasePrice, setPurchasePrice] = useState('');
  const [updatepurchasePrice, setUpdatePurchasePrice] = useState('');
  const [location, setLocation] = useState('');
  const [updatelocation, setUpdateLocation] = useState('');
  const [openingValue, setOpeningValue] = useState('');
  const [updateopeningValue, setUpdateOpeningValue] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [updatereorderLevel, setUpdateReorderLevel] = useState('');
  const [minbal, setMinBal] = useState('');
  const [updateminbal, setUpdateMinBal] = useState('');
  const [maxbal, setMaxBal] = useState('');
  const [updatemaxbal, setUpdateMaxBal] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [updatehsnCode, setUpdateHsnCode] = useState('');
  const [CGST, setCGST] = useState('');
  const [updateCGST, setUpdateCGST] = useState('');
  const [IGST, setIGST] = useState('');
  const [updateIGST, setUpdateIGST] = useState('');
  const [SGST, setSGST] = useState('');
  const [updateSGST, setUpdateSGST] = useState('');


  const CreateProductMaster = () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("ProductCode", productCode);
    urlencoded.append("ProductGroupId", selectedGroupOption);
    urlencoded.append("ProductName", productName);
    urlencoded.append("UOM", UOM);
    urlencoded.append("SellPrice", salesPrice);
    urlencoded.append("PurchasePrice", purchasePrice);
    urlencoded.append("Location", location);
    urlencoded.append("OpeningValue", openingValue);
    urlencoded.append("ReOrderLevel", reorderLevel);
    urlencoded.append("MinBalance", minbal);
    urlencoded.append("MaxBalance", maxbal);
    urlencoded.append("HSNCode", hsnCode);
    urlencoded.append("CGSTPercentage", CGST);
    urlencoded.append("IGSTPercentage", IGST);
    urlencoded.append("SGSTPercentage", SGST);
    const requestOptions = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        "https://arohanagroapi.microtechsolutions.co.in/php/postproductmaster.php",
        urlencoded,
        requestOptions
      )
      .then((response) => {
        console.log("API Response:", response.data);
        fetchData();
        handleClearTemplate();
        handleDrawerClose()
        toast.success("Product Master created successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleClearTemplate = () => {
    setProductCode('');
    setSelectedGroupOption('');
    setProductName('');
    setUOM('');
    setSalesPrice('');
    setPurchasePrice(' ');
    setLocation('');
    setOpeningValue('');
    setReorderLevel('');
    setMinBal('');
    setMaxBal('');
    setHsnCode('');
    setCGST(' ');
    setIGST('')
  }

  const [productsGroups, setProductsGroups] = useState([]);
  const [materialGroupError, setMaterialGroupError] = useState('');
  // Fetch data from API material group
  useEffect(() => {
    axios
      .get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productmaster")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          // Extract unique MaterialGroupId values
          const uniqueGroups = [...new Set(response.data.map(item => item.ProductGroupId))];
          setProductsGroups(uniqueGroups);

        }

      })
      .catch((error) => {
        console.error("Error fetching Material Groups:", error);
        setMaterialGroupError("Failed to load Material Groups.");
      });
  }, []);

  //tble data
  const [totalPages, setTotalPages] = useState(1);
  const fetchData = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://arohanagroapi.microtechsolutions.co.in/php/get/gettblpage.php?Table=productmaster&PageNo=${pageNo}`, requestOptions);
      // const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=productmaster", requestOptions);
      const result = await response.json();

      // console.log("Fetched result:", result);  // Log the fetched data before setting it

      setData(result.data);
      setTotalPages(result.total_pages)

      // setID(result.map(item => item.Id));
      // console.log('id', setID)

    } catch (error) {
      console.error(error);
    }
  };
  // console.log("result", data);
  useEffect(() => {
    fetchData();
  }, []);

  // edit drawer
  const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);
  const handleEditDrawerOpen = () => {
    handleEdit()
    setEditIsDrawerOpen(true);
    handleMenuOpen(false)

  };

  const handleEditDrawerClose = () => {
    setEditIsDrawerOpen(false);
  };
  // console.log(idwiseData)


  //get Data by Id
  const fetchDataById = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Id=${idwiseData}&Table=productmaster`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setUpdateProductCode(result.ProductCode)
        setUpdateProductGroup(result.ProductGroupId)
        setUpdateProductName(result.ProductName)
        setUpdateUOM(result.UOM)
        setUpdateSalesPrice(result.SellPrice)
        setUpdatePurchasePrice(result.PurchasePrice)
        setUpdateLocation(result.Location)
        setUpdateOpeningValue(result.OpeningValue)
        setUpdateReorderLevel(result.ReOrderLevel)
        setUpdateMinBal(result.MinBalance)
        setUpdateMaxBal(result.MaxBalance)
        setUpdateHsnCode(result.HSNCode)
        setUpdateCGST(result.CGSTPercentage)
        setUpdateIGST(result.IGSTPercentage)
        setUpdateSGST(result.SGSTPercentage)
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    // CreateMaterialMaster();
    fetchDataById(idwiseData)
  }, [idwiseData]);

  //update 
  const UpdateProductMaster = () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("ProductCode", updateproductCode);
    urlencoded.append("ProductGroupId", selectedGroupOption);
    urlencoded.append("ProductName", updateproductName);
    urlencoded.append("UOM", updateUOM);
    urlencoded.append("SellPrice", updatesalesPrice);
    urlencoded.append("PurchasePrice", updatepurchasePrice);
    urlencoded.append("Location", updatelocation);
    urlencoded.append("OpeningValue", updateopeningValue);
    urlencoded.append("ReOrderLevel", updatereorderLevel);
    urlencoded.append("MinBalance", updateminbal);
    urlencoded.append("MaxBalance", updatemaxbal);
    urlencoded.append("HSNCode", updatehsnCode);
    urlencoded.append("CGSTPercentage", updateCGST);
    urlencoded.append("IGSTPercentage", updateIGST);
    urlencoded.append("SGSTPercentage", updateSGST);
    urlencoded.append("Id", idwiseData);
    const requestOptions = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        "https://arohanagroapi.microtechsolutions.co.in/php/updateproductmaster.php",
        urlencoded,
        requestOptions
      )
      .then((response) => {
        console.log("API Response:", response.data);
        toast.success("Product Master Updated successfully");
        handleEditDrawerClose()
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //for delete 
  const DeleteProductMaster = () => {
    // if (currentRow) {
    //   console.log("Editing item with ID:", currentRow.original.Id);

    // }
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    const url = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=productmaster&Id=${currentRow.original.Id}`
    console.log(url)
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)

        toast.success("Product deleted successfully!");


      })
      .catch((error) => console.error(error));
  }



  return (
    <Box>

      <Box textAlign={'center'}>
        <Typography variant='h4' color='var(--complementary-color)'><b>Product Master</b></Typography>
      </Box>


      <Box sx={{
        //  background: 'rgb(236, 253, 230)', 
        p: 5, height: 'auto'
      }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Product Master </Button>
        </Box>


        <Box mt={4} m={2}>
          <MaterialReactTable
            columns={columns}
            data={data}
            enablePagination={false}
            muiTableHeadCellProps={{
              sx: {

                backgroundColor: '#E9ECEF',
                color: "black",
                fontSize: "16px",
              },
            }}

            renderBottomToolbarCustomActions={() => (
              <Box mt={2} alignItems={'center'} display={'flex'} justifyContent="flex-end"
                width="100%" >
                <FirstPageIcon sx={{ cursor: "pointer" }} onClick={() => setPageNo(1)} />
                <KeyboardArrowLeftIcon sx={{ cursor: "pointer" }} onClick={() =>
                  setPageNo((prev) => Math.max(Number(prev) - 1, 1))
                } />
                <Box > Page No </Box>
                <TextField
                  sx={{ width: "4.5%", ml: 1 ,
                    '@media (max-width: 768px)': {
                      width: '10%',
                  },
                  }}
                  value={pageNo}
                  onChange={(e) => setPageNo(e.target.value)}
                  size="small" />
                <KeyboardArrowRightIcon sx={{ cursor: "pointer" }} onClick={() => setPageNo((prev) => Number(prev) + 1)} />
                <LastPageIcon sx={{ cursor: "pointer" }} onClick={() => setPageNo(totalPages)} />
                Total Pages : {totalPages}
              </Box>

            )}

          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem


              onClick={handleEditDrawerOpen}

            >Edit </MenuItem>
            <MenuItem onClick={DeleteProductMaster} >Delete</MenuItem>
          </Menu>
        </Box>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "650px",
              zIndex: 1000,
            },
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
            <Typography m={2} variant="h6"><b>Create Product Master</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />


          {/* <Box display="flex" alignItems="center" gap={2}>
              <Box flex={1} m={1}>
                <Box>
                  <Typography>Product Code</Typography>
                  <TextField
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    size="small" margin="normal" placeholder="Enter Product Code" fullWidth />
                </Box>
              </Box>

           
                <Box flex={1}>
                  <Typography>Product Group</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedGroupOption}
                      onChange={(event) => setSelectedGroupOption(event.target.value)}
                    >
                      {groupOption.length > 0 ? (
                        groupOption.map((option) => (
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
         


            </Box> */}

          <Box display="flex" alignItems="center" gap={2} m={1}>
            {/* Product Code */}
            <Box flex={1} display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">Product Code</Typography>
              <TextField
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                size="small"
                placeholder="Enter Product Code"
                fullWidth
              />
            </Box>

            {/* Product Group */}
            <Box flex={1} display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">Product Group</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedGroupOption}
                  onChange={(event) => setSelectedGroupOption(event.target.value)}
                >
                  {groupOption.length > 0 ? (
                    groupOption.map((option) => (
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
          <Box display={'flex'} alignItems={"center"} gap={2} m={1} >

            <Box flex={2}>
              <Typography>Product Name</Typography>
              <TextField
                value={productName}
                onChange={(e) => setProductName(e.target.value)}

                size="small" placeholder="Enter Product Name" fullWidth />

            </Box>



            <Box flex={1}>
              <Typography>UOM</Typography>
              <FormControl fullWidth size="small">
                <Select value={UOM} onChange={(event) => setUOM(event.target.value)} displayEmpty>
                  <MenuItem value="">Select UOM</MenuItem>
                  <MenuItem value="num">No</MenuItem>

                </Select>
              </FormControl>
            </Box>
          </Box>

          {/*  */}
          {/* <Box >
          <Box display="flex" alignItems="center" gap={2} m={1}  >
            <Box flex={1} >
              <Box>
                <Typography>Sales Price</Typography>
                <TextField
                  value={salesPrice}
                  onChange={(e) => setSalesPrice(e.target.value)}

                  size="small"  placeholder="Enter Sales Price" fullWidth />

              </Box>

              <Box mt={2}>
                <Typography>Opening Value</Typography>

                <TextField
                  value={openingValue}
                  onChange={(e) => setOpeningValue(e.target.value)}
                  size="small"  placeholder="Enter Op.Value" fullWidth />

              </Box>


              <Box mt={2}>
                <Typography>CGST%</Typography>
                <TextField
                  value={CGST}
                  onChange={(e) => setCGST(e.target.value)}
                  size="small"  placeholder="Enter CGST%" fullWidth />

              </Box>





            </Box>





            <Box flex={1}  >


              <Box >
                <Typography>Purchase Price</Typography>
                <TextField
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  size="small"  placeholder="Enter Purchase Price" fullWidth />

              </Box>


              <Box mt={2} >
                <Typography>Reorder Level</Typography>
                <TextField
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  size="small"  placeholder="Enter Reorder Level" fullWidth />

              </Box>

              <Box mt={2}>
                <Typography>SGST%</Typography>
                <TextField

                  value={SGST}
                  onChange={(e) => setSGST(e.target.value)}
                  size="small"  placeholder="Enter SGST" fullWidth />

              </Box>


            </Box>


            <Box flex={2} >
              <Box>
                <Typography>Location</Typography>
                <TextField
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  size="small"  placeholder="Enter Location" fullWidth />

              </Box>

              <Box mt={2}>
                <Typography>Min Balance</Typography>
                <TextField
                  value={minbal}
                  onChange={(e) => setMinBal(e.target.value)}
                  size="small"  placeholder="Enter Min Balance" fullWidth />

              </Box>


              <Box mt={2}>
                <Typography>IGST%</Typography>
                <TextField
                  value={IGST}
                  onChange={(e) => setIGST(e.target.value)}
                  size="small"  placeholder="Enter IGST" fullWidth />

              </Box>

            </Box>


          </Box>



        </Box> */}
          <Box>
            <Box display="flex" alignItems="center" gap={2} m={1}>
              <Box flex={1}>
                <Box>
                  <Typography>Sales Price</Typography>
                  <TextField
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(e.target.value)}
                    size="small"
                    placeholder="Enter Sales Price"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>Opening Value</Typography>
                  <TextField
                    value={openingValue}
                    onChange={(e) => setOpeningValue(e.target.value)}
                    size="small"
                    placeholder="Enter Op.Value"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>CGST%</Typography>
                  <TextField
                    value={CGST}
                    onChange={(e) => setCGST(e.target.value)}
                    size="small"
                    placeholder="Enter CGST%"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box flex={1}>
                <Box>
                  <Typography>Purchase Price</Typography>
                  <TextField
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    size="small"
                    placeholder="Enter Purchase Price"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>Reorder Level</Typography>
                  <TextField
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    size="small"
                    placeholder="Enter Reorder Level"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>SGST%</Typography>
                  <TextField
                    value={SGST}
                    onChange={(e) => setSGST(e.target.value)}
                    size="small"
                    placeholder="Enter SGST"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box flex={1}> {/* Change flex from 2 to 1 */}
                <Box>
                  <Typography>Location</Typography>
                  <TextField
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    size="small"
                    placeholder="Enter Location"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>Min Balance</Typography>
                  <TextField
                    value={minbal}
                    onChange={(e) => setMinBal(e.target.value)}
                    size="small"
                    placeholder="Enter Min Balance"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>IGST%</Typography>
                  <TextField
                    value={IGST}
                    onChange={(e) => setIGST(e.target.value)}
                    size="small"
                    placeholder="Enter IGST"
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>
          </Box>


          <Box mt={1}>
            <Box display="flex" alignItems="center" gap={2} m={1}>
              <Box flex={1} >
                <Box>
                  <Typography>Max Balance</Typography>
                  <TextField
                    value={maxbal}
                    onChange={(e) => setMaxBal(e.target.value)}
                    size="small" placeholder="Enter Max Balance" fullWidth />

                </Box>
              </Box>

              <Box flex={1} >
                <Box>
                  <Typography>HSN Code</Typography>
                  <TextField
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    size="small" placeholder="Enter HSN Code" fullWidth />

                </Box>
              </Box>
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
            <Box>
              <Button sx={{
                background: 'var(--primary-color)',
              }} onClick={CreateProductMaster} variant='contained'>Save </Button>
            </Box>

            <Box>
              <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
                onClick={handleDrawerClose}
                variant='outlined'>
                <b>Cancel</b>

              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* edit drawer */}

        <Drawer
          anchor="right"
          open={isEditDrawerOpen}
          onClose={handleEditDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "650px",
              zIndex: 1000,
            },
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
            <Typography m={2} variant="h6"><b>Update Product Master</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleEditDrawerClose} />
          </Box>
          <Divider />

          {/* <Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1} m={1}>
              <Box>
                <Typography>Product Code</Typography>
                <TextField
                  value={updateproductCode}
                  onChange={(e) => setUpdateProductCode(e.target.value)}
                  size="small" margin="normal" placeholder="Enter Product Code" fullWidth />
              </Box>
            </Box>

            <Box flex={1} m={1}>



              <Box flex={1}>
                <Typography>Product Group</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedGroupOption}
                    onChange={(event) => setSelectedGroupOption(event.target.value)}
                  >
                    {groupOption.length > 0 ? (
                      groupOption.map((option) => (
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


          </Box>
        </Box> */}
          <Box display="flex" alignItems="center" gap={2} m={1}>
            {/* Product Code */}
            <Box flex={1} display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">Product Code</Typography>
              <TextField
                value={updateproductCode}
                onChange={(e) => setUpdateProductCode(e.target.value)}
                size="small"
                placeholder="Enter Product Code"
                fullWidth
              />
            </Box>

            {/* Product Group */}
            <Box flex={1} display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">Product Group</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedGroupOption}
                  onChange={(event) => setSelectedGroupOption(event.target.value)}
                >
                  {groupOption.length > 0 ? (
                    groupOption.map((option) => (
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
          <Box display={'flex'} alignItems={"center"} gap={2} m={1} >

            <Box flex={2}>
              <Typography>Product Name</Typography>
              <TextField
                value={updateproductName}
                onChange={(e) => setUpdateProductName(e.target.value)}

                size="small" placeholder="Enter Product Name" fullWidth />

            </Box>
            <Box flex={1} >
              <Typography>UOM</Typography>
              <FormControl
                fullWidth size="small" >

                <Select value={updateUOM} onChange={(e) => setUpdateUOM(e.target.value)}>
                  <MenuItem value="num">No</MenuItem>

                </Select>

              </FormControl>
            </Box>
          </Box>

          {/* 
          <Box>
            <Box display="flex" alignItems="center" m={1} gap={1} >
              <Box flex={1} >
                <Box>
                  <Typography>Sales Price</Typography>
                  <TextField
                    value={updatesalesPrice}
                    onChange={(e) => setUpdateSalesPrice(e.target.value)}

                    size="small" margin="normal" placeholder="Enter Sales Price" fullWidth />

                </Box>

                <Box>
                  <Typography>Opening Value</Typography>

                  <TextField
                    value={updateopeningValue}
                    onChange={(e) => setUpdateOpeningValue(e.target.value)}
                    size="small" margin="normal" placeholder="Enter Op.Value" fullWidth />

                </Box>


                <Box>
                  <Typography>CGST%</Typography>
                  <TextField
                    value={updateCGST}
                    onChange={(e) => setUpdateCGST(e.target.value)}
                    size="small" margin="normal" placeholder="Enter CGST%" fullWidth />

                </Box>





              </Box>





              <Box flex={1} >


                <Box >
                  <Typography>Purchase Price</Typography>
                  <TextField
                    value={updatepurchasePrice}
                    onChange={(e) => setUpdatePurchasePrice(e.target.value)}
                    size="small" margin="normal" placeholder="Enter Purchase Price" fullWidth />

                </Box>


                <Box >
                  <Typography>Reorder Level</Typography>
                  <TextField
                    value={updatereorderLevel}
                    onChange={(e) => setUpdateReorderLevel(e.target.value)}
                    size="small" margin="normal" placeholder="Enter Reorder Level" fullWidth />

                </Box>

                <Box >
                  <Typography>SGST%</Typography>
                  <TextField

                    value={updateSGST}
                    onChange={(e) => setUpdateSGST(e.target.value)}
                    size="small" margin="normal" placeholder="Enter SGST" fullWidth />

                </Box>


              </Box>


              <Box flex={1} >
                <Box>
                  <Typography>Location</Typography>
                  <TextField
                    value={updatelocation}
                    onChange={(e) => setUpdateLocation(e.target.value)}
                    size="small" margin="normal" placeholder="Enter Location" fullWidth />

                </Box>

                <Box>
                  <Typography>Min Balance</Typography>
                  <TextField
                    value={updateminbal}
                    onChange={(e) => setUpdateMinBal(e.target.value)}
                    size="small" margin="normal" placeholder="Enter Min Balance" fullWidth />

                </Box>


                <Box>
                  <Typography>IGST%</Typography>
                  <TextField
                    value={updateIGST}
                    onChange={(e) => setUpdateIGST(e.target.value)}
                    size="small" margin="normal" placeholder="Enter IGST" fullWidth />

                </Box>

              </Box>


            </Box>



          </Box> */}
          <Box>
            <Box display="flex" alignItems="center" m={1} gap={1}>
              <Box flex={1}>
                <Box>
                  <Typography>Sales Price</Typography>
                  <TextField
                    value={updatesalesPrice}
                    onChange={(e) => setUpdateSalesPrice(e.target.value)}
                    size="small"

                    placeholder="Enter Sales Price"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>Opening Value</Typography>
                  <TextField
                    value={updateopeningValue}
                    onChange={(e) => setUpdateOpeningValue(e.target.value)}
                    size="small"

                    placeholder="Enter Op.Value"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>CGST%</Typography>
                  <TextField
                    value={updateCGST}
                    onChange={(e) => setUpdateCGST(e.target.value)}
                    size="small"

                    placeholder="Enter CGST%"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box flex={1}>
                <Box>
                  <Typography>Purchase Price</Typography>
                  <TextField
                    value={updatepurchasePrice}
                    onChange={(e) => setUpdatePurchasePrice(e.target.value)}
                    size="small"

                    placeholder="Enter Purchase Price"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>Reorder Level</Typography>
                  <TextField
                    value={updatereorderLevel}
                    onChange={(e) => setUpdateReorderLevel(e.target.value)}
                    size="small"

                    placeholder="Enter Reorder Level"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>SGST%</Typography>
                  <TextField
                    value={updateSGST}
                    onChange={(e) => setUpdateSGST(e.target.value)}
                    size="small"

                    placeholder="Enter SGST"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box flex={1}> {/* Previously flex={2}, changed to flex={1} to match other columns */}
                <Box>
                  <Typography>Location</Typography>
                  <TextField
                    value={updatelocation}
                    onChange={(e) => setUpdateLocation(e.target.value)}
                    size="small"

                    placeholder="Enter Location"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>Min Balance</Typography>
                  <TextField
                    value={updateminbal}
                    onChange={(e) => setUpdateMinBal(e.target.value)}
                    size="small"

                    placeholder="Enter Min Balance"
                    fullWidth
                  />
                </Box>

                <Box mt={2}>
                  <Typography>IGST%</Typography>
                  <TextField
                    value={updateIGST}
                    onChange={(e) => setUpdateIGST(e.target.value)}
                    size="small"

                    placeholder="Enter IGST"
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>
          </Box>


          <Box>
            <Box display="flex" alignItems="center" gap={1} m={1}>
              <Box flex={1} >
                <Box>
                  <Typography>Max Balance</Typography>
                  <TextField
                    value={updatemaxbal}
                    onChange={(e) => setUpdateMaxBal(e.target.value)}
                    size="small" placeholder="Enter Max Balance" fullWidth />

                </Box>
              </Box>

              <Box flex={1} >
                <Box>
                  <Typography>HSN Code</Typography>
                  <TextField
                    value={updatehsnCode}
                    onChange={(e) => setUpdateHsnCode(e.target.value)}
                    size="small" placeholder="Enter HSN Code" fullWidth />

                </Box>
              </Box>
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
            <Box>
              <Button sx={{
                background: 'var(--primary-color)',
              }} onClick={UpdateProductMaster} variant='contained'>Save </Button>
            </Box>

            <Box>
              <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleEditDrawerClose} variant='outlined'><b>Cancel</b> </Button>
            </Box>
          </Box>
        </Drawer>



      </Box>
    </Box>
  )
}

export default ProductMaster










































// import React, { useMemo, useState } from 'react'
// import { Alert, useMediaQuery, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { MaterialReactTable, } from 'material-react-table';
// import suppliermaster from './suppliermaster.json'
// import { useTheme } from "@mui/material/styles";



// const ProductMaster = () => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const handleDrawerOpen = () => {
//     setIsDrawerOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//   };
//   //table
//   const columns = useMemo(() => {
//     return [
//       {
//         accessorKey: 'srNo',
//         header: 'Sr No',
//         size: 100,
//       },
//       {
//         accessorKey: 'AccountCode',
//         header: 'Account Code',
//         size: 150,
//       },
//       {
//         accessorKey: 'AccountName',
//         header: 'Account Name',
//         size: 150,
//       },
//       {
//         accessorKey: 'TypeCode',
//         header: 'Type Code',
//         size: 150,
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         size: 150,

//       },
//     ];
//   }, []);


//   //validation
//   const [formValues, setFormValues] = useState({
//     ProductCode: "",
//     ProductName: "",
//     UOM: "",
//     SalesPrice: "",
//     PurchasePrice: "",
//     Location: "",
//     OpValue: "",
//     ReorderLevel: "",
//     MinBalance: "",
//     CGST: "",
//     SGST: "",
//     IGST: "",
//     MaxBalance: "",
//     HSNCode: "",
//     ProductGroup: ""
//   });

//   const [formErrors, setFormErrors] = useState({});

//   const handleChange = (field, value) => {
//     setFormValues((prev) => ({ ...prev, [field]: value }));
//     setFormErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const validate = () => {
//     const errors = {};

//     if (!formValues.ProductName) errors.ProductName = "Product Name is required.";
//     if (!formValues.UOM) errors.UOM = "UOM is required.";
//     if (!formValues.SalesPrice) errors.SalesPrice = "Sales Price is required.";
//     if (!formValues.PurchasePrice) errors.PurchasePrice = "PurchasePrice is required.";
//     if (!formValues.Location) errors.Location = "Location is required.";
//     if (!formValues.OpValue) errors.OpValue = "OpValue is required.";
//     if (!formValues.ReorderLevel) errors.ReorderLevel = "Reorder Level is required.";
//     if (!formValues.MinBalance) errors.MinBalance = "MinBalance is required.";
//     if (!formValues.ProductGroup) errors.ProductGroup = "Product Group is required.";
//     if (!formValues.CGST) errors.CGST = "CGST is required.";
//     if (!formValues.SGST) errors.SGST = "SGST is required.";
//     if (!formValues.IGST) errors.IGST = "IGST is required.";
//     if (!formValues.MaxBalance) errors.MaxBalance = "MaxBalance is required.";
//     if (!formValues.HSNCode)
//       errors.HSNCode = "HSNCode is required.";


//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSave = () => {
//     if (validate()) {
//       // Perform save action
//       console.log("Form submitted:", formValues);
//       handleDrawerClose();
//     }
//   };

//   return (
//     <Box>
//       <Box sx={{ background: 'rgb(238, 246, 252)', borderRadius: '10px', p: 5, height: 'auto' }}>
//         <Box textAlign={'center'}>
//           <Typography variant='h4'><b>Product Master</b></Typography>
//         </Box>

//         <Box sx={{ display: 'flex', gap: 3 }}>
//           <Button variant="contained" onClick={handleDrawerOpen}>Create Product Master </Button>
//         </Box>


//         <Box mt={4}>
//           <MaterialReactTable
//             columns={columns}
//             data={suppliermaster}
//             enableColumnOrdering
//             enableColumnResizing
//           />
//         </Box>

//         <Drawer
//           anchor="right"
//           open={isDrawerOpen}
//           onClose={handleDrawerClose}
//           PaperProps={{
//             sx: {
//               borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//               width: isSmallScreen ? "100%" : "650px",
//               zIndex: 1000,
//             },
//           }}
//         >
//           <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <Typography m={2} variant="h6"><b>Create Product Master</b></Typography>
//             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
//           </Box>
//           <Divider />

//           <Box>
//             <Box display="flex" alignItems="center" gap={2}>
//               <Box flex={1} m={2}>
//                 <Box>
//                   <Typography>Product Code</Typography>
//                   <TextField onChange={(e) => handleChange("ProductName", e.target.value)} value={formValues.ProductName} error={!!formErrors.ProductName}
//                     size="small" margin="normal" placeholder="Enter Product Code" fullWidth />
//                   {(!!formErrors.ProductName) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.ProductName}
//                     </Alert>
//                   )}
//                 </Box>
//               </Box>

//               <Box flex={1} m={2}>


//                 <Box >
//                   <Typography>Product Group</Typography>
//                   <FormControl onChange={(e) => handleChange("ProductGroup", e.target.value)} value={formValues.ProductGroup} error={!!formErrors.ProductGroup}
//                     fullWidth size="small" margin="normal">


//                     <Select>
//                       <MenuItem value=""></MenuItem>
//                     </Select>
//                     {(!!formErrors.ProductGroup) && (
//                       <Alert severity="error" sx={{
//                         width: '92%',
//                         p: '2',
//                         pl: '4%', height: '23px',
//                         borderRadius: '8px',
//                         borderTopLeftRadius: '0',
//                         borderTopRightRadius: '0',
//                         fontSize: '12px',
//                         display: 'flex',
//                         backgroundColor: "#ffdddd",
//                         color: "#a00",
//                         alignItems: 'center',
//                         '& .MuiAlert-icon': {
//                           fontSize: '16px',
//                           mr: '8px',
//                         },
//                       }}>
//                         {formErrors.ProductGroup}
//                       </Alert>
//                     )}
//                   </FormControl>
//                 </Box>

//               </Box>


//             </Box>
//           </Box>

//           <Box display={'flex'} alignItems={"center"} gap={2} m={2} >

//             <Box flex={2}>
//               <Typography>Product Name</Typography>
//               <TextField onChange={(e) => handleChange("ProductName", e.target.value)} value={formValues.ProductName} error={!!formErrors.ProductName} size="small" margin="normal" placeholder="Enter Product Name" fullWidth />
//               {(!!formErrors.ProductName) && (
//                 <Alert severity="error" sx={{
//                   width: '92%',
//                   p: '2',
//                   pl: '4%', height: '23px',
//                   borderRadius: '8px',
//                   borderTopLeftRadius: '0',
//                   borderTopRightRadius: '0',
//                   fontSize: '12px',
//                   display: 'flex',
//                   backgroundColor: "#ffdddd",
//                   color: "#a00",
//                   alignItems: 'center',
//                   '& .MuiAlert-icon': {
//                     fontSize: '16px',
//                     mr: '8px',
//                   },
//                 }}>
//                   {formErrors.ProductName}
//                 </Alert>
//               )}
//             </Box>
//             <Box flex={1} >
//               <Typography>UOM</Typography>
//               <FormControl onChange={(e) => handleChange("UOM", e.target.value)} value={formValues.UOM} error={!!formErrors.UOM}
//                 fullWidth size="small" margin="normal">

//                 <Select>
//                   <MenuItem value=""></MenuItem>

//                 </Select>
//                 {(!!formErrors.UOM) && (
//                   <Alert severity="error" sx={{
//                     width: '92%',
//                     p: '2',
//                     pl: '4%', height: '23px',
//                     borderRadius: '8px',
//                     borderTopLeftRadius: '0',
//                     borderTopRightRadius: '0',
//                     fontSize: '12px',
//                     display: 'flex',
//                     backgroundColor: "#ffdddd",
//                     color: "#a00",
//                     alignItems: 'center',
//                     '& .MuiAlert-icon': {
//                       fontSize: '16px',
//                       mr: '8px',
//                     },
//                   }}>
//                     {formErrors.UOM}
//                   </Alert>
//                 )}
//               </FormControl>
//             </Box>
//           </Box>

//           {/*  */}
//           <Box>
//             <Box display="flex" alignItems="center" gap={2}>
//               <Box flex={1} m={2}>
//                 <Box>
//                   <Typography>Sales Price</Typography>
//                   <TextField onChange={(e) => handleChange("SalesPrice", e.target.value)} value={formValues.SalesPrice} error={!!formErrors.SalesPrice}
//                     size="small" margin="normal" placeholder="Enter Sales Price" fullWidth />
//                   {(!!formErrors.SalesPrice) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.SalesPrice}
//                     </Alert>
//                   )}
//                 </Box>

//                 <Box>
//                   <Typography>Op.Value</Typography>
//                   <TextField onChange={(e) => handleChange("OpValue", e.target.value)} value={formValues.OpValue} error={!!formErrors.OpValue} size="small" margin="normal" placeholder="Enter Op.Value" fullWidth />
//                   {(!!formErrors.OpValue) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.OpValue}
//                     </Alert>
//                   )}
//                 </Box>


//                 <Box>
//                   <Typography>CGST%</Typography>
//                   <TextField onChange={(e) => handleChange("CGST", e.target.value)} value={formValues.CGST} error={!!formErrors.CGST} size="small" margin="normal" placeholder="Enter CGST%" fullWidth />
//                   {(!!formErrors.CGST) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.CGST}
//                     </Alert>
//                   )}
//                 </Box>





//               </Box>





//               <Box flex={1} m={2}>


//                 <Box >
//                   <Typography>Purchase Price</Typography>
//                   <TextField onChange={(e) => handleChange("PurchasePrice", e.target.value)} value={formValues.PurchasePrice} error={!!formErrors.PurchasePrice} size="small" margin="normal" placeholder="Enter Purchase Price" fullWidth />
//                   {(!!formErrors.PurchasePrice) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.PurchasePrice}
//                     </Alert>
//                   )}
//                 </Box>


//                 <Box >
//                   <Typography>Reorder Level</Typography>
//                   <TextField onChange={(e) => handleChange("ReorderLevel", e.target.value)} value={formValues.ReorderLevel} error={!!formErrors.ReorderLevel} size="small" margin="normal" placeholder="Enter Reorder Level" fullWidth />
//                   {(!!formErrors.ReorderLevel) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.ReorderLevel}
//                     </Alert>
//                   )}
//                 </Box>

//                 <Box >
//                   <Typography>SGST%</Typography>
//                   <TextField onChange={(e) => handleChange("SGST", e.target.value)} value={formValues.SGST} error={!!formErrors.SGST} size="small" margin="normal" placeholder="Enter SGST" fullWidth />
//                   {(!!formErrors.SGST) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.SGST}
//                     </Alert>
//                   )}
//                 </Box>


//               </Box>


//               <Box flex={1} m={2}>
//                 <Box>
//                   <Typography>Location</Typography>
//                   <TextField onChange={(e) => handleChange("Location", e.target.value)} value={formValues.Location} error={!!formErrors.Location} size="small" margin="normal" placeholder="Enter Location" fullWidth />
//                   {(!!formErrors.Location) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.Location}
//                     </Alert>
//                   )}
//                 </Box>

//                 <Box>
//                   <Typography>Min Balance</Typography>
//                   <TextField onChange={(e) => handleChange("MinBalance", e.target.value)} value={formValues.MinBalance} error={!!formErrors.MinBalance} size="small" margin="normal" placeholder="Enter Min Balance" fullWidth />
//                   {(!!formErrors.MinBalance) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.MinBalance}
//                     </Alert>
//                   )}
//                 </Box>


//                 <Box>
//                   <Typography>IGST%</Typography>
//                   <TextField onChange={(e) => handleChange("IGST", e.target.value)} value={formValues.IGST} error={!!formErrors.IGST} size="small" margin="normal" placeholder="Enter IGST" fullWidth />
//                   {(!!formErrors.IGST) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.IGST}
//                     </Alert>
//                   )}
//                 </Box>

//               </Box>


//             </Box>



//           </Box>


//           <Box>
//             <Box display="flex" alignItems="center" gap={2}>
//               <Box flex={1} m={2}>
//                 <Box>
//                   <Typography>Max Balance</Typography>
//                   <TextField onChange={(e) => handleChange("MaxBalance", e.target.value)} value={formValues.MaxBalance} error={!!formErrors.MaxBalance} size="small" margin="normal" placeholder="Enter Max Balance" fullWidth />
//                   {(!!formErrors.MaxBalance) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.MaxBalance}
//                     </Alert>
//                   )}
//                 </Box>
//               </Box>

//               <Box flex={1} m={2}>
//                 <Box>
//                   <Typography>HSN Code</Typography>
//                   <TextField onChange={(e) => handleChange("HSNCode", e.target.value)} value={formValues.HSNCode} error={!!formErrors.HSNCode} size="small" margin="normal" placeholder="Enter HSN Code" fullWidth />
//                   {(!!formErrors.HSNCode) && (
//                     <Alert severity="error" sx={{
//                       width: '92%',
//                       p: '2',
//                       pl: '4%', height: '23px',
//                       borderRadius: '8px',
//                       borderTopLeftRadius: '0',
//                       borderTopRightRadius: '0',
//                       fontSize: '12px',
//                       display: 'flex',
//                       backgroundColor: "#ffdddd",
//                       color: "#a00",
//                       alignItems: 'center',
//                       '& .MuiAlert-icon': {
//                         fontSize: '16px',
//                         mr: '8px',
//                       },
//                     }}>
//                       {formErrors.HSNCode}
//                     </Alert>
//                   )}
//                 </Box>
//               </Box>
//             </Box>
//           </Box>

//           <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//             <Box>
//               <Button onClick={handleSave} variant='contained'>Save </Button>
//             </Box>

//             <Box>
//               <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
//             </Box>
//           </Box>
//         </Drawer>

//       </Box>

//     </Box>
//   )
// }

// export default ProductMaster



