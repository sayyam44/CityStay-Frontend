import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography,CircularProgress, Button, TextField, FormControlLabel, Checkbox,Card, CardMedia,CardContent, CardActions } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

import StateContext from '../Contexts/StateContext';
import ProfileUpdate from './ProfileUpdate';

import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'

//We already have a backend api that displays all the profiles at
//api/profiles/ , so here we are making an axios get request to this url.

function Agencies() {
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

    //to get all profiles
    useEffect(()=>{
        async function GetAgencies(){    
          try{
            const response = await Axios.get(
            `http://127.0.0.1:8000/api/profiles/`);
            console.log(response.data);
            //response.data holds all the profiles data
            dispatch({
            type: 'catchAgencies', 
            agenciesArray: response.data});
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


        
    return (
    <Grid2 container justifyContent="flex-start" spacing={2} 
    sx={{ padding: "10px" }}> 
        {/* here agency is iterating on the list of all the agencies in
        agenciesList */}
        {state.agenciesList.map((agency)=>{
        
        //this function displays the number of properties listed
        //button by each user in the agencies cards
        //seller_listings hold all the listings of the current seller
        //that we are getting from serializers of profile models
        function PropertiesDisplay(){
            if (agency.seller_listings.length === 0){
                return <Button disabled size="small">No Property Listed</Button>;
            }
            else if (agency.seller_listings.length === 1){
            return <Button size="small">One Property Listed</Button>;
            }
            else {
            return(
            <Button size="small">{agency.seller_listings.length} PROPERTIES</Button>
            );
            }
        }


            if (agency.agency_name && agency.phone_number)
            return (
        //here we are generating key id for each of the listing 
            <Grid2 key={agency.id} sx={{ marginTop: '1rem', maxWidth: "20rem" }}> 
                <Card>
                <CardMedia
                    component="img"
                    sx={{
                      height: 140, // Enforce consistent height
                      width: "100%", // Ensure it fills the width of the card
                      objectFit: "cover", // Crop or scale image to fit the defined dimensions
                    }}
                    image={agency.profile_picture 
                        ? agency.profile_picture :
                        defaultProfilePicture }
                    alt="Profile Picture"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {agency.agency_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {agency.bio.substring(0,100)}...
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
        );
}

export default Agencies