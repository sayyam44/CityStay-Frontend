import React, { useEffect, useContext } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
// MUI
import {
	Grid2,
	AppBar,
	Typography,
	Button,
  Box,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CircularProgress,
	TextField,
	Snackbar,
	Alert,
} from "@mui/material";

// Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

function Activation() {
	const navigate = useNavigate();
    //because we need uid and 
	const params = useParams();

	const GlobalDispatch = useContext(DispatchContext);
	const GlobalState = useContext(StateContext);

	async function ActivationHandler() {
		try {
			const response = await Axios.post(
				"https://www.citystayinnl.com/api-auth-djoser/users/activation/",
				{
					uid: params.uid,
					token: params.token,
				}
			);
			navigate("/login"); //once the user is activated then navigate the user to login page
		} catch (e) {}
	}

	return (
		<Box
      sx={{
        width: "100%", // Full width
        maxWidth: "600px", // Max width for large screens
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border: "5px solid black",
        padding: "2rem",
        boxSizing: "border-box", // Ensures padding is inside the border
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Please click on the button below to activate your account!
      </Typography>
      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: "1rem" }}
        onClick={ActivationHandler}
      >
        ACTIVATE
      </Button>
    </Box>
	);
}

export default Activation;