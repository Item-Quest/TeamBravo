let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/-ry1ZS2sh/';

// Video
let video;
// To store the classification
let label = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  let canvas = createCanvas(320, 260);
  canvas.parent('canvasContainer');
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  // Start classifying
  classifyVideo();

  // Add event listener to the button
  document.getElementById('predictButton').addEventListener('click', predictImage);
}

function draw() {
  background(0);

  // Draw the flipped video
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  pop();

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}

// Predict and display the label when the button is clicked
function predictImage() {
  // Create a new p5 Image object
  let img = createImage(video.width, video.height);
  // Copy the current video frame into the image
  img.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
  // Classify the copied image
  classifier.classify(img, (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    label = results[0].label;
  });
}