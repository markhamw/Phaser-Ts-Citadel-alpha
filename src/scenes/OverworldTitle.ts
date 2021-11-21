import { Physics, Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { Speech, WRGame } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import { WindDirection, GenerateBuildings, RandomCloud, buildingsforWorldMap } from "../game/overworldlogic";
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
  titletext4!: Phaser.GameObjects.Text;
  titletext0!: Phaser.GameObjects.Text;
  leftArrow!: Phaser.GameObjects.Sprite;
  rightArrow!: Phaser.GameObjects.Sprite;
  head!: Phaser.GameObjects.Sprite;
  hasPlayerPressedSpace: boolean = false;

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


  createAnimations = () => {
    CreateAnimationSet(this, GetOverworldPlayerAnims(this.anims, 5, "playeroverworld"));
    CreateAnimationSet(this, GetCoinAnims(this.anims, 4));
    CreateAnimationSet(this, GetSmokeAnims(this.anims, 4));
    CreateAnimationSet(this, GetRatAnims(this.anims, 4));
    CreateAnimationSet(this, GetRatOgreAnims(this.anims, 4));
    CreateAnimationSet(this, GetShamanAnims(this.anims, 4));
  };

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
  };

  createBorder = () => {
    let borderBox = this.add.sprite(0, 0, "border");
    borderBox.setOrigin(0, 0);
    borderBox.setScale(0.98);
    borderBox.setAlpha(0.5);
    borderBox.setDepth(5);
  };

  createMenuKeyPressEvents = () => {
    this.wasd[1].on("up", () => {
      if (!this.hasPlayerPressedSpace) {
        this.events.emit("changeHead", "left");
      }

    });
    this.wasd[3].on("up", () => {
      if (!this.hasPlayerPressedSpace) {
        this.events.emit("changeHead", "right");
      }

    });
    this.keys.space.on("up", () => {
      if (!this.hasPlayerPressedSpace) {
        this.hasPlayerPressedSpace = true;
        this.events.emit("startintro");
      }

    });
  };

  createGoldOverlay = () => {
    this.goldDisplay = this.add.text(60, 470, "x" + this.wrGame.playerGold, { fontSize: "12px", fontFamily: "breathfire", color: "#ffffff" });
    this.goldCoin = this.add.sprite(50, 480, "coin", "coin_1.png");
    this.goldCoin.anims.play("coinrotate");
    this.goldCoin.setScale(2);
  };
  SummonRats = (group: Phaser.Physics.Arcade.Group, enemyid: string, instances: number) => {
    for (let countmade = 0; countmade < instances; countmade++) {
      let mobX = RandomCoord(200);
      let mobY = RandomCoord(300);
      if (this.RatGroup.children.entries.length < 2) {
        group.get(mobX + 200, mobY + 200, enemyid);
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
        group.get(mobX + 200, mobY + 200, enemyid);
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
        group.get(mobX + 200, mobY + 200, enemyid);
      } else {
        console.log("Could not create shaman. Too Many");
      }
    }
  };

  PlayerSay = (text: Speech) => {

    //create
    let { line1, line2, line3 } = text;
    this.player.currentSpeech = text;
    this.player.talkBubble = this.add.sprite(this.player.x, this.player.y - 50, "window1").setScale(.50).setDepth(5).setAlpha(0).setOrigin(0.05, 0);
    this.player.headPngforTalkBubble = this.add
      .sprite(this.player.talkBubble.x, this.player.talkBubble.y, "playerheads", this.wrGame.playerHead)
      .setScale(1.65)
      .setOrigin(0.2, -0.07).setDepth(5).setAlpha(0)

    this.playerline1 = this.add.text(this.player.talkBubble.x + 30, this.player.talkBubble.y, line1).setAlpha(0).setDepth(6).setFontSize(10);
    this.playerline2 = this.add.text(this.player.talkBubble.x + 30, this.player.talkBubble.y + 8, line2).setAlpha(0).setDepth(6).setFontSize(10);
    this.playerline3 = this.add.text(this.player.talkBubble.x + 30, this.player.talkBubble.y + 17, line3).setAlpha(0).setDepth(6).setFontSize(10);

    let show = this.time.addEvent({
      delay: 0,
      repeat: 0,
      callback: () => {
        this.player.talkBubble.setAlpha(1);
        this.player.headPngforTalkBubble.setAlpha(1)
        this.playerline1.setAlpha(1);
        this.playerline2.setAlpha(1);
        this.playerline3.setAlpha(1);
      },
    });

    let update = this.time.addEvent({
      delay: 100,
      repeat: 50,
      callback: () => {
        this.player.talkBubble.setPosition(this.player.x, this.player.y - 50);
        this.player.headPngforTalkBubble.setPosition(this.player.talkBubble.x, this.player.talkBubble.y);
        this.playerline1.setPosition(this.player.talkBubble.x + 30, this.player.talkBubble.y);
        this.playerline2.setPosition(this.player.talkBubble.x + 30, this.player.talkBubble.y + 8);
        this.playerline3.setPosition(this.player.talkBubble.x + 30, this.player.talkBubble.y + 17);
      },
    });

    let hide = this.time.addEvent({
      delay: 5000,
      repeat: 0,
      callback: () => {
        this.player.talkBubble.setAlpha(0);
        this.player.headPngforTalkBubble.setAlpha(0);
        this.playerline1.setAlpha(0);
        this.playerline2.setAlpha(0);
        this.playerline3.setAlpha(0);
      },
    });
  }


  createOverworldPlayer = (wrGame: WRGame) => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);
  };

  addTitleTextToScene = (text: string, x: number, y: number, fontSize: number, fontFamily: string, color: string, depth: number): Phaser.GameObjects.Text => {
    let textObject = this.add.text(x, y, text, { fontSize: `${fontSize}px`, fontFamily: fontFamily, color: color });
    textObject.setAlpha(0);
    textObject.setDepth(depth);
    textObject.setOrigin(0.5, 0.5);
    textObject.setShadow(4, 4, "#000000", 8, true, true);
    textObject.setInteractive();
    textObject.on("pointerover", () => {
      textObject.setScale(textObject.scale + .5);
    }).on("pointerout", () => {
      textObject.setScale(textObject.scale - .5);
    });
    return textObject;
  }

  displayTitleText = () => {
    let fontFamily = "breathfire";

    this.titletext0 = this.addTitleTextToScene("The Ranger Of", 100, 100, 32, fontFamily, "#ffffff", 3);
    this.titletext1 = this.addTitleTextToScene("Ratticus", 0, 100, 48, fontFamily, "#BE620C", 3).setScale(1.5);
    this.titletext2 = this.addTitleTextToScene("Island", 0, 100, 48, fontFamily, "#000055", 3).setScale(1.5);
    this.titletext4 = this.addTitleTextToScene("Choose Your Face", 250, 230, 48, fontFamily, "#000000", 3);

    this.titletext4.on("pointerover", () => {
      this.titletext4.setText("Use A & D, or the arrows to change, SPACE to Begin");
    }).on("pointerout", () => { this.titletext4.setText("Choose Your Face") });

    Phaser.Display.Align.In.Center(this.titletext4, this.add.zone(250, 300, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext0, this.add.zone(250, 100, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext1, this.add.zone(250, 130, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext2, this.add.zone(250, 175, 200, 200));

    let fadeTextIn = this.time.addEvent({
      delay: 50,
      repeat: 10,
      callback: () => {
        this.titletext0.setAlpha((this.titletext0.alpha += 0.1));
        this.titletext1.setAlpha((this.titletext1.alpha += 0.1));
        this.titletext2.setAlpha((this.titletext2.alpha += 0.1));
        this.titletext4.setAlpha((this.titletext2.alpha += 0.1));
      },
    });

    let startingTextAnim = this.time.addEvent({
      delay: 50,
      repeat: 10,
      callback: () => {
        this.titletext4.setScale((this.titletext4.scaleX -= 0.025));
        this.titletext4.setScale((this.titletext4.scaleY -= 0.025));
      },
    });
  };

  startIntro = () => {
    this.time.addEvent({
      delay: 100,
      repeat: 10,
      callback: () => {
        this.titletext0.setAlpha((this.titletext0.alpha -= 0.1));
        this.titletext1.setAlpha((this.titletext1.alpha -= 0.1));
        this.titletext2.setAlpha((this.titletext2.alpha -= 0.1));
        this.titletext4.setAlpha((this.titletext4.alpha -= 0.1));
        this.leftArrow.setAlpha((this.leftArrow.alpha -= 0.1));
        this.rightArrow.setAlpha((this.rightArrow.alpha -= 0.1));
        this.head.setAlpha((this.head.alpha -= 0.1));
      },
    });


    this.time.addEvent({
      delay: 1100,
      repeat: 0,
      callback: () => {
        this.titletext0.destroy();
        this.titletext1.destroy();
        this.titletext2.destroy();
        this.titletext4.destroy();
        this.leftArrow.destroy();
        this.rightArrow.destroy();
        this.head.destroy();

      },
    });

    this.time.addEvent({
      delay: 1200,
      repeat: 0,
      callback: () => {
        this.cameras.main.zoomTo(2, 3000, 'Linear', true);
        this.cameras.main.pan(320, 310, 3000);

      },
    });

    this.time.addEvent({
      delay: 4300,
      repeat: 0,
      callback: () => {
        this.sound.play('doorOpen', { volume: .2 });
      },
    });

    this.time.addEvent({
      delay: 5900,
      repeat: 0,
      callback: () => {
        this.sound.play('doorClose', { volume: .4 });
      },
    });

    this.time.addEvent({
      delay: 6200,
      repeat: 0,
      callback: () => {
        this.createOverworldPlayer(this.wrGame);
        this.player.setDepth(2);
      },
    });

    this.time.addEvent({
      delay: 6500,
      repeat: 0,
      callback: () => {
        this.cameras.main.zoomTo(1, 3000, 'Linear', true);
        this.cameras.main.pan(this.cameras.main.centerX, this.cameras.main.centerY, 3000);
        this.PlayerSay({ line1: "Today is a good", line2: "day to hunt down rat", line3: "scum on my islands" })
      },
    });

  };

  AddLeftArrow = () => {
    this.leftArrow = this.add.sprite(130, 260, "arrows", "arrow_scrolling_34.png").setScale(6.5);
    Phaser.Display.Align.In.Center(this.leftArrow, this.add.zone(200, 300, 200, 200), -100, 50);
    this.leftArrow.setInteractive();
    this.leftArrow.on("pointerdown", () => {
      this.events.emit("changeHead", "left");
    });
    this.leftArrow.setDepth(3);
  }

  AddHead = (portraits) => {
    this.head = this.add.sprite(230, 240, "playerheads", this.wrGame.playerHead).setScale(5.4);
    Phaser.Display.Align.In.Center(this.head, this.add.zone(250, 300, 200, 200), 0, 60);
    this.head.setDepth(3);
    this.events.addListener("changeHead", (direction: string) => {
      let currentIndex = portraits.indexOf(this.wrGame.playerHead);
      switch (direction) {
        case "left":
          if (portraits[currentIndex - 1]) {
            this.wrGame.playerHead = portraits[currentIndex - 1];
            this.head.setTexture("playerheads", this.wrGame.playerHead);
          }
          break;
        case "right":
          if (portraits[currentIndex + 1]) {
            this.wrGame.playerHead = portraits[currentIndex + 1];
            this.head.setTexture("playerheads", this.wrGame.playerHead);
          }
          break;
      }
    });
  }

  AddRightArrow = () => {
    this.rightArrow = this.add.sprite(230, 260, "arrows", "arrow_scrolling_35.png").setScale(6.5);
    Phaser.Display.Align.In.Center(this.rightArrow, this.add.zone(200, 300, 200, 200), 200, 50);
    this.rightArrow.setInteractive();
    this.rightArrow.on("pointerdown", () => {
      this.events.emit("changeHead", "right");
    });
    this.rightArrow.setDepth(3);
  }

  ShowMenu = () => {
    let portraits: string[] = [];

    for (let i = 0; i < 19; i++) {
      portraits.push(`heads-${i}.png`);
    }

    this.AddLeftArrow();
    this.AddRightArrow();
    this.AddHead(portraits);
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
    baseLayer.setDepth(0);
    decorLayer.setDepth(0);
    baseLayer.setCollisionByProperty({ collides: true });
    decorLayer.setCollisionByProperty({ collides: true });
    this.createAnimations();
    this.addEnemyGroups();
    this.SummonShaman(this.ShamanGroup, 'enemy-shaman', 1);
    this.SummonRatOgres(this.RatOgreGroup, 'enemy-ratogre', 1);

    this.physics.add.collider(this.RatOgreGroup, baseLayer);
    this.physics.add.collider(this.RatOgreGroup, decorLayer);

    this.physics.add.collider(this.ShamanGroup, baseLayer);
    this.physics.add.collider(this.ShamanGroup, decorLayer);

    this.events.addListener("startintro", () => {
      this.startIntro();
    });

    let initialTitleTextEvent = this.time.addEvent({
      delay: 500,
      repeat: 0,
      callback: () => {
        this.displayTitleText();
        this.ShowMenu();
        this.createMenuKeyPressEvents();
      },
    });
  }

  create() {


    this.sound.play("music2", { volume: 0.3, loop: true });
    this.createBorder();

    let conditionallyAddCloudsEveryTenSeconds = this.time.addEvent({
      delay: 10000,
      repeat: -1,
      callback: () => {
        if (this.numberofclouds < 4) {
          RandomCloud(this);
        }
      },
    });

  }

  update() {

  }
}
