/// <reference path="../enchant.d.ts"/>
declare var Core: any;

module Prgr {
    export class EnchantWrapper {
        game: enchant.Core;

        constructor(preloads: any) {
            this.game: enchant.Core = new Core(320, 320);
            this.game.fps = 60;
            this.game.preload(preloads);
            this.game.onload = function () {
            };
            this.game.start();
        }

        messageLoop(action: Function) {
            this.game.addEventListener('enterframe', action);
        }
    }
}
