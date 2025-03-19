import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2, Typography,Box,CircularProgress,Breadcrumbs, Link, Button, TextField, FormControlLabel, Checkbox, IconButton, Card, CardMedia,CardContent, CardActions,Dialog,Snackbar,Rating,Tooltip   } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
//react leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {Icon} from "leaflet";
//Contexts
import StateContext from '../Contexts/StateContext';
//Assets
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RoomIcon from '@mui/icons-material/Room';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import sadiumIconPng from './Assets/Mapicons/stadium.png'
import universityIconPng from './Assets/Mapicons/university.png'
import mallIconPng from './Assets/Mapicons/mall.png'
import collegeIconPng from './Assets/Mapicons/college.png'
import hospitalIconPng from './Assets/Mapicons/hospital.png'

//Components
import ListingUpdate from './ListingUpdate';
import AddReview from './AddReview';
import SendMessage from './SendMessage';

function ListingDetail() {
    //GlobalState--> Bringing data from parent component i.e. app.js
    const GlobalState = useContext(StateContext);
    
    console.log(useParams());
    const params = useParams(); //useParams hook is used to get the
    //id of the particular agency from the url by using params.id 
    const navigate = useNavigate();

    //creating the const for different types of icon(markers) to be 
    //shown on the map imported above from the assets folder in frontend
    const stadiumIcon = new Icon(
        {
            iconUrl:sadiumIconPng,
            iconSize:[40,40],
        }
    )
    const universityIcon = new Icon(
        {
            iconUrl:universityIconPng,
            iconSize:[40,40],
        }
    )
    const mallIcon = new Icon(
        {
            iconUrl:mallIconPng,
            iconSize:[40,40],
        }
    )
    const collegeIcon = new Icon(
        {
            iconUrl:collegeIconPng,
            iconSize:[40,40],
        }
    )
    const hospitalIcon = new Icon(
        {
            iconUrl:hospitalIconPng,
            iconSize:[40,40],
        }
    )

    const initialState = {
    //this is to check whether we get data from the server or not 
    //i.e. whether we are getting the predefined userProfile data 
    //see the below dispatch for type loadingDone
    dataIsLoading: true,
    listingInfo:"",
    listingInfo: "",
    openSnack:false, //this is the popup that occurs when the user logs in
    disabledBtn: false, //this is to disable the login button once it is clicked

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
        case 'catchSellerProfileInfo':
            draft.sellerProfileInfo=action.profileObject
            break
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

    //to get the current listing details
    useEffect(()=>{
        async function GetListingInfo(){
          try{
            const response = await Axios.get(
            
            //here we are getting the id of the agency by params.id 
            // using the useParams hook above
            `https://www.citystayinnl.com/api/listings/${params.id}/`);
            console.log(response.data);
            //response.data holds all the data of the user who 
            //is signed in and have clicked on add property button
            dispatch({
            type: 'catchListingInfo', 
            listingObject: response.data});
            } catch(e){
            console.log(e.response);
          }
        }
        GetListingInfo()
      },[])
    
    //to get the current user's profile details
    useEffect(()=>{
        if (state.listingInfo){
            async function GetProfileInfo(){
            try{
                const response = await Axios.get(
                
                //here we are getting the id of the agency by params.id 
                // using the useParams hook above
                `https://www.citystayinnl.com/api/profiles/${state.listingInfo.seller}/`);
                console.log(response.data);
                //response.data holds all the data of the user who 
                //is signed in and have clicked on add property button
                dispatch({
                type: 'catchSellerProfileInfo', 
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
        }
      },[state.listingInfo])
    
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

    //this is to show the date in frontend in proper format
    const date = new Date(state.listingInfo.date_posted)
    const formattedDate= `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`


    async function DeleteHandler(){
        const confirmDelete =window.confirm('Are you sure you want to delete this Listing?');
        if (confirmDelete){
            try {
                //deleting the listing on the basis of the listings id
                const response = 
                await Axios.delete(`https://www.citystayinnl.com/api/listings/${params.id}/delete/`);
                console.log(response.data);
                dispatch({type: 'openTheSnack'}); //this is to show the popup when user successfully uploads a listing
                // navigate("/listings");
                dispatch({type: 'disabledButton'});
            }catch(e){
                dispatch({type: 'allowTheButton'});
                console.log(e.response.data)
            }
        }
    }

    //this is used to show the popup for 1.5 sec before being navigating
    //to the homepage 
    useEffect(()=>{
        if (state.openSnack){
            setTimeout(()=>{
                navigate("/listings");
            },1500);
        }
    },[state.openSnack])

    //this is for showing the update or add review dialog box
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
        };

    const handleClose = () => {
        setOpen(false);
        };
    
    //this is for showing the message and add review dialog boxes
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const [openReviewDialog, setOpenReviewDialog] = useState(false);

    // Functions to handle opening/closing dialogs
    const handleOpenMessageDialog = () => setOpenMessageDialog(true);
    const handleCloseMessageDialog = () => setOpenMessageDialog(false);

    const handleOpenReviewDialog = () => setOpenReviewDialog(true);
    const handleCloseReviewDialog = () => setOpenReviewDialog(false);

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
    <div style={{ margin: "1rem" }}>
        {/* Breadcrumbs on Top Left */}
        <Grid2 xs={12} sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            onClick={() => navigate("/Listings")}
                            sx={{ cursor: "pointer" }}
                        >
                            Listings
                        </Link>
                        <Typography sx={{ color: "text.primary" }}>{state.listingInfo.title}</Typography>
                    </Breadcrumbs>
                </Grid2>


            <Grid2 container spacing={2} sx={{ marginTop: "0rem" }}>
            
            {/* Left: Image Slider below Breadcrumbs */}
            <Grid2 xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
                {listingPictures.length > 0 && (
                    <div style={{ position: "relative", width: "100%", maxWidth: "40rem" }}>
                        <img
                            src={listingPictures[currentPicture]}
                            alt="Property"
                            style={{ width: "100%", height: "30rem", border: "4px solid black", objectFit: "cover" }}
                        />
                        <ArrowBackIcon
                            onClick={PreviousPicture}
                            sx={{
                                position: "absolute",
                                cursor: "pointer",
                                fontSize: "3rem",
                                color: "white",
                                top: "50%",
                                left: "1rem",
                                transform: "translateY(-50%)",
                                backgroundColor: "orange",
                                borderRadius: "50%",
                                padding: "0.5rem",
                                "&:hover": { backgroundColor: "black" },
                            }}
                        />
                        <ArrowForwardIcon
                            onClick={NextPicture}
                            sx={{
                                position: "absolute",
                                cursor: "pointer",
                                fontSize: "3rem",
                                color: "white",
                                top: "50%",
                                right: "1rem",
                                transform: "translateY(-50%)",
                                backgroundColor: "orange",
                                borderRadius: "50%",
                                padding: "0.5rem",
                                "&:hover": { backgroundColor: "black" },
                            }}
                        />
                    </div>
                )}
            </Grid2>

            {/* Right: Property Info */}
            <Grid2 xs={12} md={6} sx={{ padding: "1rem", border: "1px solid black", marginTop: "1rem",minWidth: "40rem",maxWidth: "40rem",height:"30rem" }}>
                <Typography variant="h5" sx={{ fontWeight: "bolder", color: "blue" }}>
                    {state.listingInfo.listing_type} | {state.listingInfo.property_staus === "Sale"
                        ? `$${state.listingInfo.price.toLocaleString()}`
                        : `$${state.listingInfo.price.toLocaleString()}/${state.listingInfo.rental_frequency}`}
                </Typography>
                <Typography variant="h5">{state.listingInfo.title}</Typography>
                <Grid2 container alignItems="center" spacing={1}>
                    <RoomIcon />
                    <Typography variant="h6">{state.listingInfo.address} - {(state.listingInfo.borough)}</Typography>
                </Grid2>
                <Typography variant="subtitle1">{state.listingInfo.formattedDate}</Typography>

                {/* Rooms & Amenities */}
                <Grid2 container spacing={2} sx={{ padding: "1rem", border: "1px solid black" }}>
                    {state.listingInfo.rooms && (
                        <Grid2>
                            <Typography variant="h6">{state.listingInfo.rooms} Rooms</Typography>
                        </Grid2>
                    )}
                    {[{ label: "Furnished", value: state.listingInfo.furnished },
                        { label: "Utilities", value: state.listingInfo.utilities },
                        { label: "Pet Friendly", value: state.listingInfo.petfriendly },
                        { label: "CCTV", value: state.listingInfo.cctv },
                        { label: "Parking", value: state.listingInfo.parking }]
                        .filter(item => item.value)
                        .map((item, index) => (
                        <Grid2 key={index} sx={{ display: "flex", alignItems: "center" }}>
                            <CheckBoxIcon sx={{ color: "green", fontSize: "2rem" }} />
                            <Typography variant="h6">{item.label}</Typography>
                        </Grid2>
                    ))}
                </Grid2>

                {/* Description */}
                {state.listingInfo.description && (
                    <Grid2 sx={{ padding: "1rem", border: "1px solid black", marginTop: "1rem" }}>
                        <Typography variant="h5">Description</Typography>
                        <Typography variant="h6">{state.listingInfo.description}</Typography>
                    </Grid2>
                )}
            </Grid2>
        </Grid2>
        
        {/* Seller Info */}
                <Grid2
                container
                style={{
                    width: "80%", // Smaller width for the box
                    maxWidth: "600px", // Limit maximum width for larger screens
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "5px solid black",
                    marginTop: "1rem",
                    padding: "20px", // Increased padding for better spacing
                    borderRadius: "10px", // Rounded corners
                    display: "flex",
                    flexDirection: "column", // Stack content vertically
                    alignItems: "center", // Center content horizontally
                    justifyContent: "center", // Center content vertically
                }}
                >
                {/* Seller Profile Picture */}
                <Grid2
                    style={{
                    textAlign: "center",
                    marginBottom: "1rem", // Space below the image
                    }}
                >
                    <img
                    style={{
                        height: "10rem",
                        width: "100%", // Responsive width
                        maxWidth: "15rem", // Limit maximum width
                        cursor: "pointer",
                        borderRadius: "10px", // Rounded corners for the image
                    }}
                    src={
                        state.sellerProfileInfo.profile_picture !== null
                        ? state.sellerProfileInfo.profile_picture
                        : defaultProfilePicture
                    }
                    onClick={() => navigate(`/agencies/${state.sellerProfileInfo.seller}`)}
                    />
                </Grid2>

                {/* Seller Agency Info */}
                <Grid2
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ textAlign: "center" }}
                >
                    {/* Agency Name */}
                    <Grid2>
                    <Typography variant="h5">
                        <span style={{ color: "blue", fontWeight: "bolder" }}>
                        {state.sellerProfileInfo.agency_name}
                        </span>
                    </Typography>
                    </Grid2>

                    {/* Phone Number */}
                    <Grid2>
                    <Typography variant="h5">
                        <IconButton>
                        <ContactPhoneIcon /> {state.sellerProfileInfo.phone_number}
                        </IconButton>
                    </Typography>
                    </Grid2>

                    {/* Update and Delete Buttons (Visible to Seller) */}
                    {GlobalState.userId == state.listingInfo.seller ? (
                    <Grid2
                        container
                        direction="column"
                        alignItems="center"
                        style={{ marginTop: "1rem", gap: "10px" }}
                    >
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        >
                        Update
                        </Button>
                        <Button
                        variant="contained"
                        color="error"
                        onClick={DeleteHandler}
                        disabled={state.disabledBtn}
                        >
                        Delete
                        </Button>
                        <Dialog open={open} onClose={handleClose} fullScreen>
                        <ListingUpdate listingData={state.listingInfo} closeDialog={handleClose} />
                        </Dialog>
                    </Grid2>
                    ) : null}

                    {/* Messaging Button (Visible to Logged-in Users Except Seller) */}
                    {GlobalState.userId !== state.listingInfo.seller && GlobalState.userIsLogged ? (
                    <Grid2
                        container
                        direction="column"
                        alignItems="center"
                        style={{ marginTop: "1rem", gap: "10px" }}
                    >
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenMessageDialog}
                        >
                        Send Message
                        </Button>
                        <Dialog
                        open={openMessageDialog}
                        onClose={handleCloseMessageDialog}
                        maxWidth="md"
                        fullWidth
                        >
                        <SendMessage recipientId={state.listingInfo.seller} />
                        </Dialog>
                    </Grid2>
                    ) : null}
                </Grid2>
            </Grid2>

    {/* Map and POIs */}
    <Grid2 container spacing={2} sx={{ padding: 2 }}>
        {/* POIs List (Left Column) */}
        <Grid2 item xs={12} size={3} sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Typography
            variant="h5"
            align="center"
            sx={{
                fontWeight: "bold",
                color: "blue",
                fontSize: "1.5rem",
                position: "sticky", // Makes it stick at the top
                top: 0, // Ensures it sticks at the top
                backgroundColor: "white", // Optional: ensures the background remains visible if the page has a background color
                zIndex: 1, // Keeps the text above other elements if necessary
                padding: "0.5rem", // Adds some space around the text for readability
            }}
        >
            Nearby Places (2 kms)
        </Typography>

            {/* Mapping through each POI within 2km of the current listing */}
            {state.listingInfo.listing_pois_within_2km.map((poi) => {
            // Convert degrees to radians
            function DegreeToRadian(coordinate) {
                return (coordinate * Math.PI) / 180;
            }

            // Calculate distance between two points on the map
            function CalculateDistance() {
                // Convert coordinates of the current property to radians
                const latitude1 = DegreeToRadian(state.listingInfo.latitude);
                const longitude1 = DegreeToRadian(state.listingInfo.longitude);

                // Convert coordinates of the POI to radians
                const latitude2 = DegreeToRadian(poi.location.coordinates[0]);
                const longitude2 = DegreeToRadian(poi.location.coordinates[1]);

                // Haversine formula
                const latDiff = latitude2 - latitude1;
                const lonDiff = longitude2 - longitude1;
                const R = 6371; // Earth's radius in kilometers

                const a =
                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                Math.cos(latitude1) *
                    Math.cos(latitude2) *
                    Math.sin(lonDiff / 2) *
                    Math.sin(lonDiff / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const d = R * c; // Distance in kilometers
                return d.toFixed(2);
            }

            return (
                <div
                key={poi.id}
                style={{
                    marginBottom: "0.5rem",
                    border: "1px solid black",
                    padding: "0.5rem",
                    borderRadius: "8px", // Optional: Rounded corners
                }}
                >
                <Typography variant="h6">{poi.name}</Typography>
                <Typography variant="subtitle1">
                    {poi.type} |{" "}
                    <span style={{ fontWeight: "bolder", color: "blue" }}>
                    {CalculateDistance()} Kilometers
                    </span>
                </Typography>
                </div>
            );
            })}
        </Grid2>

        {/* Map (Right Column) */}
        <Grid2 item xs={12} size={9} >
        <div style={{ height: "70vh" }} justifyContent="flex-end">
            <MapContainer
            center={[state.listingInfo.latitude, state.listingInfo.longitude]}
            zoom={13}
            scrollWheelZoom={true}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Marker for the current listing */}
            <Marker position={[state.listingInfo.latitude, state.listingInfo.longitude]}>
                <Popup>{state.listingInfo.title}</Popup>
            </Marker>

            {/* Markers for POIs */}
            {state.listingInfo.listing_pois_within_2km.map((poi) => {
                // Define different types of icons (markers)
                function PoiIcon() {
                if (poi.type === "Stadium") return stadiumIcon;
                else if (poi.type === "University") return universityIcon;
                else if (poi.type === "Hospital") return hospitalIcon;
                else if (poi.type === "Mall") return mallIcon;
                else if (poi.type === "College") return collegeIcon;
                }

                return (
                <Marker
                    key={poi.id}
                    position={[poi.location.coordinates[0], poi.location.coordinates[1]]}
                    icon={PoiIcon()}
                >
                    <Popup>{poi.name}</Popup>
                </Marker>
                );
            })}
            </MapContainer>
            </div>
        </Grid2>
    </Grid2>


    {/* reviews */}
        {/* Reviews Heading */}
<Grid2 container justifyContent="center" sx={{ mt: 4 }}>
    <Grid2 item xs={12}>
        <Typography 
            variant="h4" 
            sx={{ 
                fontWeight: "bold", 
                textAlign: "center",
                width: "100%",
                display: "block",
            }}
        >
            Reviews
        </Typography>
    </Grid2>
</Grid2>

{/* Reviews Section */}
<Grid2 container justifyContent="center" spacing={2} sx={{ mt: 2, px: 2 }}>
    {[...state.listingInfo.reviews]
        .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted))
        .map((review) => {
            const date = new Date(review.date_posted);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            return (
                <Grid2 item xs={12} sm={6} md={4} lg={3} key={review.id} display="flex" justifyContent="center">
                    <Card sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                {review.review_username}
                            </Typography>
                            <Typography variant="body1">{review.review}</Typography>
                            <Rating name={`rating-${review.id}`} value={review.rating} readOnly sx={{ mt: 1 }} />
                            <Typography variant="h6" color="primary">
                                {formattedDate}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            );
        })}
