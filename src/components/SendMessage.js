import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField, Snackbar } from '@mui/material';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

// Contexts
import StateContext from '../Contexts/StateContext';

function SendMessage(props) {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialState = {
        subject: '',
        body: '',
        sendRequest: 0,
        openSnack: false,
        disabledBtn: false,
        subjectErrors: {
			hasErrors: false,
			errorMessage: "",
		},
        messageErrors: {
			hasErrors: false,
			errorMessage: "",
		},
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchSubjectChange':
                draft.subject = action.subjectChosen;
                // Reset error when typing
                draft.subjectErrors.hasErrors = false; 
                draft.subjectErrors.errorMessage = "";
                break;
            case 'catchBodyChange':
                draft.body = action.bodyChosen;
                draft.messageErrors.hasErrors = false; 
                draft.messageErrors.errorMessage = "";
                break;
            case 'changeSendRequest':
                draft.sendRequest += 1;
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
            case "catchSubjectChangeErrors":
                if (action.subjectChosen.length === 0) {
                draft.subjectErrors.hasErrors = true;
                draft.subjectErrors.errorMessage = "This field must not be empty";
                }
                break;

            case "catchMessageChangeErrors":
                if (action.bodyChosen.length === 0) {
                draft.messageErrors.hasErrors = true;
                draft.messageErrors.errorMessage = "This field must not be empty";
                }
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    function FormSubmit(e) {
        e.preventDefault();
        // Check if the subject is empty
        if (state.subject.trim() === '') {
            dispatch({ 
                type: "catchSubjectChangeErrors", 
                subjectChosen: state.subject 
            });
            return; // Stop form submission
        }
        // Check if the subject is empty
        if (state.body.trim() === '') {
            dispatch({ 
                type: "catchMessageChangeErrors", 
                bodyChosen: state.subject 
            });
            return; // Stop form submission
        }
    
        if (!state.subjectErrors.hasErrors && !state.messageErrors.hasErrors) {
            dispatch({ type: "changeSendRequest" });
            dispatch({ type: 'disabledButton' });
        }
        // dispatch({ type: 'changeSendRequest' });
        // dispatch({ type: 'disabledButton' });
    }

    useEffect(() => {
        if (state.sendRequest) {
            const SendMessageToBackend = async () => {
                try {
                    const response = await Axios.post(
                        `https://www.citystayinnl.com/api/messages/send/`,
                        {
                            sender: GlobalState.userId,  // sender of the message
                            recipient: props.recipientId, //receipient of the current listing
                            subject: state.subject,
                            body: state.body,
                        },
                        {
                            headers: { Authorization: `Token ${GlobalState.userToken}` },  // Djoser Token Authentication
                        }
                    );
                    // console.log('Message sent successfully:', response.data);
                    dispatch({ type: 'openTheSnack' });
                } catch (e) {
                    // console.log('Error sending message:', e);
                    dispatch({ type: 'allowTheButton' });
                }
            };

            SendMessageToBackend();
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
                    <Typography variant="h4">MESSAGE</Typography>
                </Grid2>

                <Grid2 container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="subject"
                        label="Subject"
                        variant="outlined"
                        fullWidth
                        value={state.subject}
                        onChange={(e) => dispatch({ 
                            type: 'catchSubjectChange', 
                            subjectChosen: e.target.value })}

                        // this is to show alerts related to subject field 
                        // onBlue->Triggered when the user moves focus away (clicks somewhere else or presses Tab).
                        onBlur={(e) =>
                            dispatch({
                            type: "catchSubjectChangeErrors",
                            subjectChosen: e.target.value,
                            })}
                        error={state.subjectErrors.hasErrors ? true : false}
                        helperText={state.subjectErrors.errorMessage}
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="body"
                        label="Message"
                        variant="outlined"
                        fullWidth
                        value={state.body}
                        multiline
                        rows={4}
                        onChange={(e) => dispatch
                            ({ type: 'catchBodyChange', 
                                bodyChosen: e.target.value })}
                        // this is to show alerts related to body field 
                        // onBlue->Triggered when the user moves focus away (clicks somewhere else or presses Tab).
                        onBlur={(e) =>
                            dispatch({
                            type: "catchMessageChangeErrors",
                            bodyChosen: e.target.value,
                            })}
                        error={state.messageErrors.hasErrors ? true : false}
                        helperText={state.messageErrors.errorMessage} 
    
                    />
                </Grid2>

                <Grid2 container justifyContent="center" style={{ marginTop: '2rem' }}>
                    <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={state.disabledBtn}>
                        Send
                    </Button>
                </Grid2>
            </form>

            {/* SnackBar to show success message */}
            <Snackbar open={state.openSnack} message="Message sent successfully!" autoHideDuration={1500} />
        </div>
    );
}

export default SendMessage;
