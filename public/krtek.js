let krtek;
let krtek2;
let ground;
let state;
let score = 0;
let scroll = 10;
let scrollG = 0;
let GRAVITY = 1;
let JUMP = 20;
let GROUND_Y = 100;
let groundSpeed = 3;
let acceleration = 0.8;
let direction = 0;
var restart=false;
let stateChanged = true;

function preload(){
 jump = loadSound('assets/jump.mp3'); 
 ost = loadSound('assets/polka.mp3');
 fail = loadSound('assets/fail.wav');
 oneFont = loadFont('assets/GermaniaOne-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  krtek = createSprite(100, 100, 'assets/1.png', 'assets/4.png');
  krtek.addAnimation('stretch','assets/1.png', 'assets/2.png');
  krtek.addAnimation('normal','assets/3.png', 'assets/4.png');
  //krtek.scale = 0.6;
  krtek.setCollider('circle', 0, 0, 80);
  
  gImg = loadImage('assets/ground.png');
  
  ground = createSprite(windowWidth/2,windowHeight);
  ground.addImage(gImg);
  ground.scale = 1.1;
  ground.setCollider('rectangle', 0, 0, width*2,180);
  ground.depth = 2;
  
  bgImg = loadImage('assets/back.png');
  
  krtek2 = createSprite(random(100, width), windowHeight-150);
  krtek2.addAnimation('normal','assets/tile1.png', 'assets/tile4.png');
  krtek2.scale = 0.9;
  krtek2.setCollider('circle', 0, 0, 80);
  krtek2.depth = 1;
  krtek2.velocity.x = -3;
  
  state = 'start';
  
  updateSprites(false);
  
  ost.play();
  ost.setVolume(0.1);
  ost.loop();
  loop();
}


function start(){
  background(bgImg);
  
  image(gImg);

  fill(color('#A261A4'));
  textSize(60);
  textFont(oneFont);
  stroke(0);
  strokeWeight(0.5);
  text('Krtek game', (width/2)-150, (height/2)-70);
     
  fill(0);
  textSize(30);
  textFont(oneFont);
  text('Press S to start', (width/2)-100, (height/2)-15);
  text('and press mouse to jump', (width/2)-150, (height/2)+15);
}

function draw() {  
  background(bgImg);
  
  if (state === 'start') {
    start();
  }
  else if(state === 'game') {
    game();
  }
  else if(state === 'over') {
    over();
  }
  
  if (state === 'start' && keyIsPressed && key == 's') {
    state = 'game';
  }
  if (state === 'over' && keyIsPressed && key === 'r') {
    document.location.reload(true);
  }
}

function game(){
  
  image(gImg, -scrollG, 600, width, 100);
  image(gImg, -scrollG + width, 600, width, 100);
  image.depth=3;
    
  if (scrollG > width) {
    scrollG = 0;
  }
  
  krtek.velocity.y += GRAVITY;
    
  if(krtek.collide(ground)) {
    krtek.velocity.y = 0;
    krtek.changeAnimation('normal');
  }
  
  if(keyWentDown('x') || mouseWentDown(LEFT))
  {
    krtek.changeAnimation('stretch');
    krtek.animation.rewind();
    krtek.velocity.y = -JUMP;
    jump.play();
  }
  
  if(krtek2.position.x < 0){
    krtek2.position.x = width;
  }

  fill(0)
  textSize(40);
  textFont(oneFont);
  text(`Score: ${score}`, 10, 50);
  
  if (frameCount % 25 == 0) {
    score++;
  }  
  
  if(krtek.collide(krtek2)) {
    state = 'over';  
    stateChanged = true;
    ost.stop();
    fail.play();
    } 
  drawSprites();
  scroll += 0.002;
  scrollG += scroll / 5;
}

function over(){
      fill(0);
      textSize(30);
      textFont(oneFont);
      text('Game Over! Press R to restart', (width/2)-110, (height/2)-30);
      text(`Your score: ${score}`, width/2-60, height/2);
      
    if (stateChanged) {
    stateChanged = false;
     let body = document.querySelector('body');
    
    let topBlock = document.createElement('div');
    topBlock.setAttribute('class', 'topblock');

    let form = document.createElement('form');
    form.style.position = "absolute";
    form.style.top = "55%"; 
    form.style.left = "50%"; 
    form.style.transform = "translateX(-50%)";

    let newBtn = document.createElement('button');
    newBtn.textContent = "Save";
    
    let newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('placeholder', 'Enter name to save score');
    newInput.setAttribute('maxlength', 20);
    newInput.required = true;

    let allBtn = document.createElement('button');
    allBtn.textContent = "Get TOP5";
    allBtn.setAttribute('class', 'top-btn');
    allBtn.style.position = "absolute";
    allBtn.style.top = "60%";
    allBtn.style.left = "50%"; 
    allBtn.style.transform = "translateX(-50%)";

    let topDiv = document.createElement('div');
    topDiv.setAttribute('class', 'top-list');

    body.appendChild(topBlock);

    topBlock.appendChild(form);
    form.appendChild(newInput);
    form.appendChild(newBtn);

    topBlock.appendChild(topDiv);
    topBlock.appendChild(allBtn);
    
    form.addEventListener('submit', (e) => {
        console.log("button pressed");
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },        
            body: JSON.stringify({name: newInput.value, score: score})
        })
        .then(resp => resp.json())
        .then(data => {
                console.log(data);
        })
        .catch(e => console.log(e));
        
        form.remove();
        e.preventDefault();     
    });

    allBtn.addEventListener('click', (event) => {
        fetch('/top/5')
            .then(resp => resp.json())
            .then(data => {
                let ol = document.createElement('ol');
                let jd = JSON.parse(data.top);
                if(topDiv.hasChildNodes()) {
                    while (topDiv.firstChild) {
                        topDiv.removeChild(topDiv.firstChild);
                    }
                    ol.remove();
                }  
                
                for (let item of jd) {
                    console.log(item.username, item.score);
                    let li = document.createElement('li');
                    li.textContent = `${item.username}: \t${item.score}`;
                    ol.appendChild(li);
                }
                topDiv.appendChild(ol);
            })
            .catch(e => console.log(e));
    });
}
}
