import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, CircularProgress, Snackbar, Alert, Card, CardContent, Grid, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, AppBar, Toolbar, IconButton, Tooltip } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import socket from "../socket";
import { loadModelAndPredict, setModelMode } from "../utils/imagePredict";
import PlayCamera from "./PlayCamera";
import { geoGetInfo, getGeoItem, submitGeoquest } from "../dataProvider";

// Import logo
// import logo from "../assets/logo2.png";

const GeoQuestPage = () => {
  const navigate = useNavigate();
  const [dailyItem, setDailyItem] = useState("");
  const [streak, setStreak] = useState(0);
  const [lastIncompletedDate, setLastIncompletedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [AIOutput, setAIOutput] = useState("");
  const [gameState, setGameState] = useState("running");
  const [cameraBorderColor, setCameraBorderColor] = useState("transparent");
  const [showBorder, setShowBorder] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const outDoorItems = ['person', 'bicycle', 'car', 'motorcycle', 'bus', 'train', 'truck',
    'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
    'bird', 'cat', 'dog', 'book bag', 'umbrella', 'frisbee', 'football', 'baseball bat',
    'baseball glove', 'skateboard', 'tennis racket', 'pizza', 'donut', 'cake', 'plant',];
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Function to receive AI output from the camera
  const getAIOutput = (label) => {
    setAIOutput(label);
    //console.log("AI detected:", AIOutput, );

    // If there's a detection, show the border
    if (label) {
      setShowBorder(true);
      console.log("Label:", label, "and/but goal is:", dailyItem);
      // Set border color based on whether it matches the daily item
      if (label.toLowerCase() === dailyItem.toLowerCase()) {
        setCameraBorderColor("green");
        // Process the correct item detection
        handleItemDetected(label);
      } else {
        setCameraBorderColor("red");
        // Reset border after 3 seconds
        setTimeout(() => {
          setShowBorder(false);
          setCameraBorderColor("transparent");
        }, 3000);
      }
    } else {
      setShowBorder(false);
      setCameraBorderColor("transparent");
    }
  };

  // Create camera component with memoization to prevent unnecessary re-renders
  const camera = useMemo(() => {
    return <PlayCamera getAIOutput={getAIOutput} gameState={gameState} />;
  }, [gameState]);
  const updatePersonalInfo = () => {
    geoGetInfo((response) => {
      if (response) {
        console.log("getinfo response:", response);
        setLastIncompletedDate(response.lastIncomplete);
        setSuccess(response.completed);
        setIsComplete(response.completed);

        const lastDate = parseInt(response.lastIncomplete.replace(/-/g, ''), 10); // Convert yyyy-mm-dd to integer
        const today = parseInt(getTodayDate().replace(/-/g, ''), 10);
        const differenceInTime = today - lastDate;
        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

        console.log("Last Incompleted Date:", lastDate);
        console.log("Today Date:", today);
        console.log("Difference in Days:", differenceInDays);

        setStreak(response.completed ? differenceInDays + 1 : differenceInDays);

      }
    });
  };
  // Load user data from localStorage
  useEffect(() => {

    setModelMode("GeoQuest");

    // Generate today's item
    generateDailyItem();

    // Fetch leaderboard data
    fetchLeaderboardData();
  }, []);
  // Fetch leaderboard data
  const fetchLeaderboardData = () => {
    updatePersonalInfo();
    setLoadingLeaderboard(true);

    // Set up socket event listener for leaderboard data
    const handleLeaderboardData = (data) => {
      setLeaderboardData(data);
      setLoadingLeaderboard(false);
    };

    // Add event listener
    socket.on('geoquest top scores', handleLeaderboardData);

    // Request leaderboard data
    socket.emit('geoquest get top scores', "geoQuest");
    };

  // Save user data to localStorage
  const saveUserData = (newStreak, newLastCompletedDate) => {
    const userData = {
      streak: newStreak,
      lastCompletedDate: newLastCompletedDate
    };
    localStorage.setItem("geoQuestData", JSON.stringify(userData));
  };

  // Generate daily item based on the date
  const generateDailyItem = () => {
    setLoading(true);

    // Check if user has already completed today's challenge
    if (isComplete) {
      setAlertMessage("You've already completed today's challenge! Come back tomorrow for a new item.");
      setAlertSeverity("info");
      setShowAlert(true);
      setSuccess(true);
    }

    getGeoItem((item) => { setDailyItem(item); console.log("Daily item:", item); });  
    setLoading(false);
  };

  // Handle item detection
  const handleItemDetected = (detectedItem) => {
    // Check if the detected item matches the daily item
      console.log("ITEM FOUND")
      submitGeoquest()
      // Check if this is a new day compared to the last completed day
      if (!isComplete) {
        setSuccess(true);
        setIsComplete(true);
        setAlertMessage(`Success! You found a ${dailyItem}. Your streak is now ${streak}!`);
        setAlertSeverity("success");
        setShowAlert(true);

        // Refresh leaderboard after successful submission
        fetchLeaderboardData();
      }
      else {
        setAlertMessage("You've already completed today's challenge!");
        setAlertSeverity("info");
        setShowAlert(true);
      }
      fetchLeaderboardData();
  };

  // Format the player rank
  const getPlayerRank = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  // Handle navigation back to home
  const handleBackClick = () => {
    navigate("/home");
  };

  // Handle menu open/close
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      color: "text.primary",
      minHeight: "100vh",
    }}>
      <AppBar position="static" sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'var(--text-color)' }}>
            GeoQuest Daily Challenge
          </Typography>
          <Tooltip title="Back to Home">
            <IconButton onClick={handleBackClick} sx={{ color: 'var(--text-color)' }} aria-label="back to home">
              <HomeIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, width: "100%", maxWidth: "800px" }}>
        <Typography variant="h3" gutterBottom>
          GeoQuest
        </Typography>

        <Card sx={{ width: "100%", mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Your Current Streak: {streak} {streak === 1 ? "day" : "days"}
            </Typography>
            <Typography variant="body1">
              Find one new item each day to build your streak!
            </Typography>
          </CardContent>
        </Card>

        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ width: "100%", maxWidth: 600 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Today's Challenge
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", my: 2 }}>
                Find a: {dailyItem}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Go outside and find this item in the real world. Use the camera to verify!
              </Typography>

              {success ? (
                <Box>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Challenge Completed!
                  </Typography>
                  <Typography variant="body2">
                    Come back tomorrow for a new challenge to continue your streak.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "480px",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  mb: 2
                }}>
                  {/* Camera Container */}
                  <Box
                    sx={{
                      width: "100%",
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      padding: 0,
                      overflow: "hidden",
                      position: "relative",
                      border: showBorder ? `5px solid ${cameraBorderColor}` : "3px solid var(--text-color)",
                      boxShadow: showBorder ? `0 0 15px ${cameraBorderColor}` : "0 4px 0 rgba(0, 0, 0, 0.2)",
                      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                      zIndex: 1,
                      mb: { xs: 1, sm: 1 },
                      minHeight: { xs: "300px", sm: "400px" }
                    }}
                  >
                    {camera}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{
                      color: showBorder ? cameraBorderColor : 'inherit',
                      fontWeight: showBorder ? 'bold' : 'normal',
                      transition: "color 0.3s ease"
                    }}>
                      Detected Item: {AIOutput || "Nothing detected"}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Leaderboard Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon sx={{ mr: 1 }} color="primary" />
                  Top Streaks
                </Typography>

                {//take out time filter doesnt make sense
                /* <Box display="flex" gap={1}>
                  <Chip 
                    label="All Time" 
                    color={timeFrame === 'all' ? 'primary' : 'default'} 
                    onClick={() => setTimeFrame('all')}
                    clickable
                  />
                  <Chip 
                    label="This Week" 
                    color={timeFrame === 'week' ? 'primary' : 'default'} 
                    onClick={() => setTimeFrame('week')}
                    clickable
                  />
                  <Chip 
                    label="Today" 
                    color={timeFrame === 'today' ? 'primary' : 'default'} 
                    onClick={() => setTimeFrame('today')}
                    clickable
                  />
                </Box> */}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {loadingLeaderboard ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {leaderboardData.slice(0, 5).map((player, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {player.score}
                        </Typography>
                      }
                      sx={{
                        bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                        borderRadius: '4px',
                        mb: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: index < 3 ? 'primary.main' : 'grey.400' }}>
                          {getPlayerRank(index)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.username}
                        secondary={`GeoQuest Player`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        )}

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowAlert(false)} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default GeoQuestPage;
