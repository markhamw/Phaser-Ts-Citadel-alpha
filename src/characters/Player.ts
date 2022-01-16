import Phaser from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { CombatCapability, Condition, PlayerStatus, Speech } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet } from "~/game/gamelogic";
import { WRGameScene } from "~/game/overworldlogic";
import { hidePlayerTalkBubble, showPlayerTalkBubble, updatePlayerTalkBubblePosition, updatePlayerTalkBubbleText } from "~/game/playerlogic";
import Overworld from "~/scenes/Overworld";
import OverworldTitle from "~/scenes/OverworldTitle";

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

interface TalkBubble {
  frame: Phaser.GameObjects.Sprite;
  headPngforTalkBubble: Phaser.GameObjects.Sprite;
  line1: Phaser.GameObjects.Text;
  line2: Phaser.GameObjects.Text;
  line3: Phaser.GameObjects.Text;
}


export default class Player extends Phaser.Physics.Arcade.Sprite {
  status!: PlayerStatus;
  wasd!: Phaser.Input.Keyboard.Key[];
  keys: Phaser.Types.Input.Keyboard.CursorKeys = this.scene.input.keyboard.createCursorKeys();
  speed!: number;
  walkspeed: number = 7;
  sprintspeed: number = 21;
  isMoving!: boolean;
  tb!: TalkBubble;
  playerHead: string;
  stationary: boolean = false;
  combatCapability!: CombatCapability;
  updateTalkBubblePositionConstantly: Phaser.Time.TimerEvent;

  constructor(scene: Overworld, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.status = { MaxHP: 10, CurrentHP: 10, Condition: Condition.Healthy, XP: 0, Level: 1, Gold: Phaser.Math.Between(0, 100) };
    this.combatCapability = { offensiveMultiplier: 1, defense: 1 };
    this.wasd = AddWASDKeysToScene(scene);
    this.playerHead = scene.wrGame.playerHead;

    this.updateTalkBubblePositionConstantly = scene.time.addEvent({
      delay: 100,
      callback: () => {
        updatePlayerTalkBubblePosition(scene, this);
      },
      loop: true
    });


    this.tb = {
      frame: scene.add
        .sprite(0, 0, "window1")
        .setScale(0.5)
        .setDepth(5)
        .setAlpha(0)
        .setOrigin(0.05, 0),

      headPngforTalkBubble: scene.add
        .sprite(0, 0, "playerheads", scene.wrGame.playerHead)
        .setScale(1.65)
        .setOrigin(0.2, -0.07)
        .setDepth(5)
        .setAlpha(0),

      line1: scene.add
        .text(0, 0, "")
        .setAlpha(0)
        .setDepth(6)
        .setFontSize(10),

      line2: scene.add
        .text(0, 0, "")
        .setAlpha(0)
        .setDepth(6)
        .setFontSize(10),

      line3: scene.add
        .text(0, 0, "")
        .setAlpha(0)
        .setDepth(6)
        .setFontSize(10)


    }

    /*     this.e.on("up", () => {
          this.scene.events.emit("player-interact-event", this);
          console.log("Event: player-interact-event");
          //this.scene.swipesound.play({ loop: false, volume: 0.2, rate: 0.8 });
        }); */

    this.scene.events.addListener(
      "player-killed-flyingrat",
      () => {
        this.addExperience(100);
        let flyingRatKillSpeech: Speech = { line1: "Flyer down", line2: "", line3: "" }
        this.Say(scene, flyingRatKillSpeech, false);
      },
      this
    );

    this.scene.events.addListener(
      "player-killed-rat",
      (rat) => {
        this.addExperience(100);
        let goldreceived = Phaser.Math.Between(10, 20);
        this.addGold(goldreceived);
        let ratkillSpeech: Speech = { line1: `${rat.ratname} down`, line2: `+100 xp`, line3: `+${goldreceived} gold` }
        this.Say(scene, ratkillSpeech, false);
      },
      this
    );


    let updateCondition = scene.time.addEvent({
      delay: 500,
      repeat: -1,
      callback: () => {
        if (this.status.CurrentHP <= 0) {
          this.status.Condition = Condition.Dead;
        } else if (this.status.CurrentHP > 0 && this.status.CurrentHP < 20) {
          this.status.Condition = Condition.Eviscerated;
        } else if (this.status.CurrentHP >= 20 && this.status.CurrentHP < 40) {
          this.status.Condition = Condition.Hurt;
        } else if (this.status.CurrentHP >= 40 && this.status.CurrentHP < 60) {
          this.status.Condition = Condition.Scuffed;
        } else if (this.status.CurrentHP >= 60 && this.status.CurrentHP < 80) {
          this.status.Condition = Condition.Dusty;
        } else if (this.status.CurrentHP >= 80 && this.status.CurrentHP <= 100) {
          this.status.Condition = Condition.Healthy;
        }
      },
    });

    CreateAnimationSet(this.scene, GetOverworldPlayerAnims(this.scene.anims, 5, "playeroverworld"));
  }
  addGold(goldreceived: number) {
    this.status.Gold += goldreceived;
  }

  levelUp = () => {
    this.status.XP = 0;
    this.status.Level += 1;
    this.status.CurrentHP += 10;
    this.status.MaxHP += 10;
    let levelUpSpeech: Speech = { line1: "Leveled Up!", line2: "", line3: "" }
    this.Say(this.scene, levelUpSpeech, false);
  };

  addExperience = (xp: number) => {
    this.status.XP += xp;
    if (this.status.XP >= 1000) {
      this.levelUp();
    }
  };


  Say = (scene: any, text: Speech, canInteract: boolean) => {
    if (!scene.player.isSpeaking) {
      scene.player.isSpeaking = true;
      showPlayerTalkBubble(this.scene);
      updatePlayerTalkBubbleText(this.scene, text, this)
      let hide = scene.time.addEvent({
        delay: 3000,
        repeat: 0,
        callback: () => {
          hidePlayerTalkBubble(scene)
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
    this.scene.events.emit("playerSay");
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);
    this.update();
  }
}


Phaser.GameObjects.GameObjectFactory.register(
  "player",
  function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    var sprite = new Player(this.scene as any, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    return sprite;
  }
);
