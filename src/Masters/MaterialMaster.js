
import React, { useMemo, useState, useEffect } from 'react'
import { FormControl, Alert, useMediaQuery, Box, Button, Typography, TextField, Autocomplete, Drawer, Divider, Select, MenuItem, Menu, IconButton, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import axios from 'axios';
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../Components/common.css'

const MaterialMaster = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  //table
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  // Handle menu opening
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
      setUpdateMaterialCode(currentRow.original.MaterialCode)
      setSelectedGroupOption(currentRow.original.MaterialGroupId)

      setUpdateMaterialName(currentRow.original.MaterialName)
      setUpdateBrandName(currentRow.original.BrandName)
      setUpdatePurchaseRate(currentRow.original.PurchaseRate)
      setUpdateReorderLevel(currentRow.original.ReOrderLevel)
      setUpdateMinBal(currentRow.original.MinBalance)
      setUpdateMaxBal(currentRow.original.MaxBalance)
      setUpdateHSNCode(currentRow.original.HSNCode)
      setUpdateCGST(currentRow.original.CGSTPercentage)
      setUpdateSGST(currentRow.original.SGSTPercentage)
      setUpdateIGST(currentRow.original.IGSTPercentage)


    }
  };
  // console.log('idwiseData', idwiseData)

  const [data, setData] = useState([]);
  const columns = useMemo(() => [
    {
      accessorKey: 'MaterialCode',
      header: 'Material Code',
      size: 150,
    },

    {
      accessorKey: 'MaterialName',
      header: 'Material Name',
      size: 150,
    },

    {
      accessorKey: 'BrandName',
      header: 'Brand Name',
      size: 150,
    },
    {
      accessorKey: 'PurchaseRate',
      header: 'Purchase Rate',
      size: 150,
    },
    {
      accessorKey: 'ReOrderLevel',
      header: 'ReOrder Level',
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
      header: 'HSN Code',
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
      header: 'IGST',
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
  ], []);



  //fetch groupId
  const [groupOption, setGroupOption] = useState('');
  const [selectedGroupOption, setSelectedGroupOption] = useState('');

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=materialgroup"
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




  const fetchData = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=Materialmaster", requestOptions);
      const result = await response.json();

      // console.log("Fetched result:", result);

      setData(result);


    } catch (error) {
      console.error(error);
    }
  };
  // console.log("result", data);
  useEffect(() => {
    fetchData();
  }, []);

  //get Data by Id

  // const fetchDataById = () => {
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };

  //   fetch(
  //     `https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Id=${idwiseData}&Table=Materialmaster`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result)
  //       setUpdateMaterialCode(result.MaterialCode)
  //       console.log('editmaterial', result.MaterialCode);
  //       setUpdatematerialGroup(result.MaterialGroupId)
  //       console.log('editmaterial', result.MaterialGroupId);
  //       setUpdateMaterialName(result.MaterialName)
  //       setUpdateBrandName(result.BrandName)
  //       setUpdatePurchaseRate(result.PurchaseRate)
  //       setUpdateReorderLevel(result.ReOrderLevel)
  //       setUpdateMinBal(result.MinBalance)
  //       setUpdateMaxBal(result.MaxBalance)
  //       setUpdateHSNCode(result.HSNCode)
  //       setUpdateCGST(result.CGSTPercentage)
  //       setUpdateSGST(result.SGSTPercentage)
  //       setUpdateIGST(result.IGSTPercentage)


  //     })
  //     .catch((error) => console.error(error));
  // };
  const [materialGroupError, setMaterialGroupError] = useState('');

  //Intigration
  const [materialCode, setMaterialCode] = useState("");
  const [updatematerialCode, setUpdateMaterialCode] = useState("");
  const [materialGroup, setMaterialGroup] = useState("");
  const [updatematerialGroup, setUpdatematerialGroup] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [updatematerialName, setUpdateMaterialName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [updatebrandName, setUpdateBrandName] = useState("");
  const [purchaseRate, setPurchaseRate] = useState('');
  const [updatepurchaseRate, setUpdatePurchaseRate] = useState('');
  const [reorderLevel, setReorderLevel] = useState("");
  const [updatereorderLevel, setUpdateReorderLevel] = useState("");
  const [minBal, setMinBal] = useState("");
  const [updateminBal, setUpdateMinBal] = useState("");
  const [maxBal, setMaxBal] = useState("");
  const [updatemaxBal, setUpdateMaxBal] = useState("");
  const [HSNCode, setHSNCode] = useState("");
  const [updateHSNCode, setUpdateHSNCode] = useState("");
  const [CGST, setCGST] = useState("");
  const [updateCGST, setUpdateCGST] = useState("");
  const [SGST, setSGST] = useState("");
  const [updateSGST, setUpdateSGST] = useState("");
  const [IGST, setIGST] = useState("");
  const [updateIGST, setUpdateIGST] = useState("");


  const CreateMaterialMaster = () => {
    const urlencoded = new URLSearchParams();
  
    urlencoded.append("MaterialCode", materialCode);
    urlencoded.append("MaterialGroupId", selectedGroupOption);
    urlencoded.append("MaterialName", materialName);
    urlencoded.append("BrandName", brandName);
    urlencoded.append("PurchaseRate", purchaseRate);
    urlencoded.append("ReOrderLevel", reorderLevel);
    urlencoded.append("MinBalance", minBal);
    urlencoded.append("MaxBalance", maxBal);
    urlencoded.append("HSNCode", HSNCode);
    urlencoded.append("CGSTPercentage", CGST);
    urlencoded.append("SGSTPercentage", SGST);
    urlencoded.append("IGSTPercentage", IGST);

    const requestOptions = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        "https://arohanagroapi.microtechsolutions.co.in/php/postmaterialmaster.php",
        urlencoded,
        requestOptions
      )
      .then((response) => {
        console.log("API Response:", response.data);
   
        toast.success("Material Master created successfully");
        handleClearTemplate();
        fetchData();
        handleDrawerClose()
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const handleClearTemplate = () => {
    setMaterialCode('');
    setSelectedGroupOption('');
    setMaterialName('');
    setBrandName('');
    setPurchaseRate('');
    setReorderLevel('');
    setMinBal('');
    setMaxBal('');
    setHSNCode('');
    setCGST('');
    setSGST('');
    setIGST('')
  }

  // useEffect(() => {
  //   // CreateMaterialMaster();
  //   // fetchDataById(idwiseData)
  // }, [idwiseData]);


  const [materialGroups, setMaterialGroups] = useState([]);

  // Fetch data from API material group
  useEffect(() => {
    axios
      .get("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=Materialmaster")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          // Extract unique MaterialGroupId values
          const uniqueGroups = [...new Set(response.data.map(item => item.MaterialGroupId))];
          setMaterialGroups(uniqueGroups);

        }

      })
      .catch((error) => {
        console.error("Error fetching Material Groups:", error);
        setMaterialGroupError("Failed to load Material Groups.");
      });
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
  //for delete 
  // const DeleteMaterialMaster = () => {
  //   // if (currentRow) {
  //   //   console.log("Editing item with ID:", currentRow.original.Id);

  //   // }
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow"
  //   };
  //   const url = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=Materialmaster&Id=${currentRow.original.Id}`
  //   console.log(url)
  //   fetch(url, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result)

  //       toast.success("Material deleted successfully!");
  //       fetchData();

  //     })
  //     .catch((error) => console.error(error));
  // }

  const DeleteMaterialMaster = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
  
    const url = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=Materialmaster&Id=${currentRow.original.Id}`;
  
    console.log("Request URL:", url);
  
    fetch(url, requestOptions)
      .then(response => {
        console.log("Raw Response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Read response as text
      })
      .then(text => {
        try {
          const result = JSON.parse(text); // Try parsing JSON
          console.log("Parsed JSON:", result);
          toast.success("Material deleted successfully!");
          fetchData();
        } catch (error) {
          console.error("JSON Parsing Error:", error, "Response Text:", text);
        }
      })
      .catch(error => console.error("Fetch Error:", error));
  };
  

  //update 
  const UpdateMaterialMaster = () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("MaterialCode", updatematerialCode);
    urlencoded.append("MaterialGroupId", selectedGroupOption);
    urlencoded.append("MaterialName", updatematerialName);
    urlencoded.append("BrandName", updatebrandName);
    urlencoded.append("PurchaseRate", updatepurchaseRate);
    urlencoded.append("ReOrderLevel", updatereorderLevel);
    urlencoded.append("MinBalance", updateminBal);
    urlencoded.append("MaxBalance", updatemaxBal);
    urlencoded.append("HSNCode", updateHSNCode);
    urlencoded.append("CGSTPercentage", updateCGST);
    urlencoded.append("SGSTPercentage", updateSGST);
    urlencoded.append("IGSTPercentage", updateIGST);
    urlencoded.append("Id", idwiseData);
    const requestOptions = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        "https://arohanagroapi.microtechsolutions.co.in/php/updatematerialmaster.php",
        urlencoded,
        requestOptions
      )
      .then((response) => {
        console.log("API Response:", response.data);
      
        toast.success("Material Master Updated successfully");
        handleEditDrawerClose()
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };




  return (
 
      <Box >
        <Box textAlign={'center'}>
          <Typography color='var(--complementary-color)' variant='h4'><b>Material Master</b></Typography>
        </Box>

        <Box sx={{
        //  background: 'rgb(236, 253, 230)', 
        p: 5, height: 'auto'
      }} >

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Material Master </Button>
        </Box>


        <Box mt={1}>
          <MaterialReactTable
            columns={columns}
            data={data}
            muiTableHeadCellProps={{
              sx: {

                color: 'var(--primary-color)',
                mt:5
              },
            }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              // onClick={handleEdit}

              onClick={handleEditDrawerOpen}

            >Edit</MenuItem>
            <MenuItem onClick={DeleteMaterialMaster}>Delete</MenuItem>
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
            <Typography m={2} variant="h6"><b>Create Material Master</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />


          <Box m={2}>
            <Box display={'flex'} alignItems={'center'} gap={5}>
              <Box flex={1} >
                <Typography>Material Code</Typography>
                <TextField
                  value={materialCode}
                  onChange={(e) => setMaterialCode(e.target.value)}

                  size="small" placeholder='Material Code' fullWidth />
              </Box>




              {/* <Box flex={1}>
                <Typography>Material Group</Typography>
                <Autocomplete
                  options={materialGroups}
                  value={materialGroup}
                  onChange={(event, newValue) => setMaterialGroup(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Material Group"
                      size="small"
                      margin="normal"
                      fullWidth

                    />
                  )}
                />
              </Box> */}
              <Box flex={1}>
                <Typography>Material Group</Typography>
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



            <Box flex={1}  mt={2} >
              <Typography>Material Name</Typography>
              <TextField

                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}

                size="small"  placeholder='Material Name' fullWidth />

            </Box>

            <Box flex={1}  mt={2} >
              <Typography>Brand Name</Typography>
              <TextField
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}

                size="small"  placeholder='Brand Name' fullWidth />

            </Box>

            <Box display={'flex'} alignItems={'center'} gap={5} mt={2}>
              <Box flex={1}  >
                <Typography>Purchase Rate</Typography>
                <TextField
                  value={purchaseRate}
                  onChange={(e) => setPurchaseRate(e.target.value)}

                  size="small"  placeholder='Purchase Role' fullWidth />

              </Box>

              <Box flex={1} >
                <Typography>Reorder level</Typography>
                <TextField
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}

                  size="small" placeholder='Reorder level' fullWidth />

              </Box>

              <Box flex={1}  >
                <Typography>Min.Balance</Typography>
                <TextField
                  value={minBal}
                  onChange={(e) => setMinBal(e.target.value)}

                  size="small" placeholder='Min.Balance' fullWidth />

              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={5}  >
              <Box flex={1} mt={2} >
                <Typography>Max.Balance</Typography>
                <TextField
                  value={maxBal}
                  onChange={(e) => setMaxBal(e.target.value)}

                  size="small" placeholder='Max.Balance' fullWidth />

              </Box>



              <Box flex={1} mt={2}  >
                <Typography>HSN Code</Typography>
                <TextField
                  value={HSNCode}
                  onChange={(e) => setHSNCode(e.target.value)}

                  size="small"  placeholder='HSN Code' fullWidth />

              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={5}  >
              <Box flex={1} margin="normal" mt={2}>
                <Typography>CGST%</Typography>
                <TextField
                  value={CGST}
                  onChange={(e) => setCGST(e.target.value)}

                  size="small"  placeholder='CGST' fullWidth />

              </Box>

              <Box flex={1} margin="normal" mt={2} >
                <Typography>SGST%</Typography>
                <TextField
                  value={SGST}
                  onChange={(e) => setSGST(e.target.value)}

                  size="small"  placeholder='SGST' fullWidth />

              </Box>

              <Box flex={1} mt={2} >
                <Typography>IGST%</Typography>
                <TextField
                  value={IGST}
                  onChange={(e) => setIGST(e.target.value)}

                  size="small"  placeholder='IGST' fullWidth />

              </Box>
            </Box>


          </Box>



          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
            <Box>
              <Button sx={{
                background: 'var(--primary-color)',
              }} variant='contained' onClick={CreateMaterialMaster}>Save </Button>
            </Box>

            <Box>
              <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
            </Box>
          </Box>
        </Drawer>

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
            <Typography m={2} variant="h6"><b>Update Material Master</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleEditDrawerClose} />
          </Box>
          <Divider />


          <Box m={2}>
            <Box display={'flex'} alignItems={'center'} gap={5}>
              <Box flex={1} >
                <Typography>Material Code</Typography>
                <TextField
                  value={updatematerialCode}
                  onChange={(e) => setUpdateMaterialCode(e.target.value)}

                  size="small"  placeholder='Material Code' fullWidth />

              </Box>



              {/* 
              <Box flex={1}>
                <Typography>Material Group</Typography>
                <Autocomplete
                  options={materialGroups}
                  value={updatematerialGroup}
                  onChange={(event, newValue) => setUpdatematerialGroup(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Material Group"
                      size="small"
                      margin="normal"
                      fullWidth

                    />
                  )}
                />

              </Box> */}


              <Box flex={1} >
                <Typography>Material Group</Typography>
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



            <Box flex={1} mt={2}  >
              <Typography>Material Name</Typography>
              <TextField

                value={updatematerialName}
                onChange={(e) => setUpdateMaterialName(e.target.value)}

                size="small" placeholder='Material Name' fullWidth />

            </Box>

            <Box flex={1} mt={2} >
              <Typography>Brand Name</Typography>
              <TextField
                value={updatebrandName}
                onChange={(e) => setUpdateBrandName(e.target.value)}

                size="small"  placeholder='Brand Name' fullWidth />

            </Box>

            <Box display={'flex'} alignItems={'center'} gap={5} mt={1}>
              <Box flex={1} mt={2} >
                <Typography>Purchase Rate</Typography>
                <TextField
                  value={updatepurchaseRate}
                  onChange={(e) => setUpdatePurchaseRate(e.target.value)}

                  size="small"  placeholder='Purchase Role' fullWidth />

              </Box>

              <Box flex={1} mt={2}>
                <Typography>Reorder level</Typography>
                <TextField
                  value={updatereorderLevel}
                  onChange={(e) => setUpdateReorderLevel(e.target.value)}

                  size="small"  placeholder='Reorder level' fullWidth />

              </Box>

              <Box flex={1} mt={2} >
                <Typography>Min.Balance</Typography>
                <TextField
                  value={updateminBal}
                  onChange={(e) => setUpdateMinBal(e.target.value)}

                  size="small"  placeholder='Min.Balance' fullWidth />

              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={5} >
              <Box flex={1} mt={2} >
                <Typography>Max.Balance</Typography>
                <TextField
                  value={updatemaxBal}
                  onChange={(e) => setUpdateMaxBal(e.target.value)}

                  size="small"  placeholder='Max.Balance' fullWidth />

              </Box>



              <Box flex={1} mt={2}  >
                <Typography>HSN Code</Typography>
                <TextField
                  value={updateHSNCode}
                  onChange={(e) => setUpdateHSNCode(e.target.value)}

                  size="small"  placeholder='HSN Code' fullWidth />

              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={5} mt={1} >
              <Box flex={1} mt={2}>
                <Typography>CGST%</Typography>
                <TextField
                  value={updateCGST}
                  onChange={(e) => setUpdateCGST(e.target.value)}

                  size="small"  placeholder='CGST' fullWidth />

              </Box>

              <Box flex={1} mt={2} >
                <Typography>SGST%</Typography>
                <TextField
                  value={updateSGST}
                  onChange={(e) => setUpdateSGST(e.target.value)}

                  size="small"  placeholder='SGST' fullWidth />

              </Box>

              <Box flex={1}  mt={2}>
                <Typography>IGST%</Typography>
                <TextField
                  value={updateIGST}
                  onChange={(e) => setUpdateIGST(e.target.value)}

                  size="small" placeholder='IGST' fullWidth />

              </Box>
            </Box>


          </Box>



          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
            <Box>
              <Button sx={{
                background: 'var(--primary-color)',
              }} variant='contained' onClick={UpdateMaterialMaster}>Save </Button>
            </Box>

            <Box>
              <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleEditDrawerClose} variant='outlined'>Cancel </Button>
            </Box>
          </Box>
        </Drawer>
        </Box>
      </Box>


  )
}

export default MaterialMaster

