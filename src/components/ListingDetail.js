import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2, Typography,CircularProgress,Breadcrumbs, Link, Button, TextField, FormControlLabel, Checkbox, IconButton, Card, CardMedia,CardContent, CardActions  } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

import StateContext from '../Contexts/StateContext';

import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RoomIcon from '@mui/icons-material/Room';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
//react leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function ListingDetail() {
    const GlobalState = useContext(StateContext);
    // console.log(useParams());
    const params = useParams(); //useParams hook is used to get the
    //id of the particular agency from the url by using params.id 
    const navigate = useNavigate();
    const initialState = {
    //this is to check whether we get data from the server or not 
    //i.e. whether we are getting the predefined userProfile data 
    //see the below dispatch for type loadingDone
    dataIsLoading: true,
    listingInfo:"",
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
        case 'catchSellerProfileInfo':
            draft.sellerProfileInfo=action.profileObject
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
                sx={{fontWeight: "bolder", color: "green"}}>
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
							<span style={{ color: "green", fontWeight: "bolder" }}>
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
			</Grid2>

            {/* map */}
            <Grid2 
            container 
            style={{marginTop: '1rem'}}
            spacing={1}
            justifyContent="space-between">
                <Grid2 xs={3}> 
                    Points of Interest 
                </Grid2>
                <Grid2 xs={9} style={{height: "35rem"}}>
                    <MapContainer 
                    center={[47.56431808943282,-52.730079775120906]} 
                    zoom={11} 
                    scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                </Grid2>
            </Grid2>
    </div>
  )
}

export default ListingDetail;