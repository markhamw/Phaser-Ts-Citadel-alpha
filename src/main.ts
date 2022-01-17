import Phaser, { AUTO } from 'phaser'
import Preloader from './scenes/Preloader'
import OverworldTitle from './scenes/OverworldTitle'
import Overworld from './scenes/Overworld'

export default new Phaser.Game(
	{
		scene: [Preloader, OverworldTitle, Overworld],
		type: Phaser.WEBGL,
		autoFocus: true,
		//backgroundColor: '0x000000',
		antialias: false,
		scale: {
			parent: 'app',
			mode: Phaser.Scale.FIT,
			width: 500,
			height: 500,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH,
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
