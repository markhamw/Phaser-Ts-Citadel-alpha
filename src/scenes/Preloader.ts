import Phaser from 'phaser'
export default class Preloader extends Phaser.Scene {

    constructor() {
        super('preloader')
    }

    preload() {
        console.log("in preload preload")
        this.load.image('tiles', "tileset/dungeon-tileset-ii.png");
        this.load.tilemapTiledJSON('citadel', "tiles/citadel.json");
        
        this.load.atlas('player','character/player.png','character/player.json')

        this.load.atlas('enemy-dino','enemies/enemy-dino.png','enemies/enemy-dino.json')
        this.load.atlas('enemy-squarebo','enemies/enemy-squarebo.png','enemies/enemy-squarebo.json')
        this.load.atlas('enemy-axeman','enemies/enemy-axeman.png','enemies/enemy-axeman.json')
        
    }

    create() {
        this.scene.start('citadel')
    }
}
