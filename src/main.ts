import Phaser, { AUTO } from 'phaser'
import Preloader from './scenes/Preloader'
import OverworldTitle from './scenes/OverworldTitle'
import Overworld from './scenes/Overworld'
import SouthArea from './scenes/SouthArea'
import PlayerSpeak from './scenes/PlayerSpeak'

export default new Phaser.Game(
	{
		scene: [Preloader, OverworldTitle, Overworld, SouthArea, PlayerSpeak],
		type: Phaser.WEBGL,
		autoFocus: true,
		antialias: false,
		scale: {
			parent: 'app',
			mode: Phaser.Scale.FIT,
			width: 512,
			height: 512,
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
