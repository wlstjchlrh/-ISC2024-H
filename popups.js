// popups.js

class Popups {
    constructor() {
      this.popupStates = {
        camPopup: false,
        picPopup: false,
        savePopup: false,
        tutorialPopup: false,
        rankingPopup: false
      };
      this.selectedBackground = null; // Add this line
    }
  
    showPopup(popupType) {
      Object.keys(this.popupStates).forEach(key => {
        this.popupStates[key] = false;
      });
      this.popupStates[popupType] = true;
    }
  
    hidePopup(popupType) {
      this.popupStates[popupType] = false;
    }
  
    drawPopup(popupType) {
      switch (popupType) {
        case 'camPopup':
          this.drawCamPopup();
          break;
        case 'picPopup':
          this.drawPicPopup();
          break;
        case 'savePopup':
          this.drawSavePopup();
          break;
        case 'tutorialPopup':
          this.drawTutorialPopup();
          break;
        case 'rankingPopup':
          this.drawRankingPopup();
          break;
      }
    }
  
    drawCamPopup() {
      rectMode(CENTER);
      noStroke();
      fill(42, 64, 47);
      rect(width / 2, height / 2, 800, 1000); //edit
      image(camIcon, 970, 960, 220, 130);
  
      textSize(80);
      fill(0);
      text("방문 사진 남기기", 870, 300); //edit
      text('X', 1380, 330);
  
      if (!video) {
        video = faceDetection.video;
        video.size(350, 420); //edit
        video.position(width / 2 - 175, height / 2 - 210); //edit
      }

      // Draw video feed first --> nono
      // image(video, width / 2 - 175, height / 2 - 210, 350, 420);//수정
    
      // Flip the camera horizontally
      push();
      translate(width / 2, height / 2);
      scale(-1, 1);
      image(video, -175, -210, 350, 420);
      pop();
    }
  
    drawPicPopup() {

      // 팝업창 & 틀 사진
      rectMode(CENTER);
      noStroke();
      fill(42, 64, 47);
      rect(width / 2, height / 2, 800, 1000); //edit
      image(frame, 830, 330, 500, 600); //edit

      // 배경 넣기
      if (!this.selectedBackground) {
        const backgrounds = [background1, background2, background3];
        this.selectedBackground = random(backgrounds);
      }
      image(this.selectedBackground, 920, 420, 310, 420);
      
      // 남기기&취소 버튼 박스
      fill(82, 94, 80);
      rect(890, 1120, 350, 90); //edit
      fill(154, 168, 151);
      rect(1270, 1120, 350, 90); //edit
  
      textSize(80); //edit
      fill(0);
      textFont(font);
      text("한줄 방명록", 930, 280); //edit
      textSize(80);
      text('X', 1390, 300); //edit
  
      textFont(NanumBG);
      textSize(45)
      fill(204, 202, 202);
      text("남기기", 830, 1130);
      text('취소', 1230, 1130);
  
      if (video) {
        video.remove();
        video = null;
      }
  
      // 인풋창
      if (!inputCreated) {
        input = createInput('');
        input.position(720, 960);
  
        // 남기기 버튼 생성 및 설정
        submitButton = createButton('남기기');
        submitButton.position(715, 1075);
        submitButton.size(350, 90); //edit
        submitButton.mousePressed(uploadPost);
  
        // 텍스트 속성 설정
        submitButton.style('font-family', 'NanumBG');
        submitButton.style('font-size', '45px');
        submitButton.style('color', 'rgb(204, 202, 202)');
  
        input.size(710, 80); //edit
        input.style('color', 'white');
        input.style('fontSize', '35px');
        input.style('background-color', 'rgba(0, 0, 0, 0)');
        inputCreated = true;
      }
    }
  
    drawSavePopup() {
      submitButton.remove();
      rectMode(CENTER);
      fill(42, 64, 47);
      rect(width / 2, height / 2, 800, 900);
  
      textSize(70);
      fill(0);
      text("방명록이 성공적으로 남겨졌습니다.", 700, 405);
      text('QR코드로 사진을 다운받아 보세요!', 698, 485);
      text('X', 1380, 330);
  
      if (inputCreated) {
        input.remove();
        inputCreated = false;
      }
    }
  
    drawTutorialPopup() {
      rectMode(CENTER);
      fill(42, 64, 47);
      rect(width / 2, height / 2, 1400, 1300);
      textSize(90);
      fill(0);
      text('X', 1670, 160);
  
      textSize(100);
      fill(0);
      text("추상화 갤러리 튜토리얼", 750, 170);
  
      fill(132, 158, 131);
      rect(1090, 420, 1350, 400);
  
      textSize(60);
      fill(0);
      text("과제전에 방문한 여러분들에게 특별하고 재미있는 경험을 남겨드리기", 440, 300);
      text("위해, 개개인의 얼굴 특성을 바탕으로 커스텀 추상화를 제작해드리는", 440, 370);
      text("서비스입니다.", 440, 440);
      text("화면 상단 중앙에", 440, 510);
      fill(29, 43, 29);
      text("'방명록 남기기'", 790, 510);
      fill(0);
      text("버튼을 눌러 나만의 추상화를 만들", 1090, 510);
      text("고 QR코드로 사진을 저장해보세요!", 440, 580);
  
      textSize(70);
      fill(209, 205, 205);
      text("※ 특별 이벤트 ※", 890, 700);
  
      textSize(60);
      text("갤러리를 둘러보다가 가장 재미있는 사진에 투표해주세요!", 560, 770);
      text("1등으로 선정되신 분께는 스타벅스 기프티콘을 드립니다.", 590, 840);
  
      image(starbucks, 880, 910, 400, 400);
    }
  
    drawRankingPopup() {
      rectMode(CENTER);
      fill(42, 64, 47);
      image(rankIMG, 600, 100, 1000, 1200);
  
      textSize(100);
      fill(0);
      textFont(font);
      text("RANKING", 950, 210);
  
      textSize(60);
      text("가장 재미있는 결과물에 투표해주세요", 760, 300)
  
      textSize(90);
      text('X', 1500, 200);
    }
  }