let handpose;
let video;
let predictions = [];

let height = 700
let width = 1300

let height_init = 480
let widht_init = 640


function setup() {
  createCanvas(width, height);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {

  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();

      // Adatta le coordinate dei punti chiave alla scala della finestra
      const x = keypoint[0] * (1300 / 640);
      const y = keypoint[1] * (700 / 480);

      ellipse(x, y, 10, 10);
    }
  }
}