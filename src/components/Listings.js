import React,{ useState,useEffect } from 'react';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap,} from 'react-leaflet';
import { Grid2,
  AppBar,
  Typography,
  Button, 
  Card, 
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
  CardActions,TextField,InputAdornment,Pagination,
  Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle,MenuItem, } from '@mui/material';

import { Icon } from "leaflet";
import houseIconPng from "./Assets/Mapicons/house.png"
import apartmentIconPng from "./Assets/Mapicons/apartment.png"
import officeIconPng from "./Assets/Mapicons/office.png"

import img1 from './Assets/img1.jpg'
import myListings from './Assets/Data/Dummydata';
import RoomIcon from '@mui/icons-material/Room';
import SearchIcon from '@mui/icons-material/Search';
import { latLng } from 'leaflet';

import L from "leaflet";

function Listings() {
  // fetch('http://127.0.0.1:8000/api/listings/')
  // .then(response=>response.json())
  // .then(data=>console.log(data))

  const navigate = useNavigate();

  const houseIcon = new Icon({
		iconUrl: houseIconPng,
		iconSize: [40, 40],
	});

	const apartmentIcon = new Icon({
		iconUrl: apartmentIconPng,
		iconSize: [40, 40],
	});

	const officeIcon = new Icon({
		iconUrl: officeIconPng,
		iconSize: [40, 40],
	});

  const[latitude,setLatitude] = useState(47.56431808943282)
  const[longitude,setLongitude] = useState(-52.730079775120906)
  
  const initialState = {
  mapInstance:null, //map initial position is null defined here but 
  //still when we load the page we will be at the centre as per 
  //mp component being defined below
  };

function ReducerFunction(draft, action) {
    switch (action.type) {
    // the utility function for below case is for TheMapComponent() function
  case "getMap": //this case is to zoom into map for the area selected 
    draft.mapInstance = action.mapData;
    //mapInstance now holds all the map data
    break
  }

  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  // This function defines the functionality for zooming in into the
  //map when the user selects some area 
  // TheMapComponent function is being called below in mapContainer
  function TheMapComponent(){
    const map=useMap(); //useMap function is an inbuilt function of react leaflet
    dispatch({type: 'getMap', mapData: map }); //mapData have all the current map cata
    return null;
  }


  function GoEast(){
    setLatitude(47.56582430655992)
    setLongitude(-52.722741113637845)
  }

  function GoCenter(){
    setLatitude(47.56431808943282)
    setLongitude(-52.730079775120906)
  }
  // console.log(myListings)

  const polyOne = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ];

  //this useState hook is to hold allListings data 
  const [allListings,setAllListings] = useState([]);

  //to get the filtered listings om the basis of the input in search tab by user
  const [filteredListings, setFilteredListings] = useState([]); // Holds filtered results
  const [searchQuery, setSearchQuery] = useState(""); // Holds search input

  // the below hook is created to get over the issue we got in 
  //console when we were reloading the page, we were unable to access 
  // the data for location using console.log(allListings[0].location)
  const [dataIsLoading, setDataIsLoading] = useState(true)

  // Pagination state
  // All the logic for pagination below is dependent on the 
  // currentPage element defined here.
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5; // Show 3 listings per page

  // this is for allowing permission and holding the current location of the user
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState("20");
  const [openDialog, setOpenDialog] = useState(true)

  //to run the filterListings function always
  useEffect(() => {
    filterListings();
  }, [selectedDistance, userLocation, allListings, searchQuery]);

  // to get the necessary values to calculate distance of the user from listings 
  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
            setLocationPermission(true);
            setOpenDialog(false);
        },
        () => {
            alert("Location access denied");
            setOpenDialog(false);
            setLocationPermission(false);
            setUserLocation(null); // Ensure it's explicitly null
            setOpenDialog(false);
            filterListings(); // Call filter function even if location is denied
        }
    );
};

  useEffect(() => {
    // The below canceltoken can cancel the request even before the 
    // request is not finished yet to prevent data leaks.
    const source = Axios.CancelToken.source();
    async function GetAllListings(){
      try{
        //response holds all the lising data
      const response = await Axios.get('http://127.0.0.1:8000/api/listings/',{cancelToken: source.token});
      console.log(response.data);
      setAllListings(response.data);
      setFilteredListings(response.data); // Set filtered list initially
      setDataIsLoading(false);
    } catch(error){
      console.log(error.response);
    }}
    GetAllListings();
    return ()=>{
      source.cancel();
    }
  }, []);

  if (dataIsLoading === false) {
    console.log(allListings[0].location);
  }

  // initially the filtered listings holds all the listings 
  //then if the user have allowed the location permisiion then filtering happens on the basis of the location
  //then if the user searches for some listing then the filtering also happens on that basis
  const filterListings = () => {
      let filtered = allListings; //INITIALLY FILTERED LISTINGS HOLDS ALL THE LISTINGS
      if (userLocation && selectedDistance) {
        filtered = filtered.filter((listing) => {
            const distance = latLng(userLocation.lat, userLocation.lon).distanceTo(
                latLng(listing.latitude, listing.longitude)
            ) / 1000; // Convert meters to km
            //this filters the listings on the basis of the slected distance from the dropdown
            return distance <= parseInt(selectedDistance);
        });
      }
      if (searchQuery.trim() !== "") {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((listing) =>
            listing.seller_username.toLowerCase().includes(lowerCaseQuery) ||
            listing.title.toLowerCase().includes(lowerCaseQuery) ||
            listing.listing_type.toLowerCase().includes(lowerCaseQuery) ||
            listing.area.toLowerCase().includes(lowerCaseQuery) ||
            listing.borough.toLowerCase().includes(lowerCaseQuery) ||
            listing.property_status.toLowerCase().includes(lowerCaseQuery) ||
            listing.rental_frequency.toLowerCase().includes(lowerCaseQuery) ||
            listing.seller_agency_name.toLowerCase().includes(lowerCaseQuery) ||
            listing.price.toString().includes(lowerCaseQuery)
        );
      }

      setFilteredListings(filtered);
      setCurrentPage(1); // Reset to first page on new search
  };

  // NEW
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
// };

  //REMOVED NEW
  // Function to filter listings based on search
  // useEffect(() => {
  //   if (searchQuery.trim() === "") {
  //     setFilteredListings(allListings);
  //   } else {
  //     const lowerCaseQuery = searchQuery.toLowerCase();
  //     const filtered = allListings.filter((listing) =>
  //       listing.seller_username.toLowerCase().includes(lowerCaseQuery) ||
  //       listing.title.toLowerCase().includes(lowerCaseQuery) ||
  //       // listing.description.toLowerCase().includes(lowerCaseQuery) ||
  //       listing.listing_type.toLowerCase().includes(lowerCaseQuery) ||
  //       listing.area.toLowerCase().includes(lowerCaseQuery) ||  
  //       listing.borough.toLowerCase().includes(lowerCaseQuery) ||
  //       listing.property_status.toLowerCase().includes(lowerCaseQuery) ||
  //       listing.rental_frequency.toLowerCase().includes(lowerCaseQuery) ||
  //       listing.seller_agency_name.toLowerCase().includes(lowerCaseQuery) ||
  //       listing.price.toString().includes(lowerCaseQuery) 
  //     );
  //     setFilteredListings(filtered);
  //   }
  //   //initially the current page is 1
  //   setCurrentPage(1); // Reset to first page on new search
  // }, [searchQuery, allListings]);

  // Pagination logic
  //here the logic to show the content on current page is dependent on 
  //the currentPage component
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  //this is to show the loading circle
  if (dataIsLoading === true) {
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
  
    <Grid2 container>

      {/* new */}
      {/* Location Permission Dialog */}
      <Dialog open={openDialog}>
        <DialogTitle>Allow Location Access</DialogTitle>
        <DialogContent>
            <DialogContentText>
                This website wants to access your location to show nearby listings.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">Deny</Button>
            <Button onClick={handleAllowLocation} color="primary">Allow</Button>
        </DialogActions>
      </Dialog>

      {/* The below grid is the left side grid for listings */}
      <Grid2 size={4}>

        {/* Search Bar */}
        <TextField
          label="Search for listings..."
          variant="outlined"
          // fullWidth
          sx={{
            marginBottom: "-0.3rem",
            marginTop: "0.7rem",
            marginLeft: "0.5rem",
            marginBottom: "0.1rem",
            "& .MuiOutlinedInput-root": {
              borderRadius: "1.5rem", // Rounded edges
              height: "2.5rem", // Reduce height
              paddingRight: "0.5rem",
              width:"14rem",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* new */}
        {/* Distance Filter Dropdown */}
        {locationPermission && (
          <TextField
              select
              placeholder="Distance (km)"
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              label="Distance (km)" // Acts as a placeholder
              sx={{
                marginTop: "0.7rem",
                marginBottom: "-0.3rem",
                marginLeft: "0.5rem",
                marginBottom: "0.1rem",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "1.5rem", // Rounded edges
                  height: "2.5rem", // Reduce height
                  width:"12rem",
                  paddingRight: "0.5rem",
                },
              }}
          >
              {[...Array(10).keys()].map((km) => (
                  <MenuItem key={km + 1} value={km + 1}>{km + 1} km</MenuItem>
              ))}
          </TextField>
      )}

        {/* No Listings Message */}
        {currentListings.length === 0 && (
          <Grid2 item xs={12} style={{ textAlign: "center", marginTop: "1rem" }}>
            <Typography variant="h6" color="textSecondary">
              No listings found for "{searchQuery}"
            </Typography>
          </Grid2>
        )}

        {/* here we are getting each listing from the above useState hook for current listings */}
        {currentListings.map((listing)=>{ //for getting the value of each listing
          return (
          <Card key={listing.id} style={{margin: '0.5rem',border: "1px solid black",position: 'relative'}}>
          <CardHeader
            //this is to zoom into the location on the map when listing's
            //top right corner marker is clicked 
            action={
              <IconButton 
              aria-label="settings" 
              //here mapInstance holds all the data of the listing
              //whos top write marker button is clicked
              
              onClick={()=>state.mapInstance.flyTo(
                [listing.latitude,listing.longitude],
                16)}
                >
                <RoomIcon />
              </IconButton>
            }
            title={listing.title}
          />
          <CardMedia
            component="img"
            image={listing.picture1}
            alt={listing.title}
            style={{
              paddingRight: "4rem",
              paddingLeft: "1rem",
              height: "20rem",
              width: "30rem",
              cursor: "pointer",
            }}
            //this is to navigate to the particular listing 
            //when click on the card of that lisitng
            onClick={()=>navigate(`/listings/${listing.id}`)}
            />
            
          <CardContent>
            <Typography variant="body2">
            {listing.description.substring(0,200)}...
            </Typography>
          </CardContent>
          
          {listing.property_status === "Sale" ? (
								<Typography
									style={{
										position: "absolute",
										backgroundColor: 'rgba(0, 128, 0, 0.5)',
										zIndex: "1000",
										color: "white",
										top: "100px",
										left: "20px",
										padding: "5px",
									}}
								>
									{listing.listing_type}: $
									{listing.price
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
								</Typography>
							) : (
								<Typography
									style={{
										position: "absolute",
										backgroundColor: 'rgba(0, 128, 0, 0.5)',
										zIndex: "1000",
										color: "white",
										top: "100px",
										left: "20px",
										padding: "5px",
									}}
								>
									{listing.listing_type}: $
									{listing.price
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
									/ {listing.rental_frequency}
								</Typography>
							)}
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
              {/* this is to get the username for each listing on cards from the logic at serializer.py file in backend */}
                {listing.seller_username} {' -by- '}
                {listing.seller_agency_name} 
              </IconButton>
            </CardActions>
            </Card>
          // <CardActions disableSpacing>
          //   <IconButton aria-label="add to favorites">
          //     <span style={{ color: "black" }}>
          //       {listing.seller_username}
          //     </span>{" "}
          //     -{" "}
          //     <span style={{ color: "gray" }}>
          //       {listing.seller_agency_name}
          //     </span>
          //   </IconButton>
          // </CardActions>
        );
      
      })}
      {/* Pagination Controls */}
      <Grid2 container justifyContent="center" alignItems="center" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
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
            margin: "0 6px", // Adds spacing between numbers
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "lightblue", // Light blue background for selected page
            color: "black", // Ensures the text is readable
          },
          "& .MuiPaginationItem-root.Mui-selected:hover": {
            backgroundColor: "#add8e6", // Slightly darker blue on hover
          },
        }}
      />
    </Grid2>
    </Grid2>

      {/* The below grid is the Right side grid for map */}
      <Grid2 size={8} style={{marginTop: "0.5rem"}}>
        <AppBar position="sticky">
          <div style={{ height: "100vh" }}>
            <MapContainer 
            center={[47.56431808943282,-52.730079775120906]} 
            zoom={12} 
            scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* below is to execute the case for zooming into the selected listing's top right corner map marker*/}
              <TheMapComponent />

              <Polyline positions={polyOne} />

              {filteredListings.map((listing)=>{
                function IconDisplay(){
                  if (listing.listing_type === 'House'){
                    return houseIcon;
                  }
                  else if (listing.listing_type === 'Apartment'){
                    return apartmentIcon;
                  }
                  else if (listing.listing_type === 'Office'){
                    return officeIcon;
                  }
                }
                return (
                  <Marker 
                  key={listing.id}
                  icon={IconDisplay()}
                  position={[
                  listing.latitude,
                  listing.longitude]}>
                    <Popup>
                      <Typography variant="h5">{listing.title}</Typography>
                      <img src={listing.picture1} style={{height: "14rem",width: "18rem", cursor: "pointer"}}
                      onClick={()=>navigate(`/listings/${listing.id}`)} 
                      />
                      <Typography variant="body1">
                        {listing.description.substring(0,150)}...
                      </Typography>
                      <Button 
                      variant="contained" 
                      fullWidth
                      onClick={()=>navigate(`/listings/${listing.id}`)}
                      >Details</Button>
                    </Popup>
                  </Marker>
                )
              })}

              {/* <Marker 
              icon={houseIcon}
              position={[latitude,longitude]}>
              <Popup>
                <Typography variant="h5">A title</Typography>
                <img src={img1} style={{height: "14rem",width: "18rem"}} />
                <Typography variant="body1">
                  This is my house.
                </Typography>
                <Button variant="contained" fullWidth>Link</Button>
              </Popup>
              </Marker> */}
            </MapContainer>
          </div>
        </AppBar>
      </Grid2>
    </Grid2>
  );
}

export default Listings;
