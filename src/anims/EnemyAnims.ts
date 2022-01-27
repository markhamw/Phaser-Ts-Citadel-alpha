import Phaser from "phaser";
import Overworld from "~/scenes/Overworld";
import { GetOverworldPlayerAnims } from "./PlayerAnims";
import { GetCoinAnims, GetSmokeAnims } from "./WorldAnims";

/* function CreateAnimationSet(scene: Phaser.Scene, animations: Phaser.Types.Animations.Animation[]) {
  animations.forEach((animation) => {
    scene.anims.create(animation);
  });
} */



const createUIAnimations = (scene: Phaser.Scene) => {

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

export { createUIAnimations };
