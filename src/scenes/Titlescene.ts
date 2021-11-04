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
  private light!: Phaser.GameObjects.Light;

  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Titlescene");
    this.TitleFontSize = 16;
    this.TitleX = 70;
    this.TitleY = 70;
    this.TitleAlpha = 0.85;
    this.isStarted = false;
  
  }

  init(data) {
    this.wrGame = data;
    this.wrGame.playerCurrentScene = "Title";
  }

  preload() {
    this.load.image("scroll", "assets/scroll.png");
    this.keys = this.input.keyboard.createCursorKeys();
    this.load.audio("noteShuffle", ["assets/bookFlip2.ogg"]);
    this.load.bitmapFont("customfont", "fonts/Guevara_0.png", "fonts/Guevara.xml");
    this.load.bitmapFont("invertedfont", "fonts/font-inverted.png", "fonts/Guevara.xml");
    this.load.bitmapFont("invertedfontyellow", "fonts/font-inverted-yellow.png", "fonts/Guevara.xml");
  }

  SetupEvents = () => {
    let Start = () => {
      this.scene.start("Overworld", this.wrGame);
    };

    let SceneChangeEvent = this.time.addEvent({
      delay: 15000,
      repeat: 0,
      callback: () => {
        Start();
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
        step1.play({ delay: 2, volume: 0.2 });
        step2.play({ delay: 3, volume: 0.2 });
        step3.play({ delay: 4, volume: 0.2 });
        step4.play({ delay: 5, volume: 0.2 });
        doorOpen.play({ delay: 6.5, volume: 0.2 });
        doorClose.play({ delay: 8.0, volume: 0.2 });
      },
    });
  };

  DisplayLetter = () => {
    const letterToWilly = 
`
${this.wrGame.playerName}, 
    
We have reports of raids on the island!!
         
The vermin followers of ${this.wrGame.kingRat} 
have been raiding our villages.

We need you to stop them!
        
        
                       THAAAANKS!,     
                       Constable Green
                                               
                                               
`;

    let scroll = this.add.sprite(0, 0, "scroll").setPipeline("Light2D");
    scroll.setOrigin(0, 0);
    scroll.setScale(0.44);
    
    Phaser.Display.Align.In.Center(scroll, this.add.zone(240,230,500,500));
    
    let text = this.add
      .bitmapText(this.TitleX, this.TitleY, "invertedfontyellow", letterToWilly, this.TitleFontSize)
      .setAlpha(this.TitleAlpha)
      .setPipeline("Light2D");
  Phaser.Display.Align.In.Center(text,this.add.zone(0,0,200,200))
  };
  
  create() {
  

    this.cameras.main.setPipeline("Light2D");
    this.lights.enable();
    this.light = this.lights.addLight(250, 250, 500,0x888888, 5);

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

    this.events.addListener("start", () => {
      let FadeOut = this.time.addEvent({
        delay: 4000,
        repeat: 0,
        callback: () => {
          this.cameras.main.fadeOut(4000, 0, 0, 0);
          this.scene.start("Overworld", this.wrGame);
        },
      });
    });
  }

  update() {
    this.light.x = this.input.activePointer.x;
    this.light.y = this.input.activePointer.y;

    if (this.keys.space.isDown && !this.isStarted) {
      this.isStarted = true;
      this.events.emit("start", this.wrGame);
    }
  }
}
