/// <reference path="../domain/valueobject/point.ts"/>

export default class Renderer {
    constructor() {
    }

    flip() {
        var scene = this.game.rootScene;
        while ((<any>scene).childNodes.length > 0)
            scene.removeChild(scene.lastChild);
    }

    draw(fileName: string, point: Point, alpha: number): void {
        var sprite = new enchant.Sprite(800, 500);
        sprite.image = this.game.assets[fileName];
        sprite.x = point.x;
        sprite.y = point.y;
        sprite.opacity = alpha / 255;
        this.game.rootScene.addChild(sprite);
    }
}
