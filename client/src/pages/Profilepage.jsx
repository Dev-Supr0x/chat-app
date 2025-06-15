import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const Profilepage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const navigate = useNavigate();
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio})
      navigate('/');
    }
    
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg p-6 gap-6'>

        {/* Left Side - Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>

          {/* Profile Image Upload */}
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              alt="avatar"
              className={`w-12 h-12 object-cover ${selectedImg && 'rounded-full'}`}
            />
            Upload profile image
          </label>

          {/* Name Field */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500'
            placeholder='Your Name'
          />

          {/* Bio Field */}
          <textarea
            rows="4"
            value={bio}
            required
            onChange={(e) => setBio(e.target.value)}
            className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500'
            placeholder='Your Bio'
          ></textarea>

          {/* Save Button */}
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
          >
            Save Changes
          </button>

          {/* Optional Go Back Button */}
          <button
            type='button'
            onClick={() => navigate(-1)} // goes back to previous page
            className='text-sm text-gray-400 underline hover:text-white mt-2'
          >
            ← Go Back
          </button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={ authUser?.profilePic ||assets.logo_icon} alt="" />

        {/* Right Side - Image Preview */}
        {selectedImg && (
          <div className='flex justify-center items-center flex-1'>
            <img
              src={URL.createObjectURL(selectedImg)}
              alt="Preview"
              className='max-w-[150px] max-h-[150px] rounded-full border-2 border-gray-500'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilepage;


