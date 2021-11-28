import Phaser, { AUTO } from 'phaser'
import Preloader from './scenes/Preloader'
import OverworldTitle from './scenes/OverworldTitle'
import Chapter1 from './scenes/Chapter1'

export default new Phaser.Game(
	{
		scene: [Preloader, OverworldTitle, Chapter1],
		type: Phaser.WEBGL,
		autoFocus: true,
		//backgroundColor: '0x000000',
		backgroundAlpha: .5,
		antialias: false,
		scale: {
			parent: 'app',
			mode: Phaser.Scale.FIT,
			width: 500,
			height: 500,
			autoCenter: Phaser.Scale.Center,
		},
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },

				debug: false,
			}
		},

		disableContextMenu: true,


	})
