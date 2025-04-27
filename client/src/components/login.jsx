import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Box, Paper, TextField, Button, Typography, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import MessageIcon from '@mui/icons-material/Message';
import '../styles/login.css';
import socket from '../socket';
import logo from "../assets/logo2.png";
import SupportModal from "./SupportModal";
import click from "../assets/SFX/click.wav"

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [uiVolume] = useState(() => {
    const storedVolume = localStorage.getItem('uiVolume');
    return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
  });

  const navigate = useNavigate();
  const clickSound = new Audio(click);
  clickSound.volume = uiVolume

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
      clickSound.play();
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
      clickSound.play();
      socket.emit('register', { 'username': username, 'password': password });
    }
    else {
      setErrorMessage("Passwords do not match!");
    }
  }
  
  const SupportClick = () => {
    setIsSupportOpen(true);
  };
  
  const handleSupportClose = () => {
    setIsSupportOpen(false);
  };
  
  const navigateToHome = () => {
    navigate('/');
  };

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

  // Get the current theme's text color
  const textColor = 'var(--text-color)';

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Support Modal */}
      <SupportModal isOpen={isSupportOpen} onClose={handleSupportClose} />
      
      {/* Navbar */}
      <AppBar position="static" sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: 'var(--text-color)',
              cursor: 'pointer'
            }}
            onClick={navigateToHome}
          >
            Item Quest
          </Typography>
          <Tooltip title="Help & Support">
            <IconButton onClick={SupportClick} sx={{ color: 'var(--text-color)' }} aria-label="help and support">
              <MessageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="GitHub Repository">
            <IconButton
              sx={{ color: 'var(--text-color)' }}
              aria-label="github repository"
              href="https://github.com/Item-Quest/TeamBravo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1,
        padding: { xs: 2, md: 4 }
      }}>
        {/* Logo */}
        <Box 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={navigateToHome}
        >
          <img 
            src={logo} 
            alt="Item Quest Logo" 
            style={{ 
              width: '280px',
              height: 'auto',
              marginBottom: '1.5rem'
            }} 
          />
        </Box>

        {/* Login Form */}
        <Paper elevation={6} sx={{ 
          p: { xs: 3, md: 4 }, 
          width: '100%', 
          maxWidth: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            textAlign: 'center', 
            mb: 3,
            color: textColor,
            fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif"
          }}>
            Account Login
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Username"
            value={username}
            onChange={updateUsername}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&:hover fieldset': {
                  borderColor: 'var(--accent-color)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--accent-color)'
                },
                '& input': {
                  color: textColor
                }
              },
              '& .MuiInputLabel-root': {
                color: textColor
              }
            }}
          />
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Password"
            type="password"
            value={password}
            onChange={updatePassword}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&:hover fieldset': {
                  borderColor: 'var(--accent-color)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--accent-color)'
                },
                '& input': {
                  color: textColor
                }
              }
            }}
          />
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Confirm Password"
            type="password"
            value={confPass}
            onChange={updateConfPass}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--accent-color)',
                  borderWidth: '2px'
                },
                '&:hover fieldset': {
                  borderColor: 'var(--accent-color)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--accent-color)'
                },
                '& input': {
                  color: textColor
                }
              }
            }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: 2,
            mb: 2
          }}>
            <Button 
              variant="contained" 
              onClick={login}
              sx={{
                flex: 1,
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'var(--button-hover-color)'
                }
              }}
            >
              Log In
            </Button>
            
            <Button 
              variant="contained" 
              onClick={register}
              sx={{
                flex: 1,
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'var(--button-hover-color)'
                }
              }}
            >
              Register
            </Button>
          </Box>
          
          {errorMessage && (
            <Typography 
              sx={{ 
                color: '#f44336', 
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              {errorMessage}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