</Grid2>

{/* Add Review Button */}
<Box sx={{ mt: 4, textAlign: "center" }}>
    {GlobalState.userIsLogged && GlobalState.userId !== state.listingInfo.seller ? (
        <>
            <Button 
                sx={{
                    color: "white",
                    backgroundColor: "green",
                    width: { xs: "100%", sm: "10rem" }, // Responsive width
                    fontSize: "1.1rem",
                    mx: "auto",
                    "&:hover": { backgroundColor: "blue" },
                }}
                onClick={handleOpenReviewDialog}
            >
                Add Review
            </Button>
            <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} maxWidth="md" fullWidth>
                <AddReview listingData={state.listingInfo} />
            </Dialog>
        </>
    ) : null}

    {!GlobalState.userIsLogged ? (
        <Tooltip title="You need to log in to add a review to this property">
            <span>
                <Button
                    sx={{
                        color: "white",
                        backgroundColor: "grey",
                        width: { xs: "100%", sm: "10rem" },
                        fontSize: "1.1rem",
                        mx: "auto",
                        "&:hover": { backgroundColor: "white", cursor: "not-allowed" },
                        "&.Mui-disabled": {
                            color: "white",
                            backgroundColor: "grey",
                        },
                    }}
                    disabled
                >
                    Add Review
                </Button>
            </span>
        </Tooltip>
    ) : null}

    {GlobalState.userIsLogged && GlobalState.userId === state.listingInfo.seller ? (
        <Tooltip title="You cannot add a review to your own property">
            <span>
                <Button
                    sx={{
                        color: "white",
                        backgroundColor: "grey",
                        width: { xs: "100%", sm: "10rem" },
                        fontSize: "1.1rem",
                        mx: "auto",
                        "&:hover": { backgroundColor: "white", cursor: "not-allowed" },
                        "&.Mui-disabled": {
                            color: "white",
                            backgroundColor: "grey",
                        },
                    }}
                    disabled
                >
                    Add Review
                </Button>
            </span>
        </Tooltip>
    ) : null}
</Box>

{/* Snackbar Notification */}
<Snackbar
    open={state.openSnack}
    message="You have successfully deleted the property"
    anchorOrigin={{
        vertical: 'bottom',
        horizontal: "center"
    }}
/>

    </div>
  )
}

export default ListingDetail;