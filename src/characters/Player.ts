import Phaser, { Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import { CombatCapability, Condition, PlayerStatus, Speech } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet } from "~/game/gamelogic";
import { WRGameScene } from "~/game/overworldlogic";
import { eventForButton, hidePlayerTalkBubble, showPlayerTalkBubble, showPlayerTalkBubbleWithConditionalEnter, showPlayerTalkBubbleWithConditionalFight } from "~/game/playerlogic";
import { GetRandomNegativeIdentAction, GetRandomNegativeIdentLine, GetRandomPositiveEnemyIdentLine } from "~/game/playerspeech";
import Overworld from "~/scenes/Overworld";
import OverworldTitle from "~/scenes/OverworldTitle";
import Building from "~/structures/Building";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number, y: number, texture: string, frame?: string | number): Player;
    }
  }
}

enum EntityType {
  Enemy,
  Building,
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
  enterBtn?: Phaser.GameObjects.Sprite;
  fightBtn?: Phaser.GameObjects.Sprite;
}

interface TalkBubbleContext {
  scene: any,
  canInteract: boolean,
  speech: Speech,
  child?: Phaser.GameObjects.GameObject | null;
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
  canEnterBuilding!: string | null;
  canAttackEnemy!: string | null;
  canInteractType!: EntityType | null;

