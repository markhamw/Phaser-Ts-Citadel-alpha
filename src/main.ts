import Phaser, { AUTO } from 'phaser'
import Citadel from './scenes/Citadel'
import Preloader from './scenes/Preloader'
import Titlescene from './scenes/Titlescene'
import Splash from './scenes/Splash'
import Overworld from './scenes/Overworld'
import PlayerNameAndPortrait from './scenes/PlayerNameAndPortrait'

export default new Phaser.Game(
	{
	scene: [Preloader,PlayerNameAndPortrait,Titlescene,Splash,Overworld],
	type: Phaser.WEBGL,
	autoFocus: true,
	//backgroundColor: '0x000000',
	backgroundAlpha: .5,
	antialias:false,
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
	
	disableContextMenu:true,
	

})
