import Phaser from 'phaser'
import Citadel from './scenes/Citadel'
import Preloader from './scenes/Preloader'

export default new Phaser.Game({
	scene: [Preloader, Citadel],
	type: Phaser.WEBGL,
	width: 1920,
	height: 1080,
	backgroundColor: '0x000000',
	
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },

		debug: true,
		}
	},
	//scale: {
	//	zoom:2,
	//},

})