  constructor(scene: Overworld, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.status = { MaxHP: 10, CurrentHP: 10, Condition: Condition.Healthy, XP: 0, Level: 1, Gold: Phaser.Math.Between(0, 100) };
    this.combatCapability = { offensiveMultiplier: 1, defense: 1 };
    this.wasd = AddWASDKeysToScene(scene);
    this.playerHead = scene.wrGame.playerHead;

    scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.updateTalkBubblePosition(this);
      },
      loop: true
    });

    this.scene.events.addListener(
      "player-killed-flyingrat",
      () => {
        this.addExperience(100);
        let flyingRatKillSpeech: Speech = { line1: "Flyer down", line2: "", line3: "" }
        let flyingRatKillTalkBubbleContext: TalkBubbleContext = { scene: this.scene, canInteract: false, speech: flyingRatKillSpeech };
        this.handleInteraction(flyingRatKillTalkBubbleContext);
      },
      this
    );

    this.scene.events.addListener(
      "player-clicked-enter",
      (buildingName) => {
        console.log("Interact type: " + this.canInteractType);
        console.log("canEnterBuildin: " + this.canEnterBuilding);
      },
      this
    );

    this.scene.events.addListener(
      "player-clicked-fight",
      (enemy) => {
        console.log("Interact type: " + this.canInteractType);
        console.log("canAttackEnemy: " + this.canAttackEnemy);
        this.scene.events.emit("player-interact-event", enemy);
      },
      this
    );

    this.scene.events.addListener(
      "player-clear-interactionIndicators",
      () => {
        this.canEnterBuilding = null;
        this.canAttackEnemy = null;
      },
      this
    );


    this.scene.events.addListener(
      "player-interact-building",
      (building) => {
        console.log("Event: player-interact-building", building);
        this.scene.events.emit("player-clear-interactionIndicators");
        this.canInteractType = EntityType.Building;
        let context = this.generateContext(building);


        this.handleInteraction(context);
      },
      this
    );



    this.scene.events.addListener(
      "player-interact-enemy",
      (enemy) => {
        console.log("Event: player-interact-enemy", enemy);
        this.scene.events.emit("player-clear-interactionIndicators");
        this.canInteractType = EntityType.Enemy;

        let context = this.generateContext(enemy);

        this.handleInteraction(context);
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
        let ratkillSpeechContext = { scene: this.scene, canInteract: false, speech: ratkillSpeech };
        //this.handleBuildingInteraction(ratkillSpeechContext);
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
    let font = "breathfire"
    let fontSize = 14;

    this.tb = {
      frame: scene.add
        .sprite(0, 0, "window1")
        .setScale(1)
        .setDepth(5)
        .setAlpha(0),

      //string for head from sprite sheet
      headPngforTalkBubble: scene.add
        .sprite(0, 0, "playerheads", scene.wrGame.playerHead)
        .setScale(3)
        .setDepth(5)
        .setAlpha(0),

      line1: scene.add
        .text(0, 0, "")
        .setAlpha(0)
        .setFontFamily(font)
        .setDepth(6)
        .setShadow(2, 2, "#000000", 2, true, true)
        .setFontSize(fontSize),

      line2: scene.add
        .text(0, 0, "")
        .setAlpha(0)
        .setFontFamily(font)
        .setDepth(6)
        .setShadow(2, 2, "#000000", 2, true, true)
        .setFontSize(fontSize),

      line3: scene.add
        .text(0, 0, "")
        .setAlpha(0)
        .setFontFamily(font)
        .setDepth(6)
        .setShadow(2, 2, "#000000", 2, true, true)
        .setFontSize(fontSize),

      enterBtn: scene.add.sprite(0, 0, "enter-btn-down")
        .setAlpha(0)
        .setDepth(6)
        .setInteractive(),

      fightBtn: scene.add.sprite(0, 0, "fight-btn-down")
        .setAlpha(0)
        .setDepth(6)
        .setInteractive()

    }

    //Enter Button events
    this.tb.enterBtn?.on("pointerdown", () => {
      this.tb.enterBtn?.setTexture("enter-btn-up");
    })
    this.tb.enterBtn?.on("pointerup", () => {
      this.tb.enterBtn?.setTexture("enter-btn-down");
      this.scene.events.emit("player-clicked-enter", this.canEnterBuilding ?? "");
      this.canEnterBuilding = null;
      this.tb.enterBtn?.setAlpha(0);
    })

    //Fight button events
    this.tb.fightBtn?.on("pointerdown", () => {
      this.tb.fightBtn?.setTexture("fight-btn-up");
    })
    this.tb.fightBtn?.on("pointerup", () => {
      this.tb.fightBtn?.setTexture("fight-btn-down");
      this.scene.events.emit("player-clicked-fight", this.canInteractType ?? "");
      this.canEnterBuilding = null;
      this.tb.fightBtn?.setAlpha(0);
    })
  }


  generateContext(entity: Phaser.GameObjects.Sprite, speech?: Speech): TalkBubbleContext {

    var distanceFromIt = this.distanceFrom(entity);
    var isitTooFar = distanceFromIt > 40;
    var identLine = "";
    var actionLine = "";

    switch (this.canInteractType) {
      case EntityType.Building:
        identLine = isitTooFar ? GetRandomNegativeIdentLine() : GetRandomPositiveIdentLine(entity)
        actionLine = isitTooFar ? GetRandomNegativeIdentAction() : `I can go in`
        break
      case EntityType.Enemy:
        identLine = isitTooFar ? GetRandomNegativeIdentLine() : GetRandomPositiveEnemyIdentLine(entity);
        actionLine = isitTooFar ? GetRandomNegativeIdentAction() : `I can go in`;
        break;
    }

    let context: TalkBubbleContext = {
      scene: this.scene,
      canInteract: this.distanceFrom(entity) < 40,
      speech: { line1: identLine, line2: actionLine, line3: `` },
      child: this.distanceFrom(entity) < 40 ? entity : null,
    }
    return context;
  }

  updateTalkBubblePosition(player: Player) {

    const frameYOffset = player.y - 25
    const frameZone = this.scene.add.zone(player.x, frameYOffset, player.x, frameYOffset)

    const headPngXOffset = player.x - 127;
    const headPngZone = this.scene.add.zone(headPngXOffset, frameYOffset, headPngXOffset, frameYOffset)

    const lineXOffset = player.x - 90;
    const lineYOffset = player.y - 55;

    const lineZone = this.scene.add.zone(lineXOffset, frameYOffset, lineXOffset, frameYOffset)

    Phaser.Display.Align.In.Center(player.tb.frame, frameZone);
    Phaser.Display.Align.In.Center(player.tb.headPngforTalkBubble, headPngZone);

    // Phaser.Display.Align.In.Center(player.tb.line2, lineZone);
    //  Phaser.Display.Align.In.Center(player.tb.line3, lineZone);

    player.tb.line1.setPosition(lineXOffset, lineYOffset);
    player.tb.line2.setPosition(lineXOffset, lineYOffset + 15);
    player.tb.line3.setPosition(lineXOffset, lineYOffset + 30);

    // player.tb.enterBtn?.setPosition(player.x + 20, FrameYOffset - 7);

    // player.tb.fightBtn?.setPosition(player.x + 40, FrameYOffset - 7);
  }

  updateTalkBubbleText(speech: Speech) {
    this.tb.line1.setText(speech.line1);
    this.tb.line2.setText(speech.line2);
    this.tb.line3.setText(speech.line3);
  }

  queueHideTalkBubble(delay: number) {
    this.scene.time.addEvent({
      delay: delay,
      repeat: 0,
      callback: () => {
        hidePlayerTalkBubble(this.scene)
      },
    });
  }

  interact(context: TalkBubbleContext) {
    context.scene.isSpeaking = true;
    switch (this.canInteractType) {
      case EntityType.Building:
        showPlayerTalkBubbleWithConditionalEnter(this.scene, context.canInteract);
      case EntityType.Enemy:
        showPlayerTalkBubbleWithConditionalFight(this.scene, context.canInteract);
    }
    this.updateTalkBubbleText(context.speech)
  }

  addGold(goldreceived: number) {
    this.status.Gold += goldreceived;
  }

  addLevelStats = () => {
    this.status.XP = 0;
    this.status.Level += 1;
    this.status.CurrentHP += 10;
    this.status.MaxHP += 10;
  }

  levelUp = () => {
    this.addLevelStats();
    let levelUpSpeech: Speech = { line1: "Leveled Up!", line2: "", line3: "" }
    let levelUpTalkBubbleContext: TalkBubbleContext = { scene: this.scene, canInteract: false, speech: levelUpSpeech };
    //this.handleBuildingInteraction(levelUpTalkBubbleContext);
  };

  addExperience = (xp: number) => {
    this.status.XP += xp;
    if (this.status.XP >= 1000) {
      this.levelUp();
    }
  };

  isSprinting() {
    if (this.keys.shift.isDown) {
      this.speed = 150;
    } else {
      this.speed = 100;
    }
  }

  startMove = () => {
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

  Say = (text: Speech) => {
    this.updateTalkBubbleText(text);
    showPlayerTalkBubble(this.scene);
    this.queueHideTalkBubble(2000);
  };

  handleInteraction = (context: TalkBubbleContext) => {
    this.interact(context);
    this.queueHideTalkBubble(3500);
  };

  decideMoveSpeed = () => {
    if (this.isMoving && this.keys.shift.isDown) {
      this.speed = this.sprintspeed;
    } else {
      this.speed = this.walkspeed;
    }
  };


  distanceFrom(obj: Phaser.GameObjects.Sprite): number {
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

  create() {
    this.on("pointerdown", () => {
      let playerCondition = Condition[`${this.status.Condition}`];
      let Hpline = `I'm ${playerCondition}`;
      let Gpline = `with ${this.status.Gold} gp`;
      let Xpline = ` (lvl ${this.status.Level})`;
      let playerStatus: Speech = { line1: Hpline, line2: Gpline, line3: Xpline }
      let interactTalkBubbleContext: TalkBubbleContext = { scene: this, speech: playerStatus, canInteract: false };
      this.handleInteraction(interactTalkBubbleContext);
    });
  }

  update() {
    this.startMove();
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


