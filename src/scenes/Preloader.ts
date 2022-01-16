import Phaser, { Physics } from "phaser";
import { enemies } from "~/enemies/enemies";
import { WRGame } from "../game/game"

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        this.load.atlas('smoke', "assets/smoke.png", "assets/smoke.json")
        this.load.atlas('clouds', "assets/clouds.png", "assets/clouds.json")
        this.load.atlas('cloudsshadows', "assets/cloudshadows.png", "assets/cloudsshadows.json")
        this.load.image("tiles3", "tiles/allbiomes.png")

        this.load.tilemapTiledJSON("allbiomes", "tiles/tilemap.json");

        this.load.image('window1', "assets/window1.png")

        this.load.atlas('buildings32', "assets/buildings32.png", "assets/buildings32.json")

        this.load.atlas('buildings16', "assets/buildings16.png", "assets/buildings16.json")
        this.load.atlas('treasures', "assets/treasures.png", "assets/treasures.json")

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
        this.load.image("e_up", "assets/e_up.png")
        this.load.image("e_down", "assets/e_down.png")
        //ui-enterbutton
        this.load.image("enter_up", "assets/enter-up.png")
        this.load.image("enter_down", "assets/enter-down.png")

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


    }

    create() {

        let wrGame: WRGame = {
            isStarted: true,
            playerName: "Player",
            playerHead: "heads-1.png",
            hasIntroStarted: false
        }

        this.scene.start("OverworldTitle", wrGame);
        /*    this.scene.start("Overworld", wrGame); */

    }
}
