import React, { useContext } from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import Home from './pages/Home.jsx';
import { userDataContext } from './context/UserContext.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Customize from './pages/Customize.jsx';
import Customize2 from './pages/Customize2.jsx';


const App = () => {
  const { userData,setUserData } = useContext(userDataContext)

  // Show loading until userData is resolved (null or object)
  if (userData === undefined) {
    return <div>Loading..</div>
  } 

  return (
    <Routes>
      <Route path="/" element={(userData?.assistantImage && userData?.assistantName)? <Home/> : <Navigate to={"/customize"} />} />
      <Route path="/signin" element={!userData?<SignIn/> : <Navigate to={"/"} />} />
       <Route path="/signup" element={!userData?<SignUp/> : <Navigate to={"/"} />} />
       <Route path="/customize" element={userData ? <Customize/> : <Navigate to={"/signup"} />} />
       <Route path="/customize2" element={userData ? <Customize2/> : <Navigate to={"/signup"} />} />
    </Routes>
  )
}

export default App
