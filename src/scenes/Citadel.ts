import Phaser from "phaser";


export default class Citadel extends Phaser.Scene {
    ShouldEnableDebugForCollision: boolean;
    PlayerFrameRate: number;
    PlayerSpeed: number;
    PlayerName: string;
    PlayerHealth: number;

    private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super("citadel")
        this.ShouldEnableDebugForCollision = true
        this.PlayerFrameRate = 15
        this.PlayerName = ""
        this.PlayerSpeed = 100
        this.PlayerHealth = 1000;
    }

    preload() {
        this.keys = this.input.keyboard.createCursorKeys()
    }

    CreateAnimationSet = (anims: Phaser.Types.Animations.Animation[]) => {
        anims.forEach(anim => {
            this.anims.create(anim)
        });
    }

    Collides = (layer: Phaser.Tilemaps.TilemapLayer) => {
        layer.setCollisionByProperty({
            collides: true
        })
        if (this.ShouldEnableDebugForCollision) {
            const debugGraphics = this.add.graphics().setAlpha(0.30)
            layer.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
        }
    }

    create() {

        const enum Layers {
            Ground,
            Walls,
            Decoration
        }

        const map = this.make.tilemap({ key: 'citadel' });
        const tileset = map.addTilesetImage('citadel-tileset', 'tiles');

        map.createLayer(Layers.Ground, tileset);
        const decorationsLayer = map.createLayer(Layers.Decoration, tileset);
        const wallsLayer = map.createLayer(Layers.Walls, tileset);

        this.Collides(wallsLayer)
        this.Collides(decorationsLayer)

        this.player = this.physics.add.sprite(128, 128, 'player', 'kanji-atk-right-2.png')

        this.physics.add.collider(this.player, wallsLayer)
        this.physics.add.collider(this.player, decorationsLayer)

        const enemy_dino = this.physics.add.sprite(300, 196, 'enemy-dino', 'enemy-dino-0.png')
        const enemy_squarebo = this.physics.add.sprite(340, 196, 'enemy-squarebo', 'enemy-59.png')
        const enemy_axeman = this.physics.add.sprite(275, 110, 'enemy-axeman', 'axeman-moveright-0.png')

        this.CreateAnimationSet([{
            key: 'player-idle-down',
            frames: [{
                key: 'player',
                frame: 'kanji-rundown-0.png'
            }]
        }, {
            key: 'player-idle-up',
            frames: [{
                key: 'player',
                frame: 'kanji-runup-0.png'
            }]
        }, {
            key: 'player-idle-right',
            frames: [{
                key: 'player',
                frame: 'kanji-runright-0.png'
            }]
        }, {
            key: 'player-idle-left',
            frames: [{
                key: 'player',
                frame: 'kanji-runleft-0.png'
            }]
        },
        {
            key: 'player-atk-up',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 5,
                prefix: 'kanji-atk-up-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        }, {
            key: 'player-atk-down',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 5,
                prefix: 'kanji-atk-down-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        }, {
            key: 'player-atk-right',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 5,
                prefix: 'kanji-atk-right-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        }, {
            key: 'player-atk-left',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 5,
                prefix: 'kanji-atk-left-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        },

        {
            key: 'player-move-down',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 4,
                prefix: 'kanji-rundown-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        }, {
            key: 'player-move-up',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 4,
                prefix: 'kanji-runup-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        }, {
            key: 'player-move-right',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 4,
                prefix: 'kanji-runright-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        }, {
            key: 'player-move-left',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 4,
                prefix: 'kanji-runleft-',
                suffix: '.png',
            }),
            repeat: -1,
            frameRate: this.PlayerFrameRate
        }
        ])

        this.cameras.main.startFollow(this.player, false);


    }

    update(t: number, dt: number) {
        if (!this.keys || !this.player) {
            return
        }
       
        if (this.keys.left?.isDown) {
            this.player.setVelocity(-this.PlayerSpeed, 0);
            this.player.anims.play('player-move-left', true)
        } else if (this.keys.right?.isDown) {
            this.player.anims.play('player-move-right', true)
            this.player.setVelocity(this.PlayerSpeed, 0)
        } else if (this.keys.up?.isDown) {
            this.player.anims.play('player-move-up', true)
            this.player.setVelocity(0, -this.PlayerSpeed)
        } else if (this.keys.down?.isDown) {
            this.player.anims.play('player-move-down', true)
            this.player.setVelocity(0, this.PlayerSpeed)
        } else {
            this.player.anims.stop()
            this.player.setVelocity(0);
        }
    }
}
