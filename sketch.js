var trex, trex_running, trex_collided;
var ground, invisible_ground, groundImage;
var cloud, CloudsGroup, cloudImage;
var obstacle, ObstaclesGroup, ob1, ob2, ob3, ob4, ob5, ob6;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var count = 0;
var high_score = 0;
var Game_Over, GAME, reset, resetImage;
var back_Color = 255;
var color_State = 0;

function preload() {
  trex_running = loadAnimation("trex1.png","trex3.png", "trex4.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  
  GAME = loadImage("gameOver.png");
  resetImage = loadImage("restart.png");
  
  trex_collided = loadAnimation("trex_collided.png");
}
function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(60, 180, 10, 10);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.4;
  
  ground = createSprite(300, 180, 600, 10);
  ground.addImage("ground", groundImage);
  ground.velocityX = -6;
  
  invisible_ground = createSprite(300, 190, 600, 10);
  invisible_ground.visible = false;
  
  CloudsGroup = new Group();
  ObstaclesGroup = new Group ();
  
  Game_Over = createSprite(300, 100, 10, 10);
  Game_Over.addImage("GAME", GAME);
  Game_Over.scale = 0.5;

  reset = createSprite(300, 150, 10, 10);
  reset.addImage("RESTART", resetImage);
  reset.scale = 0.5;
}
function draw() {
  background(back_Color);
  if(World.frameCount % 30 == 0) {
    
    if(color_State == 0) {
      back_Color = back_Color - 10;
    }
    if(color_State == 1) {
      back_Color = back_Color + 10;
    }
  }
  if(back_Color < 0) {
    color_State = 1;
  }
  if(back_Color > 255) {
    color_State = 0;
  }
  
  text("Score: "+ count, 350, 40);
  if (high_score > 0) {
  text("High score: " + high_score, 100, 40);
  }
  
  if (gameState == PLAY) {
  if(keyDown("space") && trex.y > 140) {
     trex.velocityY = -10
  }
  trex.velocityY = trex.velocityY + 0.5;
  if(ground.x < 0) {
    ground.x = 300;
     } 
  
  spawnClouds();
  spawnObstacles();
    
  if (World.frameCount % 5 == 0) {
      count = count + 1;
      if (count%100 == 0 && count > 0) {
      //playSound("checkPoint.mp3", false);
      ground.velocityX = ground.velocityX - 2;
    }
    }
    
    Game_Over.visible = false;
    reset.visible = false;
    
  if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      //playSound("die.mp3", false);
  }
  }
  else if (gameState == END) {
    Game_Over.visible = true;
    reset.visible = true;
    
    ground.velocityX = 0;
    
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);
    
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
  }
  if(mousePressedOver(reset)) {
      restart();
  }
  
  trex.collide(invisible_ground);
  drawSprites();
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage("Obstacle1", ob1);
      break;
      case 2: obstacle.addImage("Obstacle2", ob2);
      break;
      case 3: obstacle.addImage("Obstacle3", ob3);
      break;
      case 4: obstacle.addImage("Obstacle4", ob4);
      break;
      case 5: obstacle.addImage("Obstacle5", ob5);
      break;
      case 6: obstacle.addImage("Obstacle6", ob6);
      break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}
function restart() {
  ground.velocityX = -6;
  gameState = PLAY;
  
  if (count > high_score) {
    high_score = count;
  }
  count = 0;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  
  trex.changeAnimation("running", trex_running);
  
  Game_Over.visible = false;
  reset.visible = false;
}
