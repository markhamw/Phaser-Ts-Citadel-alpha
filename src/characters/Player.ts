import Phaser, { BlendModes, Scene } from "phaser";
import { GetOverworldPlayerAnims, GetPlayerAnims } from "~/anims/PlayerAnims";
import Groklin from "~/enemies/Unit";
import { Condition, PlayerStatus, Speech } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet } from "~/game/gamelogic";
import { WRGameScene } from "~/game/overworldlogic";
import { hidePlayerTalkBubble, showPlayerTalkBubble, showPlayerTalkBubbleWithConditionalEnter, showPlayerTalkBubbleWithConditionalFight } from "~/game/playerlogic";
import { GetRandomNegativeIdentAction, GetRandomNegativeIdentLine, GetRandomPositiveBuildingIdentLine, GetRandomPositiveEnemyIdentLine } from "~/game/playerspeech";
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

export interface TalkBubble {
  frame: Phaser.GameObjects.Sprite;
  headPngforTalkBubble: Phaser.GameObjects.Sprite;
  lines: Phaser.GameObjects.Text;
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
  hit: number = 0;
  inBattle: boolean = false;
  playerHead: string;
  stationary: boolean = false;
  canEnterBuilding!: string | null;
  canAttackEnemy!: string | null;
  canInteractType!: EntityType | null;

