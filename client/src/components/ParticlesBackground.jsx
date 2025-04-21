"use client";

import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
// Import configuration files
import growingConfig from "../styles/GrowingConfig.json";
import workingConfig from "../styles/WorkingConfig.json";
import confettiConfig from "../styles/ConfettiConfig.json";
import hexegonConfig from "../styles/HexegonConfig.json";
import fireworksConfig from "../styles/FireworksConfig.json";
// Define configurations map for easy access
const configMap = {
  "GrowingConfig.json": growingConfig,
  "WorkingConfig.json": workingConfig,
  "ConfettiConfig.json": confettiConfig,
  "HexegonConfig.json": hexegonConfig,
  "FireworksConfig.json": fireworksConfig
  // Add more configurations here as needed
};

// Utility to get current config from localStorage (with fallback)
const getCurrentConfig = () => {
  const stored = localStorage.getItem('backgroundConfig');
  return stored && configMap[stored] ? stored : 'GrowingConfig.json';
};

// Utility to get custom background color from localStorage
const getCustomBackgroundColor = () => {
  return localStorage.getItem('customBackgroundColor') || '';
};

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const [configFile, setConfigFile] = useState(getCurrentConfig());

  // Listen for backgroundConfig changes in localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'backgroundConfig') {
        setConfigFile(getCurrentConfig());
      }
    };
    
    window.addEventListener('storage', onStorage);
    
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Also listen for changes in the same tab (MenuSettings sets localStorage directly)
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentConfig();
      setConfigFile((prev) => (prev !== current ? current : prev));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // this runs once per application lifetime
  useEffect(() => {
    const initEngine = async () => {
      await initParticlesEngine(async (engine) => {
        // loads the full version of tsparticles (for more features)
        await loadFull(engine);
      });
      
      setInit(true);
    };
    
    initEngine();
  }, []);

  // Get the appropriate config based on the configFile prop and override background settings
  const options = useMemo(() => {
    let config;
    
    // If a specific config file is provided, try to use it
    if (configFile && configMap[configFile]) {
      try {
        config = JSON.parse(JSON.stringify(configMap[configFile])); // Deep clone to avoid modifying original
      } catch (error) {
        config = JSON.parse(JSON.stringify(growingConfig)); // Fallback to growing config
      }
    } else {
      // If no config file provided or not found, use growing config
      config = JSON.parse(JSON.stringify(growingConfig));
    }
    
    // Override background settings to make it transparent
    // This ensures the theme's background color is visible
    if (config.background) {
      config.background.color = {
        value: "transparent"
      };
      config.background.opacity = 0;
    }
    
    return config;
  }, [configFile]);

  // when particles container is loaded
  const particlesLoaded = (container) => {
    console.log("Particles container loaded:", container);
  };

  if (!init) {
    // If not initialized yet, return null or empty fragment
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={options}
      particlesLoaded={particlesLoaded}
    />
  );
};

export default ParticlesBackground;
