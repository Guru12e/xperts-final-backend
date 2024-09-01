import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/colors.scss";
import "../styles/index.css";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    try {
      const apiUrl =
        role === "ALUMNI"
          ? "http://localhost:5000/auth/aluminiLogin"
          : "http://localhost:5000/auth/studentLogin";

      const response = await axios.post(apiUrl, {
        email: email,
        pass: password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("Invalid CredientialsInvalid Credentials");
      } else {
        setError("Login failed.");
      }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-[var(--sky-blue)] p-4'>
      <motion.div
        className='w-full max-w-md bg-white p-8 rounded-lg shadow-lg'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className='text-2xl font-bold text-[var(--deep-blue)] mb-6 text-center'>
          Login
        </h2>
        {error.length != 0 && (
          <div className='py-2 px-4 border rounded-md border-red-400 bg-rose-200 font-semibold uppercase text-center text-md my-4'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Select Role</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className='w-full p-2 border rounded'
              required
            >
              <option value='' disabled>
                Select your role
              </option>
              <option value='STUDENT'>STUDENT</option>
              <option value='ALUMNI'>ALUMNI</option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>
              Registered Email ID
            </label>
            <input
              type='email'
              value={email}
              onChange={handleEmailChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='mb-6'>
            <label className='block text-gray-700 mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={handlePasswordChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='flex justify-center'>
            <button type='submit' className='primary-btn'>
              Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
