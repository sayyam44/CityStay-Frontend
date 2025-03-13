import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2, Typography,CircularProgress, Button,Dialog, TextField, FormControlLabel, Checkbox, IconButton, Card, CardMedia,CardContent, CardActions  } from '@mui/material';
import Axios from "axios";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useImmerReducer } from 'use-immer';

import StateContext from '../Contexts/StateContext';

import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'
import SendMessage from './SendMessage';


//This is to show the detail page of each agency 

//**In this we used useParams hook to get the agency data on basis of
//its id directly by the url defined in app.js file at path="/agencies/:id"
//as well as the backend url defined for agency/id 
//useParams hook returns an object with url parameters.(here useParams
//is used to get the id of the particular agency)
function AgencyDetail() {
    const GlobalState = useContext(StateContext);
    // console.log(useParams());
    const params = useParams(); //useParams hook is used to get the
    //id of the particular agency from the url by using params.id 
    const navigate = useNavigate();
    const initialState = {
        userProfile: {
            //To prefill these values in the my profile page 
            //go to profileUpdate that is a child component of this component.
            agencyName: '',
            phoneNumber: '',
            profilePic: '',
            bio: '',
            sellerListings:[],//this holds all the listings of the current seller
            seller_username:'',
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
            //this holds all the listings of this seller
            draft.userProfile.sellerListings = action.profileObject.seller_listings;
            draft.userProfile.seller_username = action.profileObject.seller_username;
            break;
        case "loadingdone": //to check whther the userprofile data 
        //is already present or not 
            draft.dataIsLoading = false;
            break;
      }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);
    // this is to handle the message functionality
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const handleOpenMessageDialog = () => setOpenMessageDialog(true);
    const handleCloseMessageDialog = () => setOpenMessageDialog(false);

    
    //to get the current user's profile details
    useEffect(()=>{
        async function GetProfileInfo(){
          try{
            const response = await Axios.get(
            
            //here we are getting the id of the agency by params.id 
            // using the useParams hook above
            `https://www.citystayinnl.com/api/profiles/${params.id}/`);
            // console.log(response.data);
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
            // console.log(e.response);
          }
        }
        GetProfileInfo()
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
        <div>
        <Grid2
        container
        sx={{
            width: { xs: "90%", sm: "70%", md: "50%" },
            margin: "1rem auto",
            border: "5px solid black",
            padding: "5px",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
        }}
        >
        {/* Profile Picture */}
        <Grid2 xs={12} sm={6} display="flex" justifyContent="center">
            <img
            style={{ height: "10rem", width: "15rem" }}
            src={
                state.userProfile.profilePic !== null
                ? state.userProfile.profilePic
                : defaultProfilePicture
            }
            />
        </Grid2>

        {/* Profile Details */}
        <Grid2
            container
            direction="column"
            xs={12}
            sm={6}
            sx={{
            textAlign: "center",
            marginTop: { xs: "1rem", sm: 0 },
            marginLeft: { xs: 0, lg: "2rem" },
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "green" }}>
            {state.userProfile.agencyName}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {"Owner - "} {state.userProfile.seller_username}
            </Typography>

            <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1 }}
            >
            <ContactPhoneIcon />
            {state.userProfile.phoneNumber}
            </Typography>

            <Typography sx={{ marginTop: "1rem", padding: "5px" }}>
            {state.userProfile.bio}
            </Typography>

            {GlobalState.userId !== params.id && GlobalState.userIsLogged && (
            <Grid2 container justifyContent="center" alignItems="center">
                <Button
                variant="contained"
                color="primary"
                onClick={handleOpenMessageDialog}
                sx={{ marginTop: "1rem" }}
                >
                Send Message
                </Button>
                <Dialog open={openMessageDialog} onClose={handleCloseMessageDialog} maxWidth="md" fullWidth>
                <SendMessage recipientId={params.id} />
                </Dialog>
            </Grid2>
            )}
            </Grid2>
        </Grid2>




    <Grid2 container justifyContent="flex-start" spacing={2} 
    sx={{ padding: "10px" }}> 
        {/* here listing is iterating on the list of all the listings
        of the current user*/}
        {state.userProfile.sellerListings.map((listing)=>{
        return (
        //here we are generating key id for each of the listing 
            // <Grid2 key={listing.id} sx={{ marginTop: '1rem', maxWidth: "20rem" }}> 
            <Grid2 key={listing.id} sx={{ marginTop: '1rem', width: "15rem" }}> 
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <CardMedia
                    component="img"
                    sx={{
                      height: 140, // Enforce consistent height
                      width: "100%", // Ensure it fills the width of the card
                      objectFit: "cover", // Crop or scale image to fit the defined dimensions
                      cursor: "pointer",
                    }}
                    image={
                        //we are accessing the pictures like this
                        //to get over the issue of not getting the 
                        //full path of each listing in each card
                        //because django does not allow it directly.
                        listing.picture1
                        ? listing.picture1 :
                        defaultProfilePicture }
                    alt="Listing Picture"
                    onClick={()=>navigate(`/listings/${listing.id}`)}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {listing.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {listing.description.substring(0,100)}...
                    </Typography>
                </CardContent>
                <CardActions>
                    {listing.property_status === 'Sale' ? 
                    `${listing.listing_type}: $${listing.price
                        .toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    } - On Sale`  
                    : `${listing.listing_type}: $ ${listing.price
                        .toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }/${listing.rental_frequency}`}
                </CardActions>
                </Card>
            </Grid2>
            
            );
        })}
        </Grid2>
    

    </div>
  )
}

export default AgencyDetail