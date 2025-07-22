import React, { createContext, useEffect, useState } from "react";
import axios from "axios";


export const userDataContext = createContext();


const UserContext = ({ children }) => {
  // const serverURL = import.meta.env.VITE_BACKEND_URL;
  const serverURL = https://voice-ai-backend-hwfd.onrender.com;
  
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/user/current`, {
        withCredentials: true,
      });

      if (result.data && result.data.user) {
        setUserData(result.data.user);
        console.log("Current user:", result.data.user);
      } else {
        setUserData(null);
        console.log("No user found (user not logged in).");
      }
    } catch (error) {
      console.error("Error in handleCurrentUser:", error.response?.data?.message || error.message);
      setUserData(null);
    }
  }

  const getGeminiResponse = async (command) => {

    try {
      const result = await axios.post(`${serverURL}/api/user/asktoassistant`, { command }, { withCredentials: true })

      return result.data

    } catch (error) {
      console.log(error);

    }

  }


 useEffect(() => {
    const tokenExists = document.cookie.includes("token=");
    if (tokenExists) {
      handleCurrentUser();
    } else {
      console.log("No token found in cookies, skipping current user fetch.");
    }
  }, []);

  const value = {
    serverURL,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  }

  return (
    <div>
      <userDataContext.Provider value={value}>{children}</userDataContext.Provider>
    </div>
  );
};

export default UserContext;
