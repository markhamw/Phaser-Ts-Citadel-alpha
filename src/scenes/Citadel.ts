import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { enemies } from "~/enemies/enemies";
import Squarebo from "../enemies/Squarebo";
import { GetPlayerAnims } from '../anims/PlayerAnims'
import { GetAxeManAnims, GetSquareBoAnims, GetDinoSaurAnims, GetRatAnims } from "~/anims/EnemyAnims";
import Axeman from "~/enemies/Axeman";
import Dinosaur from "~/enemies/Dinosaur";
import Rat from "~/enemies/Rat";
import Player from "~/characters/Player"

export default class Citadel extends Phaser.Scene {
  ShouldEnableDebugForCollision: boolean;
  PlayerFrameRate: number;
  PlayerSpeed: number;
  PlayerName: string;
  PlayerHealth: number;
  PlayerID: string;
  DebugCollideColor: Phaser.Display.Color;
  DebugFaceColor: Phaser.Display.Color;
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  private TitleFontSize: number;
  private TitleX: number;
  private TitleY: number;
  private TitleText: string;
  private TitleAlpha: number;
  private TitleTextGameObject!: Phaser.GameObjects.BitmapText
  private TitleTextInstructionsGameObject!: Phaser.GameObjects.BitmapText
  private TitleTextInstructionsGameObject2!: Phaser.GameObjects.BitmapText
  private TitleFrame!: Phaser.GameObjects.Rectangle
  private IsAnyKeyPressed!: boolean
  private IsTitleDisplayed!: boolean
  private MaxRats: number;
  private MobAlpha: number
  private RatGroup!: Phaser.Physics.Arcade.Group
  private RatID: string;
  private CustomKeys!: Phaser.Input.Keyboard.Key[]
  private Spotlight!: Phaser.GameObjects.Light
  private SpotlightBaseIntensity!: number;
 
  constructor() {
    super("citadel");
    this.ShouldEnableDebugForCollision = true;
    this.PlayerFrameRate = 10;
    this.PlayerName = "";
    this.PlayerID = "player";
    this.RatID = "enemy-rat";
    this.MobAlpha = .2;
    this.PlayerSpeed = 100;
    this.PlayerHealth = 1000;
    this.DebugCollideColor = new Phaser.Display.Color(243, 234, 48, 255);
    this.DebugFaceColor = new Phaser.Display.Color(40, 39, 37, 255);
    this.TitleText = "--=== Willys Ratfights ===--"
    this.TitleFontSize = 100
    this.TitleX = 400
    this.TitleY = 65
    this.TitleAlpha = .5
    this.IsAnyKeyPressed = false;
    this.IsTitleDisplayed = true;
    this.MaxRats = 20;
    this.SpotlightBaseIntensity = 10;
    
  }



  preload() {
    this.keys = this.input.keyboard.createCursorKeys();
  
    this.Spotlight = this.lights.addLight(0, 0, 480).
    setIntensity(this.SpotlightBaseIntensity).
    setColor(0xffffff);
    
    const playerMoveUp = 'player-moveup'
    const playerMoveDown = 'player-movedown'
    const playerMoveRight = 'player-moveright'
    const playerMoveLeft = 'player-moveleft'


    this.Spotlight.scrollFactorX = 0
    this.Spotlight.scrollFactorY = 0
    this.player = this.physics.add.sprite(
      900,
      600,
      this.PlayerID,
      "player-idledown.png"
    ).setPipeline('Light2D').setAlpha(0.2);
    this.ShowTitle();
  }

  StartGameplayAndRemoveTitle = () => {
    if (this.IsTitleDisplayed){
      this.TitleFrame.destroy()
      this.TitleTextGameObject.destroy()
      this.TitleTextInstructionsGameObject.destroy()
      this.TitleTextInstructionsGameObject2.destroy()
      this.lights.setAmbientColor(0x000000)
      this.IsTitleDisplayed = false
    }
  }

  CreateAnimationSet = (animations: Phaser.Types.Animations.Animation[]) => {
    animations.forEach((animation) => {
      this.anims.create(animation);
    });
  };


