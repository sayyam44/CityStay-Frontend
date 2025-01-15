import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2, Typography,CircularProgress,Breadcrumbs, Link, Button, TextField, FormControlLabel, Checkbox, IconButton, Card, CardMedia,CardContent, CardActions  } from '@mui/material';
import Axios from "axios";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useImmerReducer } from 'use-immer';

import StateContext from '../Contexts/StateContext';

import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function ListingDetail() {
    // const GlobalState = useContext(StateContext);
    // console.log(useParams());
    const params = useParams(); //useParams hook is used to get the
    //id of the particular agency from the url by using params.id 
    const navigate = useNavigate();
    const initialState = {
    //this is to check whether we get data from the server or not 
    //i.e. whether we are getting the predefined userProfile data 
    //see the below dispatch for type loadingDone
    dataIsLoading: true,
    listingInfo: "",
  };

    function ReducerFunction(draft, action) {
        switch (action.type) {      
        case "catchListingInfo":
            draft.listingInfo=action.listingObject;
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
        async function GetListingInfo(){
          try{
            const response = await Axios.get(
            
            //here we are getting the id of the agency by params.id 
            // using the useParams hook above
            `http://127.0.0.1:8000/api/listings/${params.id}/`);
            console.log(response.data);
            //response.data holds all the data of the user who 
            //is signed in and have clicked on add property button
            dispatch({
            type: 'catchListingInfo', 
            listingObject: response.data});
            //this is to check whether we have a predefined data of the 
            //user or not 
            dispatch({
                type: 'loadingdone',
            })
            } catch(e){
            console.log(e.response);
          }
        }
        GetListingInfo()
      },[])
    
    // this array will have all the pictures to create the pitures slider
    const listingPictures=[state.listingInfo.picture1,
        state.listingInfo.picture2,
        state.listingInfo.picture3,
        state.listingInfo.picture4,
        state.listingInfo.picture5,
    ].filter((picture)=> picture != null) //this is to just add those
    //pictures in the listingPictures array those values are not null
    //that means only those pics those are actually being uploaded 
    //by the user for this listing.
    
    //this useState hook is used to make the picture slider 
    const [currentPicture,setCurrentPicture] = useState(0)

    //picture back icon function
    function PreviousPicture(){
        if (currentPicture===0){
            return setCurrentPicture(listingPictures.length-1);
        }
        else{
            return setCurrentPicture(currentPicture-1);
        }
    }
    //picture forward icon function
    function NextPicture(){
        if (currentPicture=== listingPictures.length-1){
            return setCurrentPicture(0);
        }
        else{
            return setCurrentPicture(currentPicture+1);
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
    <div style={{ marginLeft: "2rem", marginRight: "1rem", marginBottom: "1rem" }}>
        <Grid2 sx={{marginTop: "1rem"}}>
            {/* Breadcrumbs helps in putting link on the frontend */}
            <Breadcrumbs aria-label="breadcrumb">
            <Link 
            underline="hover" 
            color="inherit" 
            onClick={()=> navigate("/Listings")}
            sx={{cursor: "pointer"}}>
                Listings
            </Link>
            <Typography sx={{ color: 'text.primary' }}>
                {state.listingInfo.title}
            </Typography>
            </Breadcrumbs>
        </Grid2>

        {/* image slider from the above created array containing all pictures*/}
        {/* using the above useState hook at setCurrentPicture */}
        {listingPictures.length > 0 ?(
        <Grid2 container justifyContent='center'
        sx={{position: 'relative',
            marginTop: '1rem'
        }}>
        {listingPictures.map((picture,index)=>{
            return (
                <div key={index}>
                    {index === currentPicture ? (
                        <img 
                        src={picture} 
                        style={{width: "45rem",height: "35rem" }}/>
                    ):(
                        ""
                    )}
                </div>
            )
        })}

        {/* Arrows to slide through images  */}
        <ArrowBackIcon 
        onClick={PreviousPicture}
        sx={{position: 'absolute',
            cursor: 'pointer',
            fontSize: '3rem',
            color: 'white',
            top: '50%',
            left:'27.5%',
            "&:hover":{
                backgroundColor: "black",
            },
        }}
        />
        <ArrowForwardIcon 
        onClick={NextPicture}
        sx={{position: 'absolute',
            cursor: 'pointer',
            fontSize: '3rem',
            color: 'white',
            top: '50%',
            right:'27.5%',
            "&:hover":{
                backgroundColor: "black",
            },
        }}
        />
        {/* {currentPicture} */}
        </Grid2>
        ): (
            ""
        )}
    </div>
  )
}

export default ListingDetail