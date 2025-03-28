
import React from 'react';
import { Box, Typography, TextField,  Button, useMediaQuery,  InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import BaggroundImg from '../imgs/bg7.2.jpg';
import logo from '../imgs/logo5.jpeg';
import { useState } from 'react';
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Login = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [userName, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);


  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //login
const Login = () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("UserId", userName);
  urlencoded.append("Password", password);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  fetch("https://arohanagroapi.microtechsolutions.co.in/php/Usernameget.php", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result?.message === "Login successful") {
        sessionStorage.setItem("UserId", result.Id); // Store user ID
        sessionStorage.setItem("Name", result.Name); // Store user Name
        console.log("UserName:", result.Name);
        toast.success("Log In created successfully");
        navigate("/customermaster");
      } else {
        alert("Login failed! Please check your credentials.");
      }
    })
    .catch((error) => console.error(error));
};


  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${BaggroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            width: isSmallScreen ? "90vw" : "950px",
            height: isSmallScreen ? "auto" : "460px",
            borderRadius: "20px",
            overflow: "hidden",
            // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.53)",
            boxShadow: "0 4px 10px rgba(32, 30, 29, 0.22)",
            background: "rgba(255, 255, 255, 0.17)",
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >

          <Box
            sx={{
              width: "100%",
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              display: isSmallScreen ? 'none' : 'auto'
              // background: "rgba(255, 255, 255, 0.73)",
              // backdropFilter: "blur(20px)",

            }}
          >

            <Box className="login-logo">
              <img
                src={logo}
                alt="SNP Tax & Financials Logo"
                style={{ height: "460px", width: '100%' }}
              />
            </Box>

          </Box>


          <Box
            sx={{
              width: isSmallScreen ? "100%" : "100%",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#3A3B3C", marginBottom: 7 }}
            >
              Welcome ..
            </Typography>

            <TextField
              variant="standard"
              value={userName}
              onChange={(e) => {setUsername(e.target.value)
                // validatePassword(e.target.value);
              }}
              InputProps={{
                disableUnderline: true,
              }}

              placeholder="Username"
              sx={{
                display: 'flex',
                height: '3.5vh',
                width: '90%',
                justifyContent: 'center',
                marginBottom: 3,
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "20px",
                p: 1,
                paddingLeft: 3

              }}
            />


            {/* <TextField
              variant="standard"

              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
              placeholder="Password"
              type="password"



              sx={{
                display: 'flex',
                height: '3.5vh',
                width: '90%',
                justifyContent: 'center',
                marginBottom: 2,
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "20px",
                p: 1,
                paddingLeft: 3
              }}
            /> */}

            <TextField
              variant="standard"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "hide password" : "show password"}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ right:20}}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Password"
              sx={{
                display: "flex",
                height: "3.5vh",
                width: "90%",
                justifyContent: "center",
                marginBottom: 2,
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "20px",
                p: 1,
                paddingLeft: 3,
              }}
            />


            <Button
              sx={{
                mt: 6,
                fontSize: "16px",
                width: '90%',
                background: '#074e2c',
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#08A04B",
                },
              }}
              fullWidth
              onClick={Login}
              variant='contained'
            >
              Login
            </Button>


          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;





// import React from 'react';
// import { Box, Typography, TextField, Link, Button, useMediaQuery } from '@mui/material';
// import { useNavigate } from "react-router-dom";
// import BaggroundImg from '../imgs/bg7.2.jpg';
// import logo from '../imgs/logo5.jpeg';

// const Login = () => {
//   const navigate = useNavigate();
//   const isSmallScreen = useMediaQuery('(max-width:600px)');

//   const handleLoginClick = (e) => {
//     e.preventDefault();
//     navigate('/customermaster');
//   };

//   return (
//     <Box
//       sx={{
//         width: '100vw',
//         height: '100vh',
//         backgroundImage: `url(${BaggroundImg})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Box>
//         <Box
//           sx={{
//             display: "flex",
//             width: isSmallScreen ? "90vw" : "950px",
//             height: isSmallScreen ? "auto" : "460px",
//             borderRadius: "20px",
//             overflow: "hidden",
//             // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.53)",
//             boxShadow: "0 4px 10px rgba(32, 30, 29, 0.22)",
//             background: "rgba(255, 255, 255, 0.17)",
//             flexDirection: isSmallScreen ? "column" : "row",
//           }}
//         >

//           <Box
//             sx={{
//               width: "100%",
//               justifyContent: 'center',
//               alignContent: 'center',
//               alignItems: 'center',
//               display:isSmallScreen ?'none':'auto'
//               // background: "rgba(255, 255, 255, 0.73)",
//               // backdropFilter: "blur(20px)",

//             }}
//           >

//             <Box className="login-logo">
//               <img
//                 src={logo}
//                 alt="SNP Tax & Financials Logo"
//                 style={{ height: "460px", width: '100%' }}
//               />
//             </Box>

//           </Box>


//           <Box
//             sx={{
//               width: isSmallScreen ? "100%" : "100%",
//               padding: "40px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <Typography
//               variant="h4"
//               sx={{ fontWeight: "bold", color: "#3A3B3C", marginBottom: 7 }}
//             >
//               Welcome ..
//             </Typography>

//             <TextField
//               variant="standard"
//               InputProps={{
//                 disableUnderline: true,
//               }}

//               placeholder="Username"
//               sx={{
//                 display: 'flex',
//                 height: '3.5vh',
//                 width: '90%',
//                 justifyContent: 'center',
//                 marginBottom: 3,
//                 background: "rgba(255, 255, 255, 0.3)",
//                 borderRadius: "20px",
//                 p: 1,
//                 paddingLeft: 3

//               }}
//             />


//             <TextField
//               variant="standard"
//               InputProps={{
//                 disableUnderline: true,
//               }}
//               placeholder="Password"
//               type="password"
//               sx={{
//                 display: 'flex',
//                 height: '3.5vh',
//                 width: '90%',
//                 justifyContent: 'center',
//                 marginBottom: 2,
//                 background: "rgba(255, 255, 255, 0.3)",
//                 borderRadius: "20px",
//                 p: 1,
//                 paddingLeft: 3
//               }}
//             />


//             <Button
//               sx={{
//                 mt: 6,
//                 fontSize: "16px",
//                 width: '90%',
//                 background: '#074e2c',
//                 borderRadius: "20px",
//                 "&:hover": {
//                   backgroundColor: "#08A04B",
//                 },
//               }}
//               fullWidth
//               onClick={handleLoginClick}
//               variant='contained'
//             >
//               Login
//             </Button>


//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default Login;
