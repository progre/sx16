module Prgr {
    export class Point {
        /** @const */
        static WIDTH = 500;
        /** @const */
        static HEIGHT = 500;

        constructor(public x: number, public y: number) {
        }

        shift(x: number, y: number): Point {
            return new Point(this.x + x, this.y + y);
        }
    }
}
