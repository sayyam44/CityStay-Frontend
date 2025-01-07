import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

import StateContext from '../Contexts/StateContext';

function Profile() {
    // const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialState = {
        userProfile: {
            agencyName: '',
            phoneNumber: '',
            profilePic: '',
            bio: '',
    },
    agencyNameValue: '',
    phoneNumberValue: '',
    bioValue: '',
    uploadedPicture: [],
    profilePictureValue: '',
    sendRequest: 0
  };

    function ReducerFunction(draft, action) {
        switch (action.type) {      
        case "catchUserProfileInfo":
            draft.userProfile.agencyName = action.profileObject.agency_name;
            draft.userProfile.phoneNumber = action.profileObject.phone_number;
            draft.userProfile.profilePic = action.profileObject.profile_picture;
            draft.userProfile.bio = action.profileObject.bio;
            break;

        case 'catchAgencyNameChange':
            draft.agencyNameValue = action.agencyNameChosen;
            break;
        
        case 'catchPhoneNumberChange':
            draft.phoneNumberValue = action.phoneNumberChosen;
            break;

        case 'catchBioChange':
            draft.bioValue = action.bioChosen;
            break;
        
        case 'catchUploadedPicture':
            draft.uploadedPicture = action.pictureChosen;
            break;
        
        case 'catchProfilePictureChange':
            draft.profilePictureValue = action.profilePictureChosen;
            break;
        
        case 'changeSendRequest':
            draft.sendRequest =draft.sendRequest+1;
            break; 
      }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    //useeffect to catch uploaded picture and store it in profilePictureValue
    //this hook runs as soon as the user uploads the profile picture
    //and it shows the picture name below at state.profilePictureValue
    useEffect(()=>{
        if  (state.uploadedPicture[0]){
            dispatch({
                type: 'catchProfilePictureChange',
                profilePictureChosen: state.uploadedPicture[0]})
        }
    },[state.uploadedPicture[0]])

    //to get the user's profile details
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
                profileObject: response.data})
  
            } catch(e){
            console.log(e.response);
          }
        }
        GetProfileInfo()
      },[])

    //this is used to update the user profile
    useEffect(()=>{
        if (state.sendRequest){ //this hooks runs as the update button is clicked
          async function UpdateProfile(){
            const formData = new FormData()
            formData.append("agency_name", state.agencyNameValue);
            formData.append("phone_number", state.phoneNumberValue);
            formData.append("bio", state.bioValue);
            formData.append("profile_picture", state.profilePictureValue);
            formData.append("seller", GlobalState.userId);

            try {
                //since the profile of the user already exists that is 
                //why we send the patch request
              const response = await Axios.patch(
                `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/update/`,
                formData
              );
              console.log("Success:", response.data);
            //   navigate('/listings');
            } catch (e) {
              // Log detailed error information for debugging
              if (e.response) {
                console.error("Error Response:", e.response.data);
                console.error("Status Code:", e.response.status);
              } else if (e.request) {
                console.error("No Response Received:", e.request);
              } else {
                console.error("Error:", e.message);
              }
            }
          }
          UpdateProfile()
        }
      },[state.sendRequest]);
  
    //this runs as soon as the user hits update button
    //it changes sendRequest to sendRequest+1
    function FormSubmit(e){ 
        e.preventDefault()
        dispatch({type: 'changeSendRequest'});
    }

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
                src={state.userProfile.profilePic}/>
            </Grid2>

            <Grid2 
            container
            direction='column'
            justifyContent="center"
            xs={6}
            marginLeft='18rem'
            marginTop='-6rem'
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

  return (
    <>
        <div>
        {WelcomeDisplay()}
        </div>

        <div
            style={{
                width: "50%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "3rem",
                border: "5px solid black",
                padding: "3rem",
            }}
        >
            <form onSubmit={FormSubmit}>
                <Grid2 container justifyContent="center">
                    <Typography variant="h4">My Profile</Typography>
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="agencyName" 
                    label="Agency Name*" 
                    variant="outlined" 
                    fullWidth 
                    value = {state.agencyNameValue}

                    onChange = {(e)=>dispatch({
                        type: 'catchAgencyNameChange', 
                        agencyNameChosen: e.target.value})}  />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="phoneNumber"
                        label="Phone Number*"
                        variant="outlined"
                        fullWidth                
                        value = {state.phoneNumberValue}
                        onChange = {(e)=>dispatch({
                            type: 'catchPhoneNumberChange', 
                            phoneNumberChosen: e.target.value})}
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="bio"
                        label="Bio"
                        variant="outlined"
                        multiline
                        rows={6}
                        fullWidth                
                        value = {state.bioValue}
                        onChange = {(e)=>dispatch({
                            type: 'catchBioChange', 
                            bioChosen: e.target.value})}
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }} xs={6}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{
                        color: "white",
                        backgroundColor: "blue",
                        fontSize: "1rem",
                        // marginLeft: "3rem",
                        // marginRight: "3rem",
                        border: '1px solid black',
                    }}
                >
                    Choose Pofile Picture

                    {/* to upload the images in particular format */}
                    <input 
                    type="file" 
                    accept="image/png , image/gif, image/jpeg"
                    hidden
                    onChange={(e)=> dispatch({
                    type: "catchUploadedPicture",
                    pictureChosen: e.target.files,
                    })
                } 
                />
                </Button>
            </Grid2>
            
            {/* to show the name of the profile picture uploaded */}
            <Grid2 container>
                <ul>
                {state.profilePictureValue ? <li>{state.profilePictureValue.name}</li>:""}
                </ul>
            </Grid2>

            <Grid2 container style={{ marginTop: "-1rem" }}>
                <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                        color: "white",
                        backgroundColor: "green",
                        fontSize: "1.1rem",
                        "&:hover": {
                            backgroundColor: "orange",
                        },
                    }}
                >
                    Update
                </Button>
            </Grid2>
            </form>
        </div>
    </>
    // new
  )
}

export default Profile