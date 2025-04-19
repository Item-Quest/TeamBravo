// This module uses TensorFlow.js and COCO-SSD to detect indoor items in images.
// It first attempts to use COCO-SSD for detection, and if that fails, it falls back to a Teachable Machine model.

import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

/*
// Possible prediction labels
const cocoLabels = [
  "person", "bicycle", "car", "motorcycle", "bus", "train", "truck",
  "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
  "bird", "cat", "dog", "backpack", "umbrella", "handbag", "suitcase", "frisbee",
  "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
  "skateboard", "surfboard", "tennis racket",
  "banana", "apple", "sandwich", "orange",
  "carrot", "hot dog", "pizza", "donut", "cake", "potted plant"
];

*/

// Items for the indoor Game Mode (filtered from cocoLabels)
const validIndoorItems = [
  "backpack", "baseball bat", "banana", "apple", "orange", "carrot", "sandwich",
  "cell phone", "cup", "bottle", "potted plant"
];

// Renaming Items for the indoor Game Mode
const labelMap = {
  'cell phone': 'phone',
  'bottle': 'water bottle',
  'potted plant': 'plant',
  'cup': 'mug'
};

// Function to load and predict
// Note: The Teachable Machine model is loaded only when needed to save resources
// let tmModel;
let cocoModel;

export async function indoorPredict(imageData) {
  if (!cocoModel) {
    cocoModel = await cocoSsd.load();
  }

  const cocoPredictions = await cocoModel.detect(imageData);
  
  // Filter predictions to only include those from cocoLabels and with a confidence greater than 0.5
  const filtered = cocoPredictions
    .filter(pred => validIndoorItems.includes(pred.class) && pred.score > 0.5)
    .map(pred => ({
      label: labelMap[pred.class] || pred.class, // map the label if it exists, otherwise use the original class name
      bbox: pred.bbox,
    }))
    .sort((a, b) => b.score - a.score); // Sort predictions by confidence in descending order

    return filtered;
  }

//   // fallback only if COCO fails
//   if (!tmModel) {
//     tmModel = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/j5Voge3Vq/model.json');
//   }

//   return tf.tidy(() => {
//     const image = tf.browser.fromPixels(imageData);
//     const resized = tf.image.resizeBilinear(image, [224, 224]);
//     const normalized = resized.div(127.5).sub(1);
//     const batched = normalized.expandDims(0);

//     const predictions = tmModel.predict(batched).arraySync()[0];
//     const fallbackLabels = ['shoe','no_item','mug','notebook','phone','water_bottle','plant'];
//     const maxIndex = predictions.indexOf(Math.max(...predictions));
//     const label = fallbackLabels[maxIndex];

//     // Avoid returning "no_item" unless there's no choice
//     if (label === "no_item") {
//       return [];
//     }

//     return [{ label }];
//   });
