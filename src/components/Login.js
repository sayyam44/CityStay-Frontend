import React, { useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Typography, Button, TextField } from '@mui/material';
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
    };
    function ReducerFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen;
                break;
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen;
                break;
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest +1;
                break;
            case 'catchToken': //this is the token that is generated
            //in 1st useEffect hook that is used in the 2nd useEffect hook
              draft.token =action.tokenValue;
              break;
            default: //new
              break; // Handle unexpected actions //now
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);


    function FormSubmit(e) {
      e.preventDefault();
      console.log('yessssssssssssssss');
      dispatch({type: 'changeSendRequest'});
    }

    // the below useEffect hook is used for the user to login and 
    //generate the token for this user on frontend
    useEffect(() => {
      if (state.sendRequest) { // this means the below code should only run when the register form is submitted
          // The below cancelToken can cancel the request even before the request is finished yet
          // to prevent data leaks.
          const source = Axios.CancelToken.source();
          async function SignIn() {
              try {
                  const response = await Axios.post(
                      'http://127.0.0.1:8000/api-auth-djoser/token/login/', // Fixed the URL here
                      {
                          username: state.usernameValue,
                          password: state.passwordValue,
                          //the username and password from the form
                          //is passed here and hence a token is generated
                          //in the frontend for this user at response.data.auth_token
                      },
                      {
                          cancelToken: source.token
                      }
                  );
                  console.log(response);
                  //now response.data.auth_token holds the token 
                  //of the current user 
                  dispatch({type: 'catchToken', tokenValue: response.data.auth_token,});
                  //navigate('/')

                  //here we are sending the token to the parent component
                  //i.e. app.js using the context file and using dispatch method
                  GlobalDispatch({type: 'catchToken', tokenValue: response.data.auth_token,});
              
                } catch (error) {
                  console.log(error.response);
              }
          }
          SignIn();
          return () => {
              source.cancel();
          };
      }
  // }, [state.sendRequest]);
  }, [state.sendRequest, state.usernameValue, state.passwordValue, dispatch, GlobalDispatch]); //new

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
                    'http://127.0.0.1:8000/api-auth-djoser/users/me', // Fixed the URL here
                    {
                        headers: {Authorization: 'Token '.concat(state.token)},
                    },
                    {
                        cancelToken: source.token,
                    }
                );
                console.log(response);

                //here we are just sending the data to the app.js i.e. the parent component 
                GlobalDispatch({
                  type: "userSignsIn", 
                  usernameInfo: response.data.username, 
                  emailInfo: response.data.email, 
                  IdInfo: response.data.id})

                navigate('/')
            } catch (error) {
                console.log(error.response);
            }
        }
        GetUserInfo();
        return () => {
            source.cancel();
        };
    }
// }, [state.token]);
}, [state.token, GlobalDispatch]); //new


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
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value = {state.passwordValue}
                        onChange = {(e)=>dispatch({type: 'catchPasswordChange', passwordChosen: e.target.value})}
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
        </div>
    );
}

export default Login;
