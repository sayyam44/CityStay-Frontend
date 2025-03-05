import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField, Snackbar, Rating } from '@mui/material';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

// Contexts
import StateContext from '../Contexts/StateContext';

function AddReview(props) {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialState = {
        reviewText: '',
        ratingValue: 0, // Initializing with 0 for the rating
        sendRequest: 0,
        openSnack: false,
        disabledBtn: false,
        reviewErrors: {
			hasErrors: false,
			errorMessage: "",
		},
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchReviewTextChange':
                draft.reviewText = action.reviewTextChosen;
                // Reset error when typing
                draft.reviewErrors.hasErrors = false; 
                draft.reviewErrors.errorMessage = "";
                break;
            case 'catchRatingChange':
                draft.ratingValue = action.ratingChosen;
                break;
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest + 1;
                break;
            case 'openTheSnack':
                draft.openSnack = true;
                break;
            case 'disabledButton':
                draft.disabledBtn = true;
                break;
            case 'allowTheButton':
                draft.disabledBtn = false;
                break;
            //below are all the cases to show alert(make the field red and show the alert message below each field)
            //  in case of any of the field remains empty in the form before being submitted
            case "catchReviewErrors":
                if (action.reviewTextChosen.length === 0) {
                draft.reviewErrors.hasErrors = true;
                draft.reviewErrors.errorMessage = "This field must not be empty";
                }
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    function FormSubmit(e) {
        e.preventDefault();
    
        // Check if the review is empty
        if (state.reviewText.trim() === '') {
            dispatch({ 
                type: "catchReviewErrors", 
                reviewTextChosen: state.reviewText 
            });
            return; // Stop form submission
        }
    
        if (!state.reviewErrors.hasErrors) {
            dispatch({ type: "changeSendRequest" });
            dispatch({ type: 'disabledButton' });
        }
    }

    useEffect(() => {
        if (state.sendRequest) {
            const AddReviewToBackend = async () => {
                try {
                    const response = await Axios.post(
                        `https://www.citystayinnl.com/api/listings/${props.listingData.id}/add_review/`,
                        {
                            review: state.reviewText,
                            rating: state.ratingValue,
                            listing: props.listingData.id,  // Pass the listing_id
                            user: GlobalState.userId,  // Pass the user_id
                        }
                    );
                    console.log('Success:', response.data);
                    dispatch({ type: 'openTheSnack' });
                } catch (e) {
                    if (e.response) {
                        console.log('Error status:', e.response.status);
                        console.log('Error data:', e.response.data);
                    } else if (e.request) {
                        console.log('Request error:', e.request);
                    } else {
                        console.log('Error message:', e.message);
                    }
                    dispatch({ type: 'allowTheButton' });
                }
            };
            
            AddReviewToBackend();
        }
    }, [state.sendRequest]);

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate(0);
            }, 1500);
        }
    }, [state.openSnack]);

    return (
        <div
            style={{
                width: '95%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '1rem',
                marginBottom: '1rem',
                border: '5px solid black',
                padding: '3rem',
            }}
        >
            <form onSubmit={FormSubmit}>
                <Grid2 container justifyContent="center">
                    <Typography variant="h4">ADD REVIEW</Typography>
                </Grid2>

                <Grid2 container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="reviewText"
                        label="Your Review*"
                        variant="outlined"
                        fullWidth
                        value={state.reviewText}
                        multiline
                        rows={4}
                        onChange={(e) => dispatch({ type: 'catchReviewTextChange', reviewTextChosen: e.target.value })}
                        // this is to show alerts related to your review field 
                        // onBlue->Triggered when the user moves focus away (clicks somewhere else or presses Tab).
                        onBlur={(e) =>
                            dispatch({
                            type: "catchReviewErrors",
                            reviewTextChosen: e.target.value,
                            })}
                        error={state.reviewErrors.hasErrors ? true : false}
                        helperText={state.reviewErrors.errorMessage} 
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: '1rem' }}>
                    <Typography component="legend" 
                    sx={{ fontWeight: 'bold', fontSize: '1.2rem',marginRight: '1rem'  }}>
                         Rating*</Typography>
                    <Rating
                        name="review-rating"
                        value={state.ratingValue}
                        onChange={(e, newValue) => dispatch({ type: 'catchRatingChange', ratingChosen: newValue })}
                        size="large"
                    />
                </Grid2>

                <Grid2 container justifyContent="center" style={{ marginTop: '2rem' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={state.disabledBtn}
                    >
                        Submit Review
                    </Button>
                </Grid2>
            </form>

            {/* SnackBar to show success message */}
            <Snackbar
                open={state.openSnack}
                message="Review added successfully!"
                autoHideDuration={1500}
            />
        </div>
    );
}

export default AddReview;