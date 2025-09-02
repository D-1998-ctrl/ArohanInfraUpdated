import { useMemo, useState, useEffect } from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, useMediaQuery, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable, } from 'material-react-table';
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import axios from 'axios';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from 'moment';
import logonew from '../imgs/logo_white.png'

const PackingEntry = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        resetForm();
        setIsEditing(false);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        resetForm();
    };

    //table
    const fetchData = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        try {
            const response = await fetch(`https://arohanagroapi.microtechsolutions.net.in/php/get/gettblpage.php?Table=PackingGoods&PageNo=${pageNo}`, requestOptions);
            const result = await response.json();
           // console.log("Fetched result:", result);
            setData(result.data);
            setTotalPages(result.total_pages)

        } catch (error) {
            console.error(error);
        }
    };

    const [pageNo, setPageNo] = useState(1)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);


    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
                Cell: ({ row }) => (pageNo - 1) * 15 + row.index + 1,
            },

            {
                accessorKey: 'PackingNo',
                header: 'Packing No',
                size: 150,
            },

            {
                accessorKey: 'PackingDate.date',
                header: 'Packing Date',
                size: 150,
                Cell: ({ cell }) => <span>{moment(cell.getValue()).format('DD-MM-YYYY')}</span>,
            },


            {
                accessorKey: 'OilLit',
                header: 'Oil Lit',
                size: 150,
            },

            {
                accessorKey: 'BrandName',
                header: 'BrandName',
                size: 150,
            },

            {
                accessorKey: 'BatchNo',
                header: 'Batch No',
                size: 150,
            },

            {
                accessorKey: 'Quantity',
                header: 'Quantity',
                size: 150,
            },




            {
                header: 'Actions',
                size: 200,
                Cell: ({ row }) => (
                    <Box display="flex" gap={1}>
                        <Button
                            sx={{ background: 'var(--primary-color)' }}
                            variant="contained"
                            size="small"
                            onClick={() => {
                                // setCurrentRow(row);
                                handleEdit(row.original);
                            }}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="contained"
                            sx={{ background: 'var(--complementary-color)' }}
                            size="small"
                            onClick={() => {

                                setPreviewData({ ...row.original });
                                setPreviewOpen(true);
                                console.log('previewdata', row.original)
                            }}
                        >
                            Preview
                        </Button>

                    </Box>
                ),
            },

        ];
    }, [pageNo]);

    useEffect(() => {
        fetchData();
    }, [pageNo]);

    const [data, setData] = useState([]);
    const [packingNo, setPackingNo] = useState('');
    const [packingDate, setPackingDate] = useState(null);
    const [oilInLit, setOilInLit] = useState('');
    const [brandName, setBrandName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [idwiseData, setIdwiseData] = useState('')

    //to fetchMaterial
    const [materialOptions, setMaterialOptions] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const fetchMaterial = async () => {

        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=MaterialMaster"
            );

           // console.log("API Response:", response.data); // Debugging log

            if (Array.isArray(response.data)) {
                const materialsOptions = response.data.map((material) => ({
                    value: material?.Id || "",
                    label: material?.MaterialName,
                }));

                setMaterialOptions(materialsOptions);
            } else {
                console.error("Unexpected API response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        }

    };


    //to fetchProduct
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const fetchProduct = async () => {
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=ProductMaster"
            );

          //  console.log("API Response:", response.data); // Debugging log

            if (Array.isArray(response.data)) {
                const productsOptions = response.data.map((product) => ({
                    value: product?.Id || "",
                    label: product?.ProductName,
                }));

                setProductOptions(productsOptions);
            } else {
                console.error("Unexpected API response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        }

    };

    //fetchoprator
    const [opratorOptions, setOpratorOptions] = useState([]);
    const [selectedOprator, setSelectedOprator] = useState(null);
    const fetchOprator = async () => {
        try {
            const response = await axios.get(
                "https://arohanagroapi.microtechsolutions.net.in/php/get/gettable.php?Table=Operators"
            );

            //console.log("API Response:", response.data); // Debugging log

            if (Array.isArray(response.data)) {
                const opratorsOptions = response.data.map((oprator) => ({
                    value: oprator?.Id || "",
                    label: oprator?.OperatorName,
                }));

                setOpratorOptions(opratorsOptions);
            } else {
                console.error("Unexpected API response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    useEffect(() => {
        fetchMaterial();
        fetchProduct();
        fetchOprator()
    }, []);

    //create Entry
    const createPackingEntry = () => {

        if (!selectedOprator) {
            alert("Please select  Oprator before saving form");
            return;
        }
        if (!selectedMaterial) {
            alert("Please select  Material before saving form");
            return;
        }
        if (!oilInLit) {
            alert("Please select  oilInLit before saving form");
            return;
        }
        if (!brandName) {
            alert("Please select  brandName  before saving form");
            return;
        }
        if (!selectedProduct) {
            alert("Please select  Product before saving form");
            return;
        }
        if (!quantity) {
            alert("Please select  quantity before saving form");
            return;
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const formattedInwardDate = moment(packingDate).format("YYYY-MM-DD");
        const urlencoded = new URLSearchParams();
        urlencoded.append("PackingDate", formattedInwardDate);
        urlencoded.append("OperatorId", selectedOprator);
        urlencoded.append("MaterialId", selectedMaterial);
        urlencoded.append("OilLit", oilInLit);
        urlencoded.append("BrandName", brandName);
        urlencoded.append("BatchNo", batchNo);
        urlencoded.append("ProductId", selectedProduct);
        urlencoded.append("Quantity", quantity);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
        };

        fetch("https://arohanagroapi.microtechsolutions.net.in/php/postpackinggoods.php", requestOptions)
            .then((response) => response.json())
            .then((result) => {
            if (result.success || result.status === "success") {  // Adjust based on actual API response
                toast.success("Packing entry created successfully!");
                handleDrawerClose();
                fetchData();
            } else {
                toast.error("Failed to create packing entry. " + (result.message || ""));
                handleDrawerClose();
            }
        })
            .catch((error) => {
                console.error(error);
                toast.error("Failed to create packing entry");
            });
    }

    //setdata
    const handleEdit = (rowData) => {
       // console.log("This row has been clicked:", rowData);
        //console.log("rowData.Id:", rowData.Id);
        setIsEditing(!!rowData.Id);
        setIdwiseData(rowData.Id);
        setIsDrawerOpen(true);
        setPackingNo(rowData.PackingNo)
        setPackingDate(rowData.PackingDate?.date.split(" ")[0])
        setOilInLit(rowData.OilLit)
        setBrandName(rowData.BrandName)
        setQuantity(rowData.Quantity)
        setBatchNo(rowData.BatchNo)
        setSelectedMaterial(rowData.MaterialId)
        setSelectedProduct(rowData.ProductId)
        setSelectedOprator(rowData.OperatorId)
    };

    //update entry
    const UpdatePackingEntry = () => {
        const formattedInwardDate = moment(packingDate).format("YYYY-MM-DD");
        const urlencoded = new URLSearchParams();
        urlencoded.append("PackingDate", formattedInwardDate);
        urlencoded.append("OperatorId", selectedOprator);
        urlencoded.append("MaterialId", selectedMaterial);
        urlencoded.append("OilLit", oilInLit);
        urlencoded.append("BrandName", brandName);
        urlencoded.append("BatchNo", batchNo);
        urlencoded.append("ProductId", selectedProduct);
        urlencoded.append("Quantity", quantity);
        urlencoded.append("Id", idwiseData);

        const requestOptions = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        axios
            .post(
                "https://arohanagroapi.microtechsolutions.net.in/php/updatepackinggoods.php",
                urlencoded,
                requestOptions
            )

            .then((response) => {
                //console.log("API Response:", response.data);
                toast.success("Packing Entry Updated successfully");

                fetchData();
                handleDrawerClose()

            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    //foe delete entry
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

        //console.log("Deleted Id:", idwiseData);

        fetch(`https://arohanagroapi.microtechsolutions.net.in/php/delete/deletetable.php?Table=PackingGoods&Id=${idwiseData}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                //console.log(result);
                setOpen(false);
                handleDrawerClose();
                fetchData();
                toast.success(
                    "Packing Entry  Deleted successfully!"
                );
            })
            .catch((error) => console.error(error));
    };

    //reset form
    const resetForm = () => {
        setPackingDate("")
        setOilInLit('')
        setBrandName("")
        setQuantity("")
        setBatchNo("")
        setSelectedMaterial("")
        setSelectedProduct("")
        setSelectedOprator("")
        setPackingNo("")
    }

    ///Pagination
    const [totalPages, setTotalPages] = useState(1);

    return (
        <Box >
            <Box textAlign={'center'}>
                <Typography sx={{ color: 'var(--complementary-color)', }} variant='h4'><b>Packing Entry</b></Typography>
            </Box>

            <Box sx={{ p: 5, height: 'auto' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button sx={{ background: 'var(--complementary-color)', }} variant="contained" onClick={handleDrawerOpen}>Create Packing Entry </Button>
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
                        // muiTableBodyRowProps={({ row }) => ({
                        //     onClick: () => handleEdit(row.original),
                        //     style: { cursor: 'pointer' },
                        // })}
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

                <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="xlg" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <img src={logonew} alt="Logo" style={{ borderRadius: 50, width: "70px", height: 70 }} />
                            <Typography variant="h6">Arohan Agro Kolhapur</Typography>

                        </Box>
                        <Typography sx={{ mt: 1 }}>
                            Shop No.5 Atharva Vishwa, Near Reliance Digital Tarabai park Pitali, Ganpati Road, Kolhapur, Maharashtra 416003
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Packing Entry Preview
                        </Typography>



                    </DialogTitle>
                    <DialogContent dividers>
                        <Box>
                            {previewData ? (
                                <Box>
                                    <Box display={'flex'} justifyContent={'space-between'} gap={2}>
                                        <Typography><strong>Packing No:</strong> {previewData.PackingNo}</Typography>
                                        <Typography>
                                            <strong>Packing Date:</strong>{" "}
                                            {new Date(previewData.PackingDate.date).toLocaleDateString()}
                                        </Typography>
                                    </Box>

                                    <Box display={'flex'} justifyContent={'space-between'} gap={2} mt={2}>

                                        <Box><Typography><strong>Batch No:</strong> {previewData.BatchNo}</Typography></Box>

                                        <Box>
                                            <Typography>
                                                <strong>Oprator:</strong>{" "}

                                                {opratorOptions.find(option => option.value.toString() === previewData.OperatorId.toString())?.label || 'N/A'}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography>
                                                <strong>Material:</strong>{" "}

                                                {materialOptions.find(option => option.value.toString() === previewData.MaterialId.toString())?.label || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box><Typography><strong>Oil Lit:</strong> {previewData.OilLit}</Typography></Box>


                                    </Box>


                                    <Box display={'flex'} justifyContent={'space-between'} gap={2} mt={2}>

                                        <Box><Typography><strong>Brand Name:</strong> {previewData.BrandName}</Typography></Box>

                                        <Box>
                                            <Typography>
                                                <strong>Quantity:</strong>{" "}

                                                {previewData.Quantity}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography>
                                                <strong>Product:</strong>{" "}

                                                {productOptions.find(option => option.value.toString() === previewData.ProductId.toString())?.label || 'N/A'}
                                            </Typography>
                                        </Box>
                                        {/* <Box><Typography><strong>Oil Lit:</strong> {previewData.OilLit}</Typography></Box> */}


                                    </Box>




                                </Box>
                            ) : (
                                <Typography>No data to preview</Typography>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        {/* <Button onClick={generatePDF} color="primary" ><PrintIcon sx={{fontSize:35}}/></Button> */}
                        <Button variant='contained' onClick={() => setPreviewOpen(false)} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>


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

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgb(236, 253, 230)' }}>

                            <Typography m={2} fontWeight="bold" variant="h6">
                                {isEditing ? "Update Packing Entry" : "Create Packing Entry"}
                            </Typography>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                        </Box>
                        <Divider />

                        <Box m={2}>
                            <Box display={'flex'} gap={2} >
                                <Box flex={1} >
                                    <Typography variant="body2">Packing No</Typography>
                                    <TextField
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:after': {
                                                borderBottomWidth: 1.5,
                                                borderBottomColor: '#44ad74',
                                            }, mt: 1
                                        }}
                                        focused
                                        value={packingNo}
                                        size="small"
                                        placeholder='Packing No Autogenrated'
                                        fullWidth />
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="body2">Packing Date</Typography>

                                    <DatePicker
                                        value={packingDate ? new Date(packingDate) : null}
                                        format="dd-MM-yyyy"
                                        onChange={(newValue) => { setPackingDate(newValue); }}
                                        slotProps={{
                                            textField: { size: "small", fullWidth: true, },
                                        }}
                                        renderInput={(params) => <TextField />}
                                    />
                                </Box>
                            </Box>

                            <Box mt={2} >
                                <Typography variant="body2">Operator</Typography>
                                <FormControl fullWidth size="small" variant="standard"
                                    sx={{
                                        '& .MuiInput-underline:after': {
                                            borderBottomWidth: 1.5,
                                            borderBottomColor: '#44ad74',
                                        }, mt: 1
                                    }}
                                    focused>
                                    <Select
                                        value={selectedOprator || ""}
                                        onChange={(event) => setSelectedOprator(event.target.value)}
                                    >
                                        {opratorOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box display={'flex'} gap={2} mt={2} >
                                <Box flex={1} >
                                    <Typography variant="body2">Material</Typography>
                                    <FormControl fullWidth size="small"  variant="standard"
                                      sx={{
                                        '& .MuiInput-underline:after': {
                                          borderBottomWidth: 1.5,
                                          borderBottomColor: '#44ad74',
                                        }, mt: 1
                                      }}
                                      focused>
                                        <Select
                                            value={selectedMaterial || ""}
                                            onChange={(event) => setSelectedMaterial(event.target.value)}
                                        >
                                            {materialOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="body2">Oil (Lit)</Typography>
                                    <TextField
                                     variant="standard"
                                     sx={{
                                       '& .MuiInput-underline:after': {
                                         borderBottomWidth: 1.5,
                                         borderBottomColor: '#44ad74',
                                       }, mt: 1
                                     }}
                                     focused
                                        value={oilInLit}

                                        onChange={(e) => setOilInLit(e.target.value)}
                                        size="small"
                                        placeholder='Oil (Lit)'
                                        fullWidth />
                                </Box>
                            </Box>

                            <Box display={'flex'} gap={2} mt={2} >
                                <Box flex={1}>
                                    <Typography variant="body2">Brand Name</Typography>
                                    <TextField
                                     variant="standard"
                                     sx={{
                                       '& .MuiInput-underline:after': {
                                         borderBottomWidth: 1.5,
                                         borderBottomColor: '#44ad74',
                                       }, mt: 1
                                     }}
                                     focused
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        size="small"
                                        placeholder='Brand Name'
                                        fullWidth />
                                </Box>

                                <Box flex={1}>
                                    <Typography variant="body2">Batch No</Typography>
                                    <TextField
                                     variant="standard"
                                     sx={{
                                       '& .MuiInput-underline:after': {
                                         borderBottomWidth: 1.5,
                                         borderBottomColor: '#44ad74',
                                       }, mt: 1
                                     }}
                                     focused
                                        value={batchNo}

                                        onChange={(e) => setBatchNo(e.target.value)}
                                        size="small"
                                        placeholder='Batch No'
                                        fullWidth />
                                </Box>
                            </Box>


                            <Box display={'flex'} gap={2} mt={2} >
                                <Box flex={1} >
                                    <Typography variant="body2">Product</Typography>
                                    <FormControl fullWidth size="small"  variant="standard"
                                      sx={{
                                        '& .MuiInput-underline:after': {
                                          borderBottomWidth: 1.5,
                                          borderBottomColor: '#44ad74',
                                        }, mt: 1
                                      }}
                                      focused>
                                        <Select
                                            value={selectedProduct || ""}
                                            onChange={(event) => setSelectedProduct(event.target.value)}
                                        >
                                            {productOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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

                                        onChange={(e) => setQuantity(e.target.value)}
                                        size="small"
                                        placeholder='Quantity'
                                        fullWidth />
                                </Box>
                            </Box>


                        </Box>

                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={5}>
                            <Box>
                                <Button
                                    sx={{
                                        background: 'var(--primary-color)',
                                    }}

                                    onClick={isEditing ? UpdatePackingEntry : createPackingEntry}
                                    variant="contained"
                                >
                                    {isEditing ? "Update" : "Save"}
                                </Button>
                            </Box>

                            <Box>
                                <Button sx={{ borderColor: 'var(--complementary-color)', color: 'var(--complementary-color)' }}
                                    onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
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
                    </LocalizationProvider>
                </Drawer>
            </Box>
        </Box>
    )
}
export default PackingEntry



