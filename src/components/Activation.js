import React, { useEffect, useContext, useState  } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// MUI
import { Typography, Button, Box } from "@mui/material";

// Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

function Activation() {
  const navigate = useNavigate();
  const params = useParams();

  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);
  const [error, setError] = useState("");

  async function ActivationHandler() {
    try {
      const response = await Axios.post(
        "https://www.citystayinnl.com/api-auth-djoser/users/activation/",
        {
          uid: params.uid,
          token: params.token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Once the user is activated, navigate to login page
      navigate("/login");
    } catch (e) {
      console.error(e);
      setError("Activation failed. Please try again.");
    }
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
