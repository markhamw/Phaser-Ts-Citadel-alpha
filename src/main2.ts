import Phaser, { AUTO } from 'phaser'
import Citadel from './scenes/Citadel'
import Preloader from './scenes/Preloader'
import Titlescene from './scenes/Titlescene'

export default new Phaser.Game({
	scene: [Preloader,Titlescene],
	type: Phaser.WEBGL,
	width: 1920,
	height: 100,
	autoFocus: true,
	backgroundColor: '0xFFFFFF',
	
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
