import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Snackbar,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    Box
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Axios from "axios";

// Contexts
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";

function Header() {
    const navigate = useNavigate();
    //GlobalDispatch--> To make changes in the parent component i.e. header.js
    //GlobalState--> Bringing data from parent component i.e. app.js 
    //and then implement changes in the current child component i.e.header.js 
    const GlobalState = useContext(StateContext);
    const GlobalDispatch = useContext(DispatchContext);
    const isMobile = useMediaQuery("(max-width: 768px)");

    // this is an mui prop for the menu bar for logout
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSnack, setOpenSnack] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    function HandleProfile() {
        setAnchorEl(null);
        navigate("/profile");
    }

    // below function is to handle the logout logic
    // first we need to destroy the token of the current logged out user
    // and then we need to delete the user's data from the local storage
    async function HandleLogout() {
        setAnchorEl(null);
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            try {
                await Axios.post(
                    "https://www.citystayinnl.com/api-auth-djoser/token/logout/",
                    GlobalState.userToken,
                    {
                        headers: { Authorization: "Token " + GlobalState.userToken },
                    }
                );

                // Set locationAccess to false in localStorage
                localStorage.clear();       
                
                // dispatch case for this in app.js is logout
                GlobalDispatch({ type: "logout" });
                setOpenSnack(true);
            } catch (e) {
                // console.log(e.response);
            }
        }
    }

    // this is used to show the popup for 1.5 sec before navigating
    // to the homepage
    useEffect(() => {
        if (openSnack) {
            setTimeout(() => navigate(0), 1500);
        }
    }, [openSnack]);

    return (
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
            <Toolbar>
                {/* Mobile Menu Icon */}
                {isMobile && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ marginRight: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Logo */}
                <Typography
                    variant="h4"
                    sx={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    CityStay
                </Typography>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", gap: 3 }}>
                        <Button color="inherit" sx={{ fontSize: "1.2rem" }} onClick={() => navigate("/Listings")}>
                            Listings
                        </Button>
                        <Button color="inherit" sx={{ fontSize: "1.2rem" }} onClick={() => navigate("/agencies")}>
                            Agencies
                        </Button>
                    </Box>
                )}

                {/* User Actions */}
                {GlobalState.userIsLogged && (
                    <>
                        <Tooltip title="Messages" arrow>
                            <IconButton 
                            color="inherit" 
                            onClick={() => navigate("/Messages")}
                            sx={{ marginRight: 1 }}>
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
                                whiteSpace: "nowrap", // Prevents text wrapping
                                flexShrink: 0, // Prevents the button from shrinking
                                "&:hover": { backgroundColor: "blue" },
                            }}
                            onClick={() => navigate("/addproperty")}
                        >
                            Add Property
                        </Button>
                    </>
                )}

                {/* Login/Profile Button */}
                {GlobalState.userIsLogged ? (
                    <Button
                    onClick={handleClick}
                    sx={{
                        color: "black",
                        backgroundColor: "white",
                        width: "10rem", // Ensure a fixed width
                        height: "2.5rem", // Ensure a fixed height like the Login button
                        fontSize: "1.1rem", // Keep font size the same
                        fontFamily: "inherit",
                        marginLeft: "1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textTransform: "none", // Prevents uppercase transformation
                        "&:hover": { backgroundColor: "orange" },
                        whiteSpace: "nowrap", // Ensures text stays in one line
                        overflow: "hidden", // Prevents content from expanding the button
                    }}
                >
                    <Typography 
                        sx={{
                            fontSize: "clamp(0.7rem, 4vw, 1.1rem)", // Adjusts font size dynamically
                            fontFamily: "inherit",
                            fontWeight: "inherit",
                            maxWidth: "9.5rem", // Ensures text does not push the button size
                            textOverflow: "ellipsis", // Adds "..." if text is too long
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            display: "block", // Ensures text doesn't affect button layout
                            textAlign: "center",
                        }}
                    >
                        {GlobalState.userUsername}
                    </Typography>
                </Button>
                
                
                ) : (
                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "white",
                            width: "10rem",
                            fontSize: "1.1rem",
                            marginLeft: "1rem",
                            "&:hover": { backgroundColor: "orange" },
                        }}
                        onClick={() => navigate("/Login")}
                    >
                        Login
                    </Button>
                )}


                {/* Profile & Logout Menu */}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": "basic-button" }}
                >
                    <MenuItem onClick={HandleProfile}>Profile</MenuItem>
                    <MenuItem onClick={HandleLogout}>Logout</MenuItem>
                </Menu>

                {/* Logout Snackbar */}
                <Snackbar
                    open={openSnack}
                    message="You have successfully logged out"
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                />
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <List sx={{ width: 250 }}>
                    <ListItem button onClick={() => navigate("/Listings")}>
                        <ListItemText primary="Listings" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/agencies")}>
                        <ListItemText primary="Agencies" />
                    </ListItem>
                </List>
            </Drawer>
        </AppBar>
    );
}

export default Header;