  ShowTitle = () => {
    this.TitleFrame = this.add.rectangle(900, 600, 1910, 1070, 0x000000).setAlpha(.5);
    this.TitleFrame.setStrokeStyle(20, 0x574b38);
    this.TitleTextGameObject = this.add.bitmapText(this.TitleX, this.TitleY, 'customfont', this.TitleText, 32)
      .setPipeline('Light2D')
      .setAlpha(this.TitleAlpha)
      .setFontSize(this.TitleFontSize)
    this.TitleTextInstructionsGameObject = this.add.bitmapText(600, 185, 'customfont', "Use W,A,S,D or arrow keys (press any key)", 32).setPipeline('Light2D').setAlpha(.2)
    this.TitleTextInstructionsGameObject2 = this.add.bitmapText(600, 215, 'customfont', "Use the cursor or touch to light the area", 32).setPipeline('Light2D').setAlpha(.2)
  }

  GetNumberOfRats = ():number => {
    return this.RatGroup.children.entries.length
  }

  SummonMobs = (group: Phaser.Physics.Arcade.Group, enemyid: string, instances: number) => {
    for (let countmade = 0; countmade < instances; countmade++) {
      let mobX = this.RandomCoord(1920)
      let mobY = this.RandomCoord(1080)
      if (this.RatGroup.children.entries.length < this.MaxRats){
        group.get(mobX, mobY, enemyid).setPipeline('Light2D').setAlpha(this.MobAlpha)
      } else {
        console.log('Could not create rat. Too Many')
      }
      
    }
  }

  RandomCoord = (max: number): number => {
    let num = Math.floor(Math.random() * max);
    let minimumAbritraryCoordValue = 49
    if (num > minimumAbritraryCoordValue) {
      return num;
    } else return num + 30;
  };

