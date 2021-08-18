import Phaser from 'phaser'
import Citadel from './scenes/Citadel'
import Preloader from './scenes/Preloader'

export default new Phaser.Game({
	scene: [Preloader, Citadel],
	type: Phaser.WEBGL,
	width: 1010,
	height: 540,
	
	backgroundColor: '0x393929',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },

		debug: false,
		}
	},
	scale: {
		zoom:2,
	},

})
