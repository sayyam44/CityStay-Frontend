import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography,CircularProgress, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

import StateContext from '../Contexts/StateContext';
import ProfileUpdate from './ProfileUpdate';

import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'

function Profile() {
    // const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialState = {
        userProfile: {
            //To prefill these values in the my profile page 
            //go to profileUpdate that is a child component of this component.
            agencyName: '',
            phoneNumber: '',
            profilePic: '',
            bio: '',
    },
    //this is to check whether we get data from the server or not 
    //i.e. whether we are getting the predefined userProfile data 
    //see the below dispatch for type loadingDone
    dataIsLoading: true,
  };

    function ReducerFunction(draft, action) {
        switch (action.type) {      
        case "catchUserProfileInfo":
            draft.userProfile.agencyName = action.profileObject.agency_name;
            draft.userProfile.phoneNumber = action.profileObject.phone_number;
            draft.userProfile.profilePic = action.profileObject.profile_picture;
            draft.userProfile.bio = action.profileObject.bio;
            break;
        case "loadingdone": //to check whther the userprofile data 
        //is already present or not 
            draft.dataIsLoading = false;
            break;
      }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    //to get the current user's profile details
    useEffect(()=>{
        async function GetProfileInfo(){
          try{
            const response = await Axios.get(
            // GlobalState.userId gives the info of currently logged in user
            `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/`);
            console.log(response.data);
            //response.data holds all the data of the user who 
            //is signed in and have clicked on add property button
            dispatch({
            type: 'catchUserProfileInfo', 
            profileObject: response.data});
            //this is to check whether we have a predefined data of the 
            //user or not 
            dispatch({
                type: 'loadingdone',
            })
            } catch(e){
            console.log(e.response);
          }
        }
        GetProfileInfo()
      },[])

    //this function checks whether to show the welcome message or 
    //to show the already saved data in the userProfile form
    function WelcomeDisplay(){
        if (state.userProfile.agencyName === null || 
            state.userProfile.agencyName === '' || 
            state.userProfile.phoneNumber === null ||
            state.userProfile.phoneNumber === '')
        { return (
            <Typography 
            variant="h5"
            style={{textAlign: 'center',marginTop: '1rem'}}>
                Welcome{" "}
                <span style={{color: 'green',fontWeight:'bolder'}}>
                {GlobalState.userUsername}</span>{" "}
                , please submit this form below to update your profile.
            </Typography>
            );
        }
        else {
        return (
        <Grid2 container style={{
            width: '50%', 
            marginLeft: 'auto', 
            marginRight: 'auto',
            border: "5px solid black",
            marginTop: '1rem',
            padding: '5px'}}>
            <Grid2 xs={6}>
                <img 
                style={{height:"10rem",width: "15rem"}} 
                src={state.userProfile.profilePic !== null ?
                    state.userProfile.profilePic 
                    : defaultProfilePicture
                }/>
            </Grid2>

            <Grid2 
            container
            direction='column'
            justifyContent="center"
            xs={6}
            marginLeft='18rem'
            marginTop='-8rem'
            marginBottom= '4rem'> 
                <Grid2>
                    <Typography 
                        variant="h5"
                        style={{textAlign: 'center',marginTop: '1rem'}}>
                            Welcome{" "}
                            <span style={{color: 'green',fontWeight:'bolder'}}>
                            {GlobalState.userUsername}</span>
                    </Typography>
                </Grid2>
                <Grid2>
                    <Typography 
                        variant="h5"
                        style={{textAlign: 'center',marginTop: '1rem'}}>
                            You have x properties listed.
                            <span style={{color: 'green',fontWeight:'bolder'}}>
                            </span>
                    </Typography>
                </Grid2>
            </Grid2>
        </Grid2>
        )
        }
    }

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
        <>
            <div>
            {WelcomeDisplay()}
            </div>

            {/* the below component will have autofill values in the form
            for my profile for a user  */}
            {/* we are sending the userprofile of the current user as the props */}
            <ProfileUpdate userProfile={state.userProfile} />
        </>
        // new
    )
    }

export default Profile