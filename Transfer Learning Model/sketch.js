let teachableMachineModel;
let cocoSSDModel;
let video;
let label = "Loading Models...";

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

    if (frameCount % 10 === 0) {
        classifyVideo(); // Fixed
    }

    textSize(24);
    fill(0);
    textAlign(CENTER, CENTER);
    text(label, width / 2, height - 40); // Center the text at the bottom
}

async function classifyVideo() {
    if (!teachableMachineModel ||!cocoSSDModel) return;

    // Ensure video is ready before processing
    if (!video.elt || video.elt.videoWidth === 0 || video.elt.videoHeight === 0) {
        console.error("Video is not ready yet.");
        return;
    }

    // Debugging
    //console.log("Video size:", video.width, video.height);
    //console.log("Video element dimensions:", video.elt.videoWidth, video.elt.videoHeight);


    // Get the HTML video element from the p5.MediaElement
    const HTMLVideoElement = video.elt;

    // Get COCO-SSD prediction
    let cocoPredictions = await cocoSSDModel.detect(HTMLVideoElement);
    // debugging 
    console.log("COCO Predictions:", cocoPredictions);

    let predictedLabel = "No object detected"; // Default label

    // If no COCO-SSD object is detected, use Teachable Machine model
    if (cocoPredictions > 0) {
        predictedLabel = cocoPredictions[0].class; // Use CoCo_SSD result
    } else {
        let tmImgTensor = null;
        
        try {
            tmImgTensor = tf.browser.fromPixels(HTMLVideoElement)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();
            
                // Debugging
            //console.log("Tensor before Prediction:", tmImgTensor.shape);

            if (tmImgTensor.shape[0] > 0 && tmImgTensor.shape[1] > 0) {
                let tmPrediction = await teachableMachineModel.predict(tmImgTensor).data();
                console.log("Teachable Machine Prediction:", tmPrediction);
                
                 // Find the highest probability index properly
                 let tmMaxIndex = 0;
                 for (let i = 1; i < tmPrediction.length; i++) {
                     if (tmPrediction[i] > tmPrediction[tmMaxIndex]) {
                         tmMaxIndex = i;
                     }
                 }
                 // Debugging
                 //console.log("Highest Probability Index:", tmMaxIndex);
 
                 // Assign label
                 let predictedLabel = tmMaxIndex === 0 ? "shoe" : "no_item";
             } else {
                 console.error("Invalid image tensor shape:", tmImgTensor.shape);
             }
         } catch (error) {
             console.error("Tensor creation failed:", error);
         } finally {
             if (tmImgTensor) {
                 tmImgTensor.dispose();
                 console.log("Tensor disposed:", tmImgTensor.isDisposedInternal);
             }
         }
     }
 
     label = predictedLabel; // Use the COCO-SSD label as the primary label
 }