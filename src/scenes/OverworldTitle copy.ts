import { Physics, Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { Speech, WRGame } from "~/game/game";
import {AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import { WindDirection, GenerateBuildings, RandomCloud } from "../game/overworldlogic";
import Player from "~/characters/Player";
import "../characters/Player";
import { GetCoinAnims, GetSmokeAnims } from "~/anims/WorldAnims";
import Rat from "~/enemies/Rat";
import { GetRatAnims, GetRatOgreAnims, GetShamanAnims } from "~/anims/EnemyAnims";
import RatOgre from "~/enemies/RatOgre";
import Shaman from "~/enemies/Shaman";

const enum Layers {
  Base,
  Decor,
}

export default class OverworldTitle extends Phaser.Scene {
  keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];
  winddirection: WindDirection = { xspeed: Math.floor(Math.random() * 3) + 1, yspeed: Math.floor(Math.random() * 3) + 1 };
  numberofclouds: number = 0;
  //playerisWalking:boolean;
  goldDisplay!: Phaser.GameObjects.Text;
  goldCoin!: Phaser.GameObjects.Sprite;
  RatGroup!: Phaser.Physics.Arcade.Group;
  RatOgreGroup!: Phaser.Physics.Arcade.Group;
  ShamanGroup!: Physics.Arcade.Group;
  player!: Player;
  info!: Phaser.GameObjects.Sprite;
  shouldDisplayInfo!: boolean;
  playerline1!: Phaser.GameObjects.Text;
  playerline2!: Phaser.GameObjects.Text;
  playerline3!: Phaser.GameObjects.Text;
  DebugCollideColor: Phaser.Display.Color;
  DebugFaceColor: Phaser.Display.Color;
  wrGame!: WRGame;
  debug!: boolean;
  titletext1!: Phaser.GameObjects.Text;
  titletext2!: Phaser.GameObjects.Text;
  titletext3!: Phaser.GameObjects.Text;
  titletext0!: Phaser.GameObjects.Text;
  
  constructor() {
    super("OverworldTitle");
    
    this.DebugCollideColor = new Phaser.Display.Color(243, 234, 48, 255);
    this.DebugFaceColor = new Phaser.Display.Color(40, 39, 37, 255);
    this.debug = false;
    this.shouldDisplayInfo = false;

    
  }

  init(data) {
    this.wrGame = data;
    this.wrGame.playerCurrentScene = "OverWorld";
  }

  setPlayerSpeechBubble = (text: Speech) => {
    let { line1, line2, line3 } = text;

    this.playerline1.setText(line1).setFontSize(10).setFontStyle("bold").setSize(10, 100);
    this.playerline2.setText(line2).setFontSize(10).setFontStyle("bold");
    this.playerline3.setText(line3).setFontSize(10).setFontStyle("bold");
  };

  updatePlayerSpeechBubble = () => {
    this.setPlayerSpeechBubble(this.player.currentSpeech);
    this.playerline1.setPosition(this.player.talkBubble.x + 30, this.player.talkBubble.y);
    this.playerline2.setPosition(this.player.talkBubble.x + 30, this.player.talkBubble.y + 8);
    this.playerline3.setPosition(this.player.talkBubble.x + 30, this.player.talkBubble.y + 17);
  };

  createAnimations = () => {
    CreateAnimationSet(this, GetOverworldPlayerAnims(this.anims, 5, "playeroverworld"));
    CreateAnimationSet(this, GetCoinAnims(this.anims, 4));
    CreateAnimationSet(this, GetSmokeAnims(this.anims, 4));
    CreateAnimationSet(this, GetRatAnims(this.anims, 4));
    CreateAnimationSet(this, GetRatOgreAnims(this.anims, 4));
    CreateAnimationSet(this, GetShamanAnims(this.anims, 4));
  }

  addEnemyGroups = () => {

    this.RatGroup = this.physics.add.group({
      classType: Rat,
      createCallback: (go) => {
        const ratObj = go as Rat;
        ratObj.body.onCollide = true;
      },
      collideWorldBounds: true,
    });
    this.RatOgreGroup = this.physics.add.group({
      classType: RatOgre,
      createCallback: (go) => {
        const ratObj = go as RatOgre;
        ratObj.body.onCollide = true;
      },
      collideWorldBounds: true,
    });
    this.ShamanGroup = this.physics.add.group({
      classType: Shaman,
      createCallback: (go) => {
        const ratObj = go as RatOgre;
        ratObj.body.onCollide = true;
      },
      collideWorldBounds: true,
    });


  }

  createBorder = () => {
    let borderBox = this.add.sprite(0, 0, "border");
    borderBox.setOrigin(0, 0);
    borderBox.setScale(0.98);
    borderBox.setAlpha(0.5);
  };

  createGoldOverlay = () => {
    this.goldDisplay = this.add.text(60, 470, "x" + this.wrGame.playerGold, { fontSize: "12px", fontFamily: "Pixel", color: "#ffffff" });
    this.goldCoin = this.add.sprite(50, 480, "coin", "coin_1.png");
    this.goldCoin.anims.play("coinrotate");
    this.goldCoin.setScale(2);
  };
  SummonRats = (group: Phaser.Physics.Arcade.Group, enemyid: string, instances: number) => {
    for (let countmade = 0; countmade < instances; countmade++) {
      let mobX = RandomCoord(200);
      let mobY = RandomCoord(300);
      if (this.RatGroup.children.entries.length < 2) {
        group.get(mobX + 200, mobY + 200, enemyid)
      } else {
        console.log("Could not create rat. Too Many");
      }
    }
  };
  SummonRatOgres = (group: Phaser.Physics.Arcade.Group, enemyid: string, instances: number) => {
    for (let countmade = 0; countmade < instances; countmade++) {
      let mobX = RandomCoord(200);
      let mobY = RandomCoord(300);
      if (this.RatOgreGroup.children.entries.length < 2) {
        group.get(mobX + 200, mobY + 200, enemyid)
      } else {
        console.log("Could not create rat ogre. Too Many");
      }
    }
  };
  SummonShaman = (group: Phaser.Physics.Arcade.Group, enemyid: string, instances: number) => {
    for (let countmade = 0; countmade < instances; countmade++) {
      let mobX = RandomCoord(200);
      let mobY = RandomCoord(300);
      if (this.ShamanGroup.children.entries.length < 2) {
        group.get(mobX + 200, mobY + 200, enemyid)
      } else {
        console.log("Could not create shaman. Too Many");
      }
    }
  };
  createOverworldPlayer = (wrGame: WRGame) => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);

    this.player.talkBubble = this.add.sprite(this.player.x, this.player.y - 50, "window1").setScale(0.5);

    this.player.talkBubble.setOrigin(0.05, 0);
    this.player.shouldDisplayTalkBubble = true;
    this.player.headPngforTalkBubble = this.add
      .sprite(this.player.talkBubble.x, this.player.talkBubble.y, "playerheads", this.wrGame.playerHead)
      .setScale(1.65)
      .setOrigin(0.2, -0.07);

    this.playerline1 = this.add.text(this.player.talkBubble.x + 30, this.player.talkBubble.y, "");
    this.playerline2 = this.add.text(this.player.talkBubble.x + 30, this.player.talkBubble.y + 8, "");
    this.playerline3 = this.add.text(this.player.talkBubble.x + 30, this.player.talkBubble.y + 17, "");

    let showTalkBubble = this.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.player.shouldDisplayTalkBubble) {
          this.player.talkBubble.setAlpha(1).setZ(1);
          this.player.headPngforTalkBubble.setAlpha(1);
          this.player.shouldDisplayTalkBubble = false;
        }
      },
    });

    let positionTalkBubble = this.time.addEvent({
      delay: 100,
      repeat: -1,
      callback: () => {
        this.player.talkBubble.setPosition(this.player.x, this.player.y - 50);
        this.player.headPngforTalkBubble.setPosition(this.player.talkBubble.x, this.player.talkBubble.y);
        this.setPlayerSpeechBubble(this.player.currentSpeech);
        this.updatePlayerSpeechBubble();
      },
    });

    let hideTalkBubble = this.time.addEvent({
      delay: 5000,
      repeat: -1,
      callback: () => {
        if (!this.player.shouldDisplayTalkBubble) {
          this.player.talkBubble.setAlpha(0);
          this.player.headPngforTalkBubble.setAlpha(0);
          this.playerline1.setAlpha(0);
          this.playerline2.setAlpha(0);
          this.playerline3.setAlpha(0);
        }
      },
    });
  };

  displayTitleText = () => {
    
    this.titletext0=this.add.text(100, 100, "The Ranger Of", { fontSize: "32px", fontFamily: "Pixel", color: "#ffffff" }).setOrigin(0.5, 0.5).setAlpha(0);
    this.titletext0.setShadow(4, 4, "#000000", 2, true, true);

    this.titletext1 = this.add.text(0, 100, "Ratticus", { fontFamily: "Pixel", fontSize: "48px", color: "#BE620C" }).setAlpha(0).setScale(1.5).setOrigin(0.5, 0.5);;
    this.titletext1.setShadow(4, 4, "#3E1E00", 2, true, true);

    this.titletext2 = this.add.text(0, 100, "Island", { fontFamily: "Pixel", fontSize: "48px", color: "#000055" }).setAlpha(0).setScale(1.5).setOrigin(0.5, 0.5);
    this.titletext2.setShadow(4, 4, "#0000FF", 2, true, true);

    this.titletext3 = this.add.text(0, 100, "Space To Start", { fontFamily: "Pixel", fontSize: "48px", color: "#000000" }).setAlpha(0).setOrigin(0.5, 0.5);
    this.titletext3.setShadow(8, 8, "#FFFFFF", 2, true, true);
    
    let selectText1 = this.add.text(250, 230, "Choose A Portrait", { fontFamily: "Pixel", fontSize: "24px",color: "#ffffff"  }).setOrigin(0.5, 0.5).setAlpha(0);
    selectText1.setShadow(4, 4, "#000000", 2, true, true);
    Phaser.Display.Align.In.Center(selectText1, this.add.zone(250, 300, 200, 200));
    
  
    Phaser.Display.Align.In.Center(this.titletext0, this.add.zone(250, 100, 200, 200))
    Phaser.Display.Align.In.Center(this.titletext1, this.add.zone(250, 130, 200, 200))
    Phaser.Display.Align.In.Center(this.titletext2, this.add.zone(250, 175, 200, 200))
    Phaser.Display.Align.In.Center(this.titletext3, this.add.zone(250, 420, 200, 200))


    this.time.addEvent({
      delay: 100,
      repeat: 10,
      callback: () => {
        this.titletext0.setAlpha(this.titletext1.alpha += 0.1);
        this.titletext1.setAlpha(this.titletext1.alpha += 0.1);
        this.titletext2.setAlpha(this.titletext2.alpha += 0.1);
        this.titletext3.setAlpha(this.titletext3.alpha += 0.065);
        selectText1.setAlpha(this.titletext3.alpha += 0.1);
      }
    })
    this.time.addEvent({
      delay: 50,
      repeat: 10,
      callback: () => {
        this.titletext3.setScale(this.titletext3.scaleX -= 0.025);
        this.titletext3.setScale(this.titletext3.scaleY -= 0.025);
      }
    })
  }

  removeTitleText = () => {

  }
  ShowMenu = () => {
    let portraits: string[] = [];
    let FitToViewScale = 1.8;
    for (let i = 0; i < 19; i++) {
      portraits.push(`heads-${i}.png`);
    }
  
    let leftArrow = this.add.sprite(130, 260, "arrows", "arrow_scrolling_34.png").setScale(6.5);
    
    Phaser.Display.Align.In.Center(leftArrow, this.add.zone(200, 300, 200, 200), -100, 50);

    leftArrow.setInteractive();
    leftArrow.on("pointerdown", () => {
      this.events.emit("changeHead", "left");
    });

    let rightArrow = this.add.sprite(230, 260, "arrows", "arrow_scrolling_35.png").setScale(6.5);
    Phaser.Display.Align.In.Center(rightArrow, this.add.zone(200, 300, 200, 200), 200, 50);
    rightArrow.setInteractive();
    rightArrow.on("pointerdown", () => {
      this.events.emit("changeHead", "right");
    });

    let head = this.add.sprite(230, 240, "playerheads", this.wrGame.playerHead).setScale(4.8);
    Phaser.Display.Align.In.Center(head, this.add.zone(250, 300, 200, 200), 0, 60);
  
    this.events.addListener("changeHead", (direction: string) => { 
      let currentIndex = portraits.indexOf(this.wrGame.playerHead);
      switch (direction) {
        case "left":
          if (portraits[currentIndex - 1]) {
            this.wrGame.playerHead = portraits[currentIndex - 1];
            head.setTexture("playerheads", this.wrGame.playerHead);
          }
          break;
        case "right":
          if (portraits[currentIndex + 1]) {
            this.wrGame.playerHead = portraits[currentIndex + 1];
            head.setTexture("playerheads", this.wrGame.playerHead);
          }
          break;
      }
    });
  };


  preload() {
    
    this.wasd = AddWASDKeysToScene(this);
    this.keys = this.input.keyboard.createCursorKeys();
    let map2 = this.make.tilemap({ key: "allbiomes" });
    const tileset3 = map2.addTilesetImage("allbiomes", "tiles3");
    const baseLayer = map2.createLayer(Layers.Base, tileset3);
    const decorLayer = map2.createLayer(Layers.Decor, tileset3);

    GenerateBuildings(this);
    RandomCloud(this);
    RandomCloud(this);
    RandomCloud(this);
    RandomCloud(this);

    // this.createAnimations();
    // this.createGoldOverlay();
    // this.createOverworldPlayer(this.wrGame);
    // this.addEnemyGroups();

    baseLayer.setCollisionByProperty({ collides: true });
    decorLayer.setCollisionByProperty({ collides: true });

    // this.physics.add.collider(this.player, baseLayer);
    //  this.physics.add.collider(this.player, decorLayer);

    //  this.physics.add.collider(this.RatGroup, baseLayer);
    //  this.physics.add.collider(this.RatGroup, decorLayer);

    //  this.physics.add.collider(this.RatOgreGroup, baseLayer);
    // this.physics.add.collider(this.RatOgreGroup, decorLayer);


    /* this.input.keyboard.on("keydown_F2", () => {

      let alpha = this.shouldDisplayInfo ? 1 : 0;
      this.info.setAlpha(1);
    }) */

    this.events.addListener("playerSay", () => {
    
        this.updatePlayerSpeechBubble();
     
    
      
    });

    let displayTextEvent = this.time.addEvent({
      delay: 1000,
      repeat: 0,
      callback: () => {
        this.displayTitleText()
        this.ShowMenu();
      }
    });

    /* this.time.addEvent({
      //Make noise if player is moving
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.player.isMoving && this.player != null) {
          let step1 = this.game.sound.add("Forest1");
          let step2 = this.game.sound.add("Forest2");

          step1.play({ delay: 0.6, volume: 0.15, detune: 200 });
          step2.play({ delay: 0.2, volume: 0.15, detune: 200 });
        }
      },
    }); */

    if (this.debug) {
      const debugGraphics = this.add.graphics().setAlpha(0.1);
      baseLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: this.DebugCollideColor,
        faceColor: this.DebugFaceColor,
      });
    }
  }


  create() {

    
    this.wasd[1].on("up", () => {
      this.events.emit("changeHead", "left");
    });
    this.wasd[3].on("up", () => {
      this.events.emit("changeHead", "right");
    });
    this.keys.space.on("up", () => {
     // this.scene.start("Titlescene", this.wrGame);
    });


    this.sound.play("music2",{volume:0.3,loop:true});
    this.createBorder();
    this.info = this.add.sprite(0, 0, "info");
    this.info.setOrigin(0, 0);
    this.info.setScale(0.97);
    
    this.time.addEvent({
      delay: 10000,
      repeat: -1,
      callback: () => {
        console.log("nubmero f clouds", this.numberofclouds);
        if (this.numberofclouds < 4) {
          RandomCloud(this);
        }
      },
    });

    this.events.addListener("start", () => {
      console.log("Heard start event");
    });



    // let blah = { line1: `${this.wrGame.kingRat}'s`, line2: "lair is the Ratticus", line3: "Den to the north." };
    //  this.player.currentSpeech = blah;

    //  this.SummonRats(this.RatGroup,'enemy-rat',1)
    // this.SummonRatOgres(this.RatOgreGroup,'enemy-ratogre',1)
    // this.SummonShaman(this.ShamanGroup,'enemy-shaman',1)

  }

  update() {

    if (this.input.keyboard.addKey("F2").isDown) {
      this.info.setAlpha(1);
    }
    if (this.input.keyboard.addKey("F2").isUp) {
      this.info.setAlpha(0);
    }
    if (this.player != null) {
      if (this.keys.space.isDown) {
        this.cameras.main.zoom = 2.0;
        this.cameras.main.startFollow(this.player);
      } else {
        this.cameras.main.zoom = 1.0;
        this.cameras.main.stopFollow();
        this.cameras.main.centerOn(this.cameras.main.centerX, this.cameras.main.centerY);
      }
    }

  }
}
