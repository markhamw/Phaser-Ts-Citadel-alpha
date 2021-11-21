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
export default class RatOgre extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private RatSpeed = Phaser.Math.Between(0, 2)
    private moveEvent: Phaser.Time.TimerEvent
    private DiscardCurrentTrashTalk: Phaser.Time.TimerEvent
    private CurrentTrashTalk!: Phaser.GameObjects.Text
    private StartingXLoc: number;
    private StartingYLoc: number; 
    private EntityID: Guid;
    private ratname:string;

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
                    this.anims.play('enemy-ratogre-attack', true,)
                } else if (chanceForEmote==2){
                    this.anims.play('enemy-ratogre-attack', true)
                }
            },
            loop: true
        });
        this.scene.events.addListener('player-interact-event',(player)=>{
            
            console.log('heard by ratogre in listener')
            console.log(`${this.ratname} is at ${this.x} ${this.y}`)
            console.log("player is at ",player.x,player.y)
            let xDiff = this.x - player.x
            let yDiff = this.y - player.y
            if (xDiff && yDiff < 10){
                this.scene.add.image(this.scene.cameras.main.centerX,this.scene.cameras.main.centerY,'scrollsmall')
                
                //this.selfDestruct()
            }

            //broken here
            
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
        this.CurrentTrashTalk = scene.add.text(this.x, this.y, VocalEmotes[Phaser.Math.Between(0,7)] )
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
        let _go = go as unknown as RatOgre

        _go.moveEvent.callback()

        console.log('Collision with tile/map detected')
        console.log('EntityID:',_go.getEntityID)
        console.log('Entity Name:',_go.ratname)
    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile){
        let _go = go as RatOgre
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
        this.moveEvent.destroy()
        this.CurrentTrashTalk.destroy()
        this.DiscardCurrentTrashTalk.destroy()
        
      //  this.Scream()
        this.destroy()
    } 

    preload(){
        this.scene.events.addListener('player-interact-event',()=>{
            console.log("RatOgre heard player attack event")
        })
        
    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt)
        this.CurrentTrashTalk.setPosition(this.x+25,this.y-25)
        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -this.RatSpeed)
                this.anims.play('enemy-ratogre-moveup', true)
                break
            case Direction.DOWN:
                this.setVelocity(0, this.RatSpeed)
                this.anims.play('enemy-ratogre-movedown', true)
                break
            case Direction.LEFT:
                this.setVelocity(-this.RatSpeed, 0)
                this.anims.play('enemy-ratogre-moveleft', true)
                this.flipX = true;
                break
            case Direction.RIGHT:
                this.setVelocity(this.RatSpeed, 0)
                this.anims.play('enemy-ratogre-moveright', true)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-ratogre-moveleft', true)
                this.flipX = true;
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-ratogre-moveleft', true)
                this.flipX = true;
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-ratogre-moveright', true)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-ratogre-moveright', true)
                break
            case Direction.IDLE:
                this.setVelocity(0, 0)
                this.anims.play('enemy-ratogre-idle', true)
                break
        }
    }
}