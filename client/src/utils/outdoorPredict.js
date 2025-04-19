import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

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

// Items for the outdoor Game Mode
const validOutdoorItems = [
    "bicycle", "car", "motorcycle", "bus", "train", "truck",
    "boat", "traffic light", "fire hydrant", "stop sign", "parking meter",
    "bench", "bird", "cat", "dog", "backpack", "umbrella", "sports ball",
    "skateboard"
];

// Function to load and predict (solely using coco-ssd)
let model;

export async function outdoorPredict(imageData) {
    if(!model){
        model = await cocoSsd.load();
    }

    // Note: (Unable to use model with tf.tidy as it is not a tensor)

    // Run Detection
    const predictions = await model.detect(imageData);

    // Filter predictions to only include those from cocoLabels and with a confidence greater than 0.5
    const filteredPredictions = predictions
    .filter(pred => validOutdoorItems.includes(pred.class) && pred.score > 0.5)
    .sort((a, b) => b.score - a.score); // Sort predictions by confidence in descending order

    if (filteredPredictions.length === 0) {
        console.warn("No valid COCO predictions found. ");
    }

    /*
    // Get the confidence scores of the filtered predictions
    const scores = filteredPredictions.map(prediction => prediction.score);
    */
   // Useful for debugging purposes

    // Return the top prediction label and confidence score
    return filteredPredictions.map(pred => ({
        label: pred.class,
        bbox: pred.bbox, // [x, y, width, height] of the bounding box
        score: pred.score  // [x, y, width, height] of the bounding box
    }));
}