  constructor(scene: Overworld, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.status = { MaxHP: 5, CurrentHP: 2, Condition: Condition.Scuffed, XP: 0, Level: 1, Gold: Phaser.Math.Between(0, 100) };
    this.wasd = AddWASDKeysToScene(scene);
    this.playerHead = scene.wrGame.playerHead;

    scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.updateTalkBubblePosition();
      },
      loop: true
    });

    scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.updateHealthIndicators(this.scene);
      },
      loop: true
    });


    let killedflyingrat = this.scene.events.addListener(
      "player-killed-flyingrat",
      () => {
        this.addExperience(100);
        this.scene.time.addEvent({
          delay: 1000,
          callback: () => {
            this.addExperience(100);
            let goldreceived = Phaser.Math.Between(10, 20);
            this.addGold(goldreceived);
            let flyingRatKillSpeech: Speech = { lines: `Flyer down +100 xp. +${goldreceived} gold` }
            this.Say(flyingRatKillSpeech, this.scene);
          },
          loop: false
        });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -1200, rate: 1, delay: .1 });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -1300, rate: .8, delay: .3 });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -1400, rate: 1, delay: .6 });
        this.scene.sound.play("ratsound", { volume: 0.1, detune: 700, rate: 1.25, delay: .8 });
      },
      this
    );

    let playerclickedenterbutton = this.scene.events.addListener(
      "player-clicked-enter",
      (buildingName) => {
        console.log("Interact type: " + this.canInteractType);
        console.log("canEnterBuildin: " + this.canEnterBuilding);
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
        this.handleInteraction(context, this.scene);
      },
      this
    );

    this.scene.events.addListener(
      "player-interact-enemy",
      (enemy) => {


        //old interaction code

        /* console.log("Event: player-interact-enemy", enemy);
        this.scene.events.emit("player-clear-interactionIndicators");
        this.canInteractType = EntityType.Enemy;
        let context = this.generateContext(enemy);
        this.handleInteraction(context, this.scene); */
      },
      this
    );
    this.scene.events.addListener(
      "player-killed-rat",
      (rat) => {

        this.scene.time.addEvent({
          delay: 1000,
          callback: () => {
            this.addExperience(100);
            let goldreceived = Phaser.Math.Between(10, 20);
            this.addGold(goldreceived);
            let ratkillSpeech: Speech = { lines: `${rat.name} down. +100 xp.  +${goldreceived} gold` }
            this.Say(ratkillSpeech, this.scene);
          },
          loop: false
        });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -2200, rate: .7, delay: .2 });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -2300, rate: .8, delay: .5 });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -2400, rate: 1, delay: .9 });

      },
      this
    );
    this.scene.events.addListener(
      "player-killed-shaman",
      (shaman) => {
        this.scene.time.addEvent({
          delay: 1000,
          callback: () => {
            this.addExperience(100);
            let goldreceived = Phaser.Math.Between(10, 20);
            this.addGold(goldreceived);
            let shamankillSpeech: Speech = { lines: `${shaman.name} down. +100 xp.  +${goldreceived} gold` }
            this.Say(shamankillSpeech, this.scene);
          },
          loop: false
        });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -2200, rate: .7, delay: .2 });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -2300, rate: .8, delay: .5 });
        this.scene.sound.play("knifeswipe", { volume: 0.1, detune: -2400, rate: 1, delay: .9 });

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

      lines: scene.add
        .text(0, 0, "", { wordWrap: { width: 225, useAdvancedWrap: true }, color: "#FFFFFF", align: "left" })
        .setAlpha(0)
        .setFontFamily(font)
        .setDepth(6)
        .setShadow(2, 2, "#000000", 2, true, true)
        .setFontSize(fontSize),

    }

    //Enter Button events
    this.tb.enterBtn?.on("pointerdown", () => {
      this.tb.enterBtn?.setTexture("enter-btn-up");
    })
    this.tb.enterBtn?.on("pointerup", () => {
      this.tb.enterBtn?.setTexture("enter-btn-down");
      this.scene.events.emit("player-clicked-enter", this.canEnterBuilding ?? "");
    })

    //Fight button events
    this.tb.fightBtn?.on("pointerdown", () => {
      this.tb.fightBtn?.setTexture("fight-btn-up");
    })
    this.tb.fightBtn?.on("pointerup", () => {
      this.tb.fightBtn?.setTexture("fight-btn-down");
      this.scene.events.emit("player-clicked-fight");

    })
  }


  updateHealthIndicators(scene: any) {

    let Empties = 5 - this.status.Condition;
    let x = 100;
    for (let i = 0; i < scene.player.status.Condition; i++) {
      scene.add.sprite(x, 480, "fullheart");
      x += 10;
    }
    for (let i = 0; i < Empties; i++) {
      scene.add.sprite(x, 480, "emptyheart");
      x += 10;
    }

  }

  generateContext(entity: Phaser.GameObjects.Sprite, speech?: Speech): TalkBubbleContext {

    var distanceFromIt = this.distanceFrom(entity);
    var isitTooFar = distanceFromIt > 40;
    var identLine = "";
    var actionLine = "";

    switch (this.canInteractType) {
      case EntityType.Building:
        identLine = isitTooFar ? GetRandomNegativeIdentLine() : GetRandomPositiveBuildingIdentLine(entity)
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
      speech: { lines: identLine + ' ' + actionLine },
      child: this.distanceFrom(entity) < 40 ? entity : null,
    }
    return context;
  }

  updateTalkBubblePosition() {

    const frameYOffset = this.y - 45
    const frameZone = this.scene.add.zone(this.x, frameYOffset, this.x, frameYOffset)

    const headPngXOffset = this.x - 127;
    const headPngZone = this.scene.add.zone(headPngXOffset, frameYOffset, headPngXOffset, frameYOffset)

    const lineXOffset = this.x - 90;
    const lineYOffset = this.y - 55;

    const linesZone = this.scene.add.zone(this.x + 20, frameYOffset, this.x + 240, frameYOffset + 100)

    Phaser.Display.Align.In.Center(this.tb.frame, frameZone);
    Phaser.Display.Align.In.Center(this.tb.headPngforTalkBubble, headPngZone);
    Phaser.Display.Align.In.Center(this.tb.lines, linesZone);
 
  }

  updateTalkBubbleText(speech: Speech) {
    this.tb.lines.setText(speech.lines);
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
    let levelUpSpeech: Speech = { lines: "Leveled Up!" }
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

    }
  };

  Say = (text: Speech, scene: any, delay?: number) => {
    this.updateTalkBubbleText(text);
    showPlayerTalkBubble(this.scene);
    this.QueueClearTalkBubble(scene, delay);
  };

  QueueClearTalkBubble(scene: any, _delay?: number) {
    if (scene.clearBubbleEvent) {
      scene.clearBubbleEvent.destroy();
    }
    scene.clearBubbleEvent = this.scene.time.addEvent({
      delay: _delay ?? 5000,
      repeat: 0,
      callback: () => {
        hidePlayerTalkBubble(this.scene)
      },
    });
  }

  handleInteraction = (context: TalkBubbleContext, scene: any, delay?: number) => {
    this.interact(context);
    this.QueueClearTalkBubble(scene, delay);
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
    this.scene.events.addListener('battle', (data) => { console.log(data) });
  }

  create() {
    this.on("pointerdown", () => {

      this.scene.scene.launch('SouthArea')


      /*  let playerCondition = Condition[`${this.status.Condition}`];
       let statusLine = `I'm ${playerCondition} with ${this.status.Gold} gp (lvl ${this.status.Level})`;
       let playerStatus: Speech = { lines: statusLine }
       let interactTalkBubbleContext: TalkBubbleContext = { scene: this, speech: playerStatus, canInteract: false };
       this.Say(playerStatus, this.scene); */
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


