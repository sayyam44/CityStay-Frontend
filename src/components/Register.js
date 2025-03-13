import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField,Snackbar, tableFooterClasses, Alert } from '@mui/material';
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
        
        //these are initialstates to show errors if the input username is not following the username rules
        usernameErrors:{
            hasErrors: false,
            errorMessage: "",
        },

        //these are initialstates to show alerts if the input email is not following the email rules
        emailErrors: {
			hasErrors: false,
			errorMessage: "",
		},

        //these are initialstates to show alerts if the input password is not following the password rules
		passwordErrors: {
			hasErrors: false,
			errorMessage: "",
		},
        //these are initialstates to show alerts if the input confirm password is not following the confirm password rules
        password2HelperText: "",

        //these are initialstates to show alerts if the username already exists
        //from console error in 1st useEffect hook
        serverMessageUsername:"",

        //these are initialstates to show alerts if the mail already exists
        //from console error in 1st useEffect hook
        serverMessageEmail:"",

        //below all are the predefined password conditions in django settings
        serverMessageSimilarPassword: "",
		serverMessageCommonPassword: "",
		serverMessageNumericPassword: "",

    };
    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen;
                //this is to remove the alerts if the user types in the right username
                draft.usernameErrors.hasErrors = false;
				draft.usernameErrors.errorMessage = "";
                //this is to remove the alert when the user adds a new and unique username
                draft.serverMessageUsername= "";
                break;
            case 'catchEmailChange':
                draft.emailValue = action.emailChosen;
                //this is to remove the alerts if the user types in the right username
                draft.emailErrors.hasErrors = false;
				draft.emailErrors.errorMessage = "";
                //this is to remove the alert when the user adds a new and unique Email
                draft.serverMessageEmail= "";
                break;
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen;
                //this is to remove the alerts when user follows all the rules for password
                draft.passwordErrors.hasErrors = false;
				draft.passwordErrors.errorMessage = "";
                //below all are the predefined password conditions in django settings
                draft.serverMessageSimilarPassword = "";
				draft.serverMessageCommonPassword = "";
				draft.serverMessageNumericPassword = "";
                break;
            case 'catchPassword2Change':
                draft.password2Value = action.password2Chosen;
                //showing alert till the time the confirm password does not match the actual password
                if (action.password2Chosen !== draft.passwordValue) {
					draft.password2HelperText = "The passwords must match";
				} else if (action.password2Chosen === draft.passwordValue) {
					draft.password2HelperText = "";
				}
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
            case 'catchUsernameErrors'://these are to show alert(make the field red and show the alert message 
            // below each field) if the username is not fullfilling the username rules
				if (action.usernameChosen.length === 0) { //if the username field is empty 
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage = "This field must not be empty";
				} else if (action.usernameChosen.length < 5) { //if the username length is smaller than 5 characters.
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage =
						"The username must have at least five characters";
				} else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) { //the username should not have speacial characters
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage =
						"This field must not have special characters";
				}
				break;
            case "catchEmailErrors": //all the rules for checking the email
                if ( //This rule is a validation for checking the format of an email address
                    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        action.emailChosen
                    )
                ) {
                    draft.emailErrors.hasErrors = true;
                    draft.emailErrors.errorMessage = "Please enter a valid email!";
                }
                break;

            case "catchPasswordErrors": //all the rules for checking the password
                if (action.passwordChosen.length < 8) { //password length should not be smaller than 8 chars
                    draft.passwordErrors.hasErrors = true;
                    draft.passwordErrors.errorMessage =
                        "The password must at least have 8 characters!";
                }
                break;
            case "usernameExists": //this is to handle the error if the user inputs the username that already exists
                draft.serverMessageUsername = "This usename already exists";
                break;
            case "emailExists": //this is to handle the error if the email already exists
                draft.serverMessageEmail = "This Email already exists";
                break;

            //below all are the predefined password conditions in django settings
            case "similarPassword":
				draft.serverMessageSimilarPassword =
					"The password is too similar to the username!";
				break;

			case "commonPassword":
				draft.serverMessageCommonPassword = "The password is too common!";
				break;

			case "numericPassword":
				draft.serverMessageNumericPassword =
					"The password must not only contain numbers!";
				break;
            
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
        //we need to submit the form only if there is no error in any of the fields
        if (
			!state.usernameErrors.hasErrors &&
			!state.emailErrors.hasErrors &&
			!state.passwordErrors.hasErrors &&
			state.password2HelperText === ""
		) {
            dispatch({type: 'changeSendRequest'});
            dispatch({type: 'disabledButton'});
        }
        
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
                        'https://www.citystayinnl.com/api-auth-djoser/users/', // Fixed the URL here
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
    
                    if (error.response.data.username) { //this is to handle the error if the username already exists
                        dispatch({type: 'usernameExists'});
                    } else if (error.response.data.email) { //this is to handle the error if the email already exists
                        dispatch({type: 'emailExists'});
                    }else if ( //these all are the predefined password conditions in django settings
						error.response.data.password[0] ===
						"The password is too similar to the username."
					) {
						dispatch({ type: "similarPassword" });
					} else if (
						error.response.data.password[0] === "This password is too common."
					) {
						dispatch({ type: "commonPassword" });
					} else if (
						error.response.data.password[0] ===
						"This password is entirely numeric."
					) {
						dispatch({ type: "numericPassword" });
					}
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
                navigate("/created");
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

                {/* this is to show the error on top if the username already exists from 1st useeffect */}
                {state.serverMessageUsername ? (
                    <Alert severity='error'>{state.serverMessageUsername}</Alert>
                ):(
                    ""
                )}

                {/* this is to show the error on top if the Email already exists 1st useeffect */}
                {state.serverMessageEmail ? (
                    <Alert severity='error'>{state.serverMessageEmail}</Alert>
                ):(
                    ""
                )}

                {/* this is to show the error on top for all are the predefined password conditions in django settings */}
                {state.serverMessageSimilarPassword ? (
					<Alert severity="error">{state.serverMessageSimilarPassword}</Alert>
				) : (
					""
				)}

				{state.serverMessageCommonPassword ? (
					<Alert severity="error">{state.serverMessageCommonPassword}</Alert>
				) : (
					""
				)}

				{state.serverMessageNumericPassword ? (
					<Alert severity="error">{state.serverMessageNumericPassword}</Alert>
				) : (
					""
				)}

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="username" 
                    label="Username" 
                    variant="outlined"
                    fullWidth
                    value = {state.usernameValue}
                    onChange = 
                    {(e)=>dispatch({
                        type: 'catchUsernameChange', 
                        usernameChosen: e.target.value})}
                    //this will show alert and a alert message below the field if the username does not follow the rules
                    onBlur={(e) =>
                        dispatch({ 
                            type: "catchUsernameErrors",
                            usernameChosen: e.target.value,
                        })
                    }
                    error={state.usernameErrors.hasErrors ? true : false}
                    helperText={state.usernameErrors.errorMessage}
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="email" 
                    label="Email" 
                    variant="outlined" 
                    fullWidth
                    value = {state.emailValue}
                    onChange = 
                    {(e)=>dispatch({
                        type: 'catchEmailChange', 
                        emailChosen: e.target.value})}
                    onBlur={(e) => //this will run if the email does not follow the rules
                        dispatch({
                            type: "catchEmailErrors",
                            emailChosen: e.target.value,
                        })
                    }
                    error={state.emailErrors.hasErrors ? true : false}
                    helperText={state.emailErrors.errorMessage}
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value = {state.passwordValue}
                        onChange = {(e)=>dispatch({
                            type: 'catchPasswordChange', 
                            passwordChosen: e.target.value})}  
                        onBlur={(e) =>
                            dispatch({
                                type: "catchPasswordErrors",
                                passwordChosen: e.target.value,
                            })
                        }
                        error={state.passwordErrors.hasErrors ? true : false}
                        helperText={state.passwordErrors.errorMessage}
                        />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="password2"
                        label="Confirm Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value = {state.password2Value}
                        onChange = 
                        {(e)=>dispatch({
                            type: 'catchPassword2Change', 
                            password2Chosen: e.target.value})}  
                        helperText={state.password2HelperText}
                        />

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
