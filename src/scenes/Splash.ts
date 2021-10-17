import { Scene } from "phaser";
import { WRGame } from "~/game/game";

export default class Splash extends Phaser.Scene {
 
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isStarted: boolean;
  wrGame!: WRGame;

  constructor() {
    super("Splash");
   this.isStarted = false;
  }

  init(data){
    this.wrGame = data;
    this.wrGame.playerCurrentScene = 'Title'

  }

  preload() {
    this.keys = this.input.keyboard.createCursorKeys();

  }

  create() {
    let music = this.sound.play('idunnobygrapesofwrath',{volume:.03, detune:400})
   
    let titleadded = this.add.sprite(0,0,'willysratfights')
    titleadded.setOrigin(0,0)
    titleadded.setScale(3)

    let titletextother = "Press spacebar to --->" 
    let textadded = this.add.text(730,750,titletextother)
    textadded.setScale(3)
 
  }

  Start = ()=>{
    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.sound.stopAll()
    this.scene.start('Titlescene', this.wrGame)
  }

  update(){
    if (this.keys.space.isDown && !this.isStarted){
        this.isStarted = true;
        this.Start()
      }
  }
    
  

}
