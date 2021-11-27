import Phaser from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { Condition, PlayerStatus, Speech } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet } from "~/game/gamelogic";
import Overworld from "~/scenes/OverworldTitle";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number, y: number, texture: string, frame?: string | number): Player;
    }
  }
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  RIGHTANDUP,
  RIGHTANDDOWN,
  LEFTANDUP,
  LEFTANDDOWN,
  IDLE,
}
const animationsForPlayerByDirection = [{ key: `player-moveup`, repeat: 0 },
{ key: `player-movedown`, repeat: 0 },
{ key: `player-moveleft`, repeat: 0 },
{ key: `player-moveright`, repeat: 0 },
{ key: `player-moverightandup`, repeat: 0 },
{ key: `player-moverightanddown`, repeat: 0 },
{ key: `player-moveleftandup`, repeat: 0 },
{ key: `player-moveleftanddown`, repeat: 0 },]


export default class Player extends Phaser.Physics.Arcade.Sprite {
  status!: PlayerStatus;

  wasd!: Phaser.Input.Keyboard.Key[];
  e!: Phaser.Input.Keyboard.Key;
  keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  speed!: number;
  isMoving!: boolean;
  smokeEffect!: Phaser.GameObjects.Sprite;
  talkBubble!: Phaser.GameObjects.Sprite;
  headPngforTalkBubble!: Phaser.GameObjects.Sprite;
  textforTalkBubble!: Speech
  currentSpeech!: Speech;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.status = { MaxHP: 100, CurrentHP: 100, Condition: Condition.Healthy };
    this.wasd = AddWASDKeysToScene(scene);
    this.e = scene.input.keyboard.addKey("E");
    this.keys = scene.input.keyboard.createCursorKeys();
    this.speed = 4;

    this.e.on('up', () => {
      this.scene.events.emit("player-interact-event");
      console.log("E");
      //  this.scene.swipesound.play({ loop: false, volume: 0.2, rate: 0.8 });
      this.setVelocity(0);
    })

    let updateCondition = scene.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.status.CurrentHP <= 0) {
          this.status.Condition = Condition.Dead;
        }
        if (this.status.CurrentHP > 74 && this.status.CurrentHP < 100) {
          this.status.Condition = Condition.Dusty;
        }
        if (this.status.CurrentHP >= 50 && this.status.CurrentHP < 75) {
          this.status.Condition = Condition.Wounded;
        }
        if (this.status.CurrentHP >= 10 && this.status.CurrentHP < 25) {
          this.status.Condition = Condition.Eviscerated;
        }
        if (this.status.CurrentHP <= 0) {
          this.status.Condition = Condition.Dead;
        }
      },
    });

    CreateAnimationSet(this.scene, GetOverworldPlayerAnims(this.scene.anims, 5, "playeroverworld"));

  }

  decideMovement = () => {
    let leftKey = this.wasd[1].isDown;
    let rightKey = this.wasd[3].isDown;
    let upKey = this.wasd[0].isDown;
    let downKey = this.wasd[2].isDown;

    let leftAndUp = leftKey && upKey;
    let rightAndUp = rightKey && upKey;
    let leftAndDown = leftKey && downKey;
    let rightAndDown = rightKey && downKey;

    this.isMoving = leftKey || rightKey || upKey || downKey || leftAndUp || rightAndUp || leftAndDown || rightAndDown;

    if (this.isMoving && this.keys.shift.isDown) {
      this.speed = 8;
    }

    if (!this.keys.shift.isDown) {
      this.speed = 4;
    }

    if (leftAndUp) {
      this.setVelocity(-this.speed, -this.speed);
      this.playAnimByDirection(Direction.LEFTANDUP);
    } else if (rightAndUp) {
      this.setVelocity(this.speed, -this.speed);
      this.playAnimByDirection(Direction.RIGHTANDUP);
    } else if (leftAndDown) {
      this.setVelocity(-this.speed, this.speed);
      this.playAnimByDirection(Direction.LEFTANDDOWN);
    } else if (rightAndDown) {
      this.setVelocity(this.speed, this.speed);
      this.playAnimByDirection(Direction.RIGHTANDDOWN);
    } else if (upKey) {
      this.setVelocity(0, -this.speed);
      this.playAnimByDirection(Direction.UP);
    } else if (rightKey) {
      this.setVelocity(this.speed, 0);
      this.playAnimByDirection(Direction.RIGHT);
    } else if (leftKey) {
      this.setVelocity(-this.speed, 0);
      this.playAnimByDirection(Direction.LEFT);
    } else if (downKey) {
      this.setVelocity(0, this.speed);
      this.playAnimByDirection(Direction.DOWN);
    } else {
      this.setVelocity(0);
      this.anims.stop()
    }


  }
  playAnimByDirection = (direction: Direction) => {
    let animation = animationsForPlayerByDirection[direction] as Phaser.Animations.Animation
    animation.frameRate = this.isMoving && this.keys.shift.isDown ? 8 : 5;
    this.anims.play(animation, true);
  }
  preload() {

  }

  create() { }

  update() {
    this.decideMovement();
  }
  setTextForTalkBubble() {
    this.scene.events.emit("playerSay", this.currentSpeech);
  }
  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);
    this.update();
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "player",
  function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    var sprite = new Player(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    return sprite;
  }
);
