import React, { createContext, useEffect, useState } from "react";
import axios from "axios";


export const userDataContext = createContext();


const UserContext = ({ children }) => {
  const serverURL = import.meta.env.VITE_BACKEND_URL;
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/user/current`, { withCredentials: true })
      setUserData(result.data)
      console.log(result.data);

    } catch (error) {
      console.log(error);
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
    const cookieExists = document.cookie.includes("token=");
    if (cookieExists) {
      handleCurrentUser();
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
