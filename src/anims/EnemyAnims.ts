import Phaser from "phaser";

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
