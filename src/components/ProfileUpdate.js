import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField, FormControlLabel, Checkbox,Snackbar } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

import StateContext from '../Contexts/StateContext';

//this is a child component of Profile.js to get the prefill 
// values in the user profile form 
function ProfileUpdate(props) {
    //here We are getting the userProfile details as a prop from its
    //parent component that is profile.js
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    console.log(props.userProfile);

    //here we are getting the prefilled values in the user profile 
    // form from the props
    const initialState = {
    agencyNameValue: props.userProfile.agencyName,
    phoneNumberValue: props.userProfile.phoneNumber,
    bioValue: props.userProfile.bio,
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic,
    sendRequest: 0,
    openSnack:false, //this is the popup that occurs when the user logs in
    disabledBtn: false, //this is to disable the login button once it is clicked

  };

    function ReducerFunction(draft, action) {
        switch (action.type) {      

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

        case 'openTheSnack':
            draft.openSnack =true;
            break
        case 'disabledButton': //this is to disable the login button for 1.5 sec for the popup
            draft.disabledBtn = true;    
            break
        case 'allowTheButton': //this is to enable the button again once the popup is gone
            draft.disabledBtn = false;    
            break
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

    //this is used to update the user profile
    useEffect(()=>{
        if (state.sendRequest){ //this hooks runs as the update button is clicked
          async function UpdateProfile(){
            const formData = new FormData()

            //As we know that when a user uploads a picture it 
            // becomes an object  
            if (typeof state.profilePictureValue === "string" || state.profilePictureValue === null){
            formData.append("agency_name", state.agencyNameValue);
            formData.append("phone_number", state.phoneNumberValue);
            formData.append("bio", state.bioValue);
            // formData.append("profile_picture", state.profilePictureValue);
            formData.append("seller", GlobalState.userId);
            }
            else {
            formData.append("agency_name", state.agencyNameValue);
            formData.append("phone_number", state.phoneNumberValue);
            formData.append("bio", state.bioValue);
            formData.append("profile_picture", state.profilePictureValue);
            formData.append("seller", GlobalState.userId);
            }

            try {
                //since the profile of the user already exists that is 
                //why we send the patch request
              const response = await Axios.patch(
                `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/update/`,
                formData
              );
              console.log("Success:", response.data);
              dispatch({type: 'openTheSnack'}) //this is to show the popup when user successfully updates its profile
            //   navigate(0);//here navigate is 0 that is to update the profile
            } catch (e) {
              console.log(e.response);
              dispatch({type: 'allowTheButton'})
            }
          }
          UpdateProfile()
        }
      },[state.sendRequest]);
      
    //this is used to show the popup for 1.5 sec before being navigating
    //to 0
    useEffect(()=>{
        if (state.openSnack){
            setTimeout(()=>{
                navigate(0);
            },1500);
        }
    },[state.openSnack])

    //this runs as soon as the user hits update button
    //it changes sendRequest to sendRequest+1
    function FormSubmit(e){ 
        e.preventDefault()
        dispatch({type: 'changeSendRequest'});
        dispatch({type: 'disabledButton'})
    }

    //This is to display the name of the profile picture that is being 
    //uploaded
    function ProfilePictureDisplay(){
        //When a user uploads a picture it becomes an object 
        if (typeof state.profilePictureValue !== "string"){
            return (
            <ul>
            {state.profilePictureValue ? (
                <li>{state.profilePictureValue.name}</li>
            ) : ( 
            ""
            )}
            </ul>
        );
    }
    //and if the user opens the profile page and if it already 
    //have a profile picture then it will be a string
    else if (typeof state.profilePictureValue === "string"){
        return (
            <Grid2 
        style={{marginTop:"0.5rem", marginRight: "auto", marginLeft:"auto"}}>
            <img src={props.userProfile.profilePic} 
            style={{height: "5rem", width: "5rem"}} />
        </Grid2>
        )
    }
    }


    return (
        <>
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

                    {/* to show the name of the profile picture uploaded */}
                    <Grid2 container>
                        {ProfilePictureDisplay()}
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
                            marginBottom: "2rem",
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
                        disabled={state.disabledBtn}
                    >
                        Update
                    </Button>
                </Grid2>
                </form>
                {/* this is the popup when user updates it profile */}
                <Snackbar
                open={state.openSnack}
                message="You have successfully updated your profile"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: "center"
                }}
                />
            </div>
        </>
        // new
    )
    }

    export default ProfileUpdate