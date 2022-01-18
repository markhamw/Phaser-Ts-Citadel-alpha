import { Physics } from "phaser";
import { WRGame } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import { WindDirection, GenerateBuildings, RandomCloud, createBorder, ShowMenu, createOverworldTileMap } from "../game/overworldlogic";
import "../characters/Player";
import { GetCoinAnims, GetSmokeAnims } from "~/anims/WorldAnims";
import Rat from "~/enemies/Rat";
import { GetShamanAnims, GetFlyingRatAnims, GetEarthGolemAnims, GetAirElementalAnims, createAnimations } from "~/anims/EnemyAnims";
import RatOgre from "~/enemies/RatOgre";
import Shaman from "~/enemies/Shaman";
import { enemies, newEnemyGroup } from "~/enemies/enemies";
import FlyingRat from "~/enemies/FlyingRat";
import EarthGolem from "~/enemies/EarthGolem";
import AirElemental from "~/enemies/AirElemental";
import Player from "../characters/Player";
import Overworld from "./Overworld";
import { GetRandomExploreText } from "~/game/playerspeech";
import TalkBubbleContext from "~/characters/Player";

const enum Chapters {
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
}

export default class OverworldTitle extends Phaser.Scene {
  numberofclouds: number = 0;
  keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];
  winddirection: WindDirection = { xspeed: Math.floor(Math.random() * 3) + 1, yspeed: Math.floor(Math.random() * 3) + 1 };
  RatGroup!: Phaser.Physics.Arcade.Group;
  RatOgreGroup!: Phaser.Physics.Arcade.Group;
  ShamanGroup!: Physics.Arcade.Group;
  FlyingRatGroup!: Physics.Arcade.Group;
  EarthGolemGroup!: Physics.Arcade.Group;
  AirElementalGroup!: Physics.Arcade.Group;
  buildingsGroup!: Physics.Arcade.Group;
  player!: Player;

  wrGame!: WRGame;
  debug!: boolean;
  titletext1!: Phaser.GameObjects.Text;
  titletext2!: Phaser.GameObjects.Text;
  titletext4!: Phaser.GameObjects.Text;
  titletext0!: Phaser.GameObjects.Text;

  leftArrow!: Phaser.GameObjects.Sprite;
  rightArrow!: Phaser.GameObjects.Sprite;
  head!: Phaser.GameObjects.Sprite;

  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;
  titletext5!: Phaser.GameObjects.Text;
  titletext6!: Phaser.GameObjects.Text;

  constructor() {
    super("OverworldTitle");
  }

  init(data) {
    this.wrGame = data;
  }

  createEnemyGroups = () => {
    this.RatGroup = newEnemyGroup(this, Rat, true, true);
    this.RatOgreGroup = newEnemyGroup(this, RatOgre, true, true);
    this.ShamanGroup = newEnemyGroup(this, Shaman, true, true);
    this.FlyingRatGroup = newEnemyGroup(this, FlyingRat, false, false);
    this.EarthGolemGroup = newEnemyGroup(this, EarthGolem, true, true);
    this.AirElementalGroup = newEnemyGroup(this, AirElemental, true, true);

    this.SummonMobs(this.ShamanGroup, "enemy-shaman", 5, 287, 425);
    this.SummonMobs(this.RatOgreGroup, "enemy-ratogre", 5, 156, 284);
    this.SummonMobs(this.RatGroup, "enemy-rat", 8, 199, 409);
    this.SummonMobs(this.FlyingRatGroup, "enemy-flyingrat", 15);
    this.SummonMobs(this.EarthGolemGroup, "enemy-earthgolem", 3, 444, 262);
    this.SummonMobs(this.AirElementalGroup, "enemy-airelemental", 1, 374, 392);

    this.physics.add.collider(this.RatOgreGroup, this.baseLayer);
    this.physics.add.collider(this.RatOgreGroup, this.decorLayer);

    this.physics.add.collider(this.RatGroup, this.baseLayer);
    this.physics.add.collider(this.RatGroup, this.decorLayer);

    this.physics.add.collider(this.ShamanGroup, this.baseLayer);
    this.physics.add.collider(this.ShamanGroup, this.decorLayer);

    this.physics.add.collider(this.EarthGolemGroup, this.baseLayer);
    this.physics.add.collider(this.EarthGolemGroup, this.decorLayer);

    this.physics.add.collider(this.AirElementalGroup, this.baseLayer);
    this.physics.add.collider(this.AirElementalGroup, this.decorLayer);
  };

  createMenuKeyPressEvents = () => {
    this.wasd[1].on("up", () => {
      if (!this.wrGame.hasIntroStarted) {
        this.events.emit("changeHead", "left");
      }
    });
    this.wasd[3].on("up", () => {
      if (!this.wrGame.hasIntroStarted) {
        this.events.emit("changeHead", "right");
      }
    });
    this.keys.space.on("up", () => {
      if (!this.wrGame.hasIntroStarted) {
        this.wrGame.hasIntroStarted = true;
        this.events.emit("startintro");
      }
    });
  };

  SummonMobs = (group: Phaser.Physics.Arcade.Group, enemyid: string, numberOfMobsToCreate: number, x?: number, y?: number) => {
    for (let countmade = 0; countmade < numberOfMobsToCreate; countmade++) {
      let mobX = x ?? RandomCoord(450) + 10;
      let mobY = y ?? RandomCoord(450) + 10;
      let mob = group.get(mobX, mobY, enemyid);
      return mob;
    }
  };

  createOverworldPlayerStationary = () => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);
    this.player.stationary = true;
  };

  addTitleTextToScene = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontFamily: string,
    color: string,
    depth: number
  ): Phaser.GameObjects.Text => {
    let textObject = this.add.text(x, y, text, { fontSize: `${fontSize}px`, fontFamily: fontFamily, color: color });
    textObject.setAlpha(0);
    textObject.setDepth(depth);
    textObject.setOrigin(0.5, 0.5);
    textObject.setShadow(2, 2, "#87CEEB", 2, true, true);

    return textObject;
  };

  displayTitleText = () => {
    let fontFamily = "breathfire";

    this.titletext0 = this.addTitleTextToScene("The Ranger Of", 100, 100, 32, fontFamily, "#ffffff", 3);
    this.titletext1 = this.addTitleTextToScene("Ratticus", 0, 100, 48, fontFamily, "#BE620C", 3).setScale(1.5);
    this.titletext2 = this.addTitleTextToScene("Island", 0, 100, 48, fontFamily, "#000055", 3).setScale(1.5);
    this.titletext4 = this.addTitleTextToScene("Choose your avatar", 250, 230, 20, fontFamily, "#FFFFFF", 3).setScale(1.25);
    this.titletext5 = this.addTitleTextToScene("Press Space to start.", 250, 350, 20, fontFamily, "#000000", 3);
    this.titletext6 = this.addTitleTextToScene("Press F2 for help in game.", 250, 370, 20, fontFamily, "#000000", 3);

    this.titletext4.setInteractive();
    this.titletext4
      .on("pointerover", () => {
        this.titletext4.setText("Use A & D or arrows.");
      })
      .on("pointerout", () => {
        this.titletext4.setText("Choose your avatar");
      });

    Phaser.Display.Align.In.Center(this.titletext0, this.add.zone(250, 100, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext1, this.add.zone(250, 130, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext2, this.add.zone(250, 175, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext4, this.add.zone(250, 300, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext5, this.add.zone(250, 450, 200, 200));
    Phaser.Display.Align.In.Center(this.titletext6, this.add.zone(250, 470, 200, 200));

    let fadeTextIn = this.time.addEvent({
      delay: 50,
      repeat: 10,
      callback: () => {
        this.titletext0.setAlpha((this.titletext0.alpha += 0.1));
        this.titletext1.setAlpha((this.titletext1.alpha += 0.1));
        this.titletext2.setAlpha((this.titletext2.alpha += 0.1));
        this.titletext4.setAlpha((this.titletext4.alpha += 0.1));
        this.titletext5.setAlpha((this.titletext5.alpha += 0.1));
        this.titletext6.setAlpha((this.titletext5.alpha += 0.1));
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
        this.titletext5.setAlpha((this.titletext4.alpha -= 0.1));
        this.titletext6.setAlpha((this.titletext4.alpha -= 0.1));
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
        this.titletext5.destroy();
        this.titletext6.destroy();
        this.leftArrow.destroy();
        this.rightArrow.destroy();
        this.head.destroy();
      },
    });

    this.time.addEvent({
      delay: 1200,
      repeat: 0,
      callback: () => {
        this.cameras.main.zoomTo(2, 3000, "Linear", true);
        this.cameras.main.pan(320, 310, 3000);
      },
    });

    this.time.addEvent({
      delay: 25,
      repeat: 50,
      callback: () => {
        this.sound.volume = this.sound.volume -= 0.02;
      },
    });
    this.time.addEvent({
      delay: 1000,
      repeat: 0,
      callback: () => {
        this.events.emit("fadeMobs");
      },
    });
    this.time.addEvent({
      delay: 3000,
      repeat: 0,
      callback: () => {
        this.events.emit("removeTitleMobs");
      },
    });
    this.time.addEvent({
      delay: 4300,
      repeat: 0,
      callback: () => {
        this.sound.stopAll();
        this.sound.volume = 0.3;
        this.sound.play("doorOpen", { volume: 0.2 });
      },
    });

    this.time.addEvent({
      delay: 5900,
      repeat: 0,
      callback: () => {
        this.sound.play("doorClose", { volume: 0.4 });
      },
    });

    this.time.addEvent({
      delay: 6200,
      repeat: 0,
      callback: () => {
        this.createOverworldPlayerStationary();
        this.player.setDepth(2);
        this.player.speed = 0;
      },
    });

    this.time.addEvent({
      delay: 6500,
      repeat: 0,
      callback: () => {
        this.cameras.main.zoomTo(1, 3000, "Linear", true);
        this.cameras.main.pan(this.cameras.main.centerX, this.cameras.main.centerY, 3000);
        this.player.Say(GetRandomExploreText());
      },
    });

    this.time.addEvent({
      delay: 10000,
      repeat: 0,
      callback: () => {
        this.events.emit("spawnChapter1");
      },
    });
  };

  createStructuresAndWeather() {
    GenerateBuildings(this);
    RandomCloud(this);
    RandomCloud(this);
    RandomCloud(this);
    RandomCloud(this);
  }

  preload() {
    this.wasd = AddWASDKeysToScene(this);
    this.keys = this.input.keyboard.createCursorKeys();
    createOverworldTileMap(this);
    this.createStructuresAndWeather();
    createAnimations(this);
    this.createEnemyGroups();
    this.SummonMobs(this.FlyingRatGroup, "enemy-Flyingrat", 1);
    this.SummonMobs(this.FlyingRatGroup, "enemy-Flyingrat", 1);
    this.events.addListener("startintro", () => {
      this.startIntro();
    });

    this.events.addListener("spawnChapter1", () => {
      this.scene.start("Overworld", this.wrGame);
    });

    let initialTitleTextEvent = this.time.addEvent({
      delay: 500,
      repeat: 0,
      callback: () => {
        this.displayTitleText();
        ShowMenu(this);
        this.createMenuKeyPressEvents();
      },
    });
  }

  create() {
    this.sound.play("music2", { volume: 0.03, loop: true });
    createBorder(this);

  }

  update() {
    if (this.player && this.player.isMoving) {
      this.player.speed = 0;
    }
  }
}
