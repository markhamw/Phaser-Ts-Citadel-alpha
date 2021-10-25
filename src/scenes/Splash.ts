import { WRGame } from "~/game/game";
import { AddWASDKeysToScene } from "~/game/gamelogic";

export default class Splash extends Phaser.Scene {
 
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];
  private light!: Phaser.GameObjects.Light;
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
    this.titleImage = this.add.sprite(0,0,'titlegraphic').setPipeline('Light2D');
    this.titleImage.setOrigin(0,0);
    this.titleImage.setScale(1.56)
    let willys = this.add.text(100, 100, "WILLYS", {fontFamily:"Times New Roman", fontSize: "64px", fontStyle:"Bold",  color: "#000000"})
    let ratfights = this.add.text(100, 100, "RATFIGHTS", {fontFamily:"Times New Roman", fontSize: "64px", fontStyle:"Bold",  color: "#000000"}).setAlpha(.6)
    Phaser.Display.Align.In.Center(willys,this.add.zone(240,130,200,200))
    Phaser.Display.Align.In.Center(ratfights,this.add.zone(240,170,200,200))
    this.lights.enable();

      this.keys.space.on('up', () => {
        this.Start();
    })
    this.light = this.lights.addLight(250, 250, 500,0x888888, 5);

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
    
    this.light.x = this.input.activePointer.x;
    this.light.y = this.input.activePointer.y;
    let S = this.wasd[2]
    this.input.mousePointer.smoothFactor = .021;

 
    if (this.isStarted && S.isDown) {
         this.ShowIntro()
    } 
  }
    
  

}
