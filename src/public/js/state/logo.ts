export default class Logo {
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
