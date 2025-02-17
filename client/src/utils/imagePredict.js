import * as tf from '@tensorflow/tfjs';

// Define the labels
const labels = ['shoe','no_item']; // Add all your labels here

// Function to load and predict
export async function loadModelAndPredict(imageData) {
    // Load the model
    const model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/-ry1ZS2sh/model.json');

    // Preprocess the image
    const image = tf.browser.fromPixels(imageData);
    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
    const normalizedImage = resizedImage.div(255.0);
    const batchedImage = normalizedImage.expandDims(0);

    // Predict
    const predictions = model.predict(batchedImage);
    const predictionArray = await predictions.array();

    // Get the index of the highest confidence prediction
    const maxIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

    // Return the label corresponding to the highest confidence prediction
    return labels[maxIndex];
}
