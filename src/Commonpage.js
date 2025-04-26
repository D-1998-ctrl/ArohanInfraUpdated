import React from 'react'

const Commonpage = () => {
  return (
    <div style={{textAlign:'center'}} ><h3><b>This service is currently not available!!!!</b> </h3> </div>
  )
}

export default Commonpage



// ///customer for sales
// const open1 = Boolean(anchorEl);
// const [anchorEl, setAnchorEl] = useState(null);
// const handleClick = (event) => {
//   setAnchorEl(event.currentTarget);
// };

// const handleClose1 = () => {
//   setAnchorEl(null);
// };

// <Box flex={1} position="relative">
// <Typography variant="body2">Customer</Typography>

// <Button
//   variant="outlined"
//   onClick={handleClick}
//   fullWidth
//   sx={{ width: "50%", justifyContent: "space-between", textTransform: "none" }}
// >
//   {selectedAccount
//     ? accountOptions.find((a) => a.Id.toString() === selectedAccount)?.AccountName
//     : "Select Customer"}
// </Button>

// <Menu
//   anchorEl={anchorEl}
//   open={open1}
//   onClose={handleClose1}
//   PaperProps={{
//     sx: {
//       width: "40%",
//       padding: 2,
//       maxHeight: 300,
//     },
//   }}
//   anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//   transformOrigin={{ vertical: "top", horizontal: "left" }}
//   MenuListProps={{
//     disablePadding: true,
//     autoFocusItem: false,
//   }}
// >
//   <Box>
//     <TextField
//       value={text}
//       onChange={(e) => setText(e.target.value)}
//       size="small"
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <SearchIcon />
//           </InputAdornment>
//         ),
//       }}
//       placeholder="Search Customer Name"
//       fullWidth
//     />

//     <Box display="flex" gap={1} mt={1}>
//       <TextField
//         value={accountName}
//         onChange={(e) => setAccountName(e.target.value)}
//         size="small"
//         placeholder="Create New Customer"
//         fullWidth
//       />
//       <Button
//         variant="contained"
//         sx={{ background: "var(--primary-color)" }}
//         onClick={CreateCustomerMaster}
//         startIcon={<AddCircleIcon sx={{ fontSize: '20px' }} />}
//       >
//         Add
//       </Button>
//     </Box>

//     <Box mt={1} sx={{ maxHeight: 150, overflowY: "auto" }}>
//       {accountOptions.map((option) => (
//         <MenuItem
//           key={option.Id}
//           onClick={() => {
//             setSelectedAccount(option.Id.toString());
//             fetchAccounts(option.Id.toString());
//             handleClose1();
//           }}
//         >
//           {option.AccountName}
//         </MenuItem>
//       ))}
//     </Box>
//   </Box>
// </Menu>


// </Box>


