import { Scene } from "phaser";
import { WRGame } from "~/game/game";

export default class Titlescene extends Phaser.Scene {
  private TitleFontSize: number;
  private TitleX: number;
  private TitleY: number;
  private TitleAlpha: number;
  private isStarted: boolean;
  wrGame!: WRGame;
  private TitleFrame!: Phaser.GameObjects.Rectangle;

  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Titlescene");
    this.TitleFontSize = 16 ;
    this.TitleX = 70;
    this.TitleY = 70;
    this.TitleAlpha = 0.85;
    this.isStarted = false;
  }

  init(data){
    this.wrGame = data;
    this.wrGame.playerCurrentScene = 'Title'
    console.log(this.wrGame)
  }

  preload() {
    this.keys = this.input.keyboard.createCursorKeys();


  }



 
  SetupEvents = () =>{
     
    let Start = ()=>{
      this.scene.start('Overworld', this.wrGame)
    }
    
    let SceneChangeEvent = this.time.addEvent({
      delay: 15000,
      repeat: 0,
      callback: () => {
         Start()
      },
    });
 
    let FadeOut = this.time.addEvent({
      delay: 1000,
      repeat: 0,
      callback: () => {
        let step1 = this.game.sound.add("step1");
        let step2 = this.game.sound.add("step2");
        let step3 = this.game.sound.add("step3");
        let step4 = this.game.sound.add("step4");
        let doorOpen = this.game.sound.add("doorOpen");
        let doorClose = this.game.sound.add("doorClose");

        this.cameras.main.fadeOut(2000, 0, 0, 0);
        step1.play({ delay: 2, volume:.2 });
        step2.play({ delay: 3, volume:.2 });
        step3.play({ delay: 4, volume:.2 });
        step4.play({ delay: 5, volume:.2 });
        doorOpen.play({ delay: 6.5, volume:.2 });
        doorClose.play({ delay: 8.0, volume:.2 });
        
      },
    });
 

  }

  DisplayLetter = () => {
    const letterToWilly = `
        
        ${this.wrGame.playerName}, 
    
        Lately, we have been getting raided by ${this.wrGame.kingRat} and,
        his gang.

        Can you believe it? The rat bastard built
        a complex underground passage!

        When I was a young man, the rats didnt have the 
        capacity to build anything but crude holes to hide in.

        Anyway, you're our only hope...
        
        When you receive this message, please come help
        kill them, or you can kiss the usual rate
        of ${this.wrGame.taskRate}gp goodbye 

        ps. Dont let them bite. Their bites are poisonous.
        
        
                                               Good Luck,     
                                               Constable Green
                                               
                                               
                                               
                                               
                                               
               (Press SPACE when you're ready to begin..)`;

    let scroll = this.add.sprite(40,0,'scroll');
    scroll.setOrigin(0,0)
    scroll.setScale(.44)
    let text = this.add.bitmapText(this.TitleX, this.TitleY, "invertedfontyellow", letterToWilly, this.TitleFontSize).setAlpha(this.TitleAlpha);
  };

  create() {
  
    let noteShuffle = this.game.sound.add("noteShuffle");
      
    let noteOpeningSound = this.time.addEvent({
      delay: 200,
      repeat: 0,
      callback: () => {
        noteShuffle.play({ volume: 0.5 });
      },
    });

    let displayLetter = this.time.addEvent({
      delay: 1000,
      repeat: 0,
      callback: () => {
        this.DisplayLetter();
      },
    });

    this.events.addListener('start',()=>{
      let FadeOut = this.time.addEvent({
        delay: 4000,
        repeat: 0,
        callback: () => {
          this.cameras.main.fadeOut(4000, 0, 0, 0);
          this.scene.start('Overworld')
        },
      });
      
    })

  }
 
  update(){
    if (this.keys.space.isDown && !this.isStarted){
    
      this.isStarted = true;
      this.events.emit('start')
    } 
    
  }
    
  

}
