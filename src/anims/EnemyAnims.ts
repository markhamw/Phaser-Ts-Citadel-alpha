import Phaser from "phaser";
import { GetOverworldPlayerAnims } from "./PlayerAnims";
import { GetCoinAnims, GetSmokeAnims } from "./WorldAnims";

function CreateAnimationSet(scene: Phaser.Scene, animations: Phaser.Types.Animations.Animation[]) {
  animations.forEach((animation) => {
    scene.anims.create(animation);
  });
}
const createAnimations = (scene: Phaser.Scene) => {
  CreateAnimationSet(scene, GetCoinAnims(scene.anims, 4));
  CreateAnimationSet(scene, GetSmokeAnims(scene.anims, 4));
  CreateAnimationSet(scene, GetShamanAnims(scene.anims, 4));
  CreateAnimationSet(scene, GetFlyingRatAnims(scene.anims, 4));
  CreateAnimationSet(scene, GetEarthGolemAnims(scene.anims, 4));
  CreateAnimationSet(scene, GetAirElementalAnims(scene.anims, 4));

  scene.anims.create({
    key: `enter-btn-action`,
    frames: [
      { key: `enter-btn-up` },
      { key: `enter-btn-down` }
    ],
    repeat: 0,
    frameRate: 4,
  })

  scene.anims.create({
    key: `fight-btn-action`,
    frames: [
      { key: `fight-btn-up` },
      { key: `fight-btn-down` }
    ],
    repeat: 0,
    frameRate: 4,
  })


};

const GetShamanAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-shaman-idle`,
      frames: anims.generateFrameNames("enemy-shaman", {
        start: 316,
        end: 319,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-shaman-moveleft`,
      frames: anims.generateFrameNames("enemy-shaman", {
        start: 320,
        end: 323,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },

    {
      key: `enemy-shaman-moveright`,
      frames: anims.generateFrameNames("enemy-shaman", {
        start: 320,
        end: 323,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-shaman-dead`,
      frames: anims.generateFrameNames("enemy-shaman", {
        start: 329,
        end: 335,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: 0,
      frameRate: rate,
    },
    {
      key: `enemy-shaman-moveup`,
      frames: anims.generateFrameNames("enemy-shaman", {
        start: 320,
        end: 323,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-shaman-movedown`,
      frames: anims.generateFrameNames("enemy-shaman", {
        start: 320,
        end: 323,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-shaman-attack`,
      frames: anims.generateFrameNames("enemy-shaman", {
        start: 324,
        end: 328,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
  ];
};
const GetFlyingRatAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-flyingrat-idle`,
      frames: anims.generateFrameNames("enemy-flyingrat", {
        start: 0,
        end: 1,
        prefix: "flyingrat-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-flyingrat-moveleft`,
      frames: anims.generateFrameNames("enemy-flyingrat", {
        start: 0,
        end: 4,
        prefix: "flyingrat-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },

    {
      key: `enemy-flyingrat-moveright`,
      frames: anims.generateFrameNames("enemy-flyingrat", {
        start: 5,
        end: 9,
        prefix: "flyingrat-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
  ];
};
const GetEarthGolemAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-earthgolem-idle`,
      frames: anims.generateFrameNames("enemy-earthgolem", {
        start: 236,
        end: 239,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-earthgolem-moveleft`,
      frames: anims.generateFrameNames("enemy-earthgolem", {
        start: 240,
        end: 243,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-earthgolem-moveright`,
      frames: anims.generateFrameNames("enemy-earthgolem", {
        start: 240,
        end: 243,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-earthgolem-dead`,
      frames: anims.generateFrameNames("enemy-earthgolem", {
        start: 248,
        end: 255,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: 0,
      frameRate: rate,
    },
    {
      key: `enemy-earthgolem-moveup`,
      frames: anims.generateFrameNames("enemy-earthgolem", {
        start: 240,
        end: 243,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-earthgolem-movedown`,
      frames: anims.generateFrameNames("enemy-earthgolem", {
        start: 240,
        end: 243,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-earthgolem-attack`,
      frames: anims.generateFrameNames("enemy-earthgolem", {
        start: 244,
        end: 247,
        prefix: "tower-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
  ];
};
const GetAirElementalAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-airelemental-idle`,
      frames: anims.generateFrameNames("enemy-airelemental", {
        start: 25,
        end: 28,
        prefix: "elementals-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-airelemental-moveleft`,
      frames: anims.generateFrameNames("enemy-airelemental", {
        start: 29,
        end: 32,
        prefix: "elementals-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-airelemental-moveright`,
      frames: anims.generateFrameNames("enemy-airelemental", {
        start: 29,
        end: 32,
        prefix: "elementals-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-airelemental-dead`,
      frames: anims.generateFrameNames("enemy-airelemental", {
        start: 40,
        end: 44,
        prefix: "elementals-",
        suffix: ".png",
      }),
      repeat: 0,
      frameRate: rate,
    },
    {
      key: `enemy-airelemental-moveup`,
      frames: anims.generateFrameNames("enemy-airelemental", {
        start: 29,
        end: 32,
        prefix: "elementals-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-airelemental-movedown`,
      frames: anims.generateFrameNames("enemy-airelemental", {
        start: 29,
        end: 32,
        prefix: "elementals-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-airelemental-attack`,
      frames: anims.generateFrameNames("enemy-airelemental", {
        start: 33,
        end: 37,
        prefix: "elementals-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
  ];
};
export { GetShamanAnims, GetFlyingRatAnims, GetEarthGolemAnims, GetAirElementalAnims, createAnimations };
