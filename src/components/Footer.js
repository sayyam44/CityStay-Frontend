import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

function Footer() {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Box 
            component="footer" 
            sx={{
                backgroundColor: "white", 
                color: "grey", 
                padding: isMobile ? "1rem" : "1.8rem", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center"
            }}
        >
            <Typography variant="body2" sx={{ 
                    fontWeight: "bold" // Added bold font weight
                }}>
                &copy; 2025 CityStayNL.com. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;
