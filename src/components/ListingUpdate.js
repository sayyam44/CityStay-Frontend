import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField, FormControlLabel, Checkbox, Snackbar } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

// Contexts
import StateContext from '../Contexts/StateContext';

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

function ListingUpdate(props) {
    const navigate = useNavigate();

    //The useContext hook in React allows you to access the value of 
    //a context within a functional component, enabling you to share 
    //state or values across components without passing props down 
    //manually.(here it is used to store userid for seller in this form)
    const GlobalState = useContext(StateContext);

    const initialState = {
        titleValue: props.listingData.title,
		listingTypeValue: props.listingData.listing_type,
		descriptionValue: props.listingData.description,
    addressValue: props.listingData.address,
		propertyStatusValue: props.listingData.property_status,
		priceValue: props.listingData.price,
		rentalFrequencyValue: props.listingData.rental_frequency,
		roomsValue: props.listingData.rooms,
		furnishedValue: props.listingData.furnished,
		utilitiesValue: props.listingData.utilities,
		petfriendlyValue: props.listingData.petfriendly,
		cctvValue: props.listingData.cctv,
		parkingValue: props.listingData.parking,
		sendRequest: 0,
		// openSnack: false,
		// disabledBtn: false,

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

  };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchTitleChange":
				draft.titleValue = action.titleChosen;
				// draft.titleErrors.hasErrors = false;
				// draft.titleErrors.errorMessage = "";
				break;
      
      case "catchAddressChange":
        draft.addressValue = action.addressChosen;
        break;

			case "catchListingTypeChange":
				draft.listingTypeValue = action.listingTypeChosen;
				// draft.listingTypeErrors.hasErrors = false;
				// draft.listingTypeErrors.errorMessage = "";
				break;

			case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;


			case "catchPropertyStatusChange":
				draft.propertyStatusValue = action.propertyStatusChosen;
				// draft.propertyStatusErrors.hasErrors = false;
				// draft.propertyStatusErrors.errorMessage = "";
				break;

			case "catchPriceChange":
				draft.priceValue = action.priceChosen;
				// draft.priceErrors.hasErrors = false;
				// draft.priceErrors.errorMessage = "";
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

      //to send the data to backend
      case 'changeSendRequest':
          draft.sendRequest = draft.sendRequest +1;
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


    //if the form is submitted using the submit button then this function will run
    //this function sends the data from frontend to backend as the form is submitted
    function FormSubmit(e) {
        e.preventDefault();
        console.log('yessssssssssssssss');
        dispatch({type: 'changeSendRequest'});
        dispatch({type: 'disabledButton'})
    }

    //this use effect is used to submit the form data into backend
    useEffect(()=>{
      if (state.sendRequest){
        async function UpdateProperty(){
          const formData = new FormData();
          //when the user updates from house to office I dont 
          //want to show the number of rooms firld anymore
          if (state.listingTypeValue === 'Office'){
            formData.append("title", state.titleValue);
            formData.append("address", state.addressValue);
            formData.append("description", state.descriptionValue);
            formData.append("listing_type", state.listingTypeValue);
            formData.append("property_status", state.propertyStatusValue);
            formData.append("price", state.priceValue);
            formData.append("rental_frequency", state.rentalFrequencyValue);
            formData.append("rooms", 0);
            formData.append("furnished", state.furnishedValue);
            formData.append("utilities", state.utilitiesValue);
            formData.append("petfriendly", state.petfriendlyValue);
            formData.append("cctv", state.cctvValue);
            formData.append("parking", state.parkingValue);
            // GlobalState.userId gives the currently logged in user using th useContext hook
            formData.append("seller", GlobalState.userId);
          }
          else{
            formData.append("title", state.titleValue);
          formData.append("address", state.addressValue);
          formData.append("description", state.descriptionValue);
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
          // GlobalState.userId gives the currently logged in user using th useContext hook
          formData.append("seller", GlobalState.userId);

          }
          
          try {
            const response = await Axios.patch(
              `http://127.0.0.1:8000/api/listings/${props.listingData.id}/update/`,
              formData
            );
            console.log("Success:", response.data);
            dispatch({type: 'openTheSnack'}) //this is to show the popup when user successfully logs in
            // navigate(0);
          } catch (e) {
            console.log(e.response);
            dispatch({type: 'allowTheButton'});
          }
        }
        UpdateProperty()
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
                <Grid2 container justifyContent="center">
                    <Typography variant="h4">UPDATE LISTING</Typography>
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="title" 
                    label="Title*" 
                    variant="outlined"
                    fullWidth
                    value = {state.titleValue}
                    onChange = {(e)=>dispatch({type: 'catchTitleChange', titleChosen: e.target.value})}  />
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
                    priceChosen: e.target.value})}  />
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
                    label="utilities" />
                    </Grid2>

                    <Grid2 xs={2} style={{ marginTop: "1rem" }}>
                    <FormControlLabel 
                    control={<Checkbox 
                        checked={state.petfriendlyValue}
                        onChange = {(e)=>dispatch({type: 'catchpetfriendlyChange', 
                            petfriendlyChosen: e.target.checked})}/>} 
                    label="petfriendly" />
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

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="address" 
                    label="Address*" 
                    variant="outlined"
                    fullWidth
                    value = {state.addressValue}
                    onChange = {(e)=>dispatch({type: 'catchAddressChange', addressChosen: e.target.value})}  />
                </Grid2>
                
                <Grid2 container style={{ marginTop: "3rem" }} xs={8}>
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{
                          color: "white",
                          backgroundColor: "green",
                          fontSize: "1rem",
                          marginBottom: "1rem", // Space between buttons
                          "&:hover": {
                            backgroundColor: "orange",
                          },
                        }}
                        disabled={state.disabledBtn}
                        >
                        UPDATE
                    </Button>
                </Grid2>
            </form>

            <Grid2 container xs={8}>
              <Button
                variant="contained"
                fullWidth
                onClick={props.closeDialog}
                sx={{
                  fontSize: "1rem",
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "orange",
                  },
                }}
              >
                CANCEL
              </Button>
            </Grid2>
        </div>
    );
}

export default ListingUpdate;