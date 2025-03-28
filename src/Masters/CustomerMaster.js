
import React, { useMemo, useState, useEffect } from 'react'
import { Menu, Autocomplete, Alert, Box, useMediaQuery, Button, IconButton, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import { useTheme } from "@mui/material/styles";
import '../Components/common.css'
import axios from 'axios';
import { toast } from "react-toastify";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneInput from "react-phone-input-2";
import qs from 'qs';

const CustomerMaster = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    handleClearTemplate();
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  //table
  //tble data

  const [data, setData] = useState([]);

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
  const [addressId, setAddressId] = useState('')
  const [accountId, setAccountId] = useState(null)
  const handleEdit = () => {
    if (currentRow) {
      // console.log("Editing item with ID:", currentRow.original);
      setIdwiseData(currentRow.original.Id)
      // console.log(currentRow.original.Id)
      setAccountId(currentRow.original.AccountId)
      // console.log(currentRow.original.AccountId)
      setUpdatedAccountName(currentRow.original.AccountName)
      setSelectedGroupOption(currentRow.original.GroupId)
      setSelectedSubGroupOption(currentRow.original.SubGroupId)
      setUpdatedCurrentBal(currentRow.original.OpeningBalance)
      setDebitCredit(currentRow.original.DrORCr)
      setUpdatedAddress1(currentRow.original.Address1)
      setUpdatedAddress2(currentRow.original.Address2)
      setSelectedCity(currentRow.original.CityId)
      setSelectedState(currentRow.original.StateId)
      setUpdatedEmail(currentRow.original.EmailId)
      setUpdatedPincode(currentRow.original.Pincode)
      setupdatedMobile(currentRow.original.MobileNo)
      SetupdatedGSTNo(currentRow.original.GSTNo)
      setupdatedIsSystem(currentRow.original.IsSystem)

      setAddressId(currentRow.original.Id)
    }
  };

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

  const fetchData = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      // const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=customermaster", requestOptions);
      const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/getaccountaddress.php?Typecode=C", requestOptions);
      const result = await response.json();
      // console.log("Fetched result:", result);
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCustomerMaster = async () => {
    try {
      // Delete Address First
      const addressUrl = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=Address&Id=${currentRow.original.Id}`;
      console.log("Deleting Address:", addressUrl);

      const addressResponse = await axios.get(addressUrl);
      console.log("Address Deleted:", addressResponse.data);

      // Delete Account After Address
      const accountUrl = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=Account&Id=${currentRow.original.AccountId}`;
      console.log("Deleting Account:", accountUrl);

      const accountResponse = await axios.get(accountUrl);
      console.log("Account Deleted:", accountResponse.data);


      toast.success("Customer master deleted successfully");
      fetchData();

    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'srNo',
        header: 'Sr No',
        size: 100,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'AccountName',
        header: 'Account Name',
        size: 150,
      },

      {
        accessorKey: 'DrORCr',
        header: 'Debit/Credit',
        size: 150,
      },

      {
        accessorKey: 'Address1',
        header: 'Address 1',
        size: 150,
      },

      {
        accessorKey: 'Address2',
        header: 'Address 2',
        size: 150,
      },

      {
        accessorKey: 'EmailId',
        header: 'Email',
        size: 150,
      },

      {
        accessorKey: 'MobileNo',
        header: 'Mobile No',
        size: 150,
      },

      {
        accessorKey: 'GSTNo',
        header: 'GST No',
        size: 150,
      },

      {
        accessorKey: 'OpeningBalance',
        header: 'Current Balance',
        size: 150,
      },

      {
        id: 'actions',
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => (
          <IconButton
            onClick={(event) => handleMenuOpen(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
        ),

      },
    ];
  }, []);

  //
  const [accountCode, setAccountCode] = useState('')

  const [AccountName, setAccountName] = useState('');
  const [updatedAccountName, setUpdatedAccountName] = useState('');

  const [currentBal, setCurrentBal] = useState('');
  const [updatedcurrentBal, setUpdatedCurrentBal] = useState('');

  const [debitCredit, setDebitCredit] = useState('');


  const [typecode, setTypecode] = useState('C');
  const [updatedtypecode, setUpdatedTypecode] = useState('C');

  const [address1, setAddress1] = useState('');
  const [updatedaddress1, setUpdatedAddress1] = useState('');


  const [address2, setAddress2] = useState('');
  const [updatedaddress2, setUpdatedAddress2] = useState('');

  const [pincode, setPincode] = useState('');
  const [updatedpincode, setUpdatedPincode] = useState('');

  const [email, setEmail] = useState('');
  const [updatedemail, setUpdatedEmail] = useState('');


  const [mobileno, setMobile] = useState('');
  const [updatedmobileno, setupdatedMobile] = useState('');


  const [urls, setURLs] = useState('');


  const [gstNo, SetGSTNo] = useState('');
  const [updatedgstNo, SetupdatedGSTNo] = useState('');


  const [issystem, setIsSystem] = useState(false);
  const [updatedissystem, setupdatedIsSystem] = useState(false);

  const [gst, setGst] = useState(false);


  const [compliance, setCompliance] = useState(false);


  //fetch groupId
  const [groupOption, setGroupOption] = useState('');
  const [selectedGroupOption, setSelectedGroupOption] = useState('');

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=accountgroup"
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


  //fetch SubgroupId
  const [subGroupOption, setSubGroupOption] = useState('');
  const [selectedSubGroupOption, setSelectedSubGroupOption] = useState('');

  const fetchSubGroup = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=subaccountgroup",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log("grp info:", result);

        const options = result.map((grp) => ({
          value: grp.Id,
          label: grp.SubGroupName,
        }));

        setSubGroupOption(options);

      })
      .catch((error) => console.error("Error fetching accounts:", error));
  };


  //for cityId
  const [options, setOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const fetchCity = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=city",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log("API Response:", result); // Debugging log


        const cityOptions = result.map((city) => ({
          value: city?.Id || "",
          label: city?.CityName,
        }));

        setOptions(cityOptions);

      })
      .catch((error) => console.error("Error fetching cities:", error));
  };
  //for state id 
  const [stateOptions, setStateOptions] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [selectedState, setSelectedState] = useState(null);


  const fetchState = async () => {
    setLoadingState(true);

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=state",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log("API Response:", result); // Debugging log


        const stateOptions = result.map((state) => ({
          value: state?.Id || "",
          label: state?.StateName || "Unknown",
        }));

        setStateOptions(stateOptions);

      })
      .catch((error) => console.error("Error fetching states:", error))
      .finally(() => setLoadingState(false));
  };


  useEffect(() => {
    fetchGroup();
    fetchSubGroup();
    fetchCity();
    fetchState()
    // fetchDataById(idwiseData)
  }, [idwiseData]);


  //create Customer Master
  const CreateCustomerMaster = async () => {
    try {
      // Post Account Data
      let accountData = qs.stringify({
        'AccountName': AccountName,
        'GroupId': selectedGroupOption,
        'SubGroupId': selectedSubGroupOption,
        'OpeningBalance': currentBal,
        'DrORCr': debitCredit,
        'TypeCode': 'C',
        'IsSystem': issystem,
        'Depriciation': "0"
      });

      let accountConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://arohanagroapi.microtechsolutions.co.in/php/postaccount.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: accountData
      };

      const accountResponse = await axios.request(accountConfig);
      console.log("Account Response:", accountResponse.data);

      let accId = parseInt(accountResponse.data.Id);
      setAccountId(accId);
      console.log('accId', accId);


      let addressData = qs.stringify({
        'AccountId': accId,
        'Address1': address1,
        'Address2': address2,
        'Address3': '',
        'AreaId': '0',
        'CityId': selectedCity,
        'StateId': selectedState,
        'Pincode': pincode,
        'CountryId': '0',
        'TelephoneNo': '0',
        'FaxNo': '0',
        'MobileNo': mobileno,
        'EmailId': email,
        'PANNo': '0',
        'GSTNo': gstNo
      });

      let addressConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://arohanagroapi.microtechsolutions.co.in/php/postaddress.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: addressData
      };

      const addressResponse = await axios.request(addressConfig);
      console.log("Address Response:", addressResponse.data);
      handleDrawerClose()
      handleClearTemplate();
      toast.success("Customer Master created successfully");
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };



  //clr all fields
  const handleClearTemplate = () => {
    setAccountCode('');
    setAccountName('');
    setSelectedGroupOption('');
    setSelectedSubGroupOption('');
    setDebitCredit(' ');
    setTypecode('');
    setAddress1('');
    setAddress2('');
    setSelectedCity('');
    setSelectedState('');
    setPincode('');
    setEmail(' ');
    setMobile('');
    setURLs('');
    SetGSTNo('');
    setIsSystem('');
    setGst(' ');
    setCompliance('');
  }


  //for update
  const UpdateCustomerMaster = async () => {
    try {
      //  Post Account Data
      let accountData = qs.stringify({
        'AccountName': updatedAccountName,
        'GroupId': selectedGroupOption,
        'SubGroupId': selectedSubGroupOption,
        'OpeningBalance': updatedcurrentBal,
        'DrORCr': debitCredit,
        'TypeCode': 'C',
        'IsSystem': updatedissystem,
        'Depriciation': "0",
        'Id': accountId
      });
      console.log("accountData", accountData)
      let accountConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://arohanagroapi.microtechsolutions.co.in/php/updateaccount.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: accountData
      };

      const updateaccountResponse = await axios.request(accountConfig);
      console.log("updateAccount Response:", updateaccountResponse.data);
      //  let accId = parseInt(updateaccountResponse.data.Id)
      //  setAccountId(accId)
      // console.log('accId', accountId)


      let addressData = qs.stringify({
        'AccountId': accountId,
        'Address1': updatedaddress1,
        'Address2': updatedaddress2,
        'Address3': '',
        'AreaId': '0',
        'CityId': selectedCity,
        'StateId': selectedState,
        'Pincode': updatedpincode,
        'CountryId': '0',
        'TelephoneNo': '0',
        'FaxNo': '0',
        'MobileNo': updatedmobileno,
        'EmailId': updatedemail,
        'PANNo': '0',
        'GSTNo': updatedgstNo,
        'Id': idwiseData
      });

      let addressConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://arohanagroapi.microtechsolutions.co.in/php/updateaddress.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: addressData
      };

      const addressResponse = await axios.request(addressConfig);
      console.log("Address Response:", addressResponse.data);
      toast.success("Customer Master updated successfully");
      handleEditDrawerClose()
      fetchData();
  
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Box textAlign={'center'} >
        <Typography variant='h4' color='var(--complementary-color)'><b>Customer Master</b></Typography>
      </Box>
      <Box sx={{
        //  background: 'rgb(236, 253, 230)', 
        p: 5, height: 'auto'
      }}>


        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button sx={{ background: 'var(--complementary-color)', }}
            variant="contained"
            onClick={handleDrawerOpen}
          >Create Customer Master </Button>
        </Box>


        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={data}
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
            <MenuItem
              onClick={handleEditDrawerOpen}
            >Edit </MenuItem>
            <MenuItem
              onClick={deleteCustomerMaster}
            >
              Delete</MenuItem>
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
            <Typography m={2} variant="h6"><b>Create Customer Master</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />

          <Box>
            <Box display="flex" alignItems="flex-start" gap={2}>
              {/* Left Column */}
              <Box flex={1}>
                {/* <Box m={1.5}>
                  <Typography>Account Code</Typography>
                  <TextField
                    value={accountCode}
                    onChange={(e) => setAccountCode(e.target.value)}
                    size="small"
                    placeholder="Enter Account Code"
                    fullWidth
                  />
                </Box> */}


                <Box m={1.5}>
                  <Typography>Account Name</Typography>
                  <TextField
                    value={AccountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    size="small"
                    placeholder="Enter Account Name"
                    fullWidth
                  />
                </Box>




                <Box m={1.5}>
                  <Typography>Group</Typography>
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

                <Box m={1.5}>
                  <Typography>Type Code</Typography>
                  <TextField
                    value={typecode}
                    disabled
                    onChange={(e) => setTypecode(e.target.value)}
                    size="small" placeholder="C" fullWidth />
                </Box>

                <Box m={1.5}>
                  <Typography>Address 1</Typography>
                  <TextField
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    size="small"
                    placeholder="Enter Address 1"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>City</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedCity || ""}
                      onChange={(event) => setSelectedCity(event.target.value)}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Pincode</Typography>
                  <TextField
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    size="small"
                    placeholder="Enter Pincode"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Mobile No</Typography>
                  <PhoneInput
                    country={"in"}
                    value={mobileno}
                    onChange={(phone) => setMobile(phone)}
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

              {/* Right Column */}
              <Box flex={1}>
                <Box m={1.5}>
                  <Typography>Opening Balance</Typography>
                  <TextField
                    value={currentBal}
                    onChange={(e) => setCurrentBal(e.target.value)}
                    size="small"
                    placeholder="Enter Opening Balance"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Sub Group </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedSubGroupOption}
                      onChange={(event) => setSelectedSubGroupOption(event.target.value)}
                    >
                      {subGroupOption.length > 0 ? (
                        subGroupOption.map((option) => (
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

                <Box m={1.5}>
                  <Typography>Debit/Credit</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={debitCredit}
                      onChange={(event) => setDebitCredit(event.target.value)}
                    >
                      <MenuItem value="D">D</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Address 2</Typography>
                  <TextField
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    size="small"
                    placeholder="Enter Address 2"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>State</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedState || ""}
                      onChange={(event) => setSelectedState(event.target.value)}
                    >
                      {stateOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Email</Typography>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    placeholder="Enter Email"
                    fullWidth
                  />
                </Box>

                {/* <Box m={1.5}>
                  <Typography>URL</Typography>
                  <TextField
                    value={urls}
                    onChange={(e) => setURLs(e.target.value)}
                    size="small"
                    placeholder="Enter URL"
                    fullWidth
                  />
                </Box> */}

                <Box m={1.5}>
                  <Typography>GST No</Typography>
                  <TextField
                    value={gstNo}
                    onChange={(e) => SetGSTNo(e.target.value)}
                    size="small"
                    placeholder="Enter GST No"
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>

            <Box m={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={issystem}
                    onChange={(event) => setIsSystem(event.target.checked)}
                  />
                }
                label="Is System"
              />
              {/* 

              <FormControlLabel
                control={<Checkbox

                  checked={gst}
                  onChange={(event) => setGst(event.target.checked)}

                />}
                label="GST "
              />


              <FormControlLabel
                control={<Checkbox
                  checked={compliance}
                  onChange={(event) => setCompliance(event.target.checked)}

                />}
                label="Compliance"
              /> */}
            </Box>

          </Box>


          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={5} mb={5} mt={3}>
            <Box>
              <Button sx={{
                background: 'var(--primary-color)',
              }} onClick={CreateCustomerMaster} variant='contained'>Save </Button>
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
            <Typography m={2} variant="h6"><b>Update Customer Master</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleEditDrawerClose} />
          </Box>
          <Divider />


          <Box>

            <Box display="flex" alignItems="flex-start" gap={2}>
              {/* Left Column */}
              <Box flex={1}>
                {/* <Box m={1.5}>
                  <Typography>Account Code</Typography>
                  <TextField
                    value={updatedaccountCode}
                    onChange={(e) => setUpdatedAccountCode(e.target.value)}
                    size="small"
                    placeholder="Enter Account Code"
                    fullWidth
                  />
                </Box> */}


                <Box m={1.5}>
                  <Typography>Account Name</Typography>
                  <TextField
                    value={updatedAccountName}
                    onChange={(e) => setUpdatedAccountName(e.target.value)}
                    size="small"
                    placeholder="Enter Account Name"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Group</Typography>
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



                <Box m={1.5}>
                  <Typography>Type Code</Typography>
                  <TextField
                    value={updatedtypecode}
                    disabled
                    onChange={(e) => setUpdatedTypecode(e.target.value)}
                    size="small" placeholder="Enter Type Code" fullWidth />
                </Box>

                <Box m={1.5}>
                  <Typography>Address 1</Typography>
                  <TextField
                    value={updatedaddress1}
                    onChange={(e) => setUpdatedAddress1(e.target.value)}
                    size="small"
                    placeholder="Enter Address 1"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>City</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedCity || ""}
                      onChange={(event) => setSelectedCity(event.target.value)}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Pincode</Typography>
                  <TextField
                    value={updatedpincode}
                    onChange={(e) => setUpdatedPincode(e.target.value)}
                    size="small"
                    placeholder="Enter Pincode"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Mobile No</Typography>
                  <PhoneInput
                    country={"in"}
                    value={updatedmobileno}
                    onChange={(phone) => setupdatedMobile(phone)}
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

              {/* Right Column */}
              <Box flex={1}>
                <Box m={1.5}>
                  <Typography>Opening Balance</Typography>
                  <TextField
                    value={updatedcurrentBal}
                    onChange={(e) => setUpdatedCurrentBal(e.target.value)}
                    size="small"
                    placeholder="Enter Current Balance"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>Sub Group Id</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedSubGroupOption}
                      onChange={(event) => setSelectedSubGroupOption(event.target.value)}
                    >
                      {subGroupOption.length > 0 ? (
                        subGroupOption.map((option) => (
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

                <Box m={1.5}>
                  <Typography>Debit/Credit</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={debitCredit}
                      onChange={(event) => setDebitCredit(event.target.value)}
                    >
                      <MenuItem value="D">D</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Address 2</Typography>
                  <TextField
                    value={updatedaddress2}
                    onChange={(e) => setUpdatedAddress2(e.target.value)}
                    size="small"
                    placeholder="Enter Address 2"
                    fullWidth
                  />
                </Box>

                <Box m={1.5}>
                  <Typography>State</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedState || ""}
                      onChange={(event) => setSelectedState(event.target.value)}
                    >
                      {stateOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box m={1.5}>
                  <Typography>Email</Typography>
                  <TextField
                    value={updatedemail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    size="small"
                    placeholder="Enter Email"
                    fullWidth
                  />
                </Box>

                {/* <Box m={1.5}>
                  <Typography>URL</Typography>
                  <TextField
                    value={updatedurls}
                    onChange={(e) => setUpdatedURLs(e.target.value)}
                    size="small"
                    placeholder="Enter URL"
                    fullWidth
                  />
                </Box> */}

                <Box m={1.5}>
                  <Typography>GST No</Typography>
                  <TextField
                    value={updatedgstNo}
                    onChange={(e) => SetupdatedGSTNo(e.target.value)}
                    size="small"
                    placeholder="Enter GST No"
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>

            <Box m={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={updatedissystem}
                    onChange={(event) => setupdatedIsSystem(event.target.checked)}
                  />
                }
                label="Is System"
              />

              {/* 
              <FormControlLabel
                control={<Checkbox

                  checked={updatedgst}
                  onChange={(event) => setupdatedGst(event.target.checked)}

                />}
                label="GST "
              />


              <FormControlLabel
                control={<Checkbox
                  checked={updatedcompliance}
                  onChange={(event) => setupdatedCompliance(event.target.checked)}

                />}
                label="Compliance"
              /> */}
            </Box>

          </Box>





          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
            <Box>
              <Button onClick={UpdateCustomerMaster} sx={{
                background: 'var(--primary-color)',
              }} variant='contained'>Save </Button>
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

export default CustomerMaster












// import React, { useMemo, useState, useEffect } from 'react'
// import { Menu, Alert, Box, useMediaQuery, Button, IconButton, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { MaterialReactTable, } from 'material-react-table';
// import suppliermaster from './suppliermaster.json'
// import { useTheme } from "@mui/material/styles";
// import '../Components/common.css'
// import axios from 'axios';
// import { toast } from "react-toastify";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import PhoneInput from "react-phone-input-2";

// const CustomerMaster = () => {
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
//   //tble data
//   const [Id, setID] = useState('')
//   const [data, setData] = useState([]);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);

//   const handleMenuOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };
//   const [idwiseData, setIdwiseData] = useState('')

//   const handleEdit = () => {
//     if (currentRow) {
//       console.log("Editing item with ID:", currentRow.original.Id);
//       setIdwiseData(currentRow.original.Id)
//     }
//   };

//   console.log('idwiseData', idwiseData)

//   // edit drawer
//   const [isEditDrawerOpen, setEditIsDrawerOpen] = useState(false);
//   const handleEditDrawerOpen = () => {
//     handleEdit()
//     setEditIsDrawerOpen(true);
//     handleMenuOpen(false)

//   };

//   const handleEditDrawerClose = () => {
//     setEditIsDrawerOpen(false);
//   };
//   console.log(idwiseData)







//   const fetchData = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow"
//     };

//     try {
//       const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=customermaster", requestOptions);
//       const result = await response.json();

//       console.log("Fetched result:", result);  // Log the fetched data before setting it

//       setData(result);
//       setID(result.map(item => item.Id));
//       console.log('id', setID)

//     } catch (error) {
//       console.error(error);
//     }
//   };
//   console.log("result", data);
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns = useMemo(() => {
//     return [
//       {
//         accessorKey: 'srNo',
//         header: 'Sr No',
//         size: 100,
//         Cell: ({ row }) => row.index + 1,
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
//         accessorKey: 'DrOrCr',
//         header: 'Debit/Credit',
//         size: 150,
//       },


//       {
//         accessorKey: 'Address1',
//         header: 'Address1',
//         size: 150,
//       },
//       {
//         accessorKey: 'Address2',
//         header: 'Address2',
//         size: 150,
//       },
//       {
//         accessorKey: 'EmailId',
//         header: 'Email Id',
//         size: 150,
//       },
//       {
//         accessorKey: 'MobileNo',
//         header: 'Mobile No',
//         size: 150,
//       },
//       {
//         accessorKey: 'GSTNo',
//         header: 'GST No',
//         size: 150,
//       },

//       {
//         accessorKey: 'CurrentBalance',
//         header: 'Current Balance',
//         size: 150,
//       },

//       {
//         id: 'actions',
//         header: 'Actions',
//         size: 150,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={(event) => handleMenuOpen(event, row)}
//           >
//             <MoreVertIcon />
//           </IconButton>
//         ),

//       },
//     ];
//   }, []);

//   //
//   const [accountCode, setAccountCode] = useState('')
//   const [updatedaccountCode, setUpdatedAccountCode] = useState('')
//   const [AccountName, setAccountName] = useState('');
//   const [updatedAccountName, setUpdatedAccountName] = useState('');

//   const [currentBal, setCurrentBal] = useState('');
//   const [updatedcurrentBal, setUpdatedCurrentBal] = useState('');

//   const [debitCredit, setDebitCredit] = useState('');
//   const [updateddebitCredit, setUpdatedDebitCredit] = useState('');

//   const [typecode, setTypecode] = useState('C');
//   const [updatedtypecode, setUpdatedTypecode] = useState('C');

//   const [address1, setAddress1] = useState('');
//   const [updatedaddress1, setUpdatedAddress1] = useState('');


//   const [address2, setAddress2] = useState('');
//   const [updatedaddress2, setUpdatedAddress2] = useState('');

//   const [pincode, setPincode] = useState('');
//   const [updatedpincode, setUpdatedPincode] = useState('');

//   const [email, setEmail] = useState('');
//   const [updatedemail, setUpdatedEmail] = useState('');


//   const [mobileno, setMobile] = useState('');
//   const [updatedmobileno, setupdatedMobile] = useState('');


//   const [urls, setURLs] = useState('');
//   const [updatedurls, setUpdatedURLs] = useState('');

//   const [gstNo, SetGSTNo] = useState('');
//   const [updatedgstNo, SetupdatedGSTNo] = useState('');


//   const [issystem, setIsSystem] = useState(false);
//   const [updatedissystem, setupdatedIsSystem] = useState(false);

//   const [gst, setGst] = useState(false);
//   const [updatedgst, setupdatedGst] = useState(false);

//   const [compliance, setCompliance] = useState(false);
//   const [updatedcompliance, setupdatedCompliance] = useState(false);

//   //fetch groupId
//   const [groupOption, setGroupOption] = useState('');
//   const [selectedGroupOption, setSelectedGroupOption] = useState('');

//   const fetchGroup = async () => {
//     try {
//       const response = await fetch(
//         "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=accountgroup"
//       );
//       const result = await response.json();

//       console.log("grp info:", result);

//       const options = result.map((grp) => ({
//         value: grp.Id,
//         label: grp.GroupName,
//       }));

//       setGroupOption(options);
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//     }
//   };


//   //fetch SubgroupId
//   const [subGroupOption, setSubGroupOption] = useState('');
//   const [selectedSubGroupOption, setSelectedSubGroupOption] = useState('');

//   const fetchSubGroup = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=subaccountgroup",
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("grp info:", result);

//         const options = result.map((grp) => ({
//           value: grp.Id,
//           label: grp.SubGroupName,
//         }));

//         setSubGroupOption(options);

//       })
//       .catch((error) => console.error("Error fetching accounts:", error));
//   };


//   //for cityId
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedCity, setSelectedCity] = useState(null);

//   const fetchCity = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=city",
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("API Response:", result); // Debugging log


//         const cityOptions = result.map((city) => ({
//           value: city?.Id || "",
//           label: city?.CityName,
//         }));

//         setOptions(cityOptions);

//       })
//       .catch((error) => console.error("Error fetching cities:", error));
//   };
//   //for state id
//   const [stateOptions, setStateOptions] = useState([]);
//   const [loadingState, setLoadingState] = useState(false);
//   const [selectedState, setSelectedState] = useState(null);


//   const fetchState = async () => {
//     setLoadingState(true);

//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=state",
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("API Response:", result); // Debugging log


//         const stateOptions = result.map((state) => ({
//           value: state?.Id || "",
//           label: state?.StateName || "Unknown",
//         }));

//         setStateOptions(stateOptions);

//       })
//       .catch((error) => console.error("Error fetching states:", error))
//       .finally(() => setLoadingState(false));
//   };


//   useEffect(() => {
//     fetchGroup();
//     fetchSubGroup();
//     fetchCity();
//     fetchState()
//     fetchDataById(idwiseData)
//   }, [idwiseData]);


//   //create Customer Master
//   const CreateCustomerMaster = () => {
//     const urlencoded = new URLSearchParams();
//     urlencoded.append("AccountCode", accountCode);
//     urlencoded.append("AccountName", AccountName);
//     urlencoded.append("GroupId", selectedGroupOption);
//     urlencoded.append("SubGroupId", selectedSubGroupOption);
//     urlencoded.append("DrOrCr", debitCredit);
//     urlencoded.append("TypeCode", "C");
//     urlencoded.append("CurrentBalance", currentBal);
//     urlencoded.append("Address1", address1);
//     urlencoded.append("Address2", address2);
//     urlencoded.append("CityId", selectedCity);
//     urlencoded.append("StateId", selectedState);
//     urlencoded.append("Pincode", pincode);
//     urlencoded.append("EmailId", email);
//     urlencoded.append("MobileNo", mobileno);
//     urlencoded.append("URL", urls);
//     urlencoded.append("GSTNo", gstNo);
//     urlencoded.append("IsSystem", issystem);
//     urlencoded.append("GST", gst);
//     urlencoded.append("Compilance", compliance);
//     const requestOptions = {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     };

//     axios
//       .post(
//         "https://arohanagroapi.microtechsolutions.co.in/php/postcustomermaster.php",
//         urlencoded,
//         requestOptions
//       )
//       .then((response) => {
//         console.log("API Response:", response.data);
//         handleClearTemplate();
//         fetchData();
//         handleDrawerClose()
//         toast.success("Customer Master created successfully");
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   const handleClearTemplate = () => {
//     setAccountCode('');
//     setAccountName('');
//     setSelectedGroupOption('');
//     setSelectedSubGroupOption('');
//     setDebitCredit(' ');
//     setTypecode('');
//     setAddress1('');
//     setAddress2('');
//     setSelectedCity('');
//     setSelectedState('');
//     setPincode('');
//     setEmail(' ');
//     setMobile('');
//     setURLs('');
//     SetGSTNo('');
//     setIsSystem('');
//     setGst(' ');
//     setCompliance('');
//   }

//   //for delete
//   const DeleteProductMaster = () => {
//     // if (currentRow) {
//     //   console.log("Editing item with ID:", currentRow.original.Id);

//     // }
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow"
//     };
//     const url = `https://arohanagroapi.microtechsolutions.co.in/php/delete/deletetable.php?Table=customermaster&Id=${currentRow.original.Id}`
//     console.log(url)
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result)

//         toast.success("customermaster deleted successfully!");


//       })
//       .catch((error) => console.error(error));
//   }

//   //get Data by Id
//   const fetchDataById = () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(
//       `https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Id=${idwiseData}&Table=customermaster`,
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result)
//         setUpdatedAccountCode(result.AccountCode)
//         setUpdatedAccountName(result.AccountName)
//         setUpdatedCurrentBal(result.CurrentBalance)
//         setUpdatedDebitCredit(result.DrOrCr)
//         setUpdatedTypecode(result.TypeCode)
//         setUpdatedAddress1(result.Address1)
//         setUpdatedAddress2(result.Address2)
//         setUpdatedPincode(result.Pincode)
//         setupdatedMobile(result.MobileNo)
//         setUpdatedURLs(result.URL)
//         SetupdatedGSTNo(result.GSTNo)
//         setupdatedIsSystem(result.IsSystem)
//         setupdatedGst(result.GST)
//         setupdatedCompliance(result.Compilance)
//         setSelectedGroupOption(result.GroupId)
//         setSelectedSubGroupOption(result.SubGroupId)
//         setSelectedCity(result.CityId)
//         setSelectedState(result.StateId)
//         setUpdatedEmail(result.EmailId)

//       })
//       .catch((error) => console.error(error));
//   };
//   // useEffect(() => {
//   //   // CreateMaterialMaster();
//   //   fetchDataById(idwiseData)
//   // }, [idwiseData])


//   //update
//   // const UpdateCustomerMaster = () => {
//   //   const urlencoded = new URLSearchParams();
//   //   urlencoded.append("AccountCode", accountCode);
//   //   urlencoded.append("AccountName", AccountName);
//   //   urlencoded.append("GroupId", selectedGroupOption);
//   //   urlencoded.append("SubGroupId", selectedSubGroupOption);
//   //   urlencoded.append("DrOrCr", debitCredit);
//   //   urlencoded.append("TypeCode", "C");
//   //   urlencoded.append("CurrentBalance", currentBal);
//   //   urlencoded.append("Address1", address1);
//   //   urlencoded.append("Address2", address2);
//   //   urlencoded.append("CityId", selectedCity);
//   //   urlencoded.append("StateId", selectedState);
//   //   urlencoded.append("Pincode", pincode);
//   //   urlencoded.append("EmailId", email);
//   //   urlencoded.append("MobileNo", mobileno);
//   //   urlencoded.append("URL", urls);
//   //   urlencoded.append("GSTNo", gstNo);
//   //   urlencoded.append("IsSystem", issystem);
//   //   urlencoded.append("GST", gst);
//   //   urlencoded.append("Compilance", compliance);
//   //   urlencoded.append("Id", idwiseData);
//   //   const requestOptions = {
//   //     headers: {
//   //       "Content-Type": "application/x-www-form-urlencoded",
//   //     },
//   //   };

//   //   axios
//   //     .post(
//   //       "https://arohanagroapi.microtechsolutions.co.in/php/updatecustomermaster.php",
//   //       urlencoded,
//   //       requestOptions
//   //     )
//   //     .then((response) => {
//   //       console.log("API Response:", response.data);
//   //       handleEditDrawerClose()
//   //       fetchData();
//   //       toast.success("Customer Master Updated successfully");
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error:", error);
//   //     });
//   // };
//   const UpdateCustomerMaster = () => {
//     const qs = require('qs');
//     let data = qs.stringify({
//       'AccountCode': updatedaccountCode,
//       'AccountName': updatedAccountName,
//       'GroupId': selectedGroupOption,
//       'SubGroupId': selectedSubGroupOption,
//       'DrOrCr': debitCredit,
//       'TypeCode': 'C',
//       'Address1': updatedaddress1,
//       'Address2': updatedaddress2,
//       'CityId': selectedCity,
//       'StateId': selectedGroupOption,
//       'Pincode': updatedpincode,
//       'EmailId': updatedemail,
//       'MobileNo': updatedmobileno,
//       'URL': updatedurls,
//       'GSTNo': updatedgstNo,
//       'IsSystem': updatedissystem,
//       'GST': updatedgst,
//       'Compilance': updatedcompliance,
//       'CurrentBalance': updatedcurrentBal,
//       'Id': idwiseData
//     });

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://arohanagroapi.microtechsolutions.co.in/php/updatecustomermaster.php',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       data: data
//     };

//     axios.request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//         handleEditDrawerClose()
//         toast.success("customer Master Updated successfully");

//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };


//   return (
//     <Box>
//       <Box textAlign={'center'} >
//         <Typography variant='h4' color='var(--complementary-color)'><b>Customer Master</b></Typography>
//       </Box>
//       <Box sx={{
//         //  background: 'rgb(236, 253, 230)',
//         p: 5, height: 'auto'
//       }}>


//         <Box sx={{ display: 'flex', gap: 3 }}>
//           <Button sx={{ background: 'var(--complementary-color)', }}
//             variant="contained"
//             onClick={handleDrawerOpen}
//           >Create Customer Master </Button>
//         </Box>


//         <Box mt={4}>
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             muiTableHeadCellProps={{
//               sx: {

//                 color: 'var(--primary-color)',

//               },
//             }}

//           />
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem
//               onClick={handleEditDrawerOpen}
//             >Edit </MenuItem>
//             <MenuItem
//               onClick={DeleteProductMaster}
//             >
//               Delete</MenuItem>
//           </Menu>
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
//           <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
//             <Typography m={2} variant="h6"><b>Create Customer Master</b></Typography>
//             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
//           </Box>
//           <Divider />

//           <Box>
//             {/* <Box display="flex" alignItems="center" gap={2}>
//               <Box flex={1} >
//                 <Box m={1.5}>
//                   <Typography>Account Code</Typography>
//                   <TextField
//                     value={accountCode}
//                     onChange={(e) => setAccountCode(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter Account Code" fullWidth />

//                 </Box>

//                 <Box m={1.5}>
//                   <Typography> Group  </Typography>
//                   <FormControl fullWidth size="small" margin="normal">

//                     <Select
//                       fullWidth
//                       size="small"
//                       value={selectedGroupOption}
//                       onChange={(event) => setSelectedGroupOption(event.target.value)}
//                     >
//                       {groupOption.length > 0 ? (
//                         groupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>

//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Current Balance</Typography>
//                   <TextField
//                     value={currentBal}
//                     onChange={(e) => setCurrentBal(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter Account Name" fullWidth />

//                 </Box>


//                 <Box m={1.5}>
//                   <Typography>Type Code</Typography>
//                   <TextField
//                     size="small" margin="normal" placeholder="Enter Type code" fullWidth />

//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 1</Typography>
//                   <TextField
//                     value={address1}
//                     onChange={(e) => setAddress1(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter Address 1" fullWidth />

//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>City </Typography>
//                   <FormControl fullWidth size="small" margin="normal">

//                     <Select
//                       fullWidth
//                       size="small"
//                       value={selectedCity || ""}
//                       onChange={(event) => setSelectedCity(event.target.value)}
//                     >
//                       {options.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>

//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Pincode</Typography>
//                   <TextField
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter pincode" fullWidth />

//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Mobile No</Typography>
//                   <PhoneInput
//                     country={"in"}
//                     value={mobileno}
//                     onChange={(phone) => setMobile(phone)}
//                     inputProps={{ name: "phone", required: true }}
//                     inputStyle={{
//                       width: "100%",
//                       height: "40px",
//                       fontSize: "16px",
//                       borderRadius: "5px",
//                     }}
//                     buttonStyle={{ borderRadius: "5px" }}
//                   />

//                 </Box>

//               </Box>





//               <Box flex={1} >


//                 <Box m={1.5}>
//                   <Typography>Account Name</Typography>
//                   <TextField
//                     value={AccountName}
//                     onChange={(e) => setAccountName(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter Account Name" fullWidth />


//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Sub Group Id</Typography>
//                   <FormControl fullWidth size="small" margin="normal">

//                     <Select
//                       fullWidth
//                       size="small"
//                       value={selectedSubGroupOption}
//                       onChange={(event) => setSelectedSubGroupOption(event.target.value)}
//                     >
//                       {subGroupOption.length > 0 ? (
//                         subGroupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>

//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Debit/Credit </Typography>
//                   <FormControl fullWidth size="small" margin="normal">

//                     <Select value={debitCredit} onChange={(event, newValue) => setDebitCredit(newValue)}  >
//                       <MenuItem value="">D</MenuItem>
//                       <MenuItem value="">C</MenuItem>
//                     </Select>

//                   </FormControl>
//                 </Box>


//                 {/* <Box m={1.5}>
//                   <Typography>Salesman </Typography>
//                   <FormControl fullWidth size="small" margin="normal">

//                     <Select>
//                       <MenuItem value=""></MenuItem>
//                     </Select>

//                   </FormControl>
//                 </Box> */}

//             {/* <Box m={1.5}>
//                   <Typography>Address 2</Typography>
//                   <TextField
//                     value={address2}
//                     onChange={(e) => setAddress2(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter Address 2" fullWidth />

//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>State</Typography>
//                   <FormControl fullWidth size="small" margin="normal">

//                     <Select
//                       fullWidth
//                       size="small"
//                       value={selectedState || ""}
//                       onChange={(event) => setSelectedState(event.target.value)}
//                     >
//                       {stateOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>

//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Email</Typography>
//                   <TextField
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter Email" fullWidth />

//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>URL</Typography>
//                   <TextField
//                     value={url}
//                     onChange={(e) => setURL(e.target.value)}
//                     size="small" margin="normal" placeholder="Enter URL" fullWidth />

//                 </Box>


//                 <Box m={1.5}>
//               <Typography>GST No</Typography>
//               <TextField
//                 value={gstNo}
//                 onChange={(e) => SetGSTNo(e.target.value)}
//                 size="small" margin="normal" placeholder="Enter GST No" fullWidth />

//             </Box>

//               </Box>

//             </Box> */}


//             <Box display="flex" alignItems="flex-start" gap={2}>
//               {/* Left Column */}
//               <Box flex={1}>
//                 <Box m={1.5}>
//                   <Typography>Account Code</Typography>
//                   <TextField
//                     value={accountCode}
//                     onChange={(e) => setAccountCode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Code"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Group</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedGroupOption}
//                       onChange={(event) => setSelectedGroupOption(event.target.value)}
//                     >
//                       {groupOption.length > 0 ? (
//                         groupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Current Balance</Typography>
//                   <TextField
//                     value={currentBal}
//                     onChange={(e) => setCurrentBal(e.target.value)}
//                     size="small"
//                     placeholder="Enter Current Balance"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Type Code</Typography>
//                   <TextField
//                     value={typecode}
//                     disabled
//                     onChange={(e) => setTypecode(e.target.value)}
//                     size="small" placeholder="Enter Type Code" fullWidth />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 1</Typography>
//                   <TextField
//                     value={address1}
//                     onChange={(e) => setAddress1(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 1"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>City</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedCity || ""}
//                       onChange={(event) => setSelectedCity(event.target.value)}
//                     >
//                       {options.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Pincode</Typography>
//                   <TextField
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Pincode"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Mobile No</Typography>
//                   <PhoneInput
//                     country={"in"}
//                     value={mobileno}
//                     onChange={(phone) => setMobile(phone)}
//                     inputProps={{ name: "phone", required: true }}
//                     inputStyle={{
//                       width: "100%",
//                       height: "40px",
//                       fontSize: "16px",
//                       borderRadius: "5px",
//                     }}
//                     buttonStyle={{ borderRadius: "5px" }}
//                   />
//                 </Box>
//               </Box>

//               {/* Right Column */}
//               <Box flex={1}>
//                 <Box m={1.5}>
//                   <Typography>Account Name</Typography>
//                   <TextField
//                     value={AccountName}
//                     onChange={(e) => setAccountName(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Name"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Sub Group Id</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedSubGroupOption}
//                       onChange={(event) => setSelectedSubGroupOption(event.target.value)}
//                     >
//                       {subGroupOption.length > 0 ? (
//                         subGroupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Debit/Credit</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={debitCredit}
//                       onChange={(event) => setDebitCredit(event.target.value)}
//                     >
//                       <MenuItem value="D">D</MenuItem>
//                       <MenuItem value="C">C</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 2</Typography>
//                   <TextField
//                     value={address2}
//                     onChange={(e) => setAddress2(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 2"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>State</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedState || ""}
//                       onChange={(event) => setSelectedState(event.target.value)}
//                     >
//                       {stateOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Email</Typography>
//                   <TextField
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     size="small"
//                     placeholder="Enter Email"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>URL</Typography>
//                   <TextField
//                     value={urls}
//                     onChange={(e) => setURLs(e.target.value)}
//                     size="small"
//                     placeholder="Enter URL"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>GST No</Typography>
//                   <TextField
//                     value={gstNo}
//                     onChange={(e) => SetGSTNo(e.target.value)}
//                     size="small"
//                     placeholder="Enter GST No"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>
//             </Box>

//             <Box m={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={6}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={issystem}
//                     onChange={(event) => setIsSystem(event.target.checked)}
//                   />
//                 }
//                 label="Is System"
//               />


//               <FormControlLabel
//                 control={<Checkbox

//                   checked={gst}
//                   onChange={(event) => setGst(event.target.checked)}

//                 />}
//                 label="GST "
//               />


//               <FormControlLabel
//                 control={<Checkbox
//                   checked={compliance}
//                   onChange={(event) => setCompliance(event.target.checked)}

//                 />}
//                 label="Compliance"
//               />
//             </Box>

//           </Box>


//           <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={5} mb={5} mt={3}>
//             <Box>
//               <Button sx={{
//                 background: 'var(--primary-color)',
//               }} onClick={CreateCustomerMaster} variant='contained'>Save </Button>
//             </Box>

//             <Box>
//               <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
//                 onClick={handleDrawerClose}
//                 variant='outlined'>
//                 <b>Cancel</b>

//               </Button>
//             </Box>
//           </Box>
//         </Drawer>


//         <Drawer
//           anchor="right"
//           open={isEditDrawerOpen}
//           onClose={handleEditDrawerClose}
//           PaperProps={{
//             sx: {
//               borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//               width: isSmallScreen ? "100%" : "650px",
//               zIndex: 1000,
//             },
//           }}
//         >
//           <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>
//             <Typography m={2} variant="h6"><b>Update Customer Master</b></Typography>
//             <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleEditDrawerClose} />
//           </Box>
//           <Divider />


//           <Box>

//             <Box display="flex" alignItems="flex-start" gap={2}>
//               {/* Left Column */}
//               <Box flex={1}>
//                 <Box m={1.5}>
//                   <Typography>Account Code</Typography>
//                   <TextField
//                     value={updatedaccountCode}
//                     onChange={(e) => setUpdatedAccountCode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Code"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Group</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedGroupOption}
//                       onChange={(event) => setSelectedGroupOption(event.target.value)}
//                     >
//                       {groupOption.length > 0 ? (
//                         groupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Current Balance</Typography>
//                   <TextField
//                     value={updatedcurrentBal}
//                     onChange={(e) => setUpdatedCurrentBal(e.target.value)}
//                     size="small"
//                     placeholder="Enter Current Balance"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Type Code</Typography>
//                   <TextField
//                     value={updatedtypecode}
//                     disabled
//                     onChange={(e) => setUpdatedTypecode(e.target.value)}
//                     size="small" placeholder="Enter Type Code" fullWidth />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 1</Typography>
//                   <TextField
//                     value={updatedaddress1}
//                     onChange={(e) => setUpdatedAddress1(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 1"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>City</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedCity || ""}
//                       onChange={(event) => setSelectedCity(event.target.value)}
//                     >
//                       {options.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Pincode</Typography>
//                   <TextField
//                     value={updatedpincode}
//                     onChange={(e) => setUpdatedPincode(e.target.value)}
//                     size="small"
//                     placeholder="Enter Pincode"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Mobile No</Typography>
//                   <PhoneInput
//                     country={"in"}
//                     value={updatedmobileno}
//                     onChange={(phone) => setupdatedMobile(phone)}
//                     inputProps={{ name: "phone", required: true }}
//                     inputStyle={{
//                       width: "100%",
//                       height: "40px",
//                       fontSize: "16px",
//                       borderRadius: "5px",
//                     }}
//                     buttonStyle={{ borderRadius: "5px" }}
//                   />
//                 </Box>
//               </Box>

//               {/* Right Column */}
//               <Box flex={1}>
//                 <Box m={1.5}>
//                   <Typography>Account Name</Typography>
//                   <TextField
//                     value={updatedAccountName}
//                     onChange={(e) => setUpdatedAccountName(e.target.value)}
//                     size="small"
//                     placeholder="Enter Account Name"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Sub Group Id</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedSubGroupOption}
//                       onChange={(event) => setSelectedSubGroupOption(event.target.value)}
//                     >
//                       {subGroupOption.length > 0 ? (
//                         subGroupOption.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No options available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Debit/Credit</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={updateddebitCredit}
//                       onChange={(event) => setUpdatedDebitCredit(event.target.value)}
//                     >
//                       <MenuItem value="D">D</MenuItem>
//                       <MenuItem value="C">C</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Address 2</Typography>
//                   <TextField
//                     value={updatedaddress2}
//                     onChange={(e) => setUpdatedAddress2(e.target.value)}
//                     size="small"
//                     placeholder="Enter Address 2"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>State</Typography>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={selectedState || ""}
//                       onChange={(event) => setSelectedState(event.target.value)}
//                     >
//                       {stateOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>Email</Typography>
//                   <TextField
//                     value={updatedemail}
//                     onChange={(e) => setUpdatedEmail(e.target.value)}
//                     size="small"
//                     placeholder="Enter Email"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>URL</Typography>
//                   <TextField
//                     value={updatedurls}
//                     onChange={(e) => setUpdatedURLs(e.target.value)}
//                     size="small"
//                     placeholder="Enter URL"
//                     fullWidth
//                   />
//                 </Box>

//                 <Box m={1.5}>
//                   <Typography>GST No</Typography>
//                   <TextField
//                     value={updatedgstNo}
//                     onChange={(e) => SetupdatedGSTNo(e.target.value)}
//                     size="small"
//                     placeholder="Enter GST No"
//                     fullWidth
//                   />
//                 </Box>
//               </Box>
//             </Box>

//             <Box m={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={6}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={updatedissystem}
//                     onChange={(event) => setupdatedIsSystem(event.target.checked)}
//                   />
//                 }
//                 label="Is System"
//               />


//               <FormControlLabel
//                 control={<Checkbox

//                   checked={updatedgst}
//                   onChange={(event) => setupdatedGst(event.target.checked)}

//                 />}
//                 label="GST "
//               />


//               <FormControlLabel
//                 control={<Checkbox
//                   checked={updatedcompliance}
//                   onChange={(event) => setupdatedCompliance(event.target.checked)}

//                 />}
//                 label="Compliance"
//               />
//             </Box>

//           </Box>





//           <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
//             <Box>
//               <Button onClick={UpdateCustomerMaster} sx={{
//                 background: 'var(--primary-color)',
//               }} variant='contained'>Save </Button>
//             </Box>

//             <Box>
//               <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }} onClick={handleEditDrawerClose} variant='outlined'><b>Cancel</b> </Button>
//             </Box>
//           </Box>
//         </Drawer>

//       </Box>

//     </Box>
//   )
// }

// export default CustomerMaster



