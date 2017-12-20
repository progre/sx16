/// <reference path="../domain/valueobject/input.ts"/>

module Prgr {
    export class RealtimeInput {
        private input: any;
        private prevDirection = 5;
        private prevShot = false;
        private prevShare = false;

        constructor(game: any) {
            game.keybind(' '.charCodeAt(0), 'shot');
            game.keybind('T'.charCodeAt(0), 'share');
            this.input = game.input;
        }

        getInput(): Input {
            var nextDirection = getDirection(this.input);
            var directionChanged = this.prevDirection != nextDirection;

            var nextShot = this.input.shot;
            var shotToggled = this.prevShot != nextShot;

            var nextShare = this.input.share;
            var shareToggled = this.prevShare != nextShare;

            var nextInput = new Input(
                nextDirection, directionChanged,
                nextShot, shotToggled,
                nextShare, shareToggled);
            this.prevDirection = nextDirection;
            this.prevShot = nextShot;
            this.prevShare = nextShare;
            return nextInput;
        }
    }

    private getDirection(input: any): number {
        var v = input.up && input.down ? 0
            : input.up ? -1
            : input.down ? 1
            : 0;
        var h = input.left && input.right ? 0
            : input.left ? -1
            : input.right ? 1
            : 0;
        switch (v) {
            case -1:
                switch (h) {
                    case -1: return 7;
                    case 0: return 8;
                    default: return 9;
                }
            case 0:
                switch (h) {
                    case -1: return 4;
                    case 0: return 5;
                    default: return 6;
                }
            default:
                switch (h) {
                    case -1: return 1;
                    case 0: return 2;
                    default: return 3;
                }
        }
    }
}
