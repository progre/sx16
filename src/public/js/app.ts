/// <reference path="main.d.ts" />
require("babel-polyfill");
import Logo from "./state/logo";
import Title from "./state/title";

window.addEventListener("DOMContentLoaded", () => {
    let game = new Phaser.Game(1280, 720, Phaser.AUTO, parent)
    game.state.add("logo", new Logo(game));
    game.state.add("title", new Title(game));
    game.state.start("title");
});
