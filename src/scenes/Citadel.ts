import Phaser from "phaser";
import { enemies } from "~/enemies/enemies";
import Squarebo from "../enemies/Squarebo";
import { GetPlayerAnims } from '../anims/PlayerAnims'
import { GetAxeManAnims, GetSquareBoAnims, GetDinoSaurAnims, GetRatAnims } from "~/anims/EnemyAnims";
import Axeman from "~/enemies/Axeman";
import Dinosaur from "~/enemies/Dinosaur";
import Rat from "~/enemies/Rat";

export default class Citadel extends Phaser.Scene {
  ShouldEnableDebugForCollision: boolean;
  PlayerFrameRate: number;
  PlayerSpeed: number;
  PlayerName: string;
  PlayerHealth: number;
  PlayerID: string;
  DebugCollideColor: Phaser.Display.Color;
  DebugFaceColor: Phaser.Display.Color;
  Lines: Array<Phaser.GameObjects.BitmapText>
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  private TitleFontSize: number;
  private TitleX: number;
  private TitleY: number;
  private TitleText: string;
  private TitleAlpha: number;
  private TitleTextGameObject!: Phaser.GameObjects.BitmapText
  private ShouldDisplayTitleForIntro!: boolean

  constructor() {
    super("citadel");
    this.ShouldEnableDebugForCollision = true;
    this.PlayerFrameRate = 10;
    this.PlayerName = "";
    this.PlayerID = "player";
    this.PlayerSpeed = 100;
    this.PlayerHealth = 1000;
    this.DebugCollideColor = new Phaser.Display.Color(243, 234, 48, 255);
    this.DebugFaceColor = new Phaser.Display.Color(40, 39, 37, 255);
    this.Lines = new Array<Phaser.GameObjects.BitmapText>()
    this.TitleText = "--=== Willys Ratfights ===--"
    this.TitleFontSize = 100
    this.TitleX = 500
    this.TitleY = 15
    this.TitleAlpha = .5
    this.ShouldDisplayTitleForIntro = true;
  }

  preload() {
    this.keys = this.input.keyboard.createCursorKeys();
  }

  CreateAnimationSet = (animations: Phaser.Types.Animations.Animation[]) => {
    animations.forEach((animation) => {
      this.anims.create(animation);
    });
  };

  SetTitleUntilPlayerPressesAKey = () => {
    this.TitleTextGameObject = this.add.bitmapText(this.TitleX, this.TitleY, 'customfont', this.TitleText, 32)
      .setPipeline('Light2D')
      .setAlpha(this.TitleAlpha)
      .setFontSize(this.TitleFontSize)
  }


  RandomCoord = (max: number): number => {
    let num = Math.floor(Math.random() * max);
    if (num > 49) {
      return num;
    } else return num + 30;
  };

