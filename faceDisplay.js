class FaceDisplay {
  constructor(features) {
    this.features = features;
    this.colorPalette = [
      '#FF4136', // Red
      '#FF851B', // Orange
      '#FFDC00', // Yellow
      '#2ECC40', // Green
      '#0074D9', // Blue
      '#B10DC9'  // Purple
    ];
    this.capturedColors = {}; // Add this line to store captured colors
  }

  assignRandomColors() {
    this.capturedColors.face = color(random(125, 255), random(125, 255), random(125, 255), 255);
    this.capturedColors.mouth = random(this.colorPalette);
    this.capturedColors.nose = random(this.colorPalette);
    this.capturedColors.leftEye = random(this.colorPalette);
    this.capturedColors.rightEye = random(this.colorPalette);
    this.capturedColors.leftEyeBrow = random(this.colorPalette);
    this.capturedColors.rightEyeBrow = random(this.colorPalette);
  }

  draw() {
    if (this.features) {
      push();
      translate(width, 0);
      scale(-1, 1);
      this.drawFeatures();
      pop();
    }
  }

  drawFeatures() {
    noFill();
    stroke(161, 95, 251);
    strokeWeight(5);

    let offsetX = width / 2 - 175; //edit
    let offsetY = height / 2 - 210; //edit

    this.drawPart(this.features.mouth, true, offsetX, offsetY);
    this.drawPart(this.features.nose, false, offsetX, offsetY);
    this.drawPart(this.features.leftEye, true, offsetX, offsetY);
    this.drawPart(this.features.rightEye, true, offsetX, offsetY);
    this.drawPart(this.features.leftEyeBrow, false, offsetX, offsetY);
    this.drawPart(this.features.rightEyeBrow, false, offsetX, offsetY);

    // Draw head shape for real-time features
    this.drawHeadShape(this.features, offsetX, offsetY);
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

  drawCapturedFeatures(features) {
    if (features) {
      let offsetX = width / 2 - 175;
      let offsetY = height / 2 - 210;
  
      // Draw captured head shape first
      fill(this.capturedColors.face);
      this.drawCapturedHeadShape(features, offsetX, offsetY);
  
      // Draw facial features with assigned colors
      strokeWeight(5);
  
      stroke(this.capturedColors.mouth);
      this.drawCapturedPart(features.mouth, true, offsetX, offsetY);
  
      stroke(this.capturedColors.nose);
      this.drawCapturedPart(features.nose, false, offsetX, offsetY);
  
      stroke(this.capturedColors.leftEye);
      this.drawCapturedPart(features.leftEye, true, offsetX, offsetY);
  
      stroke(this.capturedColors.rightEye);
      this.drawCapturedPart(features.rightEye, true, offsetX, offsetY);
  
      stroke(this.capturedColors.leftEyeBrow);
      this.drawCapturedPart(features.leftEyeBrow, false, offsetX, offsetY);
  
      stroke(this.capturedColors.rightEyeBrow);
      this.drawCapturedPart(features.rightEyeBrow, false, offsetX, offsetY);
    }
  }

  drawCapturedPart(feature, closed, offsetX, offsetY) {
    beginShape();
    for (let i = 0; i < feature.length; i++) {
      const x = feature[i].x + offsetX;
      const y = feature[i].y + offsetY;
      vertex(x, y);
    }
    if (closed) {
      endShape(CLOSE);
    } else {
      endShape();
    }
  }

  drawHeadShape(features, offsetX, offsetY) {
    // Calculate head position and size based on facial features
    const leftEye = this.calculateAveragePoint(features.leftEye);
    const rightEye = this.calculateAveragePoint(features.rightEye);
    const nose = this.calculateAveragePoint(features.nose);

    const centerX = (leftEye.x + rightEye.x) / 2 + offsetX;
    const centerY = (leftEye.y + rightEye.y + nose.y) / 3 + offsetY;

    const eyeDistance = dist(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
    const headWidth = eyeDistance * 2.5;
    const headHeight = headWidth * 2;

    // Draw the head shape (ellipse)
    strokeWeight(5);
    ellipse(centerX, centerY, headWidth, headHeight);
  }

  drawCapturedHeadShape(features, offsetX, offsetY) {
    const leftEye = this.calculateAveragePoint(features.leftEye);
    const rightEye = this.calculateAveragePoint(features.rightEye);
    const nose = this.calculateAveragePoint(features.nose);

    const centerX = (leftEye.x + rightEye.x) / 2 + offsetX;
    const centerY = (leftEye.y + rightEye.y + nose.y) / 3 + offsetY;

    const eyeDistance = dist(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
    const headWidth = eyeDistance * 2.5;
    const headHeight = headWidth * 1.4;

    strokeWeight(5);
    ellipse(centerX, centerY, headWidth, headHeight);
  }

  calculateAveragePoint(feature) {
    let avgX = 0;
    let avgY = 0;

    for (let i = 0; i < feature.length; i++) {
      avgX += feature[i].x;
      avgY += feature[i].y;
    }

    avgX /= feature.length;
    avgY /= feature.length;

    return { x: avgX, y: avgY };
  }
}
