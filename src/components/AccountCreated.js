import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import { Typography, Box } from "@mui/material";

function AccountCreated() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%", // 100% width to make it responsive
        maxWidth: "600px", // Maximum width for larger screens
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border: "5px solid black",
        padding: "3rem",
        boxSizing: "border-box", // Ensures padding is inside the border
      }}
    >
      <Typography variant="h4" align="center">
        Thanks for signing up! To activate your account, please click on the
        link that has been sent to you on your email!
        <br />
        <br />
        By Sayyam Kundra from citystaynl.com
      </Typography>
    </Box>
  );
}

export default AccountCreated;
