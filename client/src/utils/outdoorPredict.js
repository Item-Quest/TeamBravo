import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

//possible prediction labels
const cocoLabels = [
    "person", "bicycle", "car", "motorcycle", "bus", "train", "truck",
    "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
    "bird", "cat", "dog", "backpack", "umbrella", "handbag", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
    "skateboard", "surfboard", "tennis racket",
    "banana", "apple", "sandwich", "orange",
    "carrot", "hot dog", "pizza", "donut", "cake", "potted plant"
];

// Function to load and predict

let model;

export async function outdoorPredict(imageData) {
    if(!model){
        model = await cocoSsd.load();
    }

    // Unable to use model with tf.tidy as it is not a tensor
    // and will throw an error if used with tf.tidy

    // Run Detection
    const predictions = await model.detect(imageData);

    // Filter predictions to only include those from cocoLabels and with a confidence greater than 0.5
    const filteredPredictions = predictions.filter(prediction => cocoLabels.includes(prediction.class) && prediction.score > 0.5);
    
    // Sort predictions by confidence in descending order
    filteredPredictions.sort((a, b) => b.score - a.score);

    // Get the labels of the filtered predictions
    const labels = filteredPredictions.map(prediction => prediction.class);

    // Get the confidence scores of the filtered predictions
    const scores = filteredPredictions.map(prediction => prediction.score);

    // Return the top prediction label and confidence score
    return filteredPredictions.length > 0 ? filteredPredictions[0].class: 'no_item';  // Custom fallback value if no predictions are found
}