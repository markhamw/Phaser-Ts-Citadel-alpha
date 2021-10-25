import Phaser from 'phaser'



const GetRatAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-rat-idle`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 192,
        end: 195,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,

    },
    {
      key: `enemy-rat-moveleft`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 196,
        end: 199,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },

    {
      key: `enemy-rat-moveright`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 196,
        end: 199,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-rat-moveup`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 196,
        end: 199,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-rat-movedown`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 196,
        end: 199,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-rat-attack`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 200,
        end: 203,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    }

  ]
}

const GetRatOgreAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-ratogre-idle`,
      frames: anims.generateFrameNames('enemy-ratogre', {
        start: 296,
        end: 299,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,

    },
    {
      key: `enemy-ratogre-moveleft`,
      frames: anims.generateFrameNames('enemy-ratogre', {
        start: 300,
        end: 303,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },

    {
      key: `enemy-ratogre-moveright`,
      frames: anims.generateFrameNames('enemy-ratogre', {
        start: 300,
        end: 303,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-ratogre-dead`,
      frames: anims.generateFrameNames('enemy-ratogre', {
        start: 311,
        end: 315,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-ratogre-moveup`,
      frames: anims.generateFrameNames('enemy-ratogre', {
        start: 300,
        end: 303,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-ratogre-movedown`,
      frames: anims.generateFrameNames('enemy-ratogre', {
        start: 300,
        end: 303,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-ratogre-attack`,
      frames: anims.generateFrameNames('enemy-ratogre', {
        start: 304,
        end: 307,
        prefix: 'tower-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    }

  ]
}
export {

  GetRatAnims, GetRatOgreAnims

}