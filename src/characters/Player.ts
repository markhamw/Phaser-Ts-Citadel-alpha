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





export default class Player extends Phaser.Physics.Arcade.Sprite {
  status!: PlayerStatus;
  direction!: Direction;
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

    this.direction = Direction.LEFT;
    this.status = { MaxHP: 100, CurrentHP: 100, Condition: Condition.Healthy };
    this.wasd = AddWASDKeysToScene(scene);
    this.e = scene.input.keyboard.addKey("E");
    this.keys = scene.input.keyboard.createCursorKeys();
    this.speed = 4;

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

  preload() {

  }

  create() { }

  update() {

    let leftKey = this.wasd[1].isDown;
    let rightKey = this.wasd[3].isDown;
    let upKey = this.wasd[0].isDown;
    let downKey = this.wasd[2].isDown;

    let leftAndUp = leftKey && upKey;
    let rightAndUp = rightKey && upKey;
    let leftAndDown = leftKey && downKey;
    let rightAndDown = rightKey && downKey;

    this.isMoving = leftKey || rightKey || upKey || downKey || leftAndUp || rightAndUp || leftAndDown || rightAndDown;

    if (leftAndUp) {
      this.direction = Direction.LEFTANDUP;
      this.setVelocity(-this.speed, -this.speed);
      this.anims.play("player-moveleftandup", true);
    } else if (rightAndUp) {
      this.direction = Direction.RIGHTANDUP;
      this.setVelocity(this.speed, -this.speed);
      this.anims.play("player-moverightandup", true);
    } else if (leftAndDown) {
      this.direction = Direction.LEFTANDDOWN;
      this.setVelocity(-this.speed, this.speed);
      this.anims.play("player-moveleftanddown", true);
    } else if (rightAndDown) {
      this.direction = Direction.RIGHTANDDOWN;
      this.setVelocity(this.speed, this.speed);
      this.anims.play("player-moverightanddown", true);
    } else if (upKey) {
      this.direction = Direction.UP;
      this.setVelocity(0, -this.speed);
      this.anims.play(`player-moveup`, true);
    } else if (rightKey) {
      this.direction = Direction.RIGHT;
      this.setVelocity(this.speed, 0);
      this.anims.play(`player-moveright`, true);
    } else if (leftKey) {
      this.direction = Direction.LEFT;
      this.setVelocity(-this.speed, 0);
      this.anims.play(`player-moveleft`, true);
    } else if (downKey) {
      this.direction = Direction.DOWN;
      this.setVelocity(0, this.speed);
      this.anims.play(`player-movedown`, true);
    } else {
      this.setVelocity(0);
      this.anims.stop()
    }
    if (this.isMoving && this.keys.shift.isDown) {
      this.speed = 6;
    }
    if (!this.keys.shift.isDown) {
      this.speed = 4;
    }

    //create if statement to detect when e is h
    if (this.e.isDown) {
      //this.scene.swipesound.play({ loop: false, volume: 0.2, rate: 0.8 });
      this.setVelocity(0);
      this.scene.events.emit("player-interact-event", this);

      switch (this.direction) {
        case Direction.LEFT:
          console.log("in attack left");
          this.anims.play(`player-attackleft`, true);
          break;
        case Direction.DOWN:
          console.log("in attack down");
          this.anims.play(`player-attackdown`, true);
          break;
        case Direction.UP:
          console.log("in attack up");
          this.anims.play(`player-attackup`, true);
          break;
        case Direction.RIGHT:
          console.log("in attack right");
          this.anims.play(`player-attackright`, true);
          break;
      }
    }
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
