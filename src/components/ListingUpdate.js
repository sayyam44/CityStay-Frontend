import React, { useEffect, useState, useRef, useMemo,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
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
		propertyStatusValue: props.listingData.property_status,
		priceValue: props.listingData.price,
		rentalFrequencyValue: props.listingData.rental_frequency,
		roomsValue: props.listingData.rooms,
		furnishedValue: props.listingData.furnished,
		poolValue: props.listingData.pool,
		elevatorValue: props.listingData.elevator,
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
    }
  };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchTitleChange":
				draft.titleValue = action.titleChosen;
				// draft.titleErrors.hasErrors = false;
				// draft.titleErrors.errorMessage = "";
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

			case "catchPoolChange":
				draft.poolValue = action.poolChosen;
				break;

			case "catchElevatorChange":
				draft.elevatorValue = action.elevatorChosen;
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
      }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);


    //if the form is submitted using the submit button then this function will run
    //this function sends the data from frontend to backend as the form is submitted
    function FormSubmit(e) {
        e.preventDefault();
        console.log('yessssssssssssssss');
        dispatch({type: 'changeSendRequest'});
    }

    //this use effect is used to submit the form data into backend
    useEffect(()=>{
      if (state.sendRequest){
        async function UpdateProperty(){
          const formData = new FormData()
          formData.append("title", state.titleValue);
          formData.append("description", state.descriptionValue);
          formData.append("listing_type", state.listingTypeValue);
          formData.append("property_status", state.propertyStatusValue);
          formData.append("price", state.priceValue);
          formData.append("rental_frequency", state.rentalFrequencyValue);
          formData.append("rooms", state.roomsValue);
          formData.append("furnished", state.furnishedValue);
          formData.append("pool", state.poolValue);
          formData.append("elevator", state.elevatorValue);
          formData.append("cctv", state.cctvValue);
          formData.append("parking", state.parkingValue);
          // GlobalState.userId gives the currently logged in user using th useContext hook
          formData.append("seller", GlobalState.userId);

        //   try {
        //     const response = await Axios.post(
        //       "http://127.0.0.1:8000/api/listings/create/",
        //       formData
        //     );
        //     console.log("Success:", response.data);
        //     navigate('/listings');
        //   } catch (e) {
        //     // Log detailed error information for debugging
        //     if (e.response) {
        //       console.error("Error Response:", e.response.data);
        //       console.error("Status Code:", e.response.status);
        //     } else if (e.request) {
        //       console.error("No Response Received:", e.request);
        //     } else {
        //       console.error("Error:", e.message);
        //     }
        //   }
        }
        UpdateProperty()
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
                        checked={state.poolValue}
                        onChange = {(e)=>dispatch({type: 'catchPoolChange', 
                            poolChosen: e.target.checked})}/>} 
                    label="Pool" />
                    </Grid2>

                    <Grid2 xs={2} style={{ marginTop: "1rem" }}>
                    <FormControlLabel 
                    control={<Checkbox 
                        checked={state.elevatorValue}
                        onChange = {(e)=>dispatch({type: 'catchElevatorChange', 
                            elevatorChosen: e.target.checked})}/>} 
                    label="Elevator" />
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
                
                <Grid2 container style={{ marginTop: "3rem" }} xs={8}>
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
                        >
                        UPDATE
                    </Button>
                </Grid2>
            </form>
            <Button 
            marginTop= "1rem"
            variant="contained" 
            onclick={props.closeDialog}>CANCEL</Button>
        </div>
    );
}

export default ListingUpdate;