import { BlendModes, Physics, Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { Condition, PlayerStatus, Speech, WRGame } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import {
  WindDirection,
  GenerateBuildings,
  SummonMobs,
  Layers,
  CreateAllLayersAndSetCollisions,
  createBorder,
  createGoldOverlay,
  GetAnimsForOverworld,
  createStructuresAndWeather,
} from "../game/overworldlogic";
import "../characters/Player";
import { CreateEnemy, enemies, newEnemyGroup } from "~/enemies/enemies";
import Player from "../characters/Player";
import { hidePlayerTalkBubble } from "~/game/playerlogic";
import { enterQuery } from "bitecs";
import TalkBubbleContext from "~/characters/Player";
import { GetRandomExploreText } from "~/game/playerspeech";
import Unit from "~/enemies/Unit";
import { createUIAnimations } from "~/anims/EnemyAnims";


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
  buildingsGroup!: Physics.Arcade.Group;
  player!: Player;
  playerTorch!: Phaser.GameObjects.Light;
  info!: Phaser.GameObjects.Sprite;
  cloudGroup!: Phaser.GameObjects.Group;
  wrGame!: WRGame;
  iSpeaking: boolean = false;
  leftArrow!: Phaser.GameObjects.Sprite;
  rightArrow!: Phaser.GameObjects.Sprite;
  head!: Phaser.GameObjects.Sprite;
  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;
  clearBubbleEvent!: Phaser.Time.TimerEvent;
  unitgroup!: Physics.Arcade.Group;
  topLayer!: Phaser.Tilemaps.TilemapLayer;
  islightused!: boolean;
  constructor() {
    super("Overworld");

  }

  init(data) {
    this.wrGame = data;
  }

  isCloseEnoughToInteract = (obj: Phaser.GameObjects.GameObject) => {
    return this.player.distanceFrom(obj as Phaser.GameObjects.Sprite) > 40;
  };

  createOverworldPlayer = (): Player => {

    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png").setPipeline("Light2D").setDepth(10);
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);
    this.physics.add.collider(this.player, this.baseLayer);
    this.physics.add.collider(this.player, this.decorLayer);
    this.physics.add.collider(this.player, this.topLayer);
    this.player.setInteractive();
    this.player.on("pointerdown", () => {
      this.player.Say(GetRandomExploreText(), this);

    });
    this.player.on("pointerup", () => {
      
      //this.scene.pause();
      this.scene.launch('SouthArea')

      //hidePlayerTalkBubble(this);
    });
    return this.player;
  };

  showDebugWalls(): void {
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    const grap1 = this.add.graphics().setAlpha(0.7);
    const grap2 = this.add.graphics().setAlpha(0.7);

    this.baseLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(143, 234, 48, 255),
    });

    this.decorLayer.renderDebug(grap1, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(143, 234, 48, 255),
    });

    this.topLayer.renderDebug(grap2, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(143, 234, 48, 255),
    });
  }


  preload() {
    this.load.scenePlugin('AnimatedTiles', 'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    this.sound.play("ruinedworld", { volume: 0.03, loop: true });

    // this.showDebugWalls()
    this.lights.enable();

    this.playerTorch = this.lights.addLight(0, 0, 100, 0xe25822, 2)

    this.events.addListener("spawnChapter1", () => {
      this.spawnChapter1();
    });
    this.events.addListener("battlescene", () => {
      this.scene.launch("SouthArea", this.player);
    });


    var particles = this.add.particles("smoke");
    this.time.addEvent({
      delay: 500,
      repeat: -1,
      callback: () => {
        if (this.player.speed > 5) {
          var emitter = particles
            .createEmitter({ maxParticles: 2, speed: 3, lifespan: 2000, blendMode: BlendModes.NORMAL, follow: this.player, followOffset: { x: 0, y: 0 }, scale: { start: 0.8, end: 0.2 } })
            .setPosition(this.player.x, this.player.y + 5).setAlpha(0.4)
        }
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
    this.time.addEvent({
      delay: 100,
      repeat: -1,
      callback: () => {
        if (this.playerTorch && this.player.isMoving) {
          this.playerTorch.setPosition(this.player.x, this.player.y);
        }
      }
    })
  }

  spawnChapter1() {


    let groklin = CreateEnemy(this, "enemy-groklin", 278, 352).
      setPipeline("Light2D");
    groklin.setImmovable(true);
    groklin.roam = true;
    this.lights.addLight(groklin.x, groklin.y, 30, 0x888866, .8)

    let groklin2 = CreateEnemy(this, "enemy-groklin", 268, 352).
      setPipeline("Light2D");
    groklin2.setImmovable(true);
    groklin2.roam = true;
    this.lights.addLight(groklin2.x, groklin2.y, 30, 0x888866, .8)
    let groklin3 = CreateEnemy(this, "enemy-groklin", 268, 372).
      setPipeline("Light2D");
    groklin3.setImmovable(true);
    groklin3.roam = true;
    this.lights.addLight(groklin3.x, groklin3.y, 30, 0x888866, .8)
    let groklin4 = CreateEnemy(this, "enemy-groklin", 268, 382).
      setPipeline("Light2D");
    groklin4.setImmovable(true);
    groklin4.roam = true;
    this.lights.addLight(groklin4.x, groklin4.y, 30, 0x888866, .8)


    let skel1 = CreateEnemy(this, "enemy-skeleton", 112, 250).
      setPipeline("Light2D");
    skel1.roam = true;
    let skel2 = CreateEnemy(this, "enemy-skeleton", 110, 251).
      setPipeline("Light2D");
    skel2.roam = true;
    let skel3 = CreateEnemy(this, "enemy-skeleton", 110, 251).
      setPipeline("Light2D");
    skel2.roam = true;
    let skel4 = CreateEnemy(this, "enemy-skeleton", 110, 251).
      setPipeline("Light2D");
    skel2.roam = true;
    let skel5 = CreateEnemy(this, "enemy-skeleton", 110, 251).
      setPipeline("Light2D");
    skel2.roam = true;
    this.lights.addLight(100, 240, 50, 0x006600, .3)


    let efreet1 = CreateEnemy(this, "enemy-efreet", 286, 296).
      setPipeline("Light2D");
    efreet1.roam = true
    let efreet1light = this.lights.addLight(efreet1.x, efreet1.y, 30, 0x770000, .8)
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        efreet1light.setPosition(efreet1.x, efreet1.y);
      },
      repeat: -1
    })


    let centaur1 = CreateEnemy(this, "enemy-centaur", 420, 121).
      setPipeline("Light2D");
    centaur1.roam = false
    this.lights.addLight(centaur1.x, centaur1.y, 60, 0x888888, .2)

    //seers fire
    this.lights.addLight(350, 330, 90, 0xe25822, .5)

    let gatemonk = CreateEnemy(this, "enemy-monk", 182, 279).
      setPipeline("Light2D");
    gatemonk.roam = false
    gatemonk.setImmovable(true);
    let gatemonklight = this.lights.addLight(gatemonk.x, gatemonk.y, 30, 0xfFFF42, .8)
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        gatemonklight.setPosition(gatemonk.x, gatemonk.y);
      },
      repeat: -1
    })

    let pitfiend = CreateEnemy(this, "enemy-pitfiend", 485, 249).
      setPipeline("Light2D");
    pitfiend.roam = true
    let pitfiendlight = this.lights.addLight(pitfiend.x, pitfiend.y, 160, 0x888888, .42)
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        pitfiendlight.setPosition(pitfiend.x, pitfiend.y);
      },
      repeat: -1
    })


    let ghost = CreateEnemy(this, "enemy-ghost", 105, 261).setPipeline("Light2D");
    ghost.roam = true;
    let ghost2 = CreateEnemy(this, "enemy-ghost", 115, 263).setPipeline("Light2D");
    ghost.roam = true;
    let ghost3 = CreateEnemy(this, "enemy-ghost", 125, 260).setPipeline("Light2D");
    ghost.roam = true;



    /*     RandomCloud(this);
        RandomCloud(this);
     */


    this.buildingsGroup.children.iterate((child) => {
      child.on("pointerup", () => {
        this.events.emit("player-interact-building", child);
      });
    });

    this.unitgroup.children.iterate((child) => {


      this.events.emit("player-interact-enemy", child);

      //disabling to test SouthArea transition
      /* child.on("pointerup", () => {
        this.events.emit("player-interact-enemy", child);
      }); */
    });


  }

  create() {

    let allmappedtiles = CreateAllLayersAndSetCollisions(this);
    this.animatedTiles.init(allmappedtiles)
    GetAnimsForOverworld(this, 4);
    createStructuresAndWeather(this);
    this.lights.enable();
    let mainlights = this.lights.setAmbientColor(0x999999);
    let light = this.lights.addLight(0, 0, 100, 0xFF0000, 3);
    let light2 = this.lights.addLight(500, 0, 100)
    let intensity = Phaser.Math.Between(400, 800);
    let speed = Phaser.Math.Between(100, 600);
    var particles = this.add.particles("rain").setDepth(4)

    this.addHiddenInfoGraphic();
    this.createOverworldPlayer();
    this.spawnChapter1();
    createGoldOverlay(this);
    this.player.updateHealthIndicators(this);
    this.player.Say(GetRandomExploreText(), this);

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
      this.cameras.main.zoomTo(1.65, 60, Phaser.Math.Easing.Linear, true);
      this.cameras.main.startFollow(this.player);
    } else {
      this.cameras.main.zoomTo(1, 60, Phaser.Math.Easing.Linear, true);
      this.cameras.main.stopFollow();
      this.cameras.main.centerOn(this.cameras.main.centerX, this.cameras.main.centerY);
    }
  }
}


