import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

//possible prediction labels
const cocoLabels = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck",
    "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
    "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
    "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
    "skateboard", "surfboard", "tennis racket",
    "banana", "apple", "sandwich", "orange", "broccoli",
    "carrot", "hot dog", "pizza", "donut", "cake", "potted plant"
];

// Function to load and predict

let model;

export async function loadModelAndPredict(imageData) {
    if(!model){
        model = await cocoSsd.load();
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