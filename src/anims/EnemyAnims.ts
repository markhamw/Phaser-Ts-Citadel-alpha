import Phaser from 'phaser'

const GetSquareBoAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-squarebo-idle`,
      frames: [
        {
          key: 'enemy-squarebo',
          frame: 'enemy-59.png',
        },
      ],
    },
    {
      key: `enemy-squarebo-move`,
      frames: anims.generateFrameNames('enemy-squarebo', {
        start: 54,
        end: 61,
        prefix: 'enemy-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    }
  ]
}

const GetAxeManAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-axeman-idle`,
      frames: [
        {
          key: 'enemy-axeman',
          frame: 'enemy-axeman-movedown-1.png',
        },
      ],
    },
    {
      key: `enemy-axeman-moveleft`,
      frames: anims.generateFrameNames('enemy-axeman', {
        start: 0,
        end: 2,
        prefix: 'enemy-axeman-moveleft-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    }
  ]
}
const GetRatAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-rat-idle`,
      frames: [
        {
          key: 'enemy-rat',
          frame: 'enemy-rat-movedown-0.png',
        },
      ],

    },
    {
      key: `enemy-rat-moveleft`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 0,
        end: 2,
        prefix: 'enemy-rat-moveleft-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },

    {
      key: `enemy-rat-moveright`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 0,
        end: 2,
        prefix: 'enemy-rat-moveright-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-rat-moveup`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 0,
        end: 2,
        prefix: 'enemy-rat-moveup-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    }

  ]
}


const GetDinoSaurAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-dino-idle`,
      frames: [
        {
          key: 'dinosaur',
          frame: 'enemy-dino-0.png',
        },
      ],
    },
    {
      key: `enemy-dino-move`,
      frames: anims.generateFrameNames('dinosaur', {
        start: 1,
        end: 2,
        prefix: 'enemy-dino-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    }
  ]
}
export {
  GetSquareBoAnims,
  GetAxeManAnims,
  GetDinoSaurAnims,
  GetRatAnims
}