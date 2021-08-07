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

}
export default class Chort extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private ChortSpeed = Phaser.Math.Between(7, 20)
    private moveEvent: Phaser.Time.TimerEvent
   // private CurrentTrashTalk!: Phaser.GameObjects.BitmapText
    private ChortAlpha!: number;
    private StartingXLoc: number;
    private StartingYLoc: number;
    private ShouldBeDestroyedDuetoDistance: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {
               
                let chanceForIdle = Phaser.Math.Between(0, 4);
               // let chanceForEmote = Phaser.Math.Between(0, 4);
                this.ChortSpeed = chanceForIdle == 1 ? 0 : Phaser.Math.Between(15, 165)
                this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)
               // if (chanceForEmote==1){
                    //this.CurrentTrashTalk.visible = true;
               // }
            },
            loop: true
        });
      //  this.DiscardCurrentTrashTalk = scene.time.addEvent({
        //    delay: 1000,
        //    repeat: -1,
          //  callback:()=>{
   //
         //   }
        //})
        this.StartingXLoc = x
        this.StartingYLoc = y
        this.ChortAlpha = .2
        this.ShouldBeDestroyedDuetoDistance=false;
        
    }

    distanceFromStartingLocation = ():number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x,this.y,this.StartingXLoc,this.StartingYLoc))
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)
       // this.CurrentTrashTalk.setPosition(this.x+25,this.y-25)  
        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -this.ChortSpeed)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.DOWN:
                this.setVelocity(0, this.ChortSpeed)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.LEFT:
                this.setVelocity(-this.ChortSpeed, 0)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.RIGHT:
                this.setVelocity(this.ChortSpeed, 0)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-this.ChortSpeed, -this.ChortSpeed)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.ChortSpeed, this.ChortSpeed)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(this.ChortSpeed, -this.ChortSpeed)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.ChortSpeed, this.ChortSpeed)
                this.anims.play('enemy-chort-run', true)
                break
            case Direction.IDLE:
                this.setVelocity(this.ChortSpeed, this.ChortSpeed)
                this.anims.play('enemy-chort-idle', true)
                break
        }
    }
}