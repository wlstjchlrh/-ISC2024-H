// faceDetection.js

class FaceDetection {
  constructor() {
    this.video = null;
    this.faceapi = null;
    this.detections = null;
    this.features = null;
  }

  setup() {
    this.video = createCapture(VIDEO);
    this.video.size(350, 420);
    this.video.hide();

    this.faceapi = ml5.faceApi(this.video, this.modelReady.bind(this));
  }

  modelReady() {
    console.log('Model Loaded');
    this.faceapi.detect(this.gotResults.bind(this));
  }

  gotResults(error, results) {
    if (error) {
      console.error(error);
      return;
    }
    this.detections = results;
    this.faceapi.detect(this.gotResults.bind(this));
  }

  draw() {
    if (this.detections) {
      let offsetX = width / 2 - 175;
      let offsetY = height / 2 - 210;

      for (let i = 0; i < this.detections.length; i++) {
        let face = this.detections[i];
        let x = face.alignedRect._box._x + offsetX;
        let y = face.alignedRect._box._y + offsetY;
        let boxWidth = face.alignedRect._box._width;
        let boxHeight = face.alignedRect._box._height;

        noFill();
        stroke(161, 95, 251);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);

        //let features = face.parts;
        //this.drawFeatures(features, offsetX, offsetY);

        this.features = face.parts; // Store the facial features
      }
    }
  }
  
  

  getFeatures() {
    return this.features;
  }

  captureFeatures() {
    if (this.features) {
      return {
        mouth: this.features.mouth.map(point => ({ x: point._x, y: point._y })),
        nose: this.features.nose.map(point => ({ x: point._x, y: point._y })),
        leftEye: this.features.leftEye.map(point => ({ x: point._x, y: point._y })),
        rightEye: this.features.rightEye.map(point => ({ x: point._x, y: point._y })),
        leftEyeBrow: this.features.leftEyeBrow.map(point => ({ x: point._x, y: point._y })),
        rightEyeBrow: this.features.rightEyeBrow.map(point => ({ x: point._x, y: point._y }))
      };
    }
    return null;
  }

  drawFeatures(features, offsetX, offsetY) {
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);

    this.drawPart(features.mouth, true, offsetX, offsetY);
    this.drawPart(features.nose, false, offsetX, offsetY);
    this.drawPart(features.leftEye, true, offsetX, offsetY);
    this.drawPart(features.rightEye, true, offsetX, offsetY);
    this.drawPart(features.leftEyeBrow, false, offsetX, offsetY);
    this.drawPart(features.rightEyeBrow, false, offsetX, offsetY);
  }

  drawPart(feature, closed, offsetX, offsetY) {
    beginShape();
    for (let i = 0; i < feature.length; i++) {
      const x = feature[i]._x + offsetX;
      const y = feature[i]._y + offsetY;
      vertex(x, y);
    }
    if (closed) {
      endShape(CLOSE);
    } else {
      endShape();
    }
  }
}