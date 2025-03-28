

import React, { useState, useEffect } from "react";
import { Drawer, useMediaQuery, Card, CardContent, Avatar, Button, TextField, Typography, Box, Paper, Chip, Divider, Autocomplete } from "@mui/material";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import "react-phone-input-2/lib/style.css";
import { InputLabel } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import Grid from '@mui/material/Grid';
import axios from "axios";
import { toast } from "react-toastify";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useTheme } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';

const Settings = () => {


    //Integration

    const [companyName, setCompanyName] = useState("");
    const [updatecompanyName, setUpdateCompanyName] = useState("");

    const [director, SetDirector] = useState("");
    const [updatedirector, SetUpdateDirector] = useState("");

    const [dessignation, setDessignation] = useState('');
    const [updatedessignation, setUpdateDessignation] = useState('');

    const [address, setAddress] = useState('');
    const [updateaddress, setUpdateAddress] = useState('');

    const [gstNum, setGSTNum] = useState("");
    const [updategstNum, setUpdateGSTNum] = useState("");

    const [pinCode, setPinCode] = useState("");
    const [updatepinCode, setupdatePinCode] = useState("");


    const [phone, setPhone] = useState("");
    const [updatephone, setupdatePhone] = useState("");

    const [faxNum, setFaxNum] = useState('');
    const [updatefaxNum, setUpdateFaxNum] = useState('');

    const [email, setEmail] = useState('');
    const [updateemail, setUpdateEmail] = useState('');

    const [website, setWebsite] = useState("");
    const [updatewebsite, setUpdateWebsite] = useState("");

    //for cityId
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);


    // useEffect(() => {
    //     const fetchCities = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await axios.get(
    //                 "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=city"
    //             );
    //             if (response.data && Array.isArray(response.data)) {
    //                 setOptions(response.data.map((city) => ({ label: city.Id, value: city.Id })));
    //             }
    //         } catch (error) {
    //             console.error("Error fetching cities:", error);
    //         }
    //         setLoading(false);
    //     };

    //     fetchCities();
    // }, []);



    const fetchCity = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=city"
            );

            console.log("API Response:", response.data); // Debugging log

            if (Array.isArray(response.data)) {
                const cityOptions = response.data.map((city) => ({
                    value: city?.Id || "",
                    label: city?.CityName,
                }));

                setOptions(cityOptions);
            } else {
                console.error("Unexpected API response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        }
        setLoading(false);
    };
    //for state id 
    const [stateOptions, setStateOptions] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [selectedState, setSelectedState] = useState(null);


    const fetchState = async () => {
        setLoadingState(true);
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=state"
            );

            console.log("API Response:", response.data); // Debugging log

            if (Array.isArray(response.data)) {
                const stateOptions = response.data.map((state) => ({
                    value: state?.Id || "",
                    label: state?.StateName || "Unknown",
                }));

                setStateOptions(stateOptions);
            } else {
                console.error("Unexpected API response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        }
        setLoading(false);
    };

    //create CompanyMaster


    const createCompanyMaster = () => {
        const urlencoded = new URLSearchParams();
        urlencoded.append("CompanyName", companyName);
        urlencoded.append("Director", director);
        urlencoded.append("Designation", dessignation);
        urlencoded.append("Address1", address);
        urlencoded.append("CityId", selectedCity?.value || "");
        urlencoded.append("StateId", selectedState?.value || "");
        urlencoded.append("Pincode", pinCode);
        urlencoded.append("MobileNo", phone);
        urlencoded.append("FaxNo", faxNum);
        urlencoded.append("EmailId", email);
        urlencoded.append("Website", website);
        urlencoded.append("GSTNo", gstNum);

        const requestOptions = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        axios
            .post(
                "https://arohanagroapi.microtechsolutions.co.in/php/postcompanymaster.php",
                urlencoded,
                requestOptions
            )
            .then((response) => {
                console.log("API Response:", response.data);

                toast.success("Comapny Master Created successfully!");
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error("Failed to Create Comapny Master");
            });
    };


    const companyMasterId = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`https://arohanagroapi.microtechsolutions.co.in/php/getbyid.php?Id=24&Table=companymaster`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setUpdateCompanyName(result.CompanyName)
                SetUpdateDirector(result.Director)
                setUpdateDessignation(result.Designation)
                setUpdateAddress(result.Address1)
                setUpdateGSTNum(result.GSTNo)

                setupdatePinCode(result.Pincode)
                setupdatePhone(result.MobileNo)
                setUpdateFaxNum(result.FaxNo)

                setUpdateEmail(result.EmailId)
                setUpdateWebsite(result.Website)
                setSelectedCity(result.CityId)

                console.log(result)
            }

            )
            .catch((error) => console.error(error));

    }

    useEffect(() => {
        companyMasterId();
    }, []);
    //for edit drawer
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };


    return (
        <Box sx={{ background: "#dfe4e9", display: "flex", justifyContent: "center", alignItems: "flex-start", p: 4, gap: 5 }}>


            <Paper elevation={3} sx={{ p: 3, textAlign: "center", width: 200, height: 450, flexShrink: 0,}}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    <b>Diksha Chavan</b>
                </Typography>
                <Avatar alt="User Avatar" sx={{ width: 100, height: 100, margin: "0 auto" }} />
                <Button variant="contained" sx={{ mt: 2 }}>Upload New Photo</Button>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Upload a new avatar.
                    Maximum upload size is 1 MB.
                </Typography>
            </Paper>


            <Paper elevation={3} sx={{ p: 3, width: 800 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography textAlign="center" variant="h5" sx={{ flex: 1, textAlign: 'center' }}>Company Information</Typography>
                    <Box onClick={handleDrawerOpen} sx={{ cursor: 'pointer' }}>
                        <BorderColorIcon />
                    </Box>
                </Box>

                <Divider sx={{ mt: 2 }} />
                <Box mt={2}>


                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Box>
                                    <Typography>Company Name</Typography>
                                    <TextField size="small" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter Company Name" fullWidth />
                                </Box>

                                <Box>
                                    <Typography>City</Typography>
                                    <Autocomplete
                                        options={options}
                                        getOptionLabel={(option) => (option?.label ? option.label.toString() : "")}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        loading={loading}
                                        onOpen={fetchCity}
                                        onChange={(event, newValue) => setSelectedCity(newValue)}
                                        renderInput={(params) => (
                                            <TextField {...params} size="small" placeholder="Enter City" fullWidth />
                                        )}
                                    />
                                </Box>

                                <Box>
                                    <Typography>GSTNum</Typography>
                                    <TextField value={gstNum} onChange={(e) => setGSTNum(e.target.value)} size="small" placeholder="Enter GST Number" fullWidth />
                                </Box>

                                <Box>
                                    <Typography>Mobile Number</Typography>
                                    <PhoneInput
                                        country={"in"}
                                        value={phone}
                                        onChange={(phone) => setPhone(phone)}
                                        inputProps={{ name: "phone", required: true }}
                                        inputStyle={{ width: "100%", height: "40px", fontSize: "16px", borderRadius: "5px" }}
                                        buttonStyle={{ borderRadius: "5px" }}
                                    />
                                </Box>

                                <Box>
                                    <Typography>Email Id</Typography>
                                    <TextField value={email} onChange={(e) => setEmail(e.target.value)} size="small" placeholder="Enter Email ID" fullWidth />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Box>
                                    <Typography>Director</Typography>
                                    <TextField value={director} onChange={(e) => SetDirector(e.target.value)} size="small" placeholder="Enter Director" fullWidth />
                                </Box>

                                <Box>
                                    <Typography>State</Typography>
                                    <Autocomplete
                                        options={stateOptions}
                                        getOptionLabel={(option) => (option?.label ? option.label.toString() : "")}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        loading={loadingState}
                                        onOpen={fetchState}
                                        onChange={(event, newValue) => setSelectedState(newValue)}
                                        renderInput={(params) => (
                                            <TextField {...params} size="small" placeholder="Enter State" fullWidth />
                                        )}
                                    />
                                </Box>

                                <Box>
                                    <Typography>Pincode</Typography>
                                    <TextField value={pinCode} onChange={(e) => setPinCode(e.target.value)} size="small" placeholder="Enter Pincode" fullWidth />
                                </Box>

                                <Box>
                                    <Typography>Fax Num</Typography>
                                    <TextField value={faxNum} onChange={(e) => setFaxNum(e.target.value)} size="small" placeholder="Enter Fax Number" fullWidth />
                                </Box>

                                <Box>
                                    <Typography>Website</Typography>
                                    <TextField value={website} onChange={(e) => setWebsite(e.target.value)} size="small" placeholder="Enter Website" fullWidth />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>



                    <Box>
                        <Typography>Designation</Typography>
                        <TextField
                            value={dessignation} onChange={(e) => setDessignation(e.target.value)}
                            size="small" margin="normal" placeholder='Designation' fullWidth />
                    </Box>

                    <Box>
                        <Typography>Address</Typography>
                        <TextField

                            value={address} onChange={(e) => setAddress(e.target.value)}
                            size="small" margin="normal" placeholder='Address' fullWidth />

                    </Box>


                    <Box display={'flex'} alignItems={"center"} gap={2} justifyContent={'center'} mt={2}>
                        <Button onClick={createCompanyMaster} variant="contained"> Save </Button>

                        <Button variant="outlined"> Cancel </Button>

                    </Box>
                </Box>
            </Paper>

            {/* drawer */}
            {/* <Box>
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
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Update Material Master</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                    </Box>
                    <Divider />


                  
                    <Grid container spacing={2}>
                       
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography>Company Name</Typography>
                                <TextField size="small" margin="normal" value={updatecompanyName} onChange={(e) => setUpdateCompanyName(e.target.value)} placeholder="Enter Company Name" fullWidth />
                            </Box>

                            <Box>
                                <Typography>CityId</Typography>
                                <Autocomplete
                                    options={options}
                                    getOptionLabel={(option) => (option?.label ? option.label.toString() : "")}
                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                    loading={loading}
                                    onOpen={fetchCity}
                                    onChange={(event, newValue) => setSelectedCity(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} size="small" margin="normal" placeholder="Enter City ID" fullWidth />
                                    )}
                                />
                            </Box>


                            <Box>
                                <Typography>GSTNum</Typography>
                                <TextField value={updategstNum} onChange={(e) => setUpdateGSTNum(e.target.value)} size="small" margin="normal" placeholder="Enter GST Number" fullWidth />

                            </Box>



                            <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <InputLabel htmlFor="phone-input">Mobile Number</InputLabel>
                                <PhoneInput
                                    country={"in"}
                                    value={updatephone}
                                    onChange={(phone) => setupdatePhone(phone)}
                                    inputProps={{
                                        name: "phone",
                                        required: true,
                                    }}
                                    inputStyle={{
                                        width: "100%",
                                        height: "40px",
                                        fontSize: "16px",
                                        borderRadius: "5px",
                                    }}
                                    buttonStyle={{ borderRadius: "5px" }}
                                />
                            </Box>

                            <Box>
                                <Typography>Email Id</Typography>
                                <TextField value={updateemail} onChange={(e) => setUpdateEmail(e.target.value)} size="small" margin="normal" placeholder="Enter Email ID" fullWidth />
                            </Box>
                        </Grid>

                      
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography>Director</Typography>
                                <TextField value={updatedirector} onChange={(e) => SetUpdateDirector(e.target.value)} size="small" margin="normal" placeholder="Enter Director" fullWidth />
                            </Box>

                            <Box>
                                <Typography>State Id</Typography>

                                <Autocomplete
                                    options={stateOptions}
                                    getOptionLabel={(option) => (option?.label ? option.label.toString() : "")}
                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                    loading={loadingState}
                                    onOpen={fetchState}
                                    onChange={(event, newValue) => setSelectedState(newValue)} // Store selected state
                                    renderInput={(params) => (
                                        <TextField {...params} size="small" margin="normal" placeholder="Enter State ID" fullWidth />
                                    )}
                                />
                            </Box>

                            <Box>
                                <Typography>Pincode</Typography>
                                <TextField value={updatepinCode} onChange={(e) => setupdatePinCode(e.target.value)} size="small" margin="normal" placeholder="Enter Pincode" fullWidth />
                            </Box>

                            <Box>
                                <InputLabel htmlFor="phone-input">Fax Num</InputLabel>
                                <TextField
                                    size="small"
                                    margin="normal"
                                    placeholder="Enter Fax Number"
                                    fullWidth
                                    value={updatefaxNum} onChange={(e) => setUpdateFaxNum(e.target.value)}
                                    style={{

                                        height: "30px",
                                        fontSize: "16px",
                                        borderRadius: "5px",
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography>Website</Typography>
                                <TextField value={updatewebsite} onChange={(e) => setUpdateWebsite(e.target.value)} size="small" margin="normal" placeholder="Enter Website" fullWidth />
                            </Box>
                        </Grid>
                    </Grid>


                    <Box>
                        <Typography>Dessignation</Typography>
                        <TextField
                            value={updatedessignation} onChange={(e) => setUpdateDessignation(e.target.value)}
                            size="small" margin="normal" placeholder='Dessignation' fullWidth />

                    </Box>

                    <Box>
                        <Typography>Adress</Typography>
                        <TextField

                            value={updateaddress} onChange={(e) => setUpdateAddress(e.target.value)}
                            size="small" margin="normal" placeholder='Adress' fullWidth />

                    </Box>


                  





                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                        <Box>
                            <Button variant='contained' >Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>
            </Box> */}
        </Box>
    );
};

export default Settings;
