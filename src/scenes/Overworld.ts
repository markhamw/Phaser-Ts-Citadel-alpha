import { BlendModes, Physics, Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { Condition, PlayerStatus, Speech, WRGame } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import {
  WindDirection,
  GenerateBuildings,
  RandomCloud,
  SummonMobs,
} from "../game/overworldlogic";
import "../characters/Player";
import { GetCoinAnims, GetSmokeAnims } from "~/anims/WorldAnims";
import { enemies, newEnemyGroup } from "~/enemies/enemies";
import Player from "../characters/Player";
import { hidePlayerTalkBubble } from "~/game/playerlogic";
import { enterQuery } from "bitecs";
import TalkBubbleContext from "~/characters/Player";
import { GetRandomExploreText } from "~/game/playerspeech";
import Deer from "~/enemies/Deer";
import Groklin from "~/enemies/Groklin";
import { createUIAnimations } from "~/anims/EnemyAnims";

const enum Layers {
  Base,
  Decor,
}

export default class Overworld extends Phaser.Scene {
  keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];
  winddirection: WindDirection = {
    xspeed: Math.floor(Math.random() * 3) + 1,
    yspeed: Math.floor(Math.random() * 3) + 1,
  };
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
  GroklinGroup!: Physics.Arcade.Group;
  buildingsGroup!: Physics.Arcade.Group;
  chapter1Group!: Phaser.Physics.Arcade.Group;
  player!: Player;
  info!: Phaser.GameObjects.Sprite;

  wrGame!: WRGame;
  iSpeaking: boolean = false;
  leftArrow!: Phaser.GameObjects.Sprite;
  rightArrow!: Phaser.GameObjects.Sprite;
  head!: Phaser.GameObjects.Sprite;

  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;
  clearBubbleEvent!: Phaser.Time.TimerEvent;
  deerGroup!: Physics.Arcade.Group;

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


  isCloseEnoughToInteract = (obj: Phaser.GameObjects.GameObject) => {
    return this.player.distanceFrom(obj as Phaser.GameObjects.Sprite) > 40;
  };

  createOverworldPlayer = (): Player => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);
    this.physics.add.collider(this.player, this.baseLayer);
    this.physics.add.collider(this.player, this.decorLayer);
    this.player.setInteractive();
    this.player.on("pointerdown", () => {
      this.player.Say(GetRandomExploreText(), this);
    });

    this.player.on("pointerup", () => {
      hidePlayerTalkBubble(this);
    });
    return this.player;
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
      callback: () => { },
    });

    let AddFlyingRatsAndClouds = this.time.addEvent({
      delay: 20000,
      repeat: -1,
      callback: () => {
        /*       if (this.FlyingRatGroup.children.size < 5) {
                let flyingrat = this.SummonMobs(
                  this.FlyingRatGroup,
                  "enemy-flyingrat",
                  1
                ).setDepth(20);
                flyingrat.setInteractive();
                flyingrat.on("pointerdown", () => {
                  flyingrat.destroyFlyingRat();
                  this.events.emit("player-killed-flyingrat");
                });
              } */

        if (this.numberofclouds < 2) {
          RandomCloud(this);
        }
      },
    });


  }



  preload() {
    this.createTiles();
    this.createStructuresAndWeather();
    createUIAnimations(this);

    this.events.addListener("spawnChapter1", () => {
      this.spawnChapter1();
    });
    this.time.addEvent({
      delay: 500,
      repeat: -1,
      callback: () => {
        var particles = this.add.particles("smoke");
        var emitter = particles
          .createEmitter({ maxParticles: 2, speed: 3, blendMode: BlendModes.NORMAL, follow: this.player, followOffset: { x: 0, y: 0 }, scale: { start: 0.8, end: 0.2 } })
          .setPosition(this.player.x, this.player.y + 5).setAlpha(0.4);

      }
    })
    this.time.addEvent({
      //Make noise if player is moving
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.player.isMoving && this.player != null) {

          let step1 = this.game.sound.add("Forest1");
          let step2 = this.game.sound.add("Forest2");
          let step3 = this.game.sound.add("Forest1");

          step1.play({
            delay: 0.5,
            volume: 0.09,
            rate: 1.2,
            detune: Phaser.Math.Between(600, 200),
          });
          step2.play({
            delay: 0.1,
            volume: 0.09,
            rate: 1.2,
            detune: Phaser.Math.Between(200, 200),
          });
          step3.play({
            delay: 0.8,
            volume: 0.09,
            rate: 1.0,
            detune: Phaser.Math.Between(-1200, 200),
          });
        }
      },
    });
  }

  spawnChapter1() {

    this.deerGroup = newEnemyGroup(this, Deer, true, true);
    this.GroklinGroup = newEnemyGroup(this, Groklin, true, true);

    RandomCloud(this);
    RandomCloud(this);

    let groklin: Groklin = SummonMobs(this.GroklinGroup, "enemy-groklin", 1, 282, 362).setScale(
      Phaser.Math.Between(0.6, 0.8)
    );

    this.buildingsGroup.children.iterate((child) => {
      child.on("pointerup", () => {
        this.events.emit("player-interact-building", child);
      });
    });

    this.GroklinGroup.children.iterate((child) => {
      child.on("pointerup", () => {
        this.events.emit("player-interact-enemy", child);
      });
    });
  }

  create() {
    this.addHiddenInfoGraphic();
    this.createOverworldPlayer();
    this.spawnChapter1();
    this.createGoldOverlay();
    this.player.updateHealthIndicators(this);
    this.player.setDepth(2);
    this.player.Say(GetRandomExploreText(), this);
    this.baseLayer.setInteractive();


    this.baseLayer.on("pointerdown", (clicked) => {
      console.log(clicked.x, clicked.y);

      var particles = this.add.particles("blueparticle");
      var emitter = particles
        .createEmitter({ maxParticles: 5, speed: 15, blendMode: BlendModes.ADD })
        .setScale(0.1)
        .setPosition(clicked.x, clicked.y).setAlpha(0.5);

      let chanceForBanter = Phaser.Math.Between(0, 8);
      if (chanceForBanter == 0) {
        this.player.Say(GetRandomExploreText(), this);
      } else if (chanceForBanter == 1 || 2 || 3) {
        this.player.Say({ lines: "Its nothing.." }, this, 1000);
      }
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
      this.cameras.main.zoomTo(1.65, 60, Phaser.Math.Easing.Bounce.In, true);
      this.cameras.main.startFollow(this.player);
    } else {
      this.cameras.main.zoomTo(1, 60, Phaser.Math.Easing.Bounce.Out, true);
      this.cameras.main.stopFollow();
      this.cameras.main.centerOn(this.cameras.main.centerX, this.cameras.main.centerY);
    }
  }
}
