import React, { useContext} from 'react'
import Card from '../card/Card.jsx'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";

const Customize = () => {
  const {
    setSelectedImage,
    selectedImage
  } = useContext(userDataContext)

  const navigate = useNavigate()

  const handleSelect = (image) => {
    setSelectedImage(image)
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#090956] flex items-center justify-center flex-col relative'>

      <IoIosArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[30px] h-[30px] cursor-pointer ' onClick={() => navigate("/")} />

      <h1 className='text-white text-[30px] text-center p-[15px] mb-[10px] '>Select your <span className='text-blue-200'>Assistant Image</span> </h1>

      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]'>
        {[image1, image2, image3, image4, image5, image6, image7].map((img, index) => (
          <Card
            key={index}
            image={img}
            onClick={() => handleSelect(img)}
            isSelected={selectedImage === img}
          />
        ))}
      </div>

      {selectedImage && (
        <button
          className="min-w-[120px] h-[50px] text-black font-semibold text-[15px] bg-white rounded-full mt-[20px] cursor-pointer"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}

    </div>
  )
}

export default Customize

