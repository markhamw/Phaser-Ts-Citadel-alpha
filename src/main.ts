import Phaser, { AUTO } from 'phaser'
import Citadel from './scenes/Citadel'
import Preloader from './scenes/Preloader'
import Titlescene from './scenes/Titlescene'

export default new Phaser.Game({
	scene: [Preloader, Titlescene,Citadel],
	type: Phaser.WEBGL,
	width: 1920,
	height: 1080,
	autoFocus: true,
	backgroundColor: '0x000000',
	
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },

		debug: false,
		}
	},
	scale: {
		zoom:1,
	},
	disableContextMenu:true,
	
})
