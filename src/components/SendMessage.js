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
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchSubjectChange':
                draft.subject = action.subjectChosen;
                break;
            case 'catchBodyChange':
                draft.body = action.bodyChosen;
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
            const SendMessageToBackend = async () => {
                try {
                    const response = await Axios.post(
                        `http://127.0.0.1:8000/api/messages/send/`,
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
                    console.log('Message sent successfully:', response.data);
                    dispatch({ type: 'openTheSnack' });
                } catch (e) {
                    console.log('Error sending message:', e);
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
                        onChange={(e) => dispatch({ type: 'catchSubjectChange', subjectChosen: e.target.value })}
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="body"
                        label="Message"
                        variant="outlined"
                        fullWidth
                        value={state.body}
                        onChange={(e) => dispatch({ type: 'catchBodyChange', bodyChosen: e.target.value })}
                        multiline
                        rows={4}
                    />
                </Grid2>

                <Grid2 container justifyContent="center" style={{ marginTop: '2rem' }}>
                    <Button type="submit" variant="contained" color="primary" disabled={state.disabledBtn}>
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
