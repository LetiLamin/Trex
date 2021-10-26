var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trexColidindo;
var solo, soloInvisivel, imagemdosolo;
var nuvem, imagemNuvem, grupoNuvens;

var obstaculos, grupoObstaculos;
var obstaculos1, obstaculos2, obstaculos3, obstaculos4, obstaculos5, obstaculos6; 

var pontuacao;

var gameOver, gameoverImg,restart,restartImg;

var somCheckPoint, somJump, somDie;

function preload(){

  trex_correndo =  loadAnimation("trex1.png","trex3.png","trex4.png");
  trexColidindo = loadAnimation("trex_collided.png");
  imagemdosolo = loadImage("ground2.png");
  imagemNuvem = loadImage("cloud.png");
  
  obstaculos1 = loadImage("obstacle1.png");
  obstaculos2 = loadImage("obstacle2.png");
  obstaculos3 = loadImage("obstacle3.png");
  obstaculos4 = loadImage("obstacle4.png");
  obstaculos5 = loadImage("obstacle5.png");
  obstaculos6 = loadImage("obstacle6.png");
  
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  somCheckPoint = loadSound("checkPoint.mp3");
  somJump = loadSound("jump.mp3");
  somDie = loadSound("die.mp3");
}

function setup() {
  
 createCanvas(windowWidth,windowHeight);

  //criar um sprite do trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("colidindo", trexColidindo);
  trex.scale = 0.5;

  //criar um sprite do solo
  solo = createSprite(200,height/2,width,20);
  solo.addImage(imagemdosolo);
  solo.x = solo.width /2;
  
  //solo invisível
  soloInvisivel = createSprite(200,height/2+10,width,20)
  soloInvisivel.visible = false
  
  //criar grupos
  grupoNuvens = createGroup();
  grupoObstaculos = createGroup();
  
  pontuacao = 0;
  
  trex.debug = false;
  trex.setCollider("circle",20,0,40);
  
  gameOver = createSprite(width/2,height/2-75);
  gameOver.addImage(gameoverImg);
  restart = createSprite(width/2,height/2-30);
  restart.addImage(restartImg);
  restart.scale = 0.5;
}

function draw() {
  background("MediumPurple");
  
  text("Pontuação: " + pontuacao,500,30);
  
  
  
  if (estadoJogo === JOGAR){
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    
    if(pontuacao > 0 && pontuacao % 300 == 0){
      somCheckPoint.play();
    }
    
    solo.velocityX = -(4+pontuacao/100);
    
    
    if (solo.x<0){
      solo.x = solo.width/2;
    }
    
    //o trex pula quando a tecla espaço é acionada 
    if(touches.length > 0 || keyDown("space") && trex.y >= height/2-70) {
      trex.velocityY = -10;
      somJump.play();
      touches = [];
    }
    
    //gravidade
    trex.velocityY= trex.velocityY + 0.8;
    
    //funções
    gerarNuvens();
  
    gerarObstaculos();
    
    gameOver.visible = false;
    restart.visible = false;
    
    if (grupoObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      somDie.play();
      trex.changeAnimation("colidindo", trexColidindo);
      //trex.velocityY = -10;
      //somJump.play();
    }
    
  }
    else if (estadoJogo === ENCERRAR){
      solo.velocityX = 0;
      trex.velocityY = 0;
      grupoNuvens.setVelocityXEach(0);
      grupoObstaculos.setVelocityXEach(0);
      
      //fazer as nuvens e os obstáculos terem vida eterna
      grupoNuvens.setLifetimeEach(-1);
      grupoObstaculos.setLifetimeEach(-1);
      
      gameOver.visible = true;
      restart.visible = true;
      
      if (mousePressedOver(restart)){
        console.log("reiniciar jogo");
        reiniciar();
      }
    }


  //impedir o trex de cair 
  trex.collide(soloInvisivel);

  
  
  drawSprites();
}

function gerarObstaculos(){
  if(frameCount % 60 === 0){
    obstaculos = createSprite(width,height/2-10,10,40);
    obstaculos.velocityX = -(4+pontuacao/100);
    obstaculos.lifetime = 600;
    obstaculos.scale = 0.5;
    
    var aleatorio = Math.round(random(1,6));
    switch(aleatorio) {
      case 1: obstaculos.addImage(obstaculos1);
            break;
      case 2: obstaculos.addImage(obstaculos2);
            break;
      case 3: obstaculos.addImage(obstaculos3);
            break;
      case 4: obstaculos.addImage(obstaculos4);
            break;
      case 5: obstaculos.addImage(obstaculos5);
            break;
      case 6: obstaculos.addImage(obstaculos6);
            break;
        default: break;
    }
    
    //adicionar os obstaculos ao grupo de obstaculos
    grupoObstaculos.add(obstaculos);
  }
}

function gerarNuvens(){
  if (frameCount % 60 === 0){
    nuvem = createSprite(width,100,40,10);
    nuvem.addImage(imagemNuvem);
    nuvem.velocityX = -3;
    nuvem.y = Math.round(random(10,100));
    nuvem.lifetime = 600;
    
    //profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar as nuvens ao grupo de nuvens
    grupoNuvens.add(nuvem);
       
  } 
}

function reiniciar(){
    estadoJogo = JOGAR;
    grupoNuvens.destroyEach();
    grupoObstaculos.destroyEach();
    gameOver.visible = false;
    restart.visible = false;
    pontuacao = 0;
    trex.changeAnimation("running", trex_correndo);
}
