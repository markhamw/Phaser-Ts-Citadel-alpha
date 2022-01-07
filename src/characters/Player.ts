import Phaser from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { CombatCapability, Condition, PlayerStatus, Speech } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet } from "~/game/gamelogic";
import { WRGameScene } from "~/game/overworldlogic";
import Chapter1 from "~/scenes/Chapter1";
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

const animationsForPlayerByDirection = [
  { key: `player-moveup`, repeat: 0 },
  { key: `player-movedown`, repeat: 0 },
  { key: `player-moveleft`, repeat: 0 },
  { key: `player-moveright`, repeat: 0 },
  { key: `player-moverightandup`, repeat: 0 },
  { key: `player-moverightanddown`, repeat: 0 },
  { key: `player-moveleftandup`, repeat: 0 },
  { key: `player-moveleftanddown`, repeat: 0 },
];

export default class Player extends Phaser.Physics.Arcade.Sprite {
  status!: PlayerStatus;
  wasd!: Phaser.Input.Keyboard.Key[];
  e!: Phaser.Input.Keyboard.Key;
  keys: Phaser.Types.Input.Keyboard.CursorKeys = this.scene.input.keyboard.createCursorKeys();
  speed!: number;
  walkspeed: number = 7;
  sprintspeed: number = 21;
  isMoving!: boolean;
  talkBubble!: Phaser.GameObjects.Sprite;
  headPngforTalkBubble!: Phaser.GameObjects.Sprite;
  textforTalkBubble!: Speech;
  currentSpeech!: Speech;
  isSpeaking: boolean = false;
  stationary: boolean = false;
  combatCapability!: CombatCapability;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.status = { MaxHP: 100, CurrentHP: 100, Condition: Condition.Healthy, XP: 0, Level: 1 };
    this.combatCapability = { offensiveMultiplier: 1, defense: 0 };

    this.wasd = AddWASDKeysToScene(scene);
    this.e = scene.input.keyboard.addKey("E");
    this.isMoving = false;
    this.e.on("up", () => {
      this.scene.events.emit("player-interact-event", this);
      console.log("E");
      //  this.scene.swipesound.play({ loop: false, volume: 0.2, rate: 0.8 });
      this.setVelocity(0);
    });

    this.scene.events.addListener(
      "kill-flyingrat",
      () => {
        this.addExperience(100);
        this.Say(this.scene, { line1: "Got em!", line2: "", line3: "" });
      },
      this
    );

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

  levelUp = () => {
    this.status.XP = 0;
    this.status.Level += 1;
    this.status.CurrentHP += 10;
    this.status.MaxHP += 10;
    this.Say(this.scene, { line1: "Leveled Up!", line2: "", line3: "" });
  };

  addExperience = (xp: number) => {
    this.status.XP += xp;
    if (this.status.XP >= 1000) {
      this.levelUp();
    }
  };

  Say = (scene: Chapter1 | any, text: Speech) => {
    if (!this.isSpeaking) {
      this.isSpeaking = true;
      let { line1, line2, line3 } = text;
      scene.player.currentSpeech = text;
      scene.player.talkBubble = scene.add
        .sprite(scene.player.x, scene.player.y - 50, "window1")
        .setScale(0.5)
        .setDepth(5)
        .setAlpha(0)
        .setOrigin(0.05, 0);
      scene.player.headPngforTalkBubble = scene.add
        .sprite(scene.player.talkBubble.x, scene.player.talkBubble.y, "playerheads", scene.wrGame.playerHead)
        .setScale(1.65)
        .setOrigin(0.2, -0.07)
        .setDepth(5)
        .setAlpha(0);
      scene.playerline1 = scene.add
        .text(scene.player.talkBubble.x + 30, scene.player.talkBubble.y, line1)
        .setAlpha(0)
        .setDepth(6)
        .setFontSize(10);
      scene.playerline2 = scene.add
        .text(scene.player.talkBubble.x + 30, scene.player.talkBubble.y + 8, line2)
        .setAlpha(0)
        .setDepth(6)
        .setFontSize(10);
      scene.playerline3 = scene.add
        .text(scene.player.talkBubble.x + 30, scene.player.talkBubble.y + 17, line3)
        .setAlpha(0)
        .setDepth(6)
        .setFontSize(10);

      let show = scene.time.addEvent({
        delay: 0,
        repeat: 0,
        callback: () => {
          scene.player.talkBubble.setAlpha(1);
          scene.player.headPngforTalkBubble.setAlpha(1);
          scene.playerline1.setAlpha(1);
          scene.playerline2.setAlpha(1);
          scene.playerline3.setAlpha(1);
        },
      });

      let update = scene.time.addEvent({
        delay: 100,
        repeat: 50,
        callback: () => {
          scene.player.talkBubble.setPosition(scene.player.x, scene.player.y - 50);
          scene.player.headPngforTalkBubble.setPosition(scene.player.talkBubble.x, scene.player.talkBubble.y);
          scene.playerline1.setPosition(scene.player.talkBubble.x + 30, scene.player.talkBubble.y);
          scene.playerline2.setPosition(scene.player.talkBubble.x + 30, scene.player.talkBubble.y + 8);
          scene.playerline3.setPosition(scene.player.talkBubble.x + 30, scene.player.talkBubble.y + 17);
        },
      });

      let hide = scene.time.addEvent({
        delay: 5000,
        repeat: 0,
        callback: () => {
          scene.HidePlayerTalkBubble();
        },
      });
    }
  };

  decideMoveSpeed = () => {
    if (this.isMoving && this.keys.shift.isDown) {
      this.speed = this.sprintspeed;
    } else {
      this.speed = this.walkspeed;
    }
  };


  decideMovement = () => {
    if (this.stationary) {
      return;
    }

    let leftKey = this.wasd[1].isDown;
    let rightKey = this.wasd[3].isDown;
    let upKey = this.wasd[0].isDown;
    let downKey = this.wasd[2].isDown;

    let leftAndUp = leftKey && upKey;
    let rightAndUp = rightKey && upKey;
    let leftAndDown = leftKey && downKey;
    let rightAndDown = rightKey && downKey;

    this.isMoving = leftKey || rightKey || upKey || downKey || leftAndUp || rightAndUp || leftAndDown || rightAndDown;

    this.decideMoveSpeed();

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
      this.anims.stop();
    }
  };

  distanceFrom(obj: Phaser.GameObjects.Sprite, scene: WRGameScene): number {
    return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, obj.x, obj.y))
  }

  playAnimByDirection = (direction: Direction) => {
    let animation = animationsForPlayerByDirection[direction] as Phaser.Animations.Animation;
    animation.frameRate = this.isMoving && this.keys.shift.isDown ? 8 : 5;
    this.anims.play(animation, true);
  };


  preload() {
    //this.scene.events.addListener('battle', (data) => { console.log(data) });
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
