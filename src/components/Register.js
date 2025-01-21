import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField,Snackbar } from '@mui/material';
import Axios from "axios";
import { useImmerReducer } from 'use-immer';

// flow of registeration -> 
//if user fills the form and sumbits it then formSubmit function runs
//and then sendRequest value becomes 1 and hence useEffect runs
//and will submit the values that we got from form into the fields defined.
function Register() {
    const navigate = useNavigate();

    const initialState = {
        usernameValue: '',
        emailValue: '',
        passwordValue: '',
        password2Value: '',
        sendRequest: 0,//this is to update whether the form is submitted or not
        openSnack:false, //this is the popup that occurs when the user registers
        disabledBtn: false, //this is to disable the register button once it is clicked
    };
    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen;
                break;
            case 'catchEmailChange':
                draft.emailValue = action.emailChosen;
                break;
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen;
                break;
            case 'catchPassword2Change':
                draft.password2Value = action.password2Chosen;
                break;
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

    // const [sendRequest, setSendRequest] = useState(false);

    //below are the useState hooks used for the form inputs 
    //we are using hooks here for each field because then we
    //need to use these values in the useEffect hook for form below .
    // const [ usernameValue,setUsernameValue] = useState('');
    // const [ emailValue,setEmailValue] = useState('');
    // const [ passwordValue,setPasswordValue] = useState('');
    // const [ password2Value,setPassword2Value] = useState('');

    function FormSubmit(e) {
        e.preventDefault();
        console.log('yessssssssssssssss');
        dispatch({type: 'changeSendRequest'});
        dispatch({type: 'disabledButton'});
    }

    // The below useEffect hook sends the registration data (username, email, password, re_password)
    // to the backend only when the form is submitted. This is triggered by the sendRequest state.
    useEffect(() => {
        if (state.sendRequest) { // this means the below code should only run when the register form is submitted
            // The below cancelToken can cancel the request even before the request is finished yet
            // to prevent data leaks.
            const source = Axios.CancelToken.source();
            async function SignUp() {
                try {
                    const response = await Axios.post(
                        'http://127.0.0.1:8000/api-auth-djoser/users/', // Fixed the URL here
                        {
                            username: state.usernameValue,
                            email: state.emailValue,
                            password: state.passwordValue,
                            re_password: state.password2Value,
                        },
                        {
                            cancelToken: source.token
                        }
                    );
                    console.log(response);
                    // navigate('/')
                    dispatch({type: 'openTheSnack'}) //this is to show the popup when user registers

                } catch (error) {
                    dispatch({type: 'allowTheButton'})
                    console.log(error.response);
                }
            }
            SignUp();
            return () => {
                source.cancel();
            };
        }
    }, [state.sendRequest]);

    //this is used to show the popup for 1.5 sec before being navigating
    //to the homepage 
    useEffect(()=>{
        if (state.openSnack){
            setTimeout(()=>{
                navigate("/");
            },1500);
        }
    },[state.openSnack])
    
    
    return (
        <div
            style={{
                width: "50%",
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: "3rem",
                border: "5px solid black",
                padding: "3rem"
            }}
        >
            <form onSubmit={FormSubmit}>
                <Grid2 container justifyContent="center">
                    <Typography variant="h4">CREATE AN ACCOUNT</Typography>
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="username" 
                    label="Username" 
                    variant="outlined"
                    fullWidth
                    value = {state.usernameValue}
                    onChange = {(e)=>dispatch({type: 'catchUsernameChange', usernameChosen: e.target.value})}  />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="email" 
                    label="Email" 
                    variant="outlined" 
                    fullWidth
                    value = {state.emailValue}
                    onChange = {(e)=>dispatch({type: 'catchEmailChange', emailChosen: e.target.value})} />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value = {state.passwordValue}
                        onChange = {(e)=>dispatch({type: 'catchPasswordChange', passwordChosen: e.target.value})}  />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="password2"
                        label="Confirm Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value = {state.password2Value}
                        onChange = {(e)=>dispatch({type: 'catchPassword2Change', password2Chosen: e.target.value})}  />

                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }} xs={8}>
                    <Button
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
                        disabled={state.disabledBtn}
                    >
                        SIGN UP
                    </Button>
                </Grid2>
            </form>

            <Grid2 container justifyContent="center" style={{ marginTop: "1rem" }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate("/login")}
                        style={{ cursor: 'pointer', color: 'green' }}
                    >
                        SIGN IN
                    </span>
                </Typography>
            </Grid2>

            {/* this is the popup when user registers  */}
            <Snackbar
            open={state.openSnack}
            message="You have successfully created an account"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: "center"
            }}
            />
        </div>
    );
}

export default Register;
