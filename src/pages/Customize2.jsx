import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx';
import axios from 'axios';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const {
    userData,
    selectedImage,
    serverURL,
    setUserData
  } = useContext(userDataContext)

  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      const body = {
        assistantName,
        imageURL: selectedImage
      }

      const result = await axios.post(`${serverURL}/api/user/update`, body, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setUserData(result.data);
      setLoading(false);
      navigate("/");

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#090956] flex items-center justify-center flex-col p-[10px] relative '>

      <IoIosArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[30px] h-[30px] cursor-pointer ' onClick={() => navigate("/customize")} />

      <h1 className='text-white text-[30px] text-center p-[15px] mb-[10px] '>Enter Your <span className='text-blue-200'> Assistant Name </span> </h1>

      <input
        type="text"
        placeholder="eg . Jarvis "
        className="w-full max-w-[600px] h-[45px] outline-none border-2 border-white text-white bg-transparent placeholder-gray-300 px-[15px] py-[10px] rounded-full text-[18px] "
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && selectedImage && (
        <button
          className="min-w-[250px] h-[50px] text-black font-semibold text-[15px] bg-white rounded-full mt-[20px] cursor-pointer"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  )
}

export default Customize2
