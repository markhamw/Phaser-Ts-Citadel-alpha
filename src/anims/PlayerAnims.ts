import Phaser from 'phaser'

const GetPlayerAnims = (anims: Phaser.Animations.AnimationManager, rate: number, playerID: string)=>{
return [
    {
      key: "player-idledown",
      frames: [
        {
          key: playerID,
          frame: "player-idledown.png",
        },
      ],
    },
    {
      key: "player-idleup",
      frames: [
        {
          key: playerID,
          frame: "player-idleup.png",
        },
      ],
    },
    {
      key: "player-idleright",
      frames: [
        {
          key: playerID,
          frame: "player-idleup.png",
        },
      ],
    },
    {
      key: "player-idleleft",
      frames: [
        {
          key: playerID,
          frame: "player-idleup.png",
        },
      ],
    },
    {
      key: "player-attackup",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-attackdown",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackdown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-attackright",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackright-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-attackleft",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackleft-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },

    {
      key: "player-movedown",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-movedown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveup",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-moveup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveright",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-moveright-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveleft",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-moveleft-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
  ]
}

const GetPlayerAnims2 = (anims: Phaser.Animations.AnimationManager, rate: number, playerID: string)=>{
return [
    {
      key: "player-idledown",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-down-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-idleup",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-up-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-idleright",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-right-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-idleleft",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-left-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-idleleftanddown",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-leftanddown-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-idleleftandup",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-leftandup-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-idlerightandup",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-rightandup-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-idlerightanddown",
      frames: [
        {
          key: playerID,
          frames: anims.generateFrameNames(playerID, {
            start: 0,
            end: 16,
            prefix: "player-idle-rightanddown-",
            suffix: ".png",
          }),
          repeat: -1,
          frameRate: rate,
        },
      ],
    },
    {
      key: "player-attackup",
      frames: [
        {
        key: playerID,
        frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-attack-up-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
        }],
    },
    {
      key: "player-attackdown",
      frames: [
        {
        key: playerID,
        frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-attack-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
        }],
    },
    {
      key: "player-attackright",
      frames: [
        {
        key: playerID,
        frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-attack-right-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
        }],
    },
    {
      key: "player-attackleft",
      frames: [
        {
        key: playerID,
        frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-attack-left-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
        }],
    },
    {
      key: "player-movedown",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-move-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveup",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-move-up-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveright",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-move-right-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-move-left",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-moveleft-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveleftandup",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-move-leftandup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveleftanddown",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-move-leftanddown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moverightandup",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-move-rightandup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moverightanddown",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 16,
        prefix: "player-move-rightanddown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    }
  ]
}


export{
    GetPlayerAnims,
    GetPlayerAnims2
}