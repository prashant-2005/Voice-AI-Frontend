import React, { useContext } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext.jsx';
import axios from 'axios';

const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false);
  const {serverURL,userData, setUserData} = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async(e)=>{
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverURL}/api/auth/signup`,{
        name,email,password
      },{withCredentials:true})
      setUserData(result.data) 
      setLoading(false)  
      navigate("/customize")
    } catch (error) {
      setUserData(null) 
      setLoading(false)
      setError(error.response.data.message) 
    }
  }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center ' style={{ backgroundImage: `url(${bg})` }}>

      <form className='w-[90%] h-[550px] max-w-[450px] bg-[#00000075] backdrop-blur shadow-lg shadow-black rounded-4xl  flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignUp} >

        <h1 className='text-white text-[30px] font-semibold mb-[30px] '>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>

        <input type="text" placeholder='Enter your Name ' className='w-full h-[50px] outline-none border-2 border-white bg-transparent placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] text-white' required onChange={(e)=>setName(e.target.value)} value={name} />

        <input type="email" placeholder='Email ' className='w-full h-[50px] outline-none border-2 border-white bg-transparent placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] text-white' required onChange={(e)=>setEmail(e.target.value)} value={email}  />

        <div className='w-full h-[50px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>

          <input type={showPassword ? "text" : "password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required onChange={(e)=>setPassword(e.target.value)} value={password}  />

          {!showPassword && <IoEye className='absolute top-[12px] right-[20px] text-white w-[23px] h-[23px] cursor-pointer ' onClick={() => setShowPassword(true)} />}

          {showPassword && <IoEyeOff className='absolute top-[12px] right-[20px] text-white w-[23px] h-[23px] cursor-pointer ' onClick={() => setShowPassword(false)} />}


        </div>

        {error.length>0 && <p className='text-red-500 text-[17px] '>*{error}</p>}

        <button className='min-w-[120px] h-[50px] bg-white text-black font-semibold text-[19px] rounded-full mt-[20px] cursor-pointer ' disabled={loading}>{loading?"Loading...":"Sign Up"}</button>

        <p className='text-white text-[18px] cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account ? <span className='text-blue-400 '>Sign In</span> </p>
        
      </form>

    </div>
  )
}

export default SignUp
