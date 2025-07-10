import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext.jsx'

const Card = ({image}) => {

  const { serverURL,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage } = useContext(userDataContext)


  return (
    <div className={`w-[70px] h-[120px] lg:w-[140px] lg:h-[220px] bg-[#0f0f2a] border-2 border-[#0000ff6b] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage===image ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`} onClick={()=>{
      setSelectedImage(image)
      }}>
      <img src={image} className='h-full object-cover ' />
    </div>
  )
}

export default Card
