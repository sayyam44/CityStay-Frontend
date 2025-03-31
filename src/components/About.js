import React from "react";
import { Box, Typography, Avatar, Link, Divider, useTheme } from "@mui/material";
import { GitHub, LinkedIn, Email } from "@mui/icons-material";
import citystaynl from './Assets/citystaynl.jpg';
import profile from './Assets/profile.jpg';


function About() {
  const theme = useTheme();

  return (
    <Box sx={{ 
      maxWidth: 800, 
      margin: "0 auto", 
      padding: 4,
      display: "flex",
      flexDirection: "column",
      gap: 3
    }}>
      {/* Top Section - About CityStayNL */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: "center"
      }}>
        <Box
          component="img"
          src={citystaynl}
          sx={{ 
            width: 200,
            height: 200,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            objectFit: 'cover'
          }}
        />
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            About CityStayNL
          </Typography>
          <Typography variant="body1" paragraph>
          The idea behind CityStayNL began with a simple 
          vision i.e. to simplify the process of renting or 
          buying reliable properties in St. John's, Newfoundland,
           for both the newcomers and residents of the city. As 
           the demand for housing has surged due to a 
           significant increase in immigrants and students 
           over the past few years, CityStayNL aims to bridge 
           the gap by providing a full-stack, location-based 
           real estate web application. CityStayNL is designed 
           to address the growing need for both rental and 
           purchase properties in the city. With a focus on 
           ease of use, it connects people with affordable and 
           convenient housing options, helping them find the 
           right place to call home in St. John’s.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Bottom Section - About Developer */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: "center"
      }}>
        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Meet the Developer
          </Typography>
          <Typography variant="body1" paragraph>
          Hello! I'm Sayyam Kundra, an experienced software 
          engineer and full-stack developer with a passion 
          for creating meaningful web applications and software 
          solutions. I hold a Master's degree in Computer 
          Engineering from Memorial University of Newfoundland 
          in St. John's. I’ve always been driven to solve
           real-world problems using technology.One of my 
           recent projects, CityStayNL, aims to address the 
           challenges of renting or buying reliable properties 
           in St. John’s, Newfoundland, providing a 
           user-friendly platform for both newcomers and 
           residents of the city.
          </Typography>
          <Box sx={{ 
            display: "flex", 
            gap: 3, 
            mt: 3,
            justifyContent: { xs: "center", md: "flex-start" },
            flexWrap: 'wrap'
          }}>
            <Link 
              href="https://github.com/sayyam44" 
              target="_blank"
              rel="noopener"
              sx={{ 
                display: "flex", 
                alignItems: "center",
                textDecoration: 'underline'
              }}
            >
              <GitHub sx={{ mr: 1 }} /> GitHub
            </Link>
            <Link 
              href="https://www.linkedin.com/in/sayyamkundra44/" 
              target="_blank"
              rel="noopener"
              sx={{ 
                display: "flex", 
                alignItems: "center",
                textDecoration: 'underline'
              }}
            >
              <LinkedIn sx={{ mr: 1 }} /> LinkedIn
            </Link>
            <Link 
              href="mailto:skundra@mun.ca"
              sx={{ 
                display: "flex", 
                alignItems: "center",
                textDecoration: 'underline'
              }}
            >
              <Email sx={{ mr: 1 }} /> Email
            </Link>
          </Box>
        </Box>
        <Avatar
          src={profile}
          sx={{ 
            width: 200, 
            height: 200,
            boxShadow: theme.shadows[4]
          }}
        />
      </Box>
    </Box>
  );
}

export default About;