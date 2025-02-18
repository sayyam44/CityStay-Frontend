import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from '@mui/material';
import city from './Assets/city.JPG';

function Example() {
    const navigate = useNavigate();
    return (
        <> 
        <div style={{ 
            position: "fixed", 
            width: "100vw", 
            height: "100vh", 
            overflow: "hidden"
        }}>
            <img
                style={{
                    width: '100vw',
                    height: "100vh",
                    objectFit: 'cover',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    filter: "brightness(75%)", // Darkens the image slightly
                }}
                src={city}
                alt="City"
            />     
            <div style={{
                position: 'absolute', 
                top: '50%',
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
                padding: "2rem",
                borderRadius: "10px"
            }}>
                <Typography variant="h2" color="white" fontWeight="bold">
                    Find Your{' '}
                    <span style={{ color: '#FFA500', fontWeight: 'bolder' }}>Trusted</span>{' '}
                    Accommodations in{' '}
                    <span style={{ color: '#FFA500', fontWeight: 'bolder' }}>St.John's</span>
                </Typography>

                <Button 
                    sx={{
                        fontSize: "1.5rem",
                        borderRadius: "25px",
                        backgroundColor: "#FFA500", // Warm color to match houses
                        color: "white",
                        marginTop: "2rem",
                        padding: "0.75rem 2rem",
                        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.3)",
                        '&:hover': { backgroundColor: "#FF8C00" } // Darker orange on hover
                    }}
                    onClick={() => navigate("/Listings")}
                >
                    See All Properties
                </Button>
            </div>
        </div>
        </>
    );
}

export default Example;
