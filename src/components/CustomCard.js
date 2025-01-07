import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button,Typography } from '@mui/material';


function CustomCard() {
    const [btnColor, setBtnColor] = useState("error");
    return(
    <div style={{width: "100%" , border: "2px solid black", padding:"15px"}}> 
        <Typography variant='h4'>
            This is the heading.
        </Typography>
        <Typography>
            Hello my name is sayyam kundra.
        </Typography>
        <Button 
        onClick={() => setBtnColor(btnColor === "error" ? "success" : "error")}
        variant="contained"
        size="medium"
        color={btnColor}
        >
            Go
        </Button>
    </div>
    );
}

export default CustomCard