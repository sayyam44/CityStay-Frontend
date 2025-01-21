import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2, Typography,CircularProgress,Breadcrumbs, Link, Button, TextField, FormControlLabel, Checkbox, IconButton, Card, CardMedia,CardContent, CardActions,Dialog,Snackbar  } from '@mui/material';
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


function ListingDetail() {
    const GlobalState = useContext(StateContext);
    // console.log(useParams());
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
            `http://127.0.0.1:8000/api/listings/${params.id}/`);
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
                `http://127.0.0.1:8000/api/profiles/${state.listingInfo.seller}/`);
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
                await Axios.delete(`http://127.0.0.1:8000/api/listings/${params.id}/delete/`);
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

    //this is for showing the update dialog box
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
        };

    const handleClose = () => {
        setOpen(false);
        };

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
        {/* More Information of the property */}
        <Grid2 container sx={{padding: '1rem',
            border: '1px solid black', 
            marginTop:"1rem"
             }} spacing={20} >
            <Grid2 container xs={7} 
            direction="column"
            spacing={1}>
                <Grid2>
                    <Typography variant="h5">
                        {state.listingInfo.title}
                    </Typography>
                </Grid2>
                <Grid2>
                    <RoomIcon />{" "}
                    <Typography variant="h6">
                        {state.listingInfo.borough}
                    </Typography>
                </Grid2>
                <Grid2>
                    <Typography variant="subtitle1">
                        {formattedDate}
                    </Typography>
                </Grid2>
            </Grid2>
            <Grid2 container xs={5} alignItems="center">
                <Typography variant='h6' 
                sx={{fontWeight: "bolder", color: "blue"}}>
                    {state.listingInfo.listing_type} | 
                    {state.listingInfo.property_staus === 'Sale' ? 
                    `$${state.listingInfo.price.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : 
                    `$${state.listingInfo.price.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${state.listingInfo.rental_frequency}`}
                </Typography>
            </Grid2>
        </Grid2>

        <Grid2
				container
				justifyContent="flex-start"
                spacing={15} 
				style={{
					padding: "1rem",
					border: "1px solid black",
					marginTop: "1rem",
				}}
			>
				{state.listingInfo.rooms ? (
					<Grid2 xs={2} style={{ display: "flex" }}>
						<Typography variant="h6">
							{state.listingInfo.rooms} Rooms
						</Typography>
					</Grid2>
				) : (
					""
				)}

				{state.listingInfo.furnished ? (
					<Grid2 xs={2} style={{ display: "flex" }}>
						<CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
						<Typography variant="h6">Furnished</Typography>
					</Grid2>
				) : (
					""
				)}

				{state.listingInfo.pool ? (
					<Grid2 xs={2} style={{ display: "flex" }}>
						<CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
						<Typography variant="h6">Pool</Typography>
					</Grid2>
				) : (
					""
				)}

				{state.listingInfo.elevator ? (
					<Grid2 xs={2} style={{ display: "flex" }}>
						<CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
						<Typography variant="h6">Elevator</Typography>
					</Grid2>
				) : (
					""
				)}

				{state.listingInfo.cctv ? (
					<Grid2 xs={2} style={{ display: "flex" }}>
						<CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
						<Typography variant="h6">Cctv</Typography>
					</Grid2>
				) : (
					""
				)}

				{state.listingInfo.parking ? (
					<Grid2 xs={2} style={{ display: "flex" }}>
						<CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
						<Typography variant="h6">Parking</Typography>
					</Grid2>
				) : (
					""
				)}
			</Grid2>
        
        {/* Description */}
			{state.listingInfo.description ? (
				<Grid2
					style={{
						padding: "1rem",
						border: "1px solid black",
						marginTop: "1rem",
					}}
				>
					<Typography variant="h5">Description</Typography>
					<Typography variant="h6">{state.listingInfo.description}</Typography>
				</Grid2>
			) : (
				""
			)}
        
        {/* Seller Info */}
			<Grid2
				container
				style={{
					width: "50%",
					marginLeft: "auto",
					marginRight: "auto",
					border: "5px solid black",
					marginTop: "1rem",
					padding: "5px",
				}}
                
			>
				<Grid2 xs={6}>
					<img
						style={{ height: "10rem", width: "15rem", cursor: "pointer" }}
						src={
							state.sellerProfileInfo.profile_picture !== null
								? state.sellerProfileInfo.profile_picture
								: defaultProfilePicture
						}
						onClick={() =>
							navigate(`/agencies/${state.sellerProfileInfo.seller}`)
						}
					/>
				</Grid2>
				<Grid2 
                 container 
                 direction="column" 
                 justifyContent="center" 
                 xs={6}
                 marginLeft="4rem">
					<Grid2>
						<Typography
							variant="h5"
							style={{ textAlign: "center", marginTop: "1rem" }}
						>
							<span style={{ color: "blue", fontWeight: "bolder" }}>
								{state.sellerProfileInfo.agency_name}
							</span>
						</Typography>
					</Grid2>
					<Grid2>
						<Typography
							variant="h5"
							style={{ textAlign: "center", marginTop: "1rem" }}
						>
							<IconButton>
                            <ContactPhoneIcon /> {state.sellerProfileInfo.phone_number}
							</IconButton>
						</Typography>
					</Grid2>
				</Grid2>

            {/* updating and deleting functionality*/}
            {/* GlobalState.userId means to check the user id of the listing
            that is opened by the user currently */}
            {GlobalState.userId == state.listingInfo.seller ? (
                <Grid2 container style={{ paddingLeft: '200px' }} gap={10}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Update</Button>
                <Button 
                variant="contained" 
                color="error" 
                onClick={DeleteHandler} 
                disabled={state.disabledBtn}>
                    Delete</Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullScreen 
                    
                >
                    {/* using props to access the data of the current listing */}
                    <ListingUpdate 
                    listingData ={state.listingInfo} 
                    closeDialog={handleClose}
                    /> 
                </Dialog>

                </Grid2>
            ) : ("")}

			</Grid2>


            {/* map */}
            <Grid2 
            container spacing={2} style={{marginTop: "1rem"}}>
            
                <Grid2  xs={12} sm={3}  > 
                    {/* mapping through each poi within 2km of the current listing */}
                {state.listingInfo.listing_pois_within_2km.map((poi)=>{
                    //this is to convert the degree to radian to use it in below function
                    function DegreeToRadian(coordinate){
                        return coordinate*Math.PI/180
                    }
                    // This is to find the distance between 2 points on map using their latitude and longitude
                    function CalculateDistance() {
                        //converting the corrdinates of current property to radians
                        const latitude1=DegreeToRadian(state.listingInfo.latitude)
                        const longitude1=DegreeToRadian(state.listingInfo.longitude)

                        //converting the corrdinates of pois to radians
                        const latitude2=DegreeToRadian(poi.location.coordinates[0])
                        const longitude2=DegreeToRadian(poi.location.coordinates[1])

                        //FORMULA
                        const latDiff = latitude2 - latitude1;
                        const lonDiff = longitude2 - longitude1;
                        const R = 6371000 / 1000;

                        const a =
                            Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                            Math.cos(latitude1) *
                                Math.cos(latitude2) *
                                Math.sin(lonDiff / 2) *
                                Math.sin(lonDiff / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                        const d = R * c;

                        const dist =
                            Math.acos(
                                Math.sin(latitude1) * Math.sin(latitude2) +
                                    Math.cos(latitude1) *
                                        Math.cos(latitude2) *
                                        Math.cos(lonDiff)
                            ) * R;
                        return dist.toFixed(2);
                    }

                        return (
                            <div key={poi.id} style={{marginBottom: '0.5rem', border: '1px solid black'}}>
                            <Typography variant='h6'>
                                {poi.name}
                            </Typography >
                            <Typography variant='subtitle1'>
                                {poi.type} | <span style={{fontWeight:'bolder', color: 'blue'}}> {CalculateDistance()} Kilometers </span>
                            </Typography>
                            </div>
                        );
                    })}
                </Grid2>
                <Grid2 xs={12} sm={9} style={{ height: '70vh' , width: '120vh'}}>
                    <MapContainer 
                    center={[state.listingInfo.latitude,
                        state.listingInfo.longitude]} 
                    zoom={13} 
                    scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker 
                        position={
                        [state.listingInfo.latitude,
                        state.listingInfo.longitude]}>
                            <Popup>
                                {state.listingInfo.title}
                            </Popup>
                        </Marker>

                        {/* this is to show all the pois on the map */}
                        {state.listingInfo.listing_pois_within_2km.map((poi)=>{
                            
                            //this defines the different types of icons(markers)
                            //used in the map created above in const
                            function PoiIcon(){
                                if (poi.type === "Stadium"){
                                    return stadiumIcon
                                }
                                else if (poi.type === "University"){
                                    return universityIcon
                                }
                                else if (poi.type === "Hospital"){
                                    return hospitalIcon
                                }
                                else if (poi.type === "Mall"){
                                    return mallIcon
                                }
                                else if (poi.type === "College"){
                                    return collegeIcon
                                }
                            }
                            return (
                                <Marker 
                                key={poi.id}
                                position={[
                                    poi.location.coordinates[0],
                                    poi.location.coordinates[1],
                                ]}
                                // calling the above function to show different types of markers
                                icon={PoiIcon()} 
                                >
                                    <Popup>
                                    {poi.name}
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </Grid2>
            </Grid2>
        {/* this is the popup when user logs in  */}
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