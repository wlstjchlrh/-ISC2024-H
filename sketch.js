// sketch.js

// <Assets> 

// 1. 기본 asset
let main;
let font;
let NanumBG;
let frame;
let background1, background2, background3; // 배경 실험
let camIcon;
let starbucks;
let input;
let video;
let rankIMG;
let stage = 0;
let inputCreated = false;

// 2. 추상화 관련
let faceDetection;
let faceDisplay;
let capturedFeatures = null;

// 3. Popups 관련
let popups;

// 4. Supabase 관련
let supabaseManager;
let submitButton;

function preload() {
  main = loadImage("assets/main.jpg");
  frame = loadImage("assets/frame.png");
  camIcon = loadImage("assets/camIcon.png");
  font = loadFont("assets/BMKIRANGHAERANG.ttf");
  NanumBG = loadFont("assets/NanumBG.ttf");
  rankIMG = loadImage("assets/rankIMG.jpg")
  starbucks = loadImage("assets/starbucks.jpg");
  background1 = loadImage("assets/backGround1.jpg")
  background2 = loadImage("assets/backGround2.jpg")
  background3 = loadImage("assets/backGround3.jpg")
}

// <Setups>

function setup() {
  createCanvas(main.width, main.height);

  // 추상화
  faceDetection = new FaceDetection();
  faceDetection.setup();
  faceDisplay = new FaceDisplay();

  // Popups
  popups = new Popups();

  // Supabase
  supabaseManager = new SupabaseManager();
  supabaseManager.loadImagesFromSupabase();
}

function draw() {
  switch (stage) {
    case 0:
      mainScreen();
      break;

    case 1:
      rectMode(CORNER);
      mainScreen();
      fill(0, 0, 0, 150);
      rect(0, 0, main.width, main.height);

      if (popups.popupStates.camPopup) {
        popups.drawPopup('camPopup');
        if (!capturedFeatures) {
          faceDetection.draw();
          const features = faceDetection.getFeatures();
          if (features) {
            faceDisplay.features = features;
            faceDisplay.draw();
          }
        }
      } else if (popups.popupStates.picPopup) {
        popups.drawPopup('picPopup');
        if (capturedFeatures) {
          faceDisplay.drawCapturedFeatures(capturedFeatures);
        }
      } else if (popups.popupStates.savePopup) {
        popups.drawPopup('savePopup');
      } else if (popups.popupStates.tutorialPopup) {
        popups.drawPopup('tutorialPopup');
      } else if (popups.popupStates.rankingPopup) {
        popups.drawPopup('rankingPopup');
      }
      break;
  }

  let posX = mouseX;
  let posY = mouseY;
  fill(0);
  textSize(16);
  text('X: ' + posX + ', Y: ' + posY, 10, 20);
}

function mouseClicked() {
  let mx = mouseX;
  let my = mouseY;

  if (stage == 0 && 980 < mx && mx < 1188 && 236 < my && my < 303) {
    // 방명록 남기기 버튼 클릭
    stage = 1;
    popups.showPopup('camPopup');
    faceDetection.setup();
  } else if (popups.popupStates.picPopup && stage == 1 && 1340 < mx && mx < 1440 && 250 < my && my < 350) {
    // (A-1) x버튼 클릭
    stage = 0;
    submitButton.remove();
    popups.hidePopup('picPopup');
    popups.selectedBackground = null;

    if (inputCreated) {
      input.remove();
      inputCreated = false;
    }
  } else if (popups.popupStates.camPopup && stage == 1 && 970 < mx && mx < 1190 && 960 < my && my < 1090) {
    // (A-2) 카메라 아이콘 클릭
    capturedFeatures = faceDetection.captureFeatures();
    faceDisplay.assignRandomColors(); // Add this line
    popups.selectedBackground = null; // add this line
    stage = 1;
    popups.hidePopup('camPopup');
    popups.showPopup('picPopup');
  } else if (popups.popupStates.camPopup && stage == 1 && 1340 < mx && mx < 1420 && 250 < my && my < 350) {
    // (B-1) X 버튼 클릭
    stage = 0;
    submitButton.remove();
    if (video) {
      video.remove();
      video = null;
    }
    supabaseManager.loadedImages = [];
    capturedFeatures = null;
  } else if (popups.popupStates.picPopup && stage == 1 && 1095 < mx && mx < 1445 && 1095 < my && my < 1205) {
    // (B-2) 취소 버튼 클릭
    stage = 0;
    submitButton.remove();
    popups.hidePopup('picPopup');

    if (inputCreated) {
      input.remove();
      inputCreated = false;
    }
    supabaseManager.loadedImages = [];
    capturedFeatures = null;
  } else if (popups.popupStates.picPopup && stage == 1 && 715 < mx && mx < 1065 && 1095 < my && my < 1205) {
    // (B-3) 남기기 버튼 클릭
    let currentFrameImage = get(920, 420, 310, 420);
    let base64Image = currentFrameImage.canvas.toDataURL();
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const uniqueFileName = `public/test2_${timestamp}.jpg`;
    supabaseManager.uploadImageToSupabase(base64Image, uniqueFileName);
    supabaseManager.updateImageArray(uniqueFileName);

    popups.showPopup('savePopup');
    stage = 1;
    popups.hidePopup('camPopup');
    popups.hidePopup('picPopup');

    supabaseManager.loadedImages = [];
    capturedFeatures = null;
  } else if (popups.popupStates.savePopup && stage == 1 && 1340 < mx && mx < 1420 && 290 < my && my < 370) {
    // (C) x 버튼 클릭
    stage = 0;
    popups.hidePopup('savePopup');
    supabaseManager.loadedImages = [];
    capturedFeatures = null;
  } else if (stage == 0 && 290 < mx && mx < 360 && 600 < my && my < 730) {
    // Gallery left arrow click handling
  } else if (stage == 0 && 1800 < mx && mx < 1890 && 600 < my && my < 730) {
    // Gallery right arrow click handling
  } else if (stage == 0 && 2000 < mx && mx < 2090 && 100 < my && my < 190) {
    // 튜토리얼 팝업 실행
    popups.hidePopup('camPopup');
    popups.hidePopup('picPopup');
    popups.hidePopup('savePopup');
    popups.showPopup('tutorialPopup');
    stage = 1;
  } else if (stage == 0 && 2000 < mx && mx < 2090 && 207 < my && my < 300) {
    // 랭킹 팝업 실행
    popups.hidePopup('camPopup');
    popups.hidePopup('picPopup');
    popups.hidePopup('savePopup');
    popups.hidePopup('tutorialPopup');
    popups.showPopup('rankingPopup');
    stage = 1;
  } else if (popups.popupStates.tutorialPopup && stage == 1 && 1660 < mx && mx < 1720 && 95 < my && my < 165) {
    // 튜토리얼 x 버튼 클릭
    stage = 0;
    popups.hidePopup('tutorialPopup');
  } else if (popups.popupStates.rankingPopup && stage == 1 && 1495 < mx && mx < 1555 && 135 < my && my < 200) {
    // 랭킹 x 버튼 클릭
    stage = 0;
    popups.hidePopup('rankingPopup');
  }
}

// <Settings>

function title() {
  textSize(120);
  fill(0);
  stroke(0);
  strokeWeight(1);
  textFont(font);
  text("과제전 방문자 추상화 갤러리", 550, 170);
}

function mainScreen() {
  image(main, 0, 0, main.width, main.height);
  title();
  fill(0);
  stroke(0);
  strokeWeight(1);
  textSize(31);
  textFont(font);
  text("방명록남기기", 1050, 302);

  if (supabaseManager.loadedImages.length < Math.min(supabaseManager.imageArray.length, 8)) {
    supabaseManager.loadImagesFromSupabase();
  } else {
    let x = 550;
    let y = 435;
    let colCount = 0;
    for (let i = 0; i < supabaseManager.loadedImages.length && i < 8; i++) {
      if (supabaseManager.loadedImages[i]) {
        image(supabaseManager.loadedImages[i], x, y, 125, 167);
        x += 317;
        colCount++;
        if (colCount == 4) {
          x = 550;
          y += 330;
          colCount = 0;
        }
      }
    }
  }
}

async function uploadPost() {
  const userInput = input.value();
  await supabaseManager.uploadPost(userInput);
}

