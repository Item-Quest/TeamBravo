import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import '../styles/login.css';
import socket from '../socket';
import { use } from "react";

const Login = (props) => {
  const [username, setUsername] = useState("Anonymous");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();


  function updateUsername(event) {
    setUsername(event.target.value);
    console.log("Username Updated: ", event.target.value);
  }
  function updatePassword(event) {
    setPassword(event.target.value);
    console.log("Password Updated: ", event.target.value);
  }
  function updateConfPass(event) {
    setConfPass(event.target.value);
    console.log("Confirm Password Updated: ", event.target.value);
  }

  function login() {
    if (username.trim() === "" || password.trim() === "" || confPass.trim() === "") {
      setErrorMessage("All fields are required!");
      return;
    }
    if (password === confPass) {
      socket.emit('login', { 'username': username, 'password': password });
    }
    else {
      setErrorMessage("Passwords do not match!");
    }
  }

  function register() {
    if (username.trim() === "" || password.trim() === "" || confPass.trim() === "") {
      setErrorMessage("All fields are required!");
      return;
    }
    if (password === confPass) {
      socket.emit('register', { 'username': username, 'password': password });
    }
    else {
      setErrorMessage("Passwords do not match!");
    }
  }
  useEffect(() => {
    socket.on('login response', (response) => {
      if (response.success) {
        console.log("Login successful!");
        navigate("/"); // Redirect to home page on successful login
      } else {
        setErrorMessage(response.message || "Login failed. Please try again.");
      }
    });

    socket.on('register response', (response) => {
      if (response.success) {
        console.log(response.message);
        navigate("/"); // Redirect to home page on successful login
      } else {
        setErrorMessage(response.message || "register failed. Please try again.");
      }
    });

  });



  return (
    <div className='login-container'>
      <input onChange={updateUsername} type="text" placeholder="Enter Username"></input>
      <input onChange={updatePassword} type="text" placeholder="Enter Password"></input>
      <input onChange={updateConfPass} type="text" placeholder="Confirm Password"></input>
      <div className="button-container">
        <button className="login-button" onClick={login}>Log In</button>
        <button className="login-button" onClick={register}>Register</button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default Login;