  Collides = (layer: Phaser.Tilemaps.TilemapLayer) => {
    layer.setCollisionByProperty({
      collides: true,
    });
    if (this.ShouldEnableDebugForCollision) {
      const debugGraphics = this.add.graphics().setAlpha(0.1);
      layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: this.DebugCollideColor,
        faceColor: this.DebugFaceColor,
      });
    }
  };
  
  movePlayer = (direction: string) => {
    if (direction == 'stop') {
      this.player.anims.stop();
      this.player.setVelocity(0);
      this.IsAnyKeyPressed = false
      return
    }
    
    if (direction) {
      this.IsAnyKeyPressed = true;
    }
    console.log("direction before switchcase: ", direction);
    switch (direction){
      case 'up':
        this.player.setVelocity(0, -this.PlayerSpeed)
        this.player.anims.play(`player-move${direction}`, true);
        return
      case 'down':
        this.player.setVelocity(0, this.PlayerSpeed)
        this.player.anims.play(`player-move${direction}`, true);
        return
      case 'left':
        this.player.setVelocity(-this.PlayerSpeed, 0)
        this.player.anims.play(`player-move${direction}`, true);
        return
      case 'right':
        this.player.setVelocity(this.PlayerSpeed, 0)
        this.player.anims.play(`player-move${direction}`, true);
        return
      case 'leftanddown':
        this.player.setVelocity(-this.PlayerSpeed, this.PlayerSpeed)
        this.player.anims.play('player-moveleft', true);
        return
      case 'leftandup':
        this.player.setVelocity(-this.PlayerSpeed, -this.PlayerSpeed)
        this.player.anims.play('player-moveleft', true);
        return
      case 'rightanddown':
        this.player.setVelocity(this.PlayerSpeed, this.PlayerSpeed)
        this.player.anims.play('player-moveright', true);
        return
      case 'rightandup':
        this.player.setVelocity(this.PlayerSpeed, -this.PlayerSpeed)
        this.player.anims.play('player-moveright', true);
        return
    }
    //this.player.setVelocity(this.getVelocityXByDirection(direction), this.getVelocityYByDirection(direction));
   // this.player.anims.play(`player-move${direction}`, true);

  }

  create() {

    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)


    this.CustomKeys = [keyW, keyA, keyS, keyD]

    // const enum Layers {
    //  Ground,
    //  Walls,
    //  Decoration,
    // } 

    //const map = this.make.tilemap({ key: "citadel" });
    //const tileset = map.addTilesetImage("citadel-tileset", "tiles");

    // map.createLayer(Layers.Ground, tileset);
    // const decorationsLayer = map.createLayer(Layers.Decoration, tileset);
    // const wallsLayer = map.createLayer(Layers.Walls, tileset);

    // this.Collides(wallsLayer);
    // this.Collides(decorationsLayer);

    //this.player.setScale(1.75)
    // this.physics.add.collider(this.player, wallsLayer);
    // this.physics.add.collider(this.player, decorationsLayer);

    this.CreateAnimationSet(GetPlayerAnims(this.anims, this.PlayerFrameRate, this.PlayerID));
    //this.CreateAnimationSet(GetSquareBoAnims(this.anims,10))
    //this.CreateAnimationSet(GetDinoSaurAnims(this.anims,10))
    this.CreateAnimationSet(GetRatAnims(this.anims, 4))
    //this.player.body.setSize(this.player.width * 2, this.player.height *  2)
    // this.player.body.offset.y = 20;
    this.cameras.main.startFollow(this.player, false).setPipeline('Light2D');


    this.lights.enable();

    this.lights.setAmbientColor(0x808080);




    let UpdateLight = (pointer, spotlight: Phaser.GameObjects.Light) => {
      this.Spotlight.x = pointer.x;
      this.Spotlight.y = pointer.y;
    }

    let IntenseLight = (pointer, spotlight: Phaser.GameObjects.Light) => {
      this.Spotlight.setIntensity(this.Spotlight.intensity + 10);
      this.Spotlight.setRadius(440);
    }
    let NormalLight = (pointer, spotlight: Phaser.GameObjects.Light) => {
      this.Spotlight.setIntensity(this.SpotlightBaseIntensity);
      this.Spotlight.setRadius(380);
    }

    this.input.on('pointermove', UpdateLight);
    this.input.on('pointerdown', IntenseLight)
    this.input.on('pointerup', NormalLight)
    // const Dinosaurs = this.physics.add.group({
    //   classType:Dinosaur
    // })
    // const SquareBos = this.physics.add.group({
    //   classType:Squarebo
    // })
    //const AxeMen = this.physics.add.group({
    //  classType: Axeman
    // })
    this.RatGroup = this.physics.add.group({
      classType: Rat,
      //createCallback: (go)=>{
          
        //  console.log("hi",this.player.x,this.player.y)
      //}
    })
    
    this.SummonMobs(this.RatGroup, this.RatID, this.MaxRats)
    //SquareBos.get(this.RandomCoord(100),this.RandomCoord(200),'enemy-squarebo')  
    // AxeMen.get(this.RandomCoord(100),this.RandomCoord(200),'enemy-axeman')
    // Dinosaurs.get(this.RandomCoord(100),this.RandomCoord(200),'dinosaur')
  
  }


  update(t: number, dt: number) {
    let leftKeys = this.CustomKeys[1].isDown || this.keys.left?.isDown
    let rightKeys = this.CustomKeys[3].isDown || this.keys.right?.isDown
    let upKeys = this.CustomKeys[0].isDown || this.keys.up?.isDown
    let downKeys = this.CustomKeys[2].isDown || this.keys.down?.isDown
    console.log("num of rats",this.GetNumberOfRats())
    if ((this.MaxRats - this.GetNumberOfRats()) >= 5){
      this.SummonMobs(this.RatGroup, this.RatID, Phaser.Math.Between(1,5))
    }
    let leftAndUp = leftKeys && upKeys
    let rightAndUp = rightKeys && upKeys
    let leftAndDown = leftKeys && downKeys
    let rightAndDown = rightKeys && downKeys
    if (!this.keys || !this.player) {
      return;
    }
    if (this.IsAnyKeyPressed) {
      this.StartGameplayAndRemoveTitle()
    }
    if (leftAndUp) {
      this.movePlayer('leftandup');
    } else if (rightAndUp) {
      this.movePlayer('rightandup')
    } else if (leftAndDown) {
      this.movePlayer('leftanddown')
    } else if (rightAndDown) {
      this.movePlayer('rightanddown')
    } else if (upKeys) {
      this.movePlayer('up')
    } else if (rightKeys){
      this.movePlayer('right')
    } else if (leftKeys){
      this.movePlayer('left')
    } else if (downKeys){
      this.movePlayer('down')
    }else {
      this.movePlayer('stop')
    }
  }
}
