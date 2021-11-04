import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import Citadel from "~/scenes/Citadel";
import { Guid } from "guid-typescript"
import { getNewRatName } from "~/game/gamelogic";

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

enum VocalEmotes {
    PPSSffkkk,
    GRAAA,
    YOUDONKEY,
}
export default class Shaman extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private RatSpeed = Phaser.Math.Between(0, 2)
    private moveEvent: Phaser.Time.TimerEvent
    private DiscardCurrentTrashTalk: Phaser.Time.TimerEvent
    private CurrentTrashTalk!: Phaser.GameObjects.BitmapText
    private StartingXLoc: number;
    private StartingYLoc: number; 
    private EntityID: Guid;
    private ratname:string;
    private isAlive: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {
                this.CurrentTrashTalk.visible= false;
                let chanceForIdle = Phaser.Math.Between(0, 4);
                let chanceForEmote = Phaser.Math.Between(0, 4);
                this.RatSpeed = chanceForIdle == 1 ? 0 : Phaser.Math.Between(0, 3)
                this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)
                if (chanceForEmote==1){
                    this.CurrentTrashTalk.visible = true;
                    this.anims.play('enemy-shaman-attack', true,)
                } else if (chanceForEmote==2){
                    this.anims.play('enemy-shaman-attack', true)
                }
            },
            loop: true
        });
        this.scene.events.addListener('player-interact-event',(player)=>{
            this.isAlive = false;
        })

        this.scene.events.addListener('enemy-shaman-dead-event',(enemy)=>{
            this.anims.play('enemy-shaman-dead', true);
            this.scene.time.addEvent({
                delay:1600,
                repeat:0,
                callback:()=>{
                    this.destroy()
                    
                }

            })
            
        })
       
        this.DiscardCurrentTrashTalk = scene.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback:()=>{
                if (this.CurrentTrashTalk.visible){
                    this.CurrentTrashTalk.setActive(false)
                    this.CurrentTrashTalk.visible=false
                }
            }
        })

        this.StartingXLoc = x
        this.StartingYLoc = y
        this.CurrentTrashTalk = scene.add.bitmapText(this.x, this.y, 'customfont', VocalEmotes[Phaser.Math.Between(0,7)], 16 )
        this.CurrentTrashTalk.visible=false;
        
       this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
       this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE,  this.handleCollisionWithSprite, this.scene)
       this.EntityID = Guid.create()
       this.ratname = getNewRatName()
    }

    isNearPlayer(player: Phaser.Physics.Arcade.Sprite): boolean{
        return true
    }

    get getEntityID(){
        return this.EntityID
    }
    
    private handleCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile){
        let _go = go as unknown as Shaman

        _go.moveEvent.callback()

        console.log('Collision with tile/map detected')
        console.log('EntityID:',_go.getEntityID)
        console.log('Entity Name:',_go.ratname)
    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile){
        let _go = go as Shaman
        _go.moveEvent.callback()
        console.log('Collision with sprite detected')
}
  /*   Scream = () => {
        this.scene.sound.play('ratsound',{detune: Phaser.Math.Between(150,250), volume: .1})
    }  */

    distanceFromStartingLocation = ():number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x,this.y,this.StartingXLoc,this.StartingYLoc))
    }

    selfDestruct = () => {
        
        this.anims.play('enemy-shaman-dead', true)
    } 

    preload(){
        
    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
      
        super.preUpdate(t, dt)
        if (this.isAlive){
            switch (this.facing) {
                case Direction.UP:
                    this.setVelocity(0, -this.RatSpeed)
                    this.anims.play('enemy-shaman-moveup', true)
                    break
                case Direction.DOWN:
                    this.setVelocity(0, this.RatSpeed)
                    this.anims.play('enemy-shaman-movedown', true)
                    break
                case Direction.LEFT:
                    this.setVelocity(-this.RatSpeed, 0)
                    this.anims.play('enemy-shaman-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.RIGHT:
                    this.setVelocity(this.RatSpeed, 0)
                    this.anims.play('enemy-shaman-moveright', true)
                    break
                case Direction.LEFTANDUP:
                    this.setVelocity(-this.RatSpeed, -this.RatSpeed)
                    this.anims.play('enemy-shaman-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.LEFTANDDOWN:
                    this.setVelocity(-this.RatSpeed, this.RatSpeed)
                    this.anims.play('enemy-shaman-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.RIGHTANDUP:
                    this.setVelocity(this.RatSpeed, -this.RatSpeed)
                    this.anims.play('enemy-shaman-moveright', true)
                    break
                case Direction.RIGHTANDDOWN:
                    this.setVelocity(this.RatSpeed, this.RatSpeed)
                    this.anims.play('enemy-shaman-moveright', true)
                    break
                case Direction.IDLE:
                    this.setVelocity(0, 0)
                    this.anims.play('enemy-shaman-idle', true)
                    break
            }
        } else{
            this.setVelocity(0,0)
            this.scene.events.emit('enemy-shaman-dead-event', this)
            //this.anims.play('enemy-shaman-dead', true)
        }
     
    }
}