// Object Detection using Teachable Machine and COCO-SSD
// Team Bravo

let teachableMachineModel;
let cocoSSDModel;
let video;
let label = "Loading Models...";
// Global variables needed for on-screen detection
let latestPredictions = []; // Store Coco-SSD predictions
let latestTmLabel = "no_item"; // Store Teachable Machine label

const cocoLabels = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck",
    "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
    "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
    "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
    "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup", "fork",
    "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
    "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch", "potted plant",
    "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", "keyboard",
    "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book",
    "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
];


async function preload() {
    // Load your Teachable Machine model
    teachableMachineModel = await tf.loadLayersModel('model.json');

    // Load the COCO-SSD model
    cocoSSDModel = await cocoSsd.load();  // Transfer learning model
}

async function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);

    // Wait for the video to start playing
    video.elt.addEventListener('loadeddata', () => {
        console.log("Video is loaded and ready for processing.");
    });

    // Add play button listener
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', async () => {
        await video.elt.play(); // Ensure video is playing before processing
        classifyVideo(); // Start the classification after playing the video
    });
    
    //await video.elt.play(); // Ensure video is playing before processing
    video.size(224, 224); // Resize to match Teachable Machine input size
    video.hide();
}

function draw() {
    background(220);
    image(video, 0, 0, width, height);

    // Perform classification (Aims to reduce processing load) 
        // Changed to setInterval to reduce processing load
    if (setInterval % 10 === 0) {
        classifyVideo(); // Fixed
    }

    textSize(24);
    fill(0);
    textAlign(CENTER, CENTER);
    text(label, width / 2, height - 40); // Center the text at the bottom
}

// Get Prediction for current video frame (from both models)
async function classifyVideo() {
    if (!teachableMachineModel ||!cocoSSDModel) return;

    // Ensure video is ready before processing
    if (!video.elt || video.elt.videoWidth === 0 || video.elt.videoHeight === 0) {
        console.warn("Video is not ready yet.  Retrying on next frame.");
        return;
    }

    // Get the HTML video element from the p5.MediaElement
    const HTMLVideoElement = video.elt;

    // Filtering Coco-SSD Classes to our desired objects
    const allowed_C_Classes = [
    "person", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
    "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup", "fork",
    "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
    "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch", "potted plant",
    "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", "keyboard",
    "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book",
    "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
];

    // Get COCO-SSD prediction & filter CoCo-SSD predictions
        // Get COCO-SSD prediction
    let cocoPredictions = await cocoSSDModel.detect(HTMLVideoElement);

    // Filter unnecessary classes 
    const filteredPredictions = cocoPredictions.filter(prediction => 
        allowed_C_Classes.includes(prediction.class)
    );


    // Debugging
        // console.log("Video size:", video.width, video.height);
        // console.log("Video element dimensions:", video.elt.videoWidth, video.elt.videoHeight);

    


    // debugging 
        // console.log("COCO Predictions:", predictedLabel);

    let predictedLabel = "no_item"; // Default label

    if (filteredPredictions.length > 0) {
        predictedLabel = filteredPredictions[0].class; // Use the top filtered CoCo_SSD result
    } else {
        // Our Fallback to Teachable Machine Model
        let tmImgTensor = null;
        
        try {
            tmImgTensor = tf.browser.fromPixels(HTMLVideoElement)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();
            
                // Debugging
            // console.log("Tensor before Prediction:", tmImgTensor.shape);

            const tmLabels = ["shoe", "no_item"]; // Teachable Machine labels
            let tmPrediction = await teachableMachineModel.predict(tmImgTensor);
            let tmMaxIndex = tmPrediction.argMax(-1).dataSync()[0]; // Get the highest probability index
            predictedLabel = tmLabels[tmMaxIndex]; 
            // Debugging
                // console.log("Teachable Machine Prediction:", tmPrediction);
                // console.log("Highest Probability Index:", tmMaxIndex
        } catch (error) {
            console.error("Teachable Machine prediction failed:", error);
        } finally {
            if (tmImgTensor) tmImgTensor.dispose();
            // Debugging to ensure properly memory maintenance
                // console.log("Tensor disposed:", tmImgTensor.isDisposedInternal);
        }
    }

    label = predictedLabel; // Updates Label based on highest index
    console.log("Predicted Label:", label);
}
