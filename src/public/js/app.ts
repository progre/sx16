/// <reference path="main.d.ts" />
require("babel-polyfill");
const delay: (ms: number) => Promise<void> = require("delay");
import renderer from "./infrastructure/renderer";

class Logo {
    constructor(private game: Phaser.Game) {
    }

    preload() {
        this.game.load.image("logo", "res/logo.png");
    }

    create() {
        let logo = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY,
            "logo");
        logo.anchor.setTo(0.5, 0.5);
        logo.alpha = 0;
        let logoTween = this.game.add.tween(logo)
            .to({ alpha: 1 }, 400)
            .to({ alpha: 0 }, 400, null, false, 1700)
        logoTween.onComplete.add(() => this.game.state.start("title"))
        logoTween.start();
    }
}

class Title {
    constructor(private game: Phaser.Game) {
    }

    preload() {
        this.game.load.image("title1", "res/title1.png");
        this.game.load.image("title2", "res/title2.png");
        this.game.load.audio("miss", "res/miss.mp3")
    }

    create() {
        let title2 = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY,
            "title2");
        title2.visible = false;
        title2.anchor.setTo(0.5, 0.5);
        let title1 = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY,
            "title1");
        title1.visible = false;
        title1.anchor.setTo(0.5, 0.5);
        let sound = this.game.add.audio("miss");
        (async () => {
            await delay(10 * 16);
            title1.visible = true;
            sound.play();
            await delay(100 * 16);
            title2.visible = true;
            sound.play();
            await delay(20 * 16);
        })();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let game = new Phaser.Game(1280, 720, Phaser.AUTO, parent)
    game.state.add("logo", new Logo(game));
    game.state.add("title", new Title(game));
    game.state.start("logo");
});
