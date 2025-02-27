import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, 
  Typography,
   Button, 
   TextField, 
   FormControlLabel, 
   Checkbox, 
   Snackbar , 
   Alert} from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

// React Leaflet
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';

// Contexts
import StateContext from '../Contexts/StateContext';

const areaOptions = [
    {
      value: "",
      label: "",
    },
    {
      value: "Inner St.John's",
      label: "Inner St.John's",
    },
    {
        value: "Outer St.John's",
        label: "Outer St.John's",
    },
  ];

const InnerSJOptions = [
    {
      value: "",
      label: "",
    },
    {
      value: "Downtown",
      label: "Downtown",
    },
    {
      value: "Georgestown",
      label: "Georgestown",
    },
    {
      value: "Rabbittown",
      label: "Rabbittown",
    },
    {
      value: "Signal Hill",
      label: "Signal Hill",
    },
    {
      value: "Quidi Vidi",
      label: "Quidi Vidi",
    },
    {
      value: "Pleasantville",
      label: "Pleasantville",
    },
    {
      value: "Fort Amherst",
      label: "Fort Amherst",
    },
    {
      value: "St. John's Centre",
      label: "St. John's Centre",
    },
    {
      value: "Bannerman Park",
      label: "Bannerman Park",
    },
    {
      value: "The Battery",
      label: "The Battery",
    },
    {
      value: "West End",
      label: "West End",
    },
    {
      value: "East End",
      label: "East End",
    },
    {
      value: "North End",
      label: "North End",
    },
    {
      value: "University Area",
      label: "University Area",
    },
    {
      value: "The Strand",
      label: "The Strand",
    },
    {
      value: "Water Street",
      label: "Water Street",
    },
];
  

const OuterSJOptions = [
    {
      value: "",
      label: "",
    },
    {
      value: "Mount Pearl",
      label: "Mount Pearl",
    },
    {
      value: "Paradise",
      label: "Paradise",
    },
    {
      value: "Southlands",
      label: "Southlands",
    },
    {
      value: "Kilbride",
      label: "Kilbride",
    },
    {
      value: "Airport Heights",
      label: "Airport Heights",
    },
    {
      value: "Cowan Heights",
      label: "Cowan Heights",
    },
    {
      value: "Goulds",
      label: "Goulds",
    },
    {
      value: "Thorburn Road",
      label: "Thorburn Road",
    },
];

const listingTypeOptions = [
  {
    value:"",
    label:"",
  },
  {
    value:"Apartment",
    label:"Apartment",
  },
  {
    value:"House",
    label:"House",
  },
  {
    value:"Office",
    label:"Office",
  },

]

const propertyStatusOptions = [
  {
    value:"",
    label:"",
  },
  {
    value:"Sale",
    label:"Sale",
  },
  {
    value:"Rent",
    label:"Rent",
  },
]

const rentalFrequencyOptions = [
  {
    value:"",
    label:"",
  },
  {
    value:"Month",
    label:"Month",
  },
  {
    value:"Week",
    label:"Week",
  },
  {
    value:"Day",
    label:"Day",
  },
]

