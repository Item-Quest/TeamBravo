import React, {useEffect, useRef, useState} from "react";
import p5 from "p5";
import ml5 from "ml5";
//Used Chatgpt to help write: don't know p5js at all
const AIModel = () => {
  const classifierRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [label, setLabel] = useState("");
  const model_url = 'https://teachablemachine.withgoogle.com/models/-ry1ZS2sh/';

  //useEffect hook synchronizes with external system
  //load ml5.js model and start video
  useEffect(() => {
    let p5Instance;
  })

  const predictImage = () => {
    //file still being worked on
  }

  return (
    <div>
      <button onClick={predictImage}>Predict Image</button>
      <div ref={canvasRef}></div>
    </div>
  );
}

export default AI;