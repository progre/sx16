const delay: (ms: number) => Promise<void> = require("delay");
import Background from '../view/background';

export default class Title {
    private background: Background;

    constructor(private game: Phaser.Game) {
    }

    preload() {
        this.game.load.image("title1", "res/title1.png");
        this.game.load.image("title2", "res/title2.png");
        this.game.load.audio("miss", "res/miss.mp3")
    }

    create() {
        let bitmapData = this.game.add.bitmapData(this.game.width, this.game.height);
        bitmapData.addToWorld();
        this.background = new Background(
            bitmapData,
            this.game.width,
            this.game.height)
        // let title2 = this.game.add.sprite(
        //     this.game.world.centerX,
        //     this.game.world.centerY,
        //     "title2");
        // title2.visible = false;
        // title2.anchor.setTo(0.5, 0.5);
        // let title1 = this.game.add.sprite(
        //     this.game.world.centerX,
        //     this.game.world.centerY,
        //     "title1");
        // title1.visible = false;
        // title1.anchor.setTo(0.5, 0.5);
        // let sound = this.game.add.audio("miss");
        // (async () => {
        //     await delay(10 * 16);
        //     title1.visible = true;
        //     sound.play();
        //     await delay(100 * 16);
        //     title2.visible = true;
        //     sound.play();
        //     await delay(20 * 16);
        // })();
    }

    update() {
        this.background.render();
    }
}
