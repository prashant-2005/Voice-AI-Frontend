import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/Voice.gif";
import userImg from "../assets/AI.gif";
import { TfiMenuAlt } from "react-icons/tfi";
import { IoIosClose } from "react-icons/io";


const Home = () => {

  const { userData, serverURL, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false);
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/auth/logout`,
        { withCredentials: true })
      navigate("/signin")
      setUserData(null)
    } catch (error) {
      setUserData(null)
      console.log(error);

    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start ");
      } catch (error) {
        if (error.name !== "InvaliStateError") {
          console.error("Start error : ", error);
        }
      }
    }
  }

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)

    // utterence.lang = 'hi-IN';
    // const voices = window.speechSynthesis.getVoices()
    // const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    // if (hindiVoice) {
    //   utterence.voice = hindiVoice;  
    // }


    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      setTimeout(() => { 
        startRecognition()
      },1000);
    }
    synth.cancel()
    synth.speak(utterence)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }

    if (type === 'instagram-open') {
      window.open(`https://www.instagram.com/`, '_blank');
    }

    if (type === 'facebook-open') {
      window.open(`https://www.facebook.com/`, '_blank');
    }

    if (type === 'github-open') {
      window.open(`https://www.github.com/`, '_blank');
    }

    if (type === 'linkedin-open') {
      window.open(`https://www.linkedin.com/`, '_blank');
    }

    if (type === 'weather-show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

  }

  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (error) {
          if(error.name !== "InvalidStateError"){
            console.log(error);
          }
        }
      }
    },1000);


    // const safeRecognition = () => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     try {
    //       recognition.start();
    //       console.log("Recogniton requested to start ");
    //     } catch (error) {
    //       if (error.name !== "InvalidStateError") {
    //         console.error("Start Error :", error);
    //       }
    //     }
    //   }
    // }

    recognition.onstart = () => {
      // console.log("Recognition Started");
      isRecognizingRef.current = true;
      setListening(true)
    }

    recognition.onend = () => {
      // console.log("Recognition Ended");
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (error) {
              if(error.name !== "InvalidStateError") console.log(error);
            }
          }
        }, 1500);
      }
    };


    recognition.onerror = (event) => {
      console.warn("Recognition error :", event.error);
      isRecognizingRef.current = false;
      setListening(false)

      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if(error.name !== "InvalidStateError") console.log(error);
            }
          }
        }, 1500);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      // console.log("Heard : " + transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {

        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)

        const data = await getGeminiResponse(transcript)

        handleCommand(data)
        setAiText(data.response)
        setUserText("")

      }
    }

    // const fallBack = setInterval(() => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     safeRecognition()
    //   }
    // }, 10000)

    // safeRecognition()

    // window.speechSynthesis.onvoiceschanged = () =>{
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can i help you with?`);
      greeting.lang = 'hi-IN';
      // greeting.onend = () =>{
      //   startTimeout();
      // };
      window.speechSynthesis.speak(greeting);
    // };

    return () => {
      isMounted=false
      clearTimeout(startTimeout);
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
      // clearInterval(fallBack)
    }
  }, [])


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#060647] flex items-center justify-center flex-col gap-[15px] '>

      <TfiMenuAlt className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] ' onClick={() => setHam(true)} />

      <div className={`absolute top-0 w-full h-full bg-[#0000004f] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform lg:hidden`}>

        <IoIosClose className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] ' onClick={() => setHam(false)} />

        <button className='min-w-[120px] h-[50px] bg-white text-black font-semibold text-[19px] rounded-full  cursor-pointer ' onClick={handleLogOut} >Log Out</button>

        <button className='min-w-[120px] h-[50px] bg-white text-black font-semibold text-[19px] rounded-full cursor-pointer px-[20px] py-[10px]  ' onClick={() => navigate("/customize")} >Customize your Assistant</button>

        <div className='w-full h-[2px] bg-gray-400  '></div>

        <h1 className='text-white font-semibold text-[19px] '>History</h1>

        <div className='w-full h-[400px] overflow-auto flex flex-col gap-[20px] '>
          {userData.history?.map((his,index) => (
            <span key={index} className='text-gray-300 text-[18px] '>{his}</span>
          ))}
        </div>


      </div>

      <button className='min-w-[120px] h-[50px] bg-white text-black font-semibold text-[19px] rounded-full mt-[20px] cursor-pointer absolute hidden lg:block  top-[20px] right-[20px] ' onClick={handleLogOut} >Log Out</button>

      <button className='min-w-[120px] h-[50px] bg-white text-black font-semibold text-[19px] rounded-full mt-[20px] cursor-pointer absolute top-[80px] right-[20px] px-[20px] py-[10px] hidden lg:block  ' onClick={() => navigate("/customize")} >Customize your Assistant</button>

      <div className='w-[250px] h-[350px] flex justify-center items-center overflow-hidden shadow-lg '>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover rounded-4xl  ' />
      </div>

      <h1 className='text-white text-[18px] font-semibold '>I'm {userData?.assistantName}</h1>

      {!aiText && <img src={userImg} alt="" className='w-[200px] ' />}

      {aiText && <img src={aiImg} alt="" className='w-[200px] ' />}

      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText ? userText : aiText ? aiText : null} </h1>




    </div>
  )
}

export default Home
