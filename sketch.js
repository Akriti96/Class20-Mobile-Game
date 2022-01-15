var trex, trexRuning, trexCollided
var ground, groundImage
var invisibleGround
var clouds, cloudsImage, cloudGroup
var obsctales, obsctalImage1, obsctalImage2, obsctalImage3, obsctalImage4,
  obsctalImage5, obsctalImage6

var gameover, gameoverImage;
var restart, restartImage;

var score = 0

var Play = 1
var End = 0
var gameState = Play

var cloudsGroup
var obsctalesGroup

var diesound, jumpsound,checkpointsound

// preload is used to load the images or sounds or video
function preload() {
  trexRuning = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImage = loadImage("ground2.png")
  cloudsImage = loadImage("cloud.png")
  obsctalImage1 = loadImage("obstacle1.png")
  obsctalImage2 = loadImage("obstacle2.png")
  obsctalImage3 = loadImage("obstacle3.png")
  obsctalImage4 = loadImage("obstacle4.png")
  obsctalImage5 = loadImage("obstacle5.png")
  obsctalImage6 = loadImage("obstacle6.png")
  trexCollided=loadAnimation("trex_collided.png")
  gameoverImage=loadImage("gameOver.png")
  restartImage=loadImage("restart.png")


  diesound= loadSound("die.mp3")
  jumpsound=loadSound("jump.mp3")
  checkpointsound=loadSound("checkpoint.mp3")

}

// creating object one time
function setup() {
  createCanvas(windowWidth, windowHeight)


  // creating trex-animation
  trex = createSprite(25, height-50, 30, 30)
  trex.addAnimation("running", trexRuning)
  trex.addAnimation("collide", trexCollided)
  trex.scale = 0.3



  // ground
  ground = createSprite(200, height-40, 400, 20)
  ground.addImage("ground", groundImage)

  // invisible Ground
  invisibleGround = createSprite(200, height-30, 400, 20)
  invisibleGround.visible = false

  // creating new clouds and obstcles groups
  cloudsGroup = new Group()
  obsctalesGroup= new Group()

  // skin
  trex.debug=false
  trex.setCollider("circle", 0, 0, 55)

  // gameover
  gameover=createSprite(width/2, height/2,20,20)
  gameover.addImage("over",gameoverImage)
  gameover.scale=0.5


  restart=createSprite(width/2, height/2+40,20,20)
  restart.addImage("restart",restartImage)
  restart.scale=0.3

  sessionStorage["HighestScore"]=0

}

// display objects and their functions multiple times
function draw() {

  background("black")

 
  //  displaying score
  textSize(25)
  fill("white")
  text("Score:  " + score, width/4+150, height/2-40)
  text("Highest Score: "+  localStorage["HighestScore"],width/4-100, height/2-40)


  // collied
  trex.collide(invisibleGround)

  //  check coordinates
  text(mouseX + "," + mouseY, mouseX, mouseY)

  // console.log(trex.y)
  

  // Play state
  if (gameState === Play) {
    gameover.visible=false
    restart.visible=false
    // increasing score by very framecount and dividing by 60
    score = score + Math.round(getFrameRate()/ 60)


    // clicking space to jump trex
    if (keyDown("space") && trex.y >= height-120) {
      trex.velocityY = -10
       jumpsound.play()
    }

    else if (keyDown("up") && trex.y >= height-120) {
      trex.velocityY = -10
       jumpsound.play()
    }

    else if (touches.length>0 && trex.y >= height-120) {
       trex.velocityY = -10
       jumpsound.play()
       touches=[]
    }



    // gravity to trex to back to ground 
    trex.velocityY = trex.velocityY + 0.8
    //  console.log(trex.velocityY)


    // ground velcitya
    ground.velocityX = -(3+score/100)

    if (ground.x < 0) {
      // 400/2 =200 (ground.x)
      ground.x = ground.width / 2
    }
 
    // creating group of clouds
    spawnclouds()
  
    
    // creating group of obstcles
    spawnObstcales()

    if(score>0 && score%100 === 0){
     checkpointsound.play()
    }

    if(trex.isTouching(obsctalesGroup)){
     gameState =End
     diesound.play()
    }
   

  }
  else if (gameState === End) {
  
    trex.velocityY=0
    ground.velocityX = 0
    obsctalesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)

    obsctalesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);


    trex.changeAnimation("collide",trexCollided)
    gameover.visible=true
    restart.visible=true

    if(touches.length>0 || mousePressedOver(restart)){
      restartGame();
      touches=[]
   }
  }




  drawSprites()
}

// user defined function
function spawnclouds() {

  if (frameCount % 60 === 0) {
    clouds = createSprite(width+40, height-100, 40, 10)
    clouds.addImage("cloud", cloudsImage)
    clouds.scale = 0.6
    clouds.y = Math.round(random((height-300), (height-400)))
    clouds.velocityX = -6
    cloudsGroup.add(clouds)

    // console.log(trex.depth)
    //console.log(clouds.depth)


    // adjusting depth
    clouds.depth = trex.depth
    trex.depth = trex.depth + 1

    // calcuting lifeime
    // here distnace = width of clouds speed= velocity of clouds
    // time= distance/speed
    // time=550/3
    // time= 183

    clouds.lifetime = 183


  }

}

function spawnObstcales() {
  if (frameCount % 40 === 0) {
    obsctales = createSprite(540, height-60, 10, 40)
    obsctales.velocityX = -(6+score/100)
    obsctales.lifetime= 90
    obsctalesGroup.add(obsctales)

    var rand = Math.round(random(1, 6))
    //  scale 
    obsctales.scale = 0.5
    switch (rand) {
      case 1: obsctales.addImage(obsctalImage1)
        break;
      case 2: obsctales.addImage(obsctalImage2)
        break;
      case 3: obsctales.addImage(obsctalImage3)
        break;
      case 4: obsctales.addImage(obsctalImage4)
        break;
      case 5: obsctales.addImage(obsctalImage5)
        break;
      case 6: obsctales.addImage(obsctalImage6)
        break;

      default: break
    }
  }

}

function restartGame(){
  gameState= Play

  obsctalesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running", trexRuning)

  // 0<score
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]= score
  }

  console.log(localStorage["HighestScore"])
  score=0

}