import React, { useState, useContext, useEffect } from 'react';
import { Link,useNavigate } from "react-router-dom";
import { Button,Typography,Grid2,AppBar,Toolbar,Menu,MenuItem,Snackbar, IconButton, Badge} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import Tooltip from '@mui/material/Tooltip';
import CustomCard from "./CustomCard";
import Axios from "axios";

// Contexts
import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';

function Header() {
    const navigate = useNavigate();

    //GlobalDispatch--> To make changes in the parent component i.e. header.js
    //GlobalState--> Bringing data from parent component i.e. app.js 
    //and then implement changes in the current child component i.e.header.js 
    const GlobalState = useContext(StateContext);
    const GlobalDispatch = useContext(DispatchContext);

    //this is an mui prop for the menu bar for logout 
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function HandleProfile(){
        setAnchorEl(null);
        navigate("/profile"); 
    }
    const[openSnack, setOpenSnack] = useState(false)

    //below function is to handle the logout logic
    //first we need to destroy the token of the current logged out user
    //and then we need to delete the user's data from the local storage 
    async function HandleLogout(){
    setAnchorEl(null);
    const confirmLogout = window.confirm('Are you sure you want to logout');
    if (confirmLogout){
        try{
            const response = await Axios.post(
                'http://127.0.0.1:8000/api-auth-djoser/token/logout/',
                GlobalState.userToken, 
                {
                    headers: {Authorization: 'Token '.concat(GlobalState.userToken)}
                });
                console.log(response);

                // Set locationAccess to false in localStorage
                localStorage.clear();       
                
                //dispatch case for this in app.js is logout
                GlobalDispatch({type: "logout" });
                setOpenSnack(true);
                // navigate("/");
        }catch(e){
            console.log(e.response);
        }
    }
    }

    //this is used to show the popup for 1.5 sec before being navigating
    //to the homepage 
    useEffect(()=>{
        if (openSnack){
            setTimeout(()=>{
                navigate(0);
            },1500);
        }
    },[openSnack])

    return (
        <AppBar position="static" style={{backgroundColor:'black'}}>
            <Toolbar>
            <div style={{marginRight: 'auto'}}>
            <Button color="inherit" onClick={()=>navigate("/")}>
                <Typography variant="h4">
                    CityStay
                </Typography></Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Button color="inherit" onClick={()=>navigate("/Listings")}>
                <Typography variant="h6">Listings</Typography>
            </Button>
            <Button color="inherit" 
            style={{marginLeft: "2rem"}} 
            onClick={()=>navigate("/agencies")}
            >
                <Typography variant="h6">Agencies</Typography>
            </Button>
            </div>
            {/* <Button color="inherit" 
            style={{marginLeft: "2rem"}}>
                <Typography variant="h6">Agencies</Typography>
            </Button>
            </div> */}

            <div sx={{marginLeft: 'auto',marginRight: '10rem'}}>

            {GlobalState.userIsLogged ?( //the add property button shows only when the user logs in
                <>
                <Tooltip title="Messages" arrow>
                    <IconButton
                        sx={{ marginRight: "1rem" }}
                        color="inherit"
                        onClick={() => navigate("/Messages")}
                    >
                        <Badge color="error">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>
                <Button
                    sx={{
                        color: "white",
                        backgroundColor: "green",
                        width: "10rem",
                        fontSize: "1.1rem",
                        marginRight: "1rem",
                        "&:hover": { backgroundColor: "blue" }
                    }}
                    onClick={() => navigate("/addproperty")}
                >
                    Add Property
                </Button>
                
                </>
            ):("")}
            
            {GlobalState.userIsLogged ?( //this case if the user login's then the button should show the username
            <Button 
            onClick={handleClick} //for menu-bar mui-prop
            sx={{color:"black",
            backgroundColor: "white",
            width: "10rem", 
            fontSize:"1.1rem",
            marginLeft:"1rem",
            "&:hover":{backgroundColor:"orange"}}}
            // onClick={()=>navigate("/Login")}>
            >{GlobalState.userUsername} </Button>) : (
            <Button 
            sx={{color:"black",
            backgroundColor: "white",
            width: "10rem", 
            fontSize:"1.1rem",
            marginLeft:"1rem",
            "&:hover":{backgroundColor:"orange"}}}
            onClick={()=>navigate("/Login")}>
            Login</Button>)}
                

            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            >
            <MenuItem 
            sx={{
                color: "black",
                backgroundColor: "green",
                width: "15rem",
                fontWeight: "bolder",
                borderRadius: "15px",
                marginBottom: "0.25rem",
            }}
            onClick={HandleProfile}
            >Profile</MenuItem>
            <MenuItem 
            sx={{
                color: "black",
                backgroundColor: "red",
                width: "15rem",
                fontWeight: "bolder",
                borderRadius: "15px",
            }}
            //below button handles the logout functionality
            onClick={HandleLogout}>Logout</MenuItem> 
            </Menu>

            {/* this is the popup when user logs in  */}
            <Snackbar
            open={openSnack}
            message="You have successfully logged out"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: "center"
            }}
            />
            </div>
            </Toolbar>
        </AppBar>
  );
}

export default Header