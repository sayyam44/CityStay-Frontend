import React, { useState } from 'react';
import { Link } from "react-router-dom";

// MUI IMPORTS 
import { Button,Typography,Grid2,AppBar,Toolbar} from '@mui/material';
//Components
import CustomCard from "./CustomCard";
//Assets
import city from './Assets/city.JPG'

function Example() {
    return (
        <> 
        <div style={{position: "relative"}}>
            <img
            style={{
            width: '100%',
            height: "88vh",
            }}
            src={city}
            alt="City"/>     
            <div style={{position: 'absolute', 
                zIndex: '100',
                top: '100px',
                left: "20px",
                textAlign: "center"}}>
                
                <Typography variant="h1" color="Beige" fontWeight="bolder">
                Find Your{' '}
                <span style={{ color: '#B22222', fontWeight: 'bolder' }}>Trusted</span>{' '}
                Accommodations with us!
                </Typography>

                <Button sx={{variant: "contained",
                    fontSize:"3.5rem",
                    borderRadius: "15px",
                    color: "#3f51b5",
                    marginTop: "2rem",
                    boxShadow: "3px 3px 3px 3px white"}}>
                    See All Properties</Button>
            </div>
        </div>
      </>
    );
}

export default Example;
