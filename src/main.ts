import Phaser from 'phaser'
import Citadel from './scenes/Citadel'
import Preloader from './scenes/Preloader'

export default new Phaser.Game({
	scene: [Preloader, Citadel],
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#333333',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		}
	},
	scale: {
		zoom:3,
	},

})