  Collides = (layer: Phaser.Tilemaps.TilemapLayer) => {
    layer.setCollisionByProperty({
      collides: true,
    });
    if (this.ShouldEnableDebugForCollision) {
      const debugGraphics = this.add.graphics().setAlpha(0.3);
      layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: this.DebugCollideColor,
        faceColor: this.DebugFaceColor,
      });
    }
  };

  create() {
    // const enum Layers {
    //  Ground,
    //  Walls,
    //  Decoration,
    // } 
    this.SetTitleUntilPlayerPressesAKey();

    //const map = this.make.tilemap({ key: "citadel" });
    //const tileset = map.addTilesetImage("citadel-tileset", "tiles");

    // map.createLayer(Layers.Ground, tileset);
    // const decorationsLayer = map.createLayer(Layers.Decoration, tileset);
    // const wallsLayer = map.createLayer(Layers.Walls, tileset);

    // this.Collides(wallsLayer);
    // this.Collides(decorationsLayer);

    this.player = this.physics.add.sprite(
      900,
      600,
      this.PlayerID,
      "player-idledown.png"
    ).setPipeline('Light2D').setAlpha(0.2);
    //this.player.setScale(1.75)
    // this.physics.add.collider(this.player, wallsLayer);
    // this.physics.add.collider(this.player, decorationsLayer);

    this.CreateAnimationSet(GetPlayerAnims(this.anims, this.PlayerFrameRate, this.PlayerID));
    //this.CreateAnimationSet(GetSquareBoAnims(this.anims,10))
    //this.CreateAnimationSet(GetDinoSaurAnims(this.anims,10))
    this.CreateAnimationSet(GetRatAnims(this.anims, 10))
    // this.player.body.setSize(this.player.width * 2, this.player.height *  2)
    // this.player.body.offset.y = 20;
    //this.cameras.main.startFollow(this.player, false);


    //let line2 = this.add.bitmapText(45,45,'customfont',"How the hell are ye 22?",32).setPipeline('Light2D').setAlpha(.2)
    //this.Lines.push(line1)  
    this.lights.enable();
    this.lights.setAmbientColor(0x808080);

    var spotlight = this.lights.addLight(600, 300, 280).setIntensity(6);

    this.input.on('pointermove', function (pointer) {
      //  console.log(pointer.x)
      //   console.log(pointer.y)
      spotlight.x = pointer.x;
      spotlight.y = pointer.y;

    });
    var colors = [
      0xffffff, 0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xffff00
    ];

    var currentColor = 0;

    this.input.on('pointerdown', function (pointer) {

      currentColor++;

      if (currentColor === colors.length) {
        currentColor = 0;
      }


      spotlight.setColor(colors[currentColor]);

    });
    // const Dinosaurs = this.physics.add.group({
    //   classType:Dinosaur
    // })
    // const SquareBos = this.physics.add.group({
    //   classType:Squarebo
    // })
    //const AxeMen = this.physics.add.group({
    //  classType: Axeman
    // })
    const Rats = this.physics.add.group({
      classType: Rat
    })


    //SquareBos.get(this.RandomCoord(100),this.RandomCoord(200),'enemy-squarebo')  
    // AxeMen.get(this.RandomCoord(100),this.RandomCoord(200),'enemy-axeman')
    // Dinosaurs.get(this.RandomCoord(100),this.RandomCoord(200),'dinosaur')
    Rats.get(this.RandomCoord(1400), this.RandomCoord(800), 'enemy-rat').setPipeline('Light2D').setAlpha(0.2)
    Rats.get(this.RandomCoord(200), this.RandomCoord(900), 'enemy-rat').setPipeline('Light2D').setAlpha(0.2)
    Rats.get(this.RandomCoord(1200), this.RandomCoord(900), 'enemy-rat').setPipeline('Light2D').setAlpha(0.2)
    Rats.get(this.RandomCoord(100), this.RandomCoord(1200), 'enemy-rat').setPipeline('Light2D').setAlpha(0.2)
    Rats.get(this.RandomCoord(1100), this.RandomCoord(1200), 'enemy-rat').setPipeline('Light2D').setAlpha(0.2)

  }

  update(t: number, dt: number) {
    //  console.log(this.player.x)
    // console.log(this.player.y)



    if (!this.keys || !this.player) {
      return;
    }

    if (this.keys.left?.isDown) {
      this.player.setVelocity(-this.PlayerSpeed, 0);
      this.player.anims.play("player-moveleft", true);
    } else if (this.keys.right?.isDown) {
      this.player.anims.play("player-moveright", true);
      this.player.setVelocity(this.PlayerSpeed, 0);
    } else if (this.keys.up?.isDown) {
      this.player.anims.play("player-moveup", true);
      this.player.setVelocity(0, -this.PlayerSpeed);
    } else if (this.keys.down?.isDown) {
      if (this.ShouldDisplayTitleForIntro){
        this.TitleTextGameObject.destroy()
        this.ShouldDisplayTitleForIntro = false;
      }
      console.log(this.ShouldDisplayTitleForIntro)
      this.player.anims.play("player-movedown", true);
      this.player.setVelocity(0, this.PlayerSpeed);
    } else {
      this.player.anims.stop();
      this.player.setVelocity(0);
    }
  }
}
