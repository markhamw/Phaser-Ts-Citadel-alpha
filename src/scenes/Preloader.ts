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
    }

    create() {
        this.scene.start('citadel')
    }
}
