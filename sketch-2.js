
let mobilenet;
let predictor;
let video;
let value = 0;
let slider;
let addButton;
let trainButton;
let samples = 0;  //calculate training images captured
let trained = false;

function modelReady() {
  console.log('Model is ready!!!');
}

function videoReady() {
  console.log('Video is ready!!!');
}

function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
    predictor.predict(gotResults);
  } else {
    console.log(loss);
  }
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    // updated to work with newer version of ml5
    // value = result;
    value = result.value;
    predictor.predict(gotResults);
  }
}

function setup() {
  createCanvas(900, 590).parent("canvasContainer");
  video = createCapture(VIDEO);
  video.size(900, 675);
  video.hide();
  background(0);
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  predictor = mobilenet.regression(video, videoReady);

  slider = createSlider(0, 1, 0, 0.01).parent("slider");

  addButton = createButton('Capture Training Image').parent("addButton");
  addButton.mousePressed(function () {
    predictor.addImage(slider.value());
    samples++    //calculate training images captured
    console.log(predictor.hasAnyTrainedClass);
  });

  trainButton = createButton('Train').parent("trainButton");
  trainButton.mousePressed(function () {
    predictor.train(whileTraining);
    trained = true;
  });

  resetButton = createButton('Reset').parent("resetButton");
  resetButton.mousePressed(function () {
    mobilenet = ml5.featureExtractor('MobileNet', modelReady);
    predictor = mobilenet.regression(video, videoReady);
    trained = false;
    samples = 0;
    console.log(predictor.hasAnyTrainedClass);
  });
}
 
function draw() {
  background(0);
  translate(width, 0); // move to far corner
  scale(-1.0, 1.0);    // flip x-axis backwards
  image(video, 0, 0, 900, 675);

  translate(width, 0); // move to far corner
  scale(-1.0, 1.0);    // flip x-axis backwards
  ellipseMode(CENTER);
  fill(254, 231, 21);
  if (!trained)
    ellipse(slider.value() * width, height / 2, 100, 100);
  else
    ellipse(value * width, height / 2, 100, 100);

  //display training images captured
  fill(255);
  textSize(32);
  strokeWeight(4);
  stroke(16, 24, 32);
  text("Captured training images: " + samples, 20, height - 20);
}
