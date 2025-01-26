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
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchReviewTextChange':
                draft.reviewText = action.reviewTextChosen;
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
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    function FormSubmit(e) {
        e.preventDefault();
        dispatch({ type: 'changeSendRequest' });
        dispatch({ type: 'disabledButton' });
    }

    useEffect(() => {
        if (state.sendRequest) {
            const AddReviewToBackend = async () => {
                try {
                    const response = await Axios.post(
                        `http://127.0.0.1:8000/api/listings/${props.listingData.id}/add_review/`,
                        {
                            review: state.reviewText,
                            rating: state.ratingValue,
                            listing_id: props.listingData.id,  // Pass the listing_id
                            user_id: state.userId,  // Pass the user_id
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
                        onChange={(e) => dispatch({ type: 'catchReviewTextChange', reviewTextChosen: e.target.value })}
                        multiline
                        rows={4}
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
