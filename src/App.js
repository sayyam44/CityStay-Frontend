import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, {useEffect} from "react";
import { useImmerReducer } from 'use-immer';
//Components
import Home from "./components/Home";
import Login from "./components/Login";
import Listings from "./components/Listings";
import CssBaseline from '@mui/material/CssBaseline';
import Header from "./components/Header";
import Testing from "./components/Testing";
import Register from "./components/Register";
import AddProperty from "./components/AddProperty";
import Profile from "./components/Profile";

// Context for sharing the props from app.js to header.js 
import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";


function App() {
  const initialState = {
    //whenever the user logs-in the local storage values will be updated
    userUsername: localStorage.getItem("theUserUsername"),
    userEmail: localStorage.getItem("theUserEmail"),
    userId: localStorage.getItem("theUserId"),
    userToken: localStorage.getItem("theUserToken"), //this field will get from login.js using DispatchCaontext.js 
    //to us it in header.js file
    // globalMessage: "hahahahaahahah",
    //below useIsLoggedin will be used in the header.js to keep the 
    //button name of the user thoughtout even on refreshing the page
		userIsLogged: localStorage.getItem("theUserUsername") ? true : false,
  };
  function ReducerFunction(draft, action) {
      switch (action.type) {
        case 'catchToken': //this case is defined for getting the token 
        //from login.js using contexts so that it can be used in header.js 
          draft.userToken = action.tokenValue;
            break;
        case 'userSignsIn'://when the user signs-in below all properties have to be changed.
        //this case is to get the userinfo from login.js 
        //for the user whose token we get in the above case
          draft.userUsername = action.usernameInfo;
          draft.userEmail = action.emailInfo;
          draft.userId = action.IdInfo;
          draft.userIsLogged = true;
          break;
        case 'logout': //to manage the local storage when user logout
          draft.userIsLogged = false
          break
      }
  }
  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    if (state.userIsLogged){ 
      //whenever the user logged in the user's credentials will 
      //be stored in the local storage from login.js
      localStorage.setItem('theUserUsername', state.userUsername);
      localStorage.setItem('theUserEmail', state.userEmail);
      localStorage.setItem('theUserId', state.userId);
      localStorage.setItem('theUserToken', state.userToken);
    }
    else {//when the user logs out from the header.js's logout button
      //we need to delete the content of this user from the localstorage
      localStorage.removeItem("theUserUsername");
			localStorage.removeItem("theUserEmail");
			localStorage.removeItem("theUserId");
			localStorage.removeItem("theUserToken");
    }
  },[state.userIsLogged])

    return (
    //Below I am using the context to share the value here 
    //i.e. dispatch component to share among all its child components
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
        <CssBaseline />
            <Header />
            <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='/login' element={<Login />}/>
              <Route path="/Register" element={<Register />} />
              <Route path="/addproperty" element={<AddProperty />} />
              <Route path="/profile" element={<Profile />} />  
              <Route path="/Listings" element={<Listings />} />
              <Route path="/Testing" element={<Testing />} />            
            </Routes>
          </BrowserRouter>
      //   </DispatchContext.Provider>
      // </StateContext.Provider>
    );
}
export default App;
