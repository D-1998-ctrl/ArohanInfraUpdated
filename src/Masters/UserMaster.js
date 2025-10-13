import React, { useMemo, useState, useEffect } from 'react'
import { Box, useMediaQuery, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import axios from 'axios';
import { useMaterialReactTable, } from "material-react-table";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';


const UserMaster = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        // resetForm();
        handleClearTemplate();
        setIsEditing(false);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    //table
    const fetchData = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        try {


            // const response = await fetch("https://arohanagroapi.microtechsolutions.co.in/php/get/gettable.php?Table=User", requestOptions);
            const response = await fetch(`https://arohanagroapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=User&PageNo=${pageNo}`, requestOptions);
            const result = await response.json();
            // console.log("Fetched result:", result);
            setData(result.data);
            setTotalPages(result.total_pages)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // fetchData();
        fetchLevel();
        fetchBranch()
    }, []);



    const [pageNo, setPageNo] = useState(1)
    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
                Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
            },

            {
                accessorKey: 'Name',
                header: 'FullName',
                size: 150,
            },
            {
                accessorKey: 'UserId',
                header: 'User Name',
                size: 150,
            },

            {
                accessorKey: 'LoginStatus',
                header: 'Login Status',
                size: 150,
                Cell: ({ row }) => (row.original.LoginStatus === 1 ? 'True' : 'False'),
            },


        ];
    }, [pageNo]);

    useEffect(() => {
        fetchData();
    }, [pageNo]);

    const [idwiseData, setIdwiseData] = useState('')
    const [data, setData] = useState([]);

    // const table = useMaterialReactTable({
    //     columns,
    //     data: data,
    //     muiTableHeadCellProps: {
    //         style: {
    //             backgroundColor: "#E9ECEF",
    //             color: "black",
    //             fontSize: "16px",
    //         },
    //     },
    //     muiTableBodyRowProps: ({ row }) => ({
    //         onClick: () => handleSubmit(row.original),
    //         style: { cursor: "pointer" },
    //     }),
    // });

    const handleSubmit = (rowData) => {
        // console.log("This row has been clicked:", rowData);

        // console.log("rowData.Id:", rowData.Id);
        setIsDrawerOpen(true);
        setIsEditing(!!rowData.Id);
        setIdwiseData(rowData.Id);
        setName(rowData.Name)
        setUser(rowData.UserId)
        setPassword(rowData.Password)
        setSelectedLevelOption(rowData.LevelId)
        setSelectedBranchOption(rowData.BranchId)
    };

    //
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Validate: Exactly 6 letters, digits, or a mix of both
        if (/^[A-Za-z0-9]{6}$/.test(value) || value === "") {
            setError(false);
        } else {
            setError(true);
        }
    };

    //fetch Level
    const [levelOption, setLevelOption] = useState([]);
    const [selectedLevelOption, setSelectedLevelOption] = useState('');

    const fetchLevel = async () => {
        try {
            const response = await fetch(
                "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=levelMaster"
            );
            const result = await response.json();

            // console.log("level info:", result);

            const options = result.map((level) => ({
                value: level.Id,
                label: level.LevelName,
            }));

            setLevelOption(options);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };


    //fetch Branch
    const [branchOption, setBranchOption] = useState([]);
    const [selectedBranchOption, setSelectedBranchOption] = useState('');

    const fetchBranch = async () => {
        try {
            const response = await fetch(
                "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=Branch"
            );
            const result = await response.json();

            // console.log("Branch info:", result);

            const options = result.map((branch) => ({
                value: branch.Id,
                label: branch.Storelocation,
            }));

            setBranchOption(options);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    //create UserMaster
    const CreateUserMaster = () => {
        if (!name || name.trim() === "") {
            toast.error("Name is required");
            return;
        }

         if (!user || user.trim() === "") {
            toast.error("User Name is required");
            return;
        }

         if (!password || password.trim() === "") {
            toast.error("password is required");
            return;
        }


        const urlencoded = new URLSearchParams();
        urlencoded.append("Name", name);
        urlencoded.append("UserId", user);
        urlencoded.append("Password", password);
        urlencoded.append("LevelId", selectedLevelOption);
        urlencoded.append("LoginStatus", false);
        urlencoded.append("BranchId", selectedBranchOption);
        urlencoded.append("CompanyId", 1);
        const requestOptions = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        axios
            .post(
                "https://arohanagroapi.microtechsolutions.net.in/php/postuser.php",
                urlencoded,
                requestOptions
            )
            .then((response) => {
                console.log("API Response:", response.data);

                toast.success("User Master created successfully");
                handleClearTemplate();
                handleDrawerClose()
                fetchData()
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    //update user
    const UpdateUserMaster = () => {
        const urlencoded = new URLSearchParams();
        urlencoded.append("Name", name);
        urlencoded.append("UserId", user);
        urlencoded.append("Password", password);
        urlencoded.append("LevelId", selectedLevelOption);
        urlencoded.append("LoginStatus", false);
        urlencoded.append("BranchId", selectedBranchOption);
        urlencoded.append("CompanyId", 1);
        urlencoded.append("Id", idwiseData);

        const requestOptions = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        axios
            .post(
                "https://arohanagroapi.microtechsolutions.net.in/php/updateuser.php",
                urlencoded,
                requestOptions
            )

            .then((response) => {
                console.log("API Response:", response.data);
                toast.success("User Master Updated successfully");
                handleClearTemplate();
                fetchData();
                handleDrawerClose()

            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    const handleClearTemplate = () => {
        setName('');
        setUser('');
        setPassword('');
        setSelectedLevelOption(' ');
        setSelectedBranchOption('');
    }


    ///Pagination
    const [totalPages, setTotalPages] = useState(1);


    return (

        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>User Master</b></Typography>
            </Box>



            <Box sx={{
                //  background: 'rgb(236, 253, 230)', 
                p: 5, height: 'auto'
            }}>

                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create User Master </Button>
                </Box>



                <Box mt={4}>
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        enablePagination={false}
                        muiTableHeadCellProps={{
                            sx: {
                                backgroundColor: '#E9ECEF',
                                color: 'black',
                                fontSize: '16px',
                            },
                        }}
                        muiTableBodyRowProps={({ row }) => ({
                            onClick: () => handleSubmit(row.original),
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
                                <Box> Page No </Box>
                                <TextField
                                    sx={{
                                        width: '4.5%', ml: 1,
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
                                Total Pages : {totalPages}
                            </Box>
                        )}
                    />
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
                        {/* <Typography m={2} variant="h6"><b>Create User Master</b></Typography> */}
                        <Typography m={2} fontWeight="bold" variant="h6">
                            {isEditing ? "Update User Master" : "Create User Master"}
                        </Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                    </Box>
                    <Divider />

                    <Box m={2}>
                        <Box>
                            <Typography>Full Name</Typography>
                            <TextField
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:after': {
                                        borderBottomWidth: 1.5,
                                        borderBottomColor: '#44ad74',
                                    }, mt: 1
                                }}
                                focused

                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                size="small" placeholder="Enter Account Name" fullWidth />
                        </Box>

                        <Box mt={2}>
                            <Typography>User Name</Typography>
                            <TextField
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:after': {
                                        borderBottomWidth: 1.5,
                                        borderBottomColor: '#44ad74',
                                    }, mt: 1
                                }}
                                focused

                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                size="small" placeholder="Enter User" fullWidth />
                        </Box>

                        <Box mt={2}>
                            <Typography>Password</Typography>
                            <TextField
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:after': {
                                        borderBottomWidth: 1.5,
                                        borderBottomColor: '#44ad74',
                                    }, mt: 1
                                }}
                                focused

                                value={password}
                                // onChange={(e) => setPassword(e.target.value)}
                                onChange={handlePasswordChange}
                                error={error}
                                helperText={error ? "Password must be exactly 6 digits" : ""}
                                size="small" placeholder="Enter 6-digit Password" fullWidth />
                        </Box>

                        <Box display={'flex'} gap={2} alignItems={'center'} mt={2}>

                            <Box flex={1}  >
                                <Typography variant="body2">Level</Typography>
                                <FormControl fullWidth size="small" variant="standard"
                                    sx={{
                                        '& .MuiInput-underline:after': {
                                            borderBottomWidth: 1.5,
                                            borderBottomColor: '#44ad74',
                                        }, mt: 1
                                    }}
                                    focused
                                >
                                    <Select
                                        value={selectedLevelOption || ""}
                                        onChange={(event) => setSelectedLevelOption(event.target.value)}
                                    >
                                        {levelOption.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box flex={1}>
                                <Typography variant="body2">Branch</Typography>
                                <FormControl fullWidth size="small" variant="standard"
                                    sx={{
                                        '& .MuiInput-underline:after': {
                                            borderBottomWidth: 1.5,
                                            borderBottomColor: '#44ad74',
                                        }, mt: 1
                                    }}
                                    focused
                                >
                                    <Select
                                        value={selectedBranchOption || ""}
                                        onChange={(event) => setSelectedBranchOption(event.target.value)}
                                    >
                                        {branchOption.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                        <Box>
                            <Button
                                sx={{
                                    background: 'var(--primary-color)',
                                }}
                                // onClick={CreateUserMaster}
                                onClick={isEditing ? UpdateUserMaster : CreateUserMaster}
                                variant="contained"
                            >
                                {isEditing ? "Update" : "Save"}
                            </Button>
                        </Box>

                        <Box>
                            <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
                                onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>
            </Box>
        </Box>
    )
}
export default UserMaster



