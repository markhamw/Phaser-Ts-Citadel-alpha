import { WRGame } from "~/game/game";
import { AddWASDKeysToScene, RandomCoord } from "~/game/gamelogic";

export default class Splash extends Phaser.Scene {
 
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];
  //private light!: Phaser.GameObjects.Light;
  private lightColor!: number;
  private lightColors: number[] = [0x00FFFF, 0x00FF00, 0xFFFF00, 0xFF0000, 0xFF00FF, 0xFFFFFF];
  private isStarted: boolean;
  wrGame!: WRGame;
  menuOption!: Phaser.GameObjects.Text;
  titleImage!: Phaser.GameObjects.Sprite;
  
  constructor() {
    super("Splash");
   this.isStarted = false;
  }

  init(data){
    this.wrGame = data;
    this.wrGame.playerCurrentScene = 'Title'
  }

  preload() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.wasd = AddWASDKeysToScene(this)
    this.load.audio('idunnobygrapesofwrath',["assets/titlemusicidunno.mp3"])
    this.load.bitmapFont("customfont", "fonts/Guevara_0.png", "fonts/Guevara.xml");
  }

  create() {
    let music = this.sound.play('idunnobygrapesofwrath',{volume:.002})
    this.titleImage = this.add.sprite(0,0,'titlegraphic').setAlpha(1)
    this.titleImage.setOrigin(0,0);
    this.titleImage.setScale(1)
    let island = this.add.text(100, 100, "Island", {fontFamily:"Pixel", fontSize: "64px",  color: "#000055"})
    island.setShadow(2, 2, "#000066", 2, true, true);

    let willys = this.add.text(100, 100, "Willys", {fontFamily:"Pixel", fontSize: "64px",  color: "#0000FF"})
    willys.setShadow(2, 2, "#000066", 2, true, true);

    Phaser.Display.Align.In.Center(this.titleImage,this.add.zone(240,240,500,500))
    Phaser.Display.Align.In.Center(willys,this.add.zone(240,130,200,200))
    Phaser.Display.Align.In.Center(island,this.add.zone(240,160,200,200))
  //  this.lights.enable();

      this.keys.space.on('up', () => {
        this.Start();
    })
    //this.light = this.lights.addLight(250, 250, 500,0x888888, 5);

  /*   this.keys.shift.on('up', () => {
      this.light.setIntensity(this.light.intensity + 1);
      this.lightColor = this.lightColors[randomInt(0,5)];
      this.light.setColor(this.lightColor);
    })  */   
   
  }
  ShowMenu = () =>{
    this.titleImage.visible = false;
    
    this.menuOption = this.add.text(230,230,"Willys",{fontSize:'48'})
    Phaser.Display.Align.In.Center(this.menuOption,this.add.zone(200,200,200,200))

  }

  ShowIntro = () =>{
    let text = `
    You are the village exterminator. Your name is ${this.wrGame.playerName}. Earlier today
    you got a letter from the Tavern owner, Constable Green. 
    `
    this.menuOption.destroy()
    this.menuOption = this.add.text(30,230,text,{fontSize:'32'})
    this.menuOption.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    Phaser.Display.Align.In.Center(this.menuOption,this.add.zone(200,200,200,200))
    this.time.addEvent({
      delay:4000,
      repeat:0,
      callback: ()=>{
        this.ShowIntro2()
      }
    })
    this.time.addEvent({ 
      delay:6000,
      repeat:0,
      callback: ()=>{
        this.ShowIntro3()
      }
    })
    this.time.addEvent({ 
      delay:9000,
      repeat:0,
      callback: ()=>{
        this.Start()
      }
    })
  }

  ShowIntro2 = () =>{
    let text = `
    The scroll appears hastily written  
    `
    this.menuOption.destroy()
    this.menuOption = this.add.text(30,230,text,{fontSize:'32'})
    Phaser.Display.Align.In.Center(this.menuOption,this.add.zone(200,200,200,200))
  }

  ShowIntro3 = () =>{
    let text = `
    You read the letter one last time before starting
             the journey north to the Tavern.
    `
    this.menuOption.destroy()
    this.menuOption = this.add.text(30,230,text,{fontSize:'32'})
    Phaser.Display.Align.In.Center(this.menuOption,this.add.zone(200,200,200,200))
  }

  Start = ()=>{
    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.sound.stopAll()
    this.scene.start('PlayerNameAndPortrait', this.wrGame)
  }

  update(){
    
  //  this.light.x = this.input.activePointer.x;
 //   this.light.y = this.input.activePointer.y;
    let S = this.wasd[2]
    

 
    if (this.isStarted && S.isDown) {
         this.ShowIntro()
    } 
  }
    
  

}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


