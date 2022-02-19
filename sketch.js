var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bg,bgImg;
var player, shooter_moving, shooter_shooting;
var zombiesGroup, zombie1, zombie2;
var squidGroup, squidImg;
var bulletGroup, bulletImg;
var blastImg;
var creepsterFont;
var gameOverImg, restartImg;
var gameOverSound, gunshotSound, blastSound;

var score=0;
var killingScore=0;

function preload(){

  shooter_moving = loadAnimation("shooter_1.png","shooter_2.png")
  shooter_shooting = loadAnimation("shooter_3.png")
  zombie1 = loadImage("zombie1.png");
  zombie2 = loadImage("zombie2.png");
  squidImg = loadImage("squid.png");
  bulletImg = loadImage("bullet.png")
  gameOverImg = loadImage("you-are-dead.png")
  restartImg = loadImage("restart.png")
  creepsterFont = loadFont("font.ttf")
  bgImg = loadImage("bg.jpeg")
  blastImg = loadImage("explosion.png");
  gameOverSound = loadSound("game-over.mp3")
  gunshotSound = loadSound("gunshot.mp3")
  blastSound = loadSound("explosion.mp3")

}

function setup() {
  
  createCanvas(900,600);

//adding the background image
bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
 bg.addImage(bgImg)
   bg.scale = 1.1

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addAnimation("moving", shooter_moving)
   player.addAnimation("shooting", shooter_shooting)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

//creating the game over sprite
gameOver = createSprite(300,100);
 gameOver.addImage(gameOverImg);
   gameOver.scale = 0.4
   gameOver.visible = false;

//creating the restart sprite
restart = createSprite(300,160);
 restart.addImage(restartImg);
   restart.scale = 0.5
   restart.visible = false;

  squidGroup = new Group();
  bulletGroup = new Group();
  zombiesGroup = new Group();

}

function draw() {
  background(bgImg);
  textSize(25);
  fill("red");
  textFont(creepsterFont);
  text("SCORE: "+ score, 10,25);
  text("ENEMIES KILLED: "+killingScore,675,25);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);

    if(zombiesGroup.isTouching(player)){
      gameState = END;
      console.log("Zombie is touching the player");
    }
  
    if(squidGroup.isTouching(player)){
      gameState = END;
      console.log("Squid is touching the player");
    }
  
    //moving the player up and down and making the game mobile compatible using touches
    if(player.y>75){
      if(keyDown("UP_ARROW")||touches.length>0){
        player.y = player.y-30
      }
    }
    
  
    if(player.y<700){
      if(keyDown("DOWN_ARROW")||touches.length>0){
        player.y = player.y+30
      }
    }
  
    if(player.x>100){
      if(keyDown("LEFT_ARROW")||touches.length>0){
        player.x = player.x-30
      }
    }
  
    if(player.x<1400){
      if(keyDown("RIGHT_ARROW")||touches.length>0){
        player.x = player.x+30
      }
    }
  }

  else if (gameState === END){
    gameOver.visible = true;
    restart.visible = true;

    player.destroy();
    zombie.destroy();
    squid.destroy();
  }

  spawnSquids();
  spawnZombies();

//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  player.addAnimation(shooter_shooting)
  gunshotSound.play();
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addAnimation(shooter_moving)
}

blast= createSprite(bulletImg.x+60, bulletImg.y, 50,50);
blast.addImage(blastImg)
blast.scale=0.4
squidGroup.destroyEach()
bulletGroup.destroyEach()
zombiesGroup.destroyEach()

drawSprites();

}

function spawnSquids() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var squid = createSprite(600,120,40,10);
    squid.y = Math.round(random(80,120));
    squid.addImage(squidImg);
    squid.scale = 0.5;
    squid.velocityX = -3;
    
     //assign lifetime to the variable
    squid.lifetime = 200;
    
    //adjust the depth
    squid.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    squidGroup.add(squid);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  zombiesGroup.destroyEach();
  squidGroup.destroyEach();
  score = 0;
}

function spawnZombies() {
  if(frameCount % 60 === 0) {
    var zombie = createSprite(600,165,10,40);
    //obstacle.debug = true;
    zombie.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: zombie.addImage(zombie1);
              break;
      case 2: zombie.addImage(zombie2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    zombie.scale = 0.5;
    zombie.lifetime = 300;
    //add each obstacle to the group
    zombiesGroup.add(zombie);
  }
}