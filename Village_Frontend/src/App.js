import React, { useEffect} from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import './App.css'; 
import Login from "./components/Login";
import Home from "./container/Home";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { fetchUser } from "./utils/fetchUser";


const App = () => {

  useEffect(() => {
    const user = fetchUser;

  if(!user) Navigate('/login')
  })
  return (
  //   <div className="App">
  //   <h1 className="text-3xl font-bold underline">
  //  Hello Cant believe we are already in December and i dont even know what to say
  //   </h1>
  // </div>

  <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN_CLIENT_ID}`}>
    <BrowserRouter>
      <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