function AddProperty() {
    const navigate = useNavigate();

    //The useContext hook in React allows you to access the value of 
    //a context within a functional component, enabling you to share 
    //state or values across components without passing props down 
    //manually.(here it is used to store userid for seller in this form)
    const GlobalState = useContext(StateContext);

    const initialState = {
    titleValue: "",
		listingTypeValue: "",
		descriptionValue: "",
    addressValue:"",
		areaValue: "",
		boroughValue: "",
		latitudeValue: "",
		longitudeValue: "",
		propertyStatusValue: "",
		priceValue: "",
		rentalFrequencyValue: "",
		roomsValue: "",
		furnishedValue: false,
		utilitiesValue: false,
		petfriendlyValue: false,
		cctvValue: false,
		parkingValue: false,
		picture1Value: "",
		picture2Value: "",
		picture3Value: "",
		picture4Value: "",
		picture5Value: "",

    mapInstance:null, //map initial position is null defined here but 
    //still when we load the page we will be at the centre as per 
    //mp component being defined below
    markerPosition:{ //map's draggable marker initial position
      lat:'47.56431808943282',
      lng:'-52.730079775120906'
    },
    //uploaded pictures from the user will be stored in form of an array
    uploadedPictures: [],
    sendRequest: 0,

    //Since we want to submit the form only if we have 
    //agencyName and phoneNumber of the profile 
    //using the useEffect hook in GetProfileInfo function below
    userProfile: {
      agencyName: '',
      phoneNumber: '',
    },
    openSnack:false, //this is the popup that occurs when the user logs in
    disabledBtn: false, //this is to disable the login button once it is clicked
    
    //below are to define the initial states for each field of the form and to manage errors related to them
    titleErrors: {
			hasErrors: false,
			errorMessage: "",
		},
    addressErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		listingTypeErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		propertyStatusErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		priceErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		areaErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		boroughErrors: {
			hasErrors: false,
			errorMessage: "",
		},

  };

    function ReducerFunction(draft, action) {
        switch (action.type) {
      case "catchTitleChange":
				draft.titleValue = action.titleChosen;
        //this is to remove the alerts if the user puts in the title
				draft.titleErrors.hasErrors = false;
				draft.titleErrors.errorMessage = "";
				break;

			case "catchListingTypeChange":
				draft.listingTypeValue = action.listingTypeChosen;
        //this is to remove the alerts if the user puts in the listingtype
				draft.listingTypeErrors.hasErrors = false;
				draft.listingTypeErrors.errorMessage = "";
				break;
      
      case "catchAddressChange":
        draft.addressValue = action.addressChosen;
        draft.addressErrors.hasErrors = false;
				draft.addressErrors.errorMessage = "";
        break;

			case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;
      

			case "catchAreaChange":
				draft.areaValue = action.areaChosen;
        //this is to remove the alerts if the user puts in the area
				draft.areaErrors.hasErrors = false;
				draft.areaErrors.errorMessage = "";
				break;

			case "catchBoroughChange":
				draft.boroughValue = action.boroughChosen;
        //this is to remove the alerts if the user puts in the borough
				draft.boroughErrors.hasErrors = false;
				draft.boroughErrors.errorMessage = "";
				break;

			case "catchLatitudeChange":
				draft.latitudeValue = action.latitudeChosen;
				break;

			case "catchLongitudeChange":
				draft.longitudeValue = action.longitudeChosen;
				break;

			case "catchPropertyStatusChange":
				draft.propertyStatusValue = action.propertyStatusChosen;
        //this is to remove the alerts if the user puts in the propertystatus
				draft.propertyStatusErrors.hasErrors = false;
				draft.propertyStatusErrors.errorMessage = "";
				break;

			case "catchPriceChange":
				draft.priceValue = action.priceChosen;
        //this is to remove the alerts if the user puts in the price
				draft.priceErrors.hasErrors = false;
				draft.priceErrors.errorMessage = "";
				break;

			case "catchRentalFrequencyChange":
				draft.rentalFrequencyValue = action.rentalFrequencyChosen;
				break;

			case "catchRoomsChange":
				draft.roomsValue = action.roomsChosen;
				break;

			case "catchFurnishedChange":
				draft.furnishedValue = action.furnishedChosen;
				break;

			case "catchutilitiesChange":
				draft.utilitiesValue = action.utilitiesChosen;
				break;

			case "catchpetfriendlyChange":
				draft.petfriendlyValue = action.petfriendlyChosen;
				break;

			case "catchCctvChange":
				draft.cctvValue = action.cctvChosen;
				break;

			case "catchParkingChange":
				draft.parkingValue = action.parkingChosen;
				break;

			case "catchPicture1Change":
				draft.picture1Value = action.picture1Chosen;
				break;

			case "catchPicture2Change":
				draft.picture2Value = action.picture2Chosen;
				break;

			case "catchPicture3Change":
				draft.picture3Value = action.picture3Chosen;
				break;

			case "catchPicture4Change":
				draft.picture4Value = action.picture4Chosen;
				break;

			case "catchPicture5Change":
				draft.picture5Value = action.picture5Chosen;
				break;
      
        // the utility function for below case is TheMapComponent()
      case "getMap": //this case is to zoom into map for the area selected 
        draft.mapInstance = action.mapData;
        break
      
        //this case will only be called when we select some area from dropdown
        //and to move the marker to that particular position
        //but the actual latitude and longitude of the apartment
        //location to be stored at the backend will be upadted
        //only when the user moves this marker unless both of lat and 
        //long will be empty strings
      case "changeMarkerPosition": //this case is to change the 
      //position of the marker on the basis of the changeLatitude 
      // and changeLongitude values (that we are changing when the 
      //marker position is being changed actually)
          draft.markerPosition.lat = action.changeLatitude;
          draft.markerPosition.lng = action.changeLongitude;
          //since this case is only called when some area is selected 
          //and the marker will move automatically to this area
          //so since the user have still not specified the marker 
          //position himself so that is why we are making both of these as empty string
          draft.latitudeValue="";
          draft.longitudeValue="";
          break;
        
      //This is to store the pictures in form of array
      case "catchUploadedPictures":
        draft.uploadedPictures = action.picturesChosen;
        break;
      
      //to send the data to backend
      case 'changeSendRequest':
        draft.sendRequest = draft.sendRequest +1;
        break;
      
      //to make sure agency name and phonenumber of the userprofile
      //should be there before the user tries to submit the property
      //it gets the current user data from useEffect hook with 
      //GetProfileInfo() function and its implementation is in 
      //SubmitButtonDisplay() function 
      case "catchUserProfileInfo":
				draft.userProfile.agencyName = action.profileObject.agency_name;
				draft.userProfile.phoneNumber = action.profileObject.phone_number;
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
      
      //below are all the cases to show alert(make the field red and show the alert message below each field)
      //  in case of any of the field remains empty in the form before being submitted
      case "catchTitleErrors":
        if (action.titleChosen.length === 0) {
          draft.titleErrors.hasErrors = true;
          draft.titleErrors.errorMessage = "This field must not be empty";
        }
        break;
      
      case "catchAddressErrors":
        if (action.addressChosen.length === 0) {
          draft.addressErrors.hasErrors = true;
          draft.addressErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchListingTypeErrors":
        if (action.listingTypeChosen.length === 0) {
          draft.listingTypeErrors.hasErrors = true;
          draft.listingTypeErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchPropertyStatusErrors":
        if (action.propertyStatusChosen.length === 0) {
          draft.propertyStatusErrors.hasErrors = true;
          draft.propertyStatusErrors.errorMessage =
            "This field must not be empty";
        }
        break;

      case "catchPriceErrors":
        if (action.priceChosen.length === 0) {
          draft.priceErrors.hasErrors = true;
          draft.priceErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchAreaErrors":
        if (action.areaChosen.length === 0) {
          draft.areaErrors.hasErrors = true;
          draft.areaErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchBoroughErrors":
        if (action.boroughChosen.length === 0) {
          draft.boroughErrors.hasErrors = true;
          draft.boroughErrors.errorMessage = "This field must not be empty";
        }
        break;
      
      //below are all the cases if the required fields are empty then the form will not submit and will 
      //automatically scroll up on the screen at the required field that was empty 
      case "emptyTitle":
        draft.titleErrors.hasErrors = true;
        draft.titleErrors.errorMessage = "This field must not be empty";
        break;
      
      case "emptyAddress":
        draft.addressErrors.hasErrors = true;
        draft.addressErrors.errorMessage = "This field must not be empty";
        break;

      case "emptyListingType":
        draft.listingTypeErrors.hasErrors = true;
        draft.listingTypeErrors.errorMessage = "This field must not be empty";
        break;

      case "emptyPropertyStatus":
        draft.propertyStatusErrors.hasErrors = true;
        draft.propertyStatusErrors.errorMessage ="This field must not be empty";
        break;

      case "emptyPrice":
        draft.priceErrors.hasErrors = true;
        draft.priceErrors.errorMessage = "This field must not be empty";
        break;

      case "emptyArea":
        draft.areaErrors.hasErrors = true;
        draft.areaErrors.errorMessage = "This field must not be empty";
        break;

      case "emptyBoroug":
        draft.borougErrors.hasErrors = true;
        draft.borougErrors.errorMessage = "This field must not be empty";
        break;
      
      //this is to show alert message when the user uploads no pic or more than 5 pics
      case "setAlert":
        draft.alertMessage = action.alertmessage;
        break;
      
      //this is to clear the list if the user uploads more thna 5 pics.
      case "clearUploadedPictures":
        draft.uploadedPictures = [];
        draft.picture1Value = null;
        draft.picture2Value = null;
        draft.picture3Value = null;
        draft.picture4Value = null;
        draft.picture5Value = null;
        break;
      }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    // This function defines the functionality for zooming in into the
    //map when the user selects some area 
    // TheMapComponent function is being called below in map component
    function TheMapComponent(){
      const map=useMap(); //useMap function is an inbuilt function of react leaflet
      dispatch({type: 'getMap', mapData: map }); //mapData hols the current data values
      return null;
    }


    //UseEffect hook to change the map view depending on the chose borough
    //from TheMapComponent() function , since map instance now holds 
    //the mapData so the flyTo or setView functions will move the 
    //the current map to the borough selected by the user
    useEffect(() => {
      if (state.boroughValue === "Downtown") {
        state.mapInstance.flyTo([47.564113050637054, -52.7082911355799], 14);
        //the dispatch function is to move the marker to these location 
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.564113050637054,
          changeLongitude: -52.7082911355799
        });
      } else if (state.boroughValue === "Georgestown") {
        state.mapInstance.flyTo([47.57008153097633, -52.72082026595612], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.57008153097633, 
          changeLongitude: -52.72082026595612
        });
      } else if (state.boroughValue === "Rabbittown") {
        state.mapInstance.flyTo([47.5716, -52.7223], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5716,
          changeLongitude: -52.7223
        });
      } else if (state.boroughValue === "Signal Hill") {
        state.mapInstance.flyTo([47.5741, -52.681], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5741,
          changeLongitude: -52.681
        });
      } else if (state.boroughValue === "Quidi Vidi") {
        state.mapInstance.flyTo([47.5835, -52.6921], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5835,
          changeLongitude: -52.6921
        });
      } else if (state.boroughValue === "Pleasantville") {
        state.mapInstance.flyTo([47.5902, -52.7039], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5902,
          changeLongitude: -52.7039
        });
      } else if (state.boroughValue === "Fort Amherst") {
        state.mapInstance.flyTo([47.5679, -52.6856], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5679,
          changeLongitude: -52.6856
        });
      } else if (state.boroughValue === "St. John's Centre") {
        state.mapInstance.flyTo([47.561, -52.7123], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.561,
          changeLongitude: -52.7123
        });
      } else if (state.boroughValue === "Bannerman Park") {
        state.mapInstance.flyTo([47.5649, -52.7098], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5649,
          changeLongitude: -52.7098
        });
      } else if (state.boroughValue === "The Battery") {
        state.mapInstance.flyTo([47.5703, -52.6795], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5703,
          changeLongitude: -52.6795
        });
      } else if (state.boroughValue === "West End") {
        state.mapInstance.flyTo([47.55, -52.735], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.55,
          changeLongitude: -52.735
        });
      } else if (state.boroughValue === "East End") {
        state.mapInstance.flyTo([47.57, -52.69], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.57,
          changeLongitude: -52.69
        });
      } else if (state.boroughValue === "North End") {
        state.mapInstance.flyTo([47.575, -52.71], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.575,
          changeLongitude: -52.71
        });
      } else if (state.boroughValue === "University Area") {
        state.mapInstance.flyTo([47.5749, -52.7327], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5749,
          changeLongitude: -52.7327
        });
      } else if (state.boroughValue === "The Strand") {
        state.mapInstance.flyTo([47.563, -52.705], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.563,
          changeLongitude: -52.705
        });
      } else if (state.boroughValue === "Water Street") {
        state.mapInstance.flyTo([47.56, -52.709], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.56,
          changeLongitude: -52.709
        });
      } else if (state.boroughValue === "Mount Pearl") {
        state.mapInstance.flyTo([47.5146, -52.8054], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5146,
          changeLongitude: -52.8054
        });
      } else if (state.boroughValue === "Paradise") {
        state.mapInstance.flyTo([47.5321, -52.8691], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5321,
          changeLongitude: -52.8691
        });
      } else if (state.boroughValue === "Southlands") {
        state.mapInstance.flyTo([47.4931, -52.8184], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.4931,
          changeLongitude: -52.8184
        });
      } else if (state.boroughValue === "Kilbride") {
        state.mapInstance.flyTo([47.5014, -52.7871], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5014,
          changeLongitude: -52.7871
        });
      } else if (state.boroughValue === "Airport Heights") {
        state.mapInstance.flyTo([47.6187, -52.733], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.6187,
          changeLongitude: -52.733
        });
      } else if (state.boroughValue === "Cowan Heights") {
        state.mapInstance.flyTo([47.5303, -52.7697], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5303,
          changeLongitude: -52.7697
        });
      } else if (state.boroughValue === "Goulds") {
        state.mapInstance.flyTo([47.4526, -52.7971], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.4526,
          changeLongitude: -52.7971
        });
      } else if (state.boroughValue === "Thorburn Road") {
        state.mapInstance.flyTo([47.5581, -52.7555], 14);
        dispatch({
          type: 'changeMarkerPosition', 
          changeLatitude: 47.5581,
          changeLongitude: -52.7555
        });
      }
    }, [state.boroughValue]);
    
    
    //Defining the draggable marker on the basis of the <Marker> component
    //defined below in map code
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          //here is the logic to get latitude and longitude values 
          //whenever the marker is stopped using the dispatch function 
          // console.log(marker.getLatLng());
          // getLatLng is an inbuild funcion of marker
          dispatch({type: 'catchLatitudeChange',
            latitudeChosen: marker.getLatLng().lat})
          dispatch({type: 'catchLongitudeChange',
            longitudeChosen: marker.getLatLng().lng})
        },
      }),
      [],
    );
    // const toggleDraggable = useCallback(() => {
    //   setDraggable((d) => !d)
    // }, [])

    //this is to console the values whenever the marker position is changed
    // useEffect(()=>{
    //   console.log(state.latitudeValue,state.longitudeValue);
    // },[state.latitudeValue,state.longitudeValue]);

    //catching picture1 if the user uploads 1 picture
    useEffect(()=>{
      if (state.uploadedPictures[0]){
        dispatch({
          type: "catchPicture1Change",
          picture1Chosen: state.uploadedPictures[0],
        })
      }
    },[state.uploadedPictures[0]]);

    //catching picture2 if the user uploads 2 pictures
    useEffect(()=>{
      if (state.uploadedPictures[1]){
        dispatch({
          type: "catchPicture2Change",
          picture2Chosen: state.uploadedPictures[1],
        })
      }
    },[state.uploadedPictures[1]]);

    //catching picture3 if the user uploads 3 pictures
    useEffect(()=>{
      if (state.uploadedPictures[2]){
        dispatch({
          type: "catchPicture3Change",
          picture3Chosen: state.uploadedPictures[2],
        })
      }
    },[state.uploadedPictures[2]]);

    //catching picture4 if the user uploads 4 pictures
    useEffect(()=>{
      if (state.uploadedPictures[3]){
        dispatch({
          type: "catchPicture4Change",
          picture4Chosen: state.uploadedPictures[3],
        })
      }
    },[state.uploadedPictures[3]]);

    //catching picture5 if the user uploads 5 pictures
    useEffect(()=>{
      if (state.uploadedPictures[4]){
        dispatch({
          type: "catchPicture5Change",
          picture5Chosen: state.uploadedPictures[4],
        })
      }
    },[state.uploadedPictures[4]]);

    // request to get the profile info 
    //Goal-if the user-profile does not have the Agency name and 
    //phone number the form cannot be submitted
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


    //if the form is submitted using the submit button then this function will run
    //this function sends the data from frontend to backend as the form is submitted
    function FormSubmit(e) {
        e.preventDefault();
        console.log('yessssssssssssssss');

        // Check if the number of uploaded pictures is valid
        if (state.uploadedPictures.length === 0) {
          dispatch({ type: "setAlert", alertmessage: "At least 1 photo is required!" });
          window.scrollTo(0, 0);
          return;
        } else if (state.uploadedPictures.length > 5) {
          dispatch({ type: "setAlert", alertmessage: "Maximum of 5 photos can be uploaded!" });
          dispatch({ type: "clearUploadedPictures" });
          window.scrollTo(0, 0);
          return;
        }
  
        //the form will only submit if there is no alert or none of the fields are empty
        else if (
          !state.titleErrors.hasErrors &&
          !state.addressErrors.hasErrors &&
          !state.listingTypeErrors.hasErrors &&
          !state.propertyStatusErrors.hasErrors &&
          !state.priceErrors.hasErrors &&
          !state.areaErrors.hasErrors &&
          !state.boroughErrors.hasErrors &&
          state.latitudeValue &&
          state.longitudeValue
        ) {
          dispatch({ type: "changeSendRequest" });
          dispatch({ type: "disableTheButton" });
        } else if (state.titleValue === "") {  
          //below are all the cases if the required fields are empty then the form will not submit and will 
          //show the error message on top of the screen and automatically scroll up on the screen
          dispatch({ type: "emptyTitle" });
          window.scrollTo(0, 0);
        } else if (state.addressValue === "") {  
          //below are all the cases if the required fields are empty then the form will not submit and will 
          //show the error message on top of the screen and automatically scroll up on the screen
          dispatch({ type: "emptyAddress" });
          window.scrollTo(0, 0);
        }else if (state.listingTypeValue === "") {
          dispatch({ type: "emptyListingType" });
          window.scrollTo(0, 0);
        } else if (state.propertyStatusValue === "") {
          dispatch({ type: "emptyPropertyStatus" });
          window.scrollTo(0, 0);
        } else if (state.priceValue === "") {
          dispatch({ type: "emptyPrice" });
          window.scrollTo(0, 0);
        } else if (state.areaValue === "") {
          dispatch({ type: "emptyArea" });
          window.scrollTo(0, 0);
        } else if (state.boroughValue === "") {
          dispatch({ type: "emptyBorough" });
          window.scrollTo(0, 0);
        }
    }

    //this use effect is used to submit the form data into backend
    useEffect(()=>{
      if (state.sendRequest){
        async function AddProperty(){
          const formData = new FormData()
          formData.append("title", state.titleValue);
          formData.append("address", state.addressValue);
          formData.append("description", state.descriptionValue);
          formData.append("area", state.areaValue);
          formData.append("borough", state.boroughValue);
          formData.append("listing_type", state.listingTypeValue);
          formData.append("property_status", state.propertyStatusValue);
          formData.append("price", state.priceValue);
          formData.append("rental_frequency", state.rentalFrequencyValue);
          formData.append("rooms", state.roomsValue);
          formData.append("furnished", state.furnishedValue);
          formData.append("utilities", state.utilitiesValue);
          formData.append("petfriendly", state.petfriendlyValue);
          formData.append("cctv", state.cctvValue);
          formData.append("parking", state.parkingValue);
          formData.append("latitude", state.latitudeValue);
          formData.append("longitude", state.longitudeValue);
          formData.append("picture1", state.picture1Value);
          formData.append("picture2", state.picture2Value);
          formData.append("picture3", state.picture3Value);
          formData.append("picture4", state.picture4Value);
          formData.append("picture5", state.picture5Value);
          // GlobalState.userId gives the currently logged in user using th useContext hook
          formData.append("seller", GlobalState.userId);

          try {
            const response = await Axios.post(
              "http://127.0.0.1:8000/api/listings/create/",
              formData
            );
            console.log("Success:", response.data);
            dispatch({type: 'openTheSnack'})
            // navigate('/listings');
          } catch (e) {
            dispatch({type: 'allowTheButton'});
            console.log(e.response);
          }
        }
        AddProperty()
      }
    },[state.sendRequest]);

    function PriceDisplay(){
      if (state.propertyStatusValue === "Rent" && state.rentalFrequencyValue === 'Day'){
        return 'Price per Day*'
      }
      else if (state.propertyStatusValue === "Rent" && state.rentalFrequencyValue === 'Week'){
        return 'Price per Week*'
      }
      else if (state.propertyStatusValue === "Rent" && state.rentalFrequencyValue === 'Month'){
        return 'Price per Month*'
      }
      else{
        return 'Price*'
      }
    }

    // to display the submit button for the add property page
    //only when the user is logged in or the user puts in 
    //info for its agency name and agency phone number .
    function SubmitButtonDisplay() {
      if (
        GlobalState.userIsLogged &&
        state.userProfile.agencyName !== null &&
        state.userProfile.agencyName !== "" &&
        state.userProfile.phoneNumber !== null &&
        state.userProfile.phoneNumber !== ""
      ) {
        return (
        <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
                color: "white",
                backgroundColor: "green",
                fontSize: "1rem",
                marginLeft: "1rem",
                marginRight: "1rem",
                marginTop: "-2rem",
                "&:hover": {
                    backgroundColor: "orange",
                },
            }}
            disabled={state.disabledBtn}
            >
            SUBMIT
        </Button>
        );
      } else if (
        GlobalState.userIsLogged &&
        (state.userProfile.agencyName === null ||
          state.userProfile.agencyName === "" ||
          state.userProfile.phoneNumber === null ||
          state.userProfile.phoneNumber === "")
      ) {
        return (
          <Button
            variant="outlined"
            fullWidth
            onClick={()=>navigate('/profile')}
            // type="submit"
            sx={{
                color: "white",
                backgroundColor: "green",
                fontSize: "1rem",
                marginLeft: "1rem",
                marginRight: "1rem",
                marginTop: "-2rem",
                "&:hover": {
                    backgroundColor: "orange",
                },
            }}
            >
            PLEASE COMPLETE YOUR PROFILE TO ADD A PROPERTY!
        </Button>
        );
    //   } else if (!GlobalState.userIsLogged) {
    //     return (
    //       <Button
    //         variant="outlined"
    //         fullWidth
    //         onClick={()=>navigate('/login')}
    //         // type="submit"
    //         sx={{
    //             color: "white",
    //             backgroundColor: "green",
    //             fontSize: "1rem",
    //             marginLeft: "1rem",
    //             marginRight: "1rem",
    //             marginTop: "-2rem",
    //             "&:hover": {
    //                 backgroundColor: "orange",
    //             },
    //         }}
    //         >
    //         PLEASE SIGN IN TO ADD A PROPERTY!
    //     </Button>
    //     );
    //   }else if (
    //     GlobalState.userIsLogged &&
    //     state.uploadedPictures.length === 0
    //   ) {
    //     return (
    //       <Button
    //         variant="outlined"
    //         fullWidth
    //         onClick={()=>navigate('/profile')}
    //         // type="submit"
    //         sx={{
    //             color: "white",
    //             backgroundColor: "green",
    //             fontSize: "1rem",
    //             marginLeft: "1rem",
    //             marginRight: "1rem",
    //             marginTop: "-2rem",
    //             "&:hover": {
    //                 backgroundColor: "orange",
    //             },
    //         }}
    //         >
    //         At least 1 photo is required !
    //     </Button>
    //     );
    // }else if (
    //   GlobalState.userIsLogged &&
    //   state.uploadedPictures.length > 5
    // ) {
    //   return (
    //     <Button
    //       variant="outlined"
    //       fullWidth
    //       onClick={()=>navigate('/profile')}
    //       // type="submit"
    //       sx={{
    //           color: "white",
    //           backgroundColor: "green",
    //           fontSize: "1rem",
    //           marginLeft: "1rem",
    //           marginRight: "1rem",
    //           marginTop: "-2rem",
    //           "&:hover": {
    //               backgroundColor: "orange",
    //           },
    //       }}
    //       >
    //       Maximum of 5 photos can be uploaded !
    //   </Button>
    //   );
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

    return (
        <div
            style={{
                width: "75%",
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: "3rem",
                border: "5px solid black",
                padding: "3rem"
            }}
        >
        <form onSubmit={FormSubmit}>
          {/* this is to give an alert if the photos are less than 1 or more than 5 */}
            {state.alertMessage && (
              <Grid2 xs={12} sx={{ textAlign: "center" }}>
                <Alert severity="error" sx={{ fontWeight: "bold" }}>
                  {state.alertMessage}
                </Alert>
              </Grid2>
            )}

            <Grid2 container justifyContent="center">
                <Typography variant="h4">SUBMIT A PROPERTY</Typography>
            </Grid2>

            <Grid2 container style={{ marginTop: "1rem" }}>
                <TextField 
                id="title" 
                label="Title*" 
                variant="outlined"
                fullWidth
                value = {state.titleValue}
                onChange = {(e)=>dispatch({type: 'catchTitleChange', titleChosen: e.target.value})}  
                
                // this is to show alerts related to title field 
                onBlur={(e) =>
                  dispatch({
                    type: "catchTitleErrors",
                    titleChosen: e.target.value,
                  })
                }
                error={state.titleErrors.hasErrors ? true : false}
                helperText={state.titleErrors.errorMessage} 
                />
            </Grid2>

          <Grid2 container justifyContent='space-between'>
            <Grid2 xs={5} style={{ marginTop: "1rem", width: "47%" }}>
                <TextField 
                id="listingType" 
                label="Listing Type*" 
                variant="outlined"
                fullWidth
                value = {state.listingTypeValue}
                onChange = {(e)=>dispatch({type: 'catchListingTypeChange', 
                listingTypeChosen: e.target.value})}

                // this is to show alerts related to listing type field
                onBlur={(e) =>
                  dispatch({
                    type: "catchListingTypeErrors",
                    listingTypeChosen: e.target.value,
                  })
                }
                error={state.listingTypeErrors.hasErrors ? true : false}
                helperText={state.listingTypeErrors.errorMessage}

                select
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                >
                  {listingTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                </TextField>
            </Grid2>


            <Grid2 xs={5} style={{ marginTop: "1rem" , width: "47%" }}>
                <TextField 
                id="propertyStatus" 
                label="Property Status*" 
                variant="outlined"
                fullWidth
                value = {state.propertyStatusValue}
                onChange = {(e)=>dispatch({type: 'catchPropertyStatusChange', 
                propertyStatusChosen: e.target.value})}

                // this is to show alerts related to property status field
                onBlur={(e) =>
                  dispatch({
                    type: "catchPropertyStatusErrors",
                    propertyStatusChosen: e.target.value,
                  })
                }
                error={state.propertyStatusErrors.hasErrors ? true : false}
                helperText={state.propertyStatusErrors.errorMessage}

                select
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                >
                  {propertyStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                  ))}
                    </TextField> 
            </Grid2>
          </Grid2>
          
          <Grid2 container justifyContent='space-between' >
            <Grid2 container style={{ marginTop: "1rem" , width: "47%" }}>
                <TextField 
                id="rentalFrequency" 
                label="Rental Frequency" 
                variant="outlined"
                disabled={state.propertyStatusValue === "Sale" ? true : false}
                fullWidth
                value = {state.rentalFrequencyValue}
                onChange = {(e)=>dispatch({type: 'catchRentalFrequencyChange', 
                rentalFrequencyChosen: e.target.value})}
                select
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                > {rentalFrequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                  {option.label}
                  </option>
                ))}
                </TextField>
            </Grid2>

            <Grid2 container style={{ marginTop: "1rem" , width: "47%"}}>
                <TextField 
                id="price" 
                type="number"
                label={PriceDisplay()} //this is to change the label as per the frequency chosen by the user
                variant="outlined"
                fullWidth
                value = {state.priceValue}
                onChange = {(e)=>dispatch({type: 'catchPriceChange', 
                priceChosen: e.target.value})} 

                // this is to show alerts related to price field
                onBlur={(e) =>
                  dispatch({
                    type: "catchPriceErrors",
                    priceChosen: e.target.value,
                  })
                }
                error={state.priceErrors.hasErrors ? true : false}
                helperText={state.priceErrors.errorMessage}
                />
            </Grid2>
          </Grid2>


            <Grid2 container style={{ marginTop: "1rem" }}>
                <TextField 
                id="description" 
                label="Description" 
                variant="outlined"
                multiline
                rows={6}
                fullWidth
                value = {state.descriptionValue}
                onChange = {(e)=>dispatch({type: 'catchDescriptionChange', 
                descriptionChosen: e.target.value})}  />
            </Grid2>

            {state.listingTypeValue === 'Office' ? '' : (
              <Grid2 xs={3} container style={{ marginTop: "1rem" }}>
                <TextField 
                id="rooms" 
                type="number"
                label="Rooms" 
                variant="outlined"
                fullWidth
                value = {state.roomsValue}
                onChange = {(e)=>dispatch({type: 'catchRoomsChange', 
                roomsChosen: e.target.value})}  />
            </Grid2>
            )}

            {/* checkboxes */}
            <Grid2 container justifyContent="space-between"> 
                <Grid2 xs={2} style={{ marginTop: "1rem" }}>
                <FormControlLabel 
                control={<Checkbox 
                    checked={state.furnishedValue}
                    onChange = {(e)=>dispatch({type: 'catchFurnishedChange', 
                        furnishedChosen: e.target.checked})}/>} 
                label="Furnished" />
                </Grid2>

                <Grid2 xs={2} style={{ marginTop: "1rem" }}>
                <FormControlLabel 
                control={<Checkbox 
                    checked={state.utilitiesValue}
                    onChange = {(e)=>dispatch({type: 'catchutilitiesChange', 
                        utilitiesChosen: e.target.checked})}/>} 
                label="Utilities" />
                </Grid2>

                <Grid2 xs={2} style={{ marginTop: "1rem" }}>
                <FormControlLabel 
                control={<Checkbox 
                    checked={state.petfriendlyValue}
                    onChange = {(e)=>dispatch({type: 'catchpetfriendlyChange', 
                        petfriendlyChosen: e.target.checked})}/>} 
                label="Pet Friendly" />
                </Grid2>

                <Grid2 xs={2} style={{ marginTop: "1rem" }}>
                <FormControlLabel 
                control={<Checkbox 
                    checked={state.cctvValue}
                    onChange = {(e)=>dispatch({type: 'catchCctvChange', 
                        cctvChosen: e.target.checked})}/>} 
                label="Cctv" />
                </Grid2>
                
                
                <Grid2 xs={2} style={{ marginTop: "1rem" }}>
                <FormControlLabel 
                control={<Checkbox 
                    checked={state.parkingValue}
                    onChange = {(e)=>dispatch({type: 'catchParkingChange', 
                        parkingChosen: e.target.checked})}/>} 
                label="Parking" />
                </Grid2>
                
            </Grid2>
            
            {/* address */}
            <Grid2 container style={{ marginTop: "1rem" }}>
                <TextField 
                id="address" 
                label="Address*" 
                variant="outlined"
                fullWidth
                value = {state.addressValue}
                onChange = {(e)=>dispatch({type: 'catchAddressChange', addressChosen: e.target.value})}  
                
                // this is to show alerts related to address field 
                onBlur={(e) =>
                  dispatch({
                    type: "catchAddressErrors",
                    addressChosen: e.target.value,
                  })
                }
                error={state.addressErrors.hasErrors ? true : false}
                helperText={state.addressErrors.errorMessage} 
                />
            </Grid2>

            <Grid2 container justifyContent="space-between">
            <Grid2 style={{ marginTop: "1rem" , width: "47%"  }}>
                <TextField 
                id="area" 
                label="Area*" 
                variant="outlined"
                fullWidth
                value = {state.areaValue}
                onChange = {(e)=>dispatch({type: 'catchAreaChange', 
                areaChosen: e.target.value})} 
                
                  // this is to show alerts related to area field 
                onBlur={(e) =>
                  dispatch({
                    type: "catchAreaErrors",
                    areaChosen: e.target.value,
                  })
                }
                error={state.areaErrors.hasErrors ? true : false}
                helperText={state.areaErrors.errorMessage}

                select 
                slotProps={{
                    select: {
                      native: true,
                    },
                  }}
                >
                {areaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                
                </TextField>
            </Grid2>

            <Grid2 style={{ marginTop: "1rem", width: "47%"  }}>
                <TextField 
                id="borough" 
                label="Location*" 
                variant="outlined"
                fullWidth
                value = {state.boroughValue}
                onChange = {(e)=>dispatch({type: 'catchBoroughChange', 
                boroughChosen: e.target.value})} 
                
                // this is to show alerts related to borough field 
                onBlur={(e) =>
                  dispatch({
                    type: "catchBoroughErrors",
                    boroughChosen: e.target.value,
                  })
                }
                error={state.boroughErrors.hasErrors ? true : false}
                helperText={state.boroughErrors.errorMessage}


                select 
                slotProps={{
                    select: {
                      native: true,
                    },
                  }}
                >

                {state.areaValue === "Inner St.John's" ? InnerSJOptions.map((option) => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
                )): ''}

                {state.areaValue === "Outer St.John's" ? OuterSJOptions.map((option) => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
                )): ''}
                

                </TextField>
            </Grid2>
            
            </Grid2>
        

            {/* this is to show alert if the user does not move the marker to locate the property */}
            <Grid2 item sx={{ marginTop: "1rem" }}> 
              {state.latitudeValue && state.longitudeValue ? (
                <Alert severity="success">
                  You property is located @ {state.latitudeValue},{" "}
                  {state.longitudeValue}
                </Alert>
              ) : (
                <Alert severity="warning">
                  Locate your property on the map before submitting this form
                </Alert>
              )}
            </Grid2>
            {/* ReactLeaflet component for map and its dragable marker  */}
            <Grid2 container sx={{height: "35rem", marginTop: '1rem'}}>
                <MapContainer 
                center={[47.56431808943282,-52.730079775120906]} 
                zoom={11} 
                scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[51.505, -0.09]}>
                        <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker> */}

                  {/* below is to execute the case for zooming into the selected area from dropdown*/}
                  <TheMapComponent />
                  {/* this is to specify the functionality of the draggable marker on map */}
                  <Marker 
                    draggable
                    eventHandlers={eventHandlers}
                    position={state.markerPosition}//initial marker position
                    ref={markerRef}>
    
                  </Marker>

                </MapContainer>
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
                          marginLeft: "1rem",
                          marginRight: "1rem",
                          border: '1px solid black',
                      }}
                  >
                      UPLOAD PICTURES (MAX 5)

                      {/* to upload the images in particular format */}
                      <input 
                      type="file" 
                      multiple accept="image/png , image/gif, image/jpeg"
                      hidden
                      //to store the pictures uploaded by the user
                      //into the uploadedPictures initial state
                      //When the user is uploading picture from frontend
                      //it runs the catchUploadedPictures case and then 
                      //it adds those pics into the initialstate of uploadedPictures
                      //and I have defined a useEffect hook above that if any 
                      //picture adds into this array it adds into the initial states of 
                      //pictures i.e. picture1value,picture2value and so on.
                      onChange={(e)=> dispatch({
                        type: "catchUploadedPictures",
                        picturesChosen: e.target.files,
                      })
                    } 
                    />
                  </Button>
                </Grid2>
                
                {/* This is to show the dialog box for what all pictures are uploaded by the user */}
                <Grid2 container>
                  <ul>
                    {state.picture1Value ? <li>{state.picture1Value.name}</li>:""}
                    {state.picture2Value ? <li>{state.picture2Value.name}</li>:""}
                    {state.picture3Value ? <li>{state.picture3Value.name}</li>:""}
                    {state.picture4Value ? <li>{state.picture4Value.name}</li>:""}
                    {state.picture5Value ? <li>{state.picture5Value.name}</li>:""}
                  </ul>
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }} xs={8}>
                    {/* <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{
                            color: "white",
                            backgroundColor: "green",
                            fontSize: "1.1rem",
                            marginLeft: "1rem",
                            marginRight: "3rem",
                            "&:hover": {
                                backgroundColor: "orange",
                            },
                        }}
                    >
                        SUBMIT
                    </Button> */}
                    {SubmitButtonDisplay()}
                </Grid2>
            </form>
            {/* this is the popup when user logs in  */}
            <Snackbar
            open={state.openSnack}
            message="You have successfully Added a new property"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: "center"
            }}
            />
        </div>
    );
}

export default AddProperty