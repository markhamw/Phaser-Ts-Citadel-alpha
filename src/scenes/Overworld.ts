import { Physics, Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { Condition, Speech, WRGame } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import {
  WindDirection,
  GenerateBuildings,
  RandomCloud,
  createBorder,
  AddLeftArrow,
  AddRightArrow,
  AddHead,
  ShowMenu,
} from "../game/overworldlogic";
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
import { hidePlayerTalkBubble } from "~/game/playerlogic";
import { enterQuery } from "bitecs";
import TalkBubbleContext from "~/characters/Player";
import { GetRandomExploreText } from "~/game/playerspeech";

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

export default class Overworld extends Phaser.Scene {
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
  wrGame!: WRGame;
  iSpeaking: boolean = false;
  leftArrow!: Phaser.GameObjects.Sprite;
  rightArrow!: Phaser.GameObjects.Sprite;
  head!: Phaser.GameObjects.Sprite;

  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super("Overworld");

  }

  init(data) {
    this.wrGame = data;

  }

  createGoldOverlay = () => {
    this.goldDisplay = this.add.text(32, 470, "x" + this.player.status.Gold, {
      fontSize: "20px",
      fontFamily: "breathfire",
      color: "#ffffff",
    });
    this.goldCoin = this.add.sprite(25, 480, "coin", "coin_1.png");
    this.goldCoin.anims.play("coinrotate");
    this.goldCoin.setScale(2.5);
    this.goldCoin.setAlpha(0.6);
  };

  SummonMobs = (group: Phaser.Physics.Arcade.Group, enemyid: string, numberOfMobsToCreate: number, x?: number, y?: number) => {
    for (let countmade = 0; countmade < numberOfMobsToCreate; countmade++) {
      let mobX = x ?? RandomCoord(450) + 10;
      let mobY = y ?? RandomCoord(450) + 10;
      let mob = group.get(mobX, mobY, enemyid);
      return mob;
    }
  };

  isCloseEnoughToInteract = (obj: Phaser.GameObjects.GameObject) => {
    return this.player.distanceFrom(obj as Phaser.GameObjects.Sprite) > 40;
  };

  createOverworldPlayer = (): Player => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);
    this.physics.add.collider(this.player, this.baseLayer);
    this.physics.add.collider(this.player, this.decorLayer);
    this.player.setInteractive();

    this.player.on("pointerup", () => {
      hidePlayerTalkBubble(this);
    });
    return this.player
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

    let AddClouds = this.time.addEvent({
      delay: 20000,
      repeat: -1,
      callback: () => {
        if (this.numberofclouds < 2) {
          RandomCloud(this);
        }
      },
    });

    let AddFlyingRats = this.time.addEvent({
      delay: 20000,
      repeat: -1,
      callback: () => {
        if (this.FlyingRatGroup.children.size < 5) {
          let flyingrat = this.SummonMobs(this.FlyingRatGroup, 'enemy-flyingrat', 1).setDepth(20);
          flyingrat.setInteractive();
          flyingrat.on('pointerdown', () => {
            flyingrat.destroyFlyingRat();
            this.events.emit('player-killed-flyingrat')
          })
        }
      },
    });
  }

  preload() {
    this.createTiles();
    this.createStructuresAndWeather();
    createAnimations(this);

    this.events.addListener("spawnChapter1", () => {
      this.spawnChapter1();
    });

    this.time.addEvent({
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
    });

  }



  spawnChapter1() {

    this.chapter1Group = newEnemyGroup(this, Rat, true, true);
    this.FlyingRatGroup = newEnemyGroup(this, FlyingRat, true, false);
    RandomCloud(this);
    RandomCloud(this);
    let rat1: Rat = this.SummonMobs(this.chapter1Group, "enemy-rat", 1, 329, 361);
    rat1.setImmovable();
    this.physics.add.collider(this.chapter1Group, this.player);
    this.physics.add.collider(rat1, this.baseLayer);
    this.physics.add.collider(rat1, this.decorLayer);
    rat1.setInteractive();

    this.buildingsGroup.children.iterate((child) => {
      child.on("pointerup", () => {
        this.events.emit("player-interact-building", child);
      });
    });

    this.chapter1Group.children.iterate((child) => {
      child.on("pointerup", () => {
        this.events.emit("player-interact-enemy", child);
        /*   let dist = this.player.distanceFrom(child as Phaser.GameObjects.Sprite, this);
          let moveline = this.isCloseEnoughToInteract(child) ? "I can't see it" : "I can see it ";
          let name = (child as any).ratname;
          let identline = this.isCloseEnoughToInteract(child) ? "Its too far" : `Its ${name}`;
          let unitInteractSpeech: Speech = { line1: moveline, line2: identline, line3: `about ${dist}m away` }
          let unitInteractTalkBubbleContext = { scene: this, speech: unitInteractSpeech, canInteract: true, child: child }
          this.player.handleBuildingInteraction(unitInteractTalkBubbleContext); */
      });
    });

  }

  drawHealthBar(numberOfHearts) {
    let Empties = 5 - numberOfHearts
    let x = 100;
    for (let i = 0; i < numberOfHearts; i++) {
      this.add.sprite(x, 480, "fullheart");
      x += 10;
    }
    for (let i = 0; i < Empties; i++) {
      this.add.sprite(x, 480, "emptyheart");
      x += 10;
    }


  }

  create() {
    this.addHiddenInfoGraphic();
    this.createOverworldPlayer();
    this.spawnChapter1();
    this.createGoldOverlay();

    this.player.setDepth(2);
    this.player.Say(GetRandomExploreText())

    this.baseLayer.setInteractive();
    this.baseLayer.on("pointerdown", (clicked) => {
      console.log(clicked.x, clicked.y);
      var particles = this.add.particles("blueparticle");
      var emitter = particles
        .createEmitter({ maxParticles: 2, speed: 15, blendMode: "ADD" })
        .setScale(0.2)
        .setPosition(clicked.x, clicked.y);
    });
  }

  private addHiddenInfoGraphic() {
    this.info = this.add.sprite(0, 0, "info").setAlpha(1);
    this.info.setOrigin(0, 0);
    this.info.setScale(0.97);
    this.info.setDepth(40);
  }

  update() {
    if (this.input.keyboard.addKey("F2").isDown) {
      this.info.setAlpha(1);
    }
    if (this.input.keyboard.addKey("F2").isUp) {
      this.info.setAlpha(0);
    }

    if (this.input.keyboard.addKey("SPACE").isDown) {
      this.cameras.main.zoomTo(2, 60, "Linear", true);
      this.cameras.main.startFollow(this.player);
    } else {
      this.cameras.main.zoomTo(1, 60, "Linear", true);
      this.cameras.main.stopFollow();
      this.cameras.main.centerOn(this.cameras.main.centerX, this.cameras.main.centerY);
    }
  }
}
