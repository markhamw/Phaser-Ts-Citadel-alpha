import Phaser, { Physics } from "phaser";
import { enemies } from "~/enemies/enemies";
import { WRGame } from "../game/game"

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {


        //plugins
        this.load.scenePlugin('AnimatedTiles', 'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');

        this.load.atlas('smoke', "assets/smoke.png", "assets/smoke.json")
        this.load.atlas('clouds', "assets/clouds.png", "assets/clouds.json")
        this.load.atlas('cloudsshadows', "assets/cloudshadows.png", "assets/cloudsshadows.json")

        this.load.image("tiles3", "tileset/tiles/allbiomes.png")
        this.load.image("Dirt", "tileset/tiles/dirt/Dirt.png")
        this.load.image("DirtLand", "tileset/tiles/dirt/DirtLand.png")
        this.load.image("DirtRock", "tileset/tiles/dirt/DirtRock.png")
        this.load.image("rain", "assets/rain.png")

        this.load.image("OceanAnimated", "tileset/tiles/ocean/OceanAnimated.png")

        this.load.tilemapTiledJSON("allbiomes", "tileset/tilemap/tilemap.json");

        // this.load.image('cave', 'tileset/cavebiome/CB-LandTileset.png')
        // this.load.tilemapTiledJSON("allbiomesjson", "tiles/tilemapallbiomes.json");

        this.load.image('window1', "assets/window1.png")

        this.load.atlas('buildings32', "assets/buildings32.png", "assets/buildings32.json")
        this.load.atlas('waterfall', "assets/waterfall.png", "assets/waterfall.json")

        this.load.atlas('buildings16', "assets/buildings16.png", "assets/buildings16.json")
        this.load.atlas('treasures', "assets/treasures.png", "assets/treasures.json")
        this.load.atlas('firecolumn', "assets/firecolumn.png", "assets/firecolumn.json")
        //items and icons
        this.load.atlas('coin', "assets/coin.png", "assets/coin.json")
        this.load.atlas('arrows', "assets/arrows.png", "assets/arrows.json")

        //player spritesheet for overworld
        this.load.atlas('playeroverworld', "character/playeroverworld.png", "character/playeroverworld.json")

        //player head pngs
        this.load.atlas("playerheads", "assets/heads.png", "assets/heads.json")

        this.load.image("emptyheart", "character/ui_heart_empty.png")
        this.load.image("fullheart", "character/ui_heart_full.png")

        //informational
        this.load.image("info", "assets/keysinformationwindow1.png")

        //ui
        this.load.image("scrollsmall", "assets/scroll28x10.png")
        this.load.image("tavern", "assets/Tavern.png")
        this.load.image("border", "assets/border.png")
        this.load.image("titlegraphic", "assets/TitleGraphic.png")
        this.load.image("chooseavatarbg", "assets/chooseavatarbg.png")

        //ui-enterbutton
        this.load.image("enter-btn-up", "assets/enter-1.png")
        this.load.image("enter-btn-down", "assets/enter-0.png")

        //ui-fightbutton
        this.load.image("fight-btn-up", "assets/fight-1.png")
        this.load.image("fight-btn-down", "assets/fight-0.png")

        //particles
        this.load.image("blueparticle", "assets/blue.png")

        enemies.forEach(enemy => {
            this.load.atlas(enemy.name, enemy.PathToPNG, enemy.PathToJSON)
        })

        this.load.audio('ratsound', ["assets/sounds/rat/ratscream.mp3"])
        this.load.audio('knifeswipe', ["assets/knifeSwipe2.mp3"])


        this.load.audio('Forest1', ["assets/Forest1.mp3"])
        this.load.audio('Forest2', ["assets/Forest2.mp3"])
        this.load.audio('step1', ["assets/footstep01.mp3"])
        this.load.audio('step2', ["assets/footstep02.mp3"])
        this.load.audio('step3', ["assets/footstep03.mp3"])
        this.load.audio('step4', ["assets/footstep04.mp3"])

        this.load.audio('doorOpen', ["assets/doorOpen_2.ogg"])
        this.load.audio('doorClose', ["assets/doorClose_4.ogg"])

        this.load.audio('music2', ["assets/music2.mp3"])
        this.load.audio('peoplewithouthope', ["assets/sounds/music/peoplewithouthope.mp3"])
        this.load.audio('ruinedworld', ["assets/sounds/music/ruinedworld.mp3"])
        this.load.audio('maintitle', ["assets/sounds/music/maintitle.mp3"])

        this.load.audio('gato', ["assets/sounds/music/gatossongtrimmed.mp3"])

    }

    create() {
        //loads true type fonts, do not remove!!!
        loadfont(this)

        let wrGame: WRGame = {
            isStarted: true,
            playerName: "Player",
            playerHead: "heads-1.png",
            hasIntroStarted: false,
        }

        this.scene.start("OverworldTitle", wrGame);
        /*    this.scene.start("Overworld", wrGame); */

    }
}
function loadfont(scene: any) {
    scene.add.text(42, 470, ".", {
        fontSize: "20px",
        fontFamily: "breathfire",
        color: "#77F8FF",

    }).setAlpha(0);
}