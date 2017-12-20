module Prgr {
    export class Input {
        constructor(
            public direction: number,
            public directionToggled: bool,
            public shot: bool,
            public shotToggled: bool,
            public share: bool,
            public shareToggled: bool) {
        }
    }
}
