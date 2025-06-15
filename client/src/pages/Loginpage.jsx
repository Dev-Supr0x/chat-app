import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [prevStateBeforeBio, setPrevStateBeforeBio] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const validateInputs = () => {
    if (!email || !password) return false;
    if (currState === "Sign up" && !isDataSubmitted && !fullName) return false;
    if (currState === "Sign up" && isDataSubmitted && !bio) return false;
    return true;
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      alert("Please fill in all required fields.");
      return;
    }

    if (currState === "Sign up" && !isDataSubmitted) {
      setPrevStateBeforeBio(currState);
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? 'signup' : 'login', {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* Left Section */}
      <img src={assets.logo_big} alt="App Logo" className='w-[min(30vw,250px)]' />

      {/* Right Section */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>

        {/* Header */}
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && (
            <img
              src={assets.arrow_icon}
              alt="Back"
              className='w-5 cursor-pointer'
              onClick={() => {
                setCurrState(prevStateBeforeBio);
                setIsDataSubmitted(false);
              }}
            />
          )}
        </h2>

        {/* Full Name (only for Sign up step 1) */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Full Name'
            required
          />
        )}

        {/* Email & Password */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </>
        )}

        {/* Bio input (Sign up step 2) */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Provide a short bio...'
            required
          />
        )}

        {/* Submit Button */}
        <button
          type='submit'
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {currState === "Sign up" && !isDataSubmitted ? "Create Account" : currState === "Sign up" ? "Finish Sign Up" : "Login Now"}
        </button>

        {/* Terms */}
        {currState === "Sign up" && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" required />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>
        )}

        {/* Toggle Auth Mode */}
        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account?
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className='font-medium text-violet-500 cursor-pointer'
              > Login here</span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              New here?
              <span
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
                className='font-medium text-violet-500 cursor-pointer'
              > Create account</span>
            </p>
          )}
        </div>

      </form>
    </div>
  );
};

export default LoginPage;
