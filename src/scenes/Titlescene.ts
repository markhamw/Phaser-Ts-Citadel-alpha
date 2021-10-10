import { Scene } from "phaser";

export default class Titlescene extends Phaser.Scene {
  private TitleFontSize: number;
  private TitleX: number;
  private TitleY: number;
  private TitleAlpha: number;
  private isStarted: boolean;

  private TitleFrame!: Phaser.GameObjects.Rectangle;

  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Titlescene");
    this.TitleFontSize = 32;
    this.TitleX = 80;
    this.TitleY = 30;
    this.TitleAlpha = 0.5;
    this.isStarted = false;
  }



  preload() {
    this.keys = this.input.keyboard.createCursorKeys();


  }

  StartCitadel = () => {
    this.scene.start('citadel')
  }

 
  SetupEvents = () =>{
     
    let Start = ()=>{
      this.scene.start('citadel')
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
        step1.play({ delay: 2 });
        step2.play({ delay: 3 });
        step3.play({ delay: 4 });
        step4.play({ delay: 5 });
        doorOpen.play({ delay: 6.5 });
        doorClose.play({ delay: 8.0 });
        
      },
    });
 

  }

  DisplayLetter = () => {
    const letterToWilly = `
    Willy, 
    

        We've had reports of large to medium sized rodents
        bollocksing around the catacombs. They act like they
        own the place. I am EXCEEDINLGY confident 
        you'll cleanse the filth from the cellars.
        
        I'll pay the usual rate

        ps. Dont let me them bite. Their bites are poisonous.
        
                                                       
                                                              Constable Green`;

    this.TitleFrame = this.add.rectangle(0, 0, 1010, 520, 0x574b38);
    this.TitleFrame.setStrokeStyle(10, 0x574b38);
    this.TitleFrame.setOrigin(0, 0);
    this.TitleFrame.fillColor = 0x000000;
    this.add.bitmapText(this.TitleX, this.TitleY, "customfont", letterToWilly, this.TitleFontSize).setAlpha(this.TitleAlpha);
    
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
        this.SetupEvents()
    })

  }
 

  update(){
    if (this.keys.space.isDown && !this.isStarted){
      this.isStarted = true;
      this.events.emit('start')
    }
    
  }
    
  

}
