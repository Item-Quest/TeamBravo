import * as tf from '@tensorflow/tfjs';

// Define the labels
const labels = ['shoe','no_item','mug','notebook','phone','water_bottle']; // Add all your labels here

// Function to load and predict
let model;
export async function loadModelAndPredict(imageData) {
    if(!model){
        model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/j5Voge3Vq/model.json');
    }

    //trying tf.tidy for better memory management
    //memory management wrapper
    return tf.tidy(() => {
    // Preprocess the image
    const image = tf.browser.fromPixels(imageData);
    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
    const normalizedImage = resizedImage.div(127.5).sub(1);
    const batchedImage = normalizedImage.expandDims(0);

    // Predict
    const predictions = model.predict(batchedImage);
    const predictionArray = predictions.arraySync();

    // Get the index of the highest confidence prediction
    const maxIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

    // Return the label corresponding to the highest confidence prediction
    return labels[maxIndex];
    });
}