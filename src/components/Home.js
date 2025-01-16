import React, { useState } from 'react';
import { Link,useNavigate } from "react-router-dom";

// MUI IMPORTS 
import { Button,Typography,Grid2,AppBar,Toolbar} from '@mui/material';
//Components
import CustomCard from "./CustomCard";
//Assets
import city from './Assets/city.JPG'

function Example() {
    const navigate = useNavigate();
    return (
        <> 
        <div style={{position: "relative"}}>
            <img
            style={{
            width: '100%',
            height: "89vh",
            objectFit: 'cover',
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
                Accommodations with{' '}
                <span style={{ color: '#B22222', fontWeight: 'bolder' }}>CityStay</span>{' '}
                </Typography>

                <Button sx={{variant: "contained",
                    fontSize:"3.5rem",
                    borderRadius: "15px",
                    // color: "#3f51b5",
                    color: "orange",
                    marginTop: "2rem",
                    boxShadow: "3px 3px 3px 3px black"}}
                    onClick={()=>navigate("/Listings")}>
                    See All Properties</Button>
            </div>
        </div>
      </>
    );
}

export default Example;
