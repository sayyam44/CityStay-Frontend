import React, { useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField,Snackbar, Alert } from '@mui/material';
import { useImmerReducer } from 'use-immer';
import Axios from "axios";

// Contexts
import DispatchContext from '../Contexts/DispatchContext';
// import StateContext from '../Contexts/StateContext';

function Login() {
    const navigate = useNavigate();
    //GlobalDispatch--> To make changes in the parent component i.e. app.js
    //GlobalState--> Bringing data from parent component i.e. app.js 
    //and then implement changes in the current child component i.e.login.js 
    const GlobalDispatch = useContext(DispatchContext);
    // const GlobalState = useContext(StateContext);

    const initialState = {
      usernameValue: '',
      passwordValue: '',
      sendRequest: 0, //this is to update whether the form is submitted or not
      token: '', //this is to authenticate the user on the basis of its token being generated at the time of login
      openSnack:false, //this is the popup that occurs when the user successfully logs in
      disabledBtn: false, //this is to disable the login button once it is clicked
      serverError:false, //this is to show the error message if the user gives in wrong credentials
    };
    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen;
                draft.serverError = false; //if the user changes the username from an incorrect username then it should not be red anymore
                break;
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen;
                draft.serverError = false;//if the user changes the password from an incorrect password then it should not be red anymore
                break;
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest +1;
                break;
            case 'catchToken': //this is the token that is generated
            //in 1st useEffect hook that is used in the 2nd useEffect hook
              draft.token =action.tokenValue;
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
            case 'catchServerError': //this is to show the error message if the user gives in wrong credentials
                draft.serverError=true
                break
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);


    function FormSubmit(e) {
      e.preventDefault();
    //   console.log('yessssssssssssssss');
      dispatch({type: 'changeSendRequest'});
      dispatch({type: 'disabledButton'})
    }

    // the below useEffect hook is used for the user to login and 
    //generate the token for this user on frontend
    useEffect(() => {
        // if (state.sendRequest) changes
        if (state.sendRequest > 0 && state.token === "") {  // Avoid re-triggering once logged in
            const source = Axios.CancelToken.source();
            async function SignIn() {
                try {
                    const response = await Axios.post(
                        'https://www.citystayinnl.com/api-auth-djoser/token/login/',
                        {
                            username: state.usernameValue,
                            password: state.passwordValue,
                        },
                        {
                            cancelToken: source.token,
                        }
                    );
                    dispatch({ type: 'catchToken', tokenValue: response.data.auth_token });
                    GlobalDispatch({ type: 'catchToken', tokenValue: response.data.auth_token });

                } catch (error) {
                    dispatch({ type: 'allowTheButton' });
                    dispatch({ type: 'catchServerError' });
                }
            }
            SignIn();
            return () => {
                source.cancel();
            };
        }
    }, [state.sendRequest, state.token, dispatch, GlobalDispatch]);



  //the below useEffect hook is used for authenticate the user and to 
  //get the user's data on the basis of the token that is generated 
  //at the time of login above
  useEffect(() => {
    if (state.token !== "") { // this means the below code should only run when the register form is submitted
        // The below cancelToken can cancel the request even before the request is finished yet
        // to prevent data leaks.
        const source = Axios.CancelToken.source();
        async function GetUserInfo() {
            try {
                const response = await Axios.get(
                    'https://www.citystayinnl.com/api-auth-djoser/users/me', // Fixed the URL here
                    {
                        headers: {Authorization: 'Token '.concat(state.token)},
                    },
                    {
                        cancelToken: source.token,
                    }
                );
                // console.log(response);

                // Reset location access in localStorage after login
                localStorage.setItem("locationAccess", null);

                //here we are just sending the data to the app.js i.e. the parent component 
                GlobalDispatch({
                  type: "userSignsIn", 
                  usernameInfo: response.data.username, 
                  emailInfo: response.data.email, 
                  IdInfo: response.data.id})
                dispatch({type: 'openTheSnack'}) //this is to show the popup when user successfully logs in
                
            } catch (error) {
                // console.log(error.response);
            }
        }
        GetUserInfo();
        return () => {
            source.cancel();
        };
    }
// }, [state.token]);
}, [state.token, GlobalDispatch]); //new

//this is used to show the popup for 1.5 sec before being navigating
//to the homepage 
useEffect(()=>{
    if (state.openSnack){
        setTimeout(()=>{
            navigate("/Listings");
        },1500);
    }
},[state.openSnack])


    return (
        <div
            style={{
                width: "50%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "3rem",
                border: "5px solid black",
                padding: "3rem",
            }}
        >
            <form onSubmit={FormSubmit}>
                <Grid2 container justifyContent="center">
                    <Typography variant="h4">SIGN IN</Typography>
                </Grid2>

                {/* in order to show alert message when the credentials are wrong */}
                {state.serverError ? (
                <Alert severity="success">Incorrect Username or Password</Alert>
                ):(
                    ""
                ) }

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <TextField 
                    id="username" 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    value = {state.usernameValue}
                    onChange = {(e)=>dispatch({type: 'catchUsernameChange', usernameChosen: e.target.value})} 
                    error = {state.serverError ? true : false} //turing red alert only if there is error in catch (error) above 
                    
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
                        onChange = {(e)=>dispatch({type: 'catchPasswordChange', passwordChosen: e.target.value})}
                        error = {state.serverError ? true : false} //turing red alert only if there is error in catch (error) above 
                    />
                </Grid2>

                <Grid2 container style={{ marginTop: "1rem" }}>
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{
                            color: "white",
                            backgroundColor: "green",
                            fontSize: "1.1rem",
                            "&:hover": {
                                backgroundColor: "orange",
                            },
                        }}
                        disabled={state.disabledBtn}
                    >
                        SIGN IN
                    </Button>
                </Grid2>
            </form>
            {/* {GlobalState.globalMessage}
            {GlobalState.userToken}
            <br />
            {GlobalState.userUsername}
            <br />
            {GlobalState.userEmail}
            <br />
            {GlobalState.userId} */}

            <Grid2 container justifyContent="center" style={{ marginTop: "1rem" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Don't have an account yet?{" "}
                    <span
                    onClick={() => navigate("/register")}
                    style={{ cursor: "pointer", color: "green" }}
                    >
                    SIGN UP
                    </span>
                </Typography>
            </Grid2>

            {/* this is the popup when user logs in  */}
            <Snackbar
            open={state.openSnack}
            message="You have successfully logged in"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: "center"
            }}
            />
        </div>
    );
}

export default Login;
