let corazones = [];
let waves = [];
let amaticFont;
let lastHeartTime = 0;
let heartInterval = 50; // Adjust this to control how often hearts are created

function preload() {
  amaticFont = loadFont('AmaticSC-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 30; i++) {
    waves.push(new Wave());
  }
}

function draw() {
  background(255, 240, 245);

  for (let wave of waves) {
    wave.display();
  }

  drawResponsiveText();

  // Create hearts following the cursor
  if (millis() - lastHeartTime > heartInterval) {
    corazones.push(new Heart(mouseX, mouseY));
    lastHeartTime = millis();
  }

  // Update and render hearts
  for (let i = corazones.length - 1; i >= 0; i--) {
    corazones[i].update();
    corazones[i].render();
    
    // Remove hearts that are off-screen
    if (corazones[i].isOffScreen()) {
      corazones.splice(i, 1);
    }
  }
}

function drawResponsiveText() {
  fill(128, 0, 0);
  stroke(10);
  textFont(amaticFont);
  textAlign(CENTER, CENTER);

  let baseFontSize = min(width, height) * 0.1;
  let verticalScaleFactor = min(1, width / 1000); // Adjust text size for smaller screens
  
  // Horizontal scale factor that's more aggressive for mobile
  let horizontalScaleFactor = map(width, 300, 1200, 1.5, 1, true);

  // Calculate vertical positions
  let centerY = height / 2;
  let spacing = baseFontSize * 0.8 * verticalScaleFactor;

  // Draw "T+R" header
  let headerSize = baseFontSize * 1.5 * verticalScaleFactor * horizontalScaleFactor;
  textSize(headerSize);
  let headerY = centerY - spacing * 2.5; // Moved slightly higher
  text("T+R", width / 2, headerY);

  // Draw dates
  let dateSize = baseFontSize * 0.7 * verticalScaleFactor * horizontalScaleFactor;
  textSize(dateSize);
  text("06-25-2011", width / 2, centerY - spacing);
  text("12-31-2014", width / 2, centerY);
  text("09-09-2017", width / 2, centerY + spacing);

  // Draw footer text
  textSize(baseFontSize * 0.6 * verticalScaleFactor * horizontalScaleFactor);
  text("And every new day together...", width / 2, centerY + spacing * 2.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Heart class remains the same
class Heart {
  constructor(posX, posY) {
    this.pos = createVector(posX, posY);
    this.vel = createVector(random(-1, 1), random(2, 4));
    this.acc = createVector(0, 0.05);
    this.cR = random(200, 255);
    this.cB = random(255);
    this.size = random(1, 3);
    this.opacity = 255;
    this.fadeSpeed = random(2, 4);
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.size);
    beginShape();
    noStroke();
    fill(this.cR, 0, this.cB, this.opacity);
    vertex(0, -10);
    bezierVertex(-10, -20, -20, 0, 0, 10);
    bezierVertex(20, 0, 10, -20, 0, -10);
    endShape();
    pop();
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.opacity -= this.fadeSpeed;
  }

  isOffScreen() {
    return this.pos.y > height || this.opacity <= 0;
  }
}

// Wave class remains the same
class Wave {
  constructor() {
    this.yoffA = random(10);
    this.yoffB = this.yoffA;
    this.yRandom = random(-100, 100);
    this.c = color(random(200, 255), random(100, 150), random(150, 200), 50);
  }

  display() {
    let xoffA = 0;
    let xoffB = 0;

    fill(this.c);
    beginShape();

    for (let xA = 0; xA <= width; xA += 10) {
      let yA = map(noise(xoffA, this.yoffA), 0, 1, 0, height) + this.yRandom;
      vertex(xA, yA);
      xoffA += 0.05;
    }

    for (let xB = width; xB >= 0; xB -= 10) {
      let yB = map(noise(xoffB, this.yoffB), 0, 1, 0, height) + this.yRandom;
      vertex(xB, yB);
      xoffB += 0.05;
    }

    this.yoffA += 0.01;
    this.yoffB += 0.01;
    endShape(CLOSE);
  }
}