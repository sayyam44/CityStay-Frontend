import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, 
  Typography,
  CircularProgress, 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox,
  Card, CardMedia,CardContent, CardActions, Pagination } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

import StateContext from '../Contexts/StateContext';
import ProfileUpdate from './ProfileUpdate';

import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'

//We already have a backend api that displays all the profiles at
//api/profiles/ , so here we are making an axios get request to this url.

function Agencies() {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialState = {
        dataIsLoading: true,
        agenciesList: [],
  };

    function ReducerFunction(draft, action) {
        switch (action.type) {      
        case 'catchAgencies':
            //agenciesList have the list of all the agencies
            draft.agenciesList = action.agenciesArray;
            break;
            
        case 'loadingDone':
            draft.dataIsLoading =false;
            break;
      }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const agenciesPerPage = 10; // Show 10 agencies per page

    //to get all profiles
    useEffect(()=>{
        async function GetAgencies(){    
          try{
            const response = await Axios.get(
            `http://127.0.0.1:8000/api/profiles/`);
            console.log(response.data);
            
            // Filter agencies where agency_name is not null
            const filteredAgencies = response.data
            .filter(agency => agency.agency_name) // Remove agencies with null names
            .sort((a, b) => b.id - a.id); // Sort by ID in descending order (highest ID first)

            //response.data holds all the profiles data
            dispatch({
            type: 'catchAgencies', 
            agenciesArray: filteredAgencies});
            //this is to check whether we have a predefined data of the 
            //profiles or not 
            dispatch({
                type: 'loadingDone',
            })
            } catch(e){
            console.log(e.response);
          }
        }
        GetAgencies();
      },[])

    if (state.dataIsLoading === true) {
            return (
              <Grid2 
                container 
                justifyContent="center" 
                alignItems="center"
                style={{ height: "100vh" }}
              >
                <CircularProgress />
              </Grid2>
            );
        }

    // Calculate pagination indexes
    const indexOfLastAgency = currentPage * agenciesPerPage;
    const indexOfFirstAgency = indexOfLastAgency - agenciesPerPage;
    const currentAgencies = state.agenciesList.slice(indexOfFirstAgency, indexOfLastAgency);
    const totalPages = Math.ceil(state.agenciesList.length / agenciesPerPage);
    
    return (
      <>
        <Grid2 container justifyContent="flex-start" spacing={2} sx={{ padding: "10px" }}> 
          {currentAgencies.map((agency) => {
            function PropertiesDisplay() {
              if (agency.seller_listings.length === 0) {
                return <Button disabled size="small" onClick={() => navigate(`/agencies/${agency.seller}`)}>No Property Listed</Button>;
              } else if (agency.seller_listings.length === 1) {
                return <Button size="small" onClick={() => navigate(`/agencies/${agency.seller}`)}>One Property Listed</Button>;
              } else {
                return <Button size="small" onClick={() => navigate(`/agencies/${agency.seller}`)}>{agency.seller_listings.length} PROPERTIES</Button>;
              }
            }
    
            if (agency.agency_name && agency.phone_number)
              return (
                <Grid2 key={agency.id} sx={{ marginTop: '1rem', width: "15rem" }}> 
                  <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <CardMedia
                      component="img"
                      sx={{
                        height: 140,
                        width: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      image={agency.profile_picture ? agency.profile_picture : defaultProfilePicture}
                      alt="Profile Picture"
                      onClick={() => navigate(`/agencies/${agency.seller}`)}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {agency.agency_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {agency.bio.substring(0, 50)}...
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {PropertiesDisplay()}
                    </CardActions>
                  </Card>
                </Grid2>
              );
          })}
        </Grid2>
    
        {/* Pagination */}
        <Grid2 container 
        justifyContent="center" 
        alignItems="center" 
        sx={{ marginTop: "1rem", 
        marginBottom: "0.5rem",position: "fixed", 
        bottom: 0, // Stick to the bottom
        left: 0, // Align to the left
        width: "100%", // Full width
         }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            siblingCount={1}
            boundaryCount={1}
            variant="text"
            shape="rounded"
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                margin: "0 6px",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "lightblue",
                color: "black",
              },
              "& .MuiPaginationItem-root.Mui-selected:hover": {
                backgroundColor: "#add8e6",
              },
            }}
          />
        </Grid2>
      </>
    );
  }
export default Agencies