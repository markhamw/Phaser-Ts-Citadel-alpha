import { Physics, Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { Speech, WRGame } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import { WindDirection, GenerateBuildings, RandomCloud, createBorder, AddLeftArrow, AddRightArrow, AddHead, ShowMenu } from "../game/overworldlogic";
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

const enum Layers {
  Base,
  Decor,
}

const enum Chapters {
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
}

export default class Chapter1 extends Phaser.Scene {
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
  FlyingRatGroup!: Physics.Arcade.Group;
  EarthGolemGroup!: Physics.Arcade.Group;
  AirElementalGroup!: Physics.Arcade.Group;

  buildingsGroup!: Physics.Arcade.Group;

  chapter1Group!: Phaser.Physics.Arcade.Group;

  player!: Player;
  info!: Phaser.GameObjects.Sprite;

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

  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;


  constructor() {
    super("Chapter1");

    this.DebugCollideColor = new Phaser.Display.Color(243, 234, 48, 255);
    this.DebugFaceColor = new Phaser.Display.Color(40, 39, 37, 255);
    this.debug = false;

  }

  init(data) {
    this.wrGame = data;
    this.wrGame.playerCurrentScene = "OverWorld";
  }


  createEnemyGroups = () => {

    this.RatGroup = newEnemyGroup(this, Rat, true, true);
    this.RatOgreGroup = newEnemyGroup(this, RatOgre, true, true);
    this.ShamanGroup = newEnemyGroup(this, Shaman, true, true);
    this.FlyingRatGroup = newEnemyGroup(this, FlyingRat, false, false);
    this.EarthGolemGroup = newEnemyGroup(this, EarthGolem, true, true);
    this.AirElementalGroup = newEnemyGroup(this, AirElemental, true, true);

    this.SummonMobs(this.ShamanGroup, 'enemy-shaman', 5, 287, 425);
    this.SummonMobs(this.RatOgreGroup, 'enemy-ratogre', 5, 156, 284);
    this.SummonMobs(this.RatGroup, 'enemy-rat', 8, 199, 409);
    this.SummonMobs(this.FlyingRatGroup, 'enemy-flyingrat', 15);
    this.SummonMobs(this.EarthGolemGroup, 'enemy-earthgolem', 3, 444, 262);
    this.SummonMobs(this.AirElementalGroup, 'enemy-airelemental', 1, 374, 392);

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

  createGoldOverlay = () => {
    this.goldDisplay = this.add.text(60, 470, "x" + this.wrGame.playerGold, { fontSize: "20px", fontFamily: "breathfire", color: "#ffffff" });
    this.goldCoin = this.add.sprite(50, 480, "coin", "coin_1.png");
    this.goldCoin.anims.play("coinrotate");
    this.goldCoin.setScale(2);
  };

  SummonMobs = (group: Phaser.Physics.Arcade.Group, enemyid: string, numberOfMobsToCreate: number, x?: number, y?: number) => {
    for (let countmade = 0; countmade < numberOfMobsToCreate; countmade++) {
      let mobX = x ?? RandomCoord(450) + 10;
      let mobY = y ?? RandomCoord(450) + 10
      let mob = group.get(mobX, mobY, enemyid);
      return mob;
    }
  };

  HidePlayerTalkBubble = () => {
    this.player.talkBubble.setAlpha(0);
    this.player.headPngforTalkBubble.setAlpha(0);
    this.playerline1.setAlpha(0);
    this.playerline2.setAlpha(0);
    this.playerline3.setAlpha(0);
    this.player.isSpeaking = false;
  }

  isCloseEnoughToInteract = (obj: Phaser.GameObjects.GameObject) => {
    return this.player.distanceFrom(obj as Phaser.GameObjects.Sprite, this) > 40;
  }

  createOverworldPlayer = (wrGame: WRGame) => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);

    this.physics.add.collider(this.player, this.baseLayer);
    this.physics.add.collider(this.player, this.decorLayer);
    this.player.setInteractive();
    this.player.on("pointerdown", () => {
      let Hpline = `My HP is ${this.player.status.CurrentHP}`;
      let Gpline = `I have ${this.wrGame.playerGold} gp`;
      let Xpline = `I have ${this.player.status.XP}xp in lvl ${this.player.status.Level}`;
      this.player.Say(this, { line1: Hpline, line2: Gpline, line3: Xpline })
    });

    this.player.on("pointerup", () => {
      this.HidePlayerTalkBubble();
    });

    this.spawnChapter1();

    this.buildingsGroup.children.iterate((child) => {
      child.on("pointerup", () => {
        let dist = this.player.distanceFrom(child as Phaser.GameObjects.Sprite, this);
        let moveline = this.isCloseEnoughToInteract(child) ? "I can't go there" : "I can go here";
        let identline = this.isCloseEnoughToInteract(child) ? "Its too far" : `Its ${child.name}`;
        this.player.Say(this, { line1: moveline, line2: identline, line3: `Its ${dist} meters away` })
      });
    })

    this.chapter1Group.children.iterate((child) => {
      child.on("pointerup", () => {
        let dist = this.player.distanceFrom(child as Phaser.GameObjects.Sprite, this);
        let moveline = this.isCloseEnoughToInteract(child) ? "I can't see it" : "I can see it ";
        let name = (child as any).ratname;
        let identline = this.isCloseEnoughToInteract(child) ? "Its too far" : `Its ${name}`;
        this.player.Say(this, { line1: moveline, line2: identline, line3: `about ${dist}m away` })
      });
    })


    //this.createGoldOverlay();

  };


  createTiles() {
    let map2 = this.make.tilemap({ key: "allbiomes" });
    const tileset3 = map2.addTilesetImage("allbiomes", "tiles3");

    this.baseLayer = map2.createLayer(Layers.Base, tileset3);
    this.decorLayer = map2.createLayer(Layers.Decor, tileset3);

    this.baseLayer.setDepth(0);
    this.decorLayer.setDepth(0);
    this.baseLayer.setCollisionByProperty({ collides: true });
    this.decorLayer.setCollisionByProperty({ collides: true });

  }

  createStructuresAndWeather() {
    GenerateBuildings(this);
    RandomCloud(this);
    RandomCloud(this);

    /* let conditionallyAddCloudsEveryTenSeconds = this.time.addEvent({
      delay: 10000,
      repeat: -1,
      callback: () => {
        if (this.numberofclouds < 2) {
          RandomCloud(this);
        }
      },
    });

    let conditionallyAddFlyingRatsEveryTenSeconds = this.time.addEvent({
      delay: 10000,
      repeat: -1,
      callback: () => {
        if (this.FlyingRatGroup.children.size < 5) {
          let flyingrat = this.SummonMobs(this.FlyingRatGroup, 'enemy-Flyingrat', 1).setDepth(20);
          flyingrat.setInteractive();
          flyingrat.on('pointerdown', () => {
            flyingrat.destroyFlyingRat();
            this.events.emit('kill-flyingrat', flyingrat)
          })
        }
      },
    }); */
  }

  preload() {

    this.createTiles();
    this.createStructuresAndWeather();
    createAnimations(this);
    // this.createEnemyGroups()

    /* this.events.addListener("startintro", () => {
      this.startIntro();
    }); */

    this.events.addListener('spawnChapter1', () => {
      this.spawnChapter1();
    });

  }

  spawnChapter1() {
    this.chapter1Group = newEnemyGroup(this, Rat, true, true);
    this.FlyingRatGroup = newEnemyGroup(this, FlyingRat, true, false);

    let rat1 = this.SummonMobs(this.chapter1Group, "enemy-rat", 1, 329, 361);
    rat1.setInteractive();

    rat1.ratSpeed = 0;
    rat1.stationary = true;
    let e_up = this.add.image(329, 345, 'e_up').setAlpha(0).setDepth(4);
    let e_down = this.add.image(329, 345, 'e_down').setAlpha(1).setDepth(4);
    this.time.addEvent({
      delay: 1000,
      repeat: 10,
      callback: () => {
        e_up.setAlpha(e_up.alpha == 1 ? 0 : 1);
        e_down.setAlpha(e_up.alpha == 1 ? 0 : 1);
      }
    })
    this.time.addEvent({
      delay: 10000,
      repeat: 10,
      callback: () => {
        e_up.destroy();
        e_down.destroy();
      }
    })
    /*   let ogre1 = this.SummonMobs(this.chapter1Group, "enemy-ratogre", 1, 200, 409);
      ogre1.ratSpeed = 0;
      ogre1.stationaryenemy = true; */
  }

  create() {

    this.info = this.add.sprite(0, 0, "info").setAlpha(0);
    this.info.setOrigin(0, 0);
    this.info.setScale(0.97);

    this.createOverworldPlayer(this.wrGame)
    this.player.setDepth(2);

    this.baseLayer.setInteractive();
    this.baseLayer.on("pointerdown", (clicked) => {
      console.log(clicked.x, clicked.y);
      var particles = this.add.particles('blueparticle');
      var emitter = particles.createEmitter({ maxParticles: 2, speed: 15, blendMode: 'ADD' }).setScale(.2).setPosition(clicked.x, clicked.y);
    })

  }

  update() {


  }
}


