"use client";

import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
 
 const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // this runs once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // loads the "slim" version of tsparticles
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // when particles container is loaded
  const particlesLoaded = (container) => {
    console.log("Particles container loaded:", container);
  };

  // set up your particles config
  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#0d47a1", 
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          outModes: { default: "bounce" },
        },
        number: {
          density: { enable: true },
          value: 40,
        },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  );

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
