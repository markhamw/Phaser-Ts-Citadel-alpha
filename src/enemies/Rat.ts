import Phaser from "phaser";


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
    Squee,
    SQQUEE,
    EEEEeee,
    PPSSffkkk,
    ReeeeeEEEttt,
    Effyou,
}
export default class Rat extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private RatSpeed = Phaser.Math.Between(15, 65)
    private moveEvent: Phaser.Time.TimerEvent
    private DiscardCurrentTrashTalk: Phaser.Time.TimerEvent
    private CurrentTrashTalk!: Phaser.GameObjects.BitmapText
    private RatAlpha!: number;
    private StartingXLoc: number;
    private StartingYLoc: number;
    private ShouldBeDestroyedDuetoDistance: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {
                this.CurrentTrashTalk.visible= false;
                let chanceForIdle = Phaser.Math.Between(0, 4);
                let chanceForEmote = Phaser.Math.Between(0, 4);
                this.RatSpeed = chanceForIdle == 1 ? 0 : Phaser.Math.Between(15, 165)
                this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)
                if (chanceForEmote==1){
                    this.CurrentTrashTalk.visible = true;
                }
            },
            loop: true
        });
        this.DiscardCurrentTrashTalk = scene.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback:()=>{
                if (this.CurrentTrashTalk.visible){
                    this.CurrentTrashTalk.visible=false
                }
                if (this.distanceFromStartingLocation() > 1000){
                    this.ShouldBeDestroyedDuetoDistance = true
                }
                if (this.ShouldBeDestroyedDuetoDistance){
                    this.destroy()
                    this.CurrentTrashTalk.destroy()
                    
                }
            }
        })
        this.StartingXLoc = x
        this.StartingYLoc = y
        this.CurrentTrashTalk = scene.add.bitmapText(this.x, this.y, 'customfont', VocalEmotes[Phaser.Math.Between(0,7)], 16 ).setPipeline('Light2D').setAlpha(this.RatAlpha)
        this.CurrentTrashTalk.visible=false;
        this.RatAlpha = .2
        this.ShouldBeDestroyedDuetoDistance=false;
        
    }

    distanceFromStartingLocation = ():number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x,this.y,this.StartingXLoc,this.StartingYLoc))
    }
    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)
        this.CurrentTrashTalk.setPosition(this.x+25,this.y-25)  
        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -this.RatSpeed)
                this.anims.play('enemy-rat-moveup', true)
                
            case Direction.DOWN:
                this.setVelocity(0, this.RatSpeed)
                this.anims.play('enemy-rat-movedown', true)
                break
            case Direction.LEFT:
                this.setVelocity(-this.RatSpeed, 0)
                this.anims.play('enemy-rat-moveleft', true)
                break
            case Direction.RIGHT:
                this.setVelocity(this.RatSpeed, 0)
                this.anims.play('enemy-rat-moveright', true)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-rat-moveleft', true)
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-rat-moveleft', true)
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-rat-moveright', true)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-rat-moveright', true)
                break
            case Direction.IDLE:
                this.setVelocity(this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-rat-idle', true)
        }
    }
}