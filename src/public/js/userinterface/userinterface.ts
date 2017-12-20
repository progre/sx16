/// <reference path="../domain/entity/shootinggame.ts"/>
/// <reference path="../infrastructure/enchantwrapper.ts"/>
/// <reference path="../infrastructure/realtimeinput.ts"/>
/// <reference path="logo.ts"/>

module Prgr {
    class UserInterface {
        private game: ShootingGame;
        private input: RealtimeInput;
        private logo: Logo = new Logo();
        private enchantWrapper = new EnchantWrapper([]);
        private renderer: Renderer;
        private soundManager = null; //todo
        private title = null; //todo
        private view = null; //todo
        private current: () => bool;

        constructor() {
            this.renderer = new Renderer(this.enchantWrapper.game);
            this.title = null;
        }
    }
}
