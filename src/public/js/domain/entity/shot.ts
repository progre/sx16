/// <reference path="../valueobject/direction8.ts"/>
/// <reference path="../valueobject/point.ts"/>

module Prgr {
    private SPEED = 5;
    private SKEW_SPEED = SPEED / 1.41421356;

    export class Shot {
        private homingState: number;
        private frame: number;

        constructor(
            public direction: Direction8,
            public point: Point,
            private homing: bool) {
        }

        update(playerPoint: Point) {
            if (this.homing) {
                switch (this.homingState) {
                    case 0:
                        if (this.point.y >= playerPoint.y) {
                            this.direction = new Direction8(5);
                            this.homingState = 1;
                        }
                        break;
                    case 1:
                        this.frame++;
                        if (this.frame <= 30) {
                            return;
                        }
                        this.direction = new Direction8(
                            this.point.x < playerPoint.x ? 6 : 4);
                        this.homingState = 2;
                        break;
                }
            }

            switch (this.direction.value) {
                case 8:
                    this.point.y -= SPEED;
                    break;
                case 9:
                    this.point.x += SKEW_SPEED;
                    this.point.y -= SKEW_SPEED;
                    break;
                case 6:
                    this.point.x += SPEED;
                    break;
                case 3:
                    this.point.x += SKEW_SPEED;
                    this.point.y += SKEW_SPEED;
                    break;
                case 2:
                    this.point.y += SPEED;
                    break;
                case 1:
                    this.point.x -= SKEW_SPEED;
                    this.point.y += SKEW_SPEED;
                    break;
                case 4:
                    this.point.x -= SPEED;
                    break;
                case 7:
                    this.point.x -= SKEW_SPEED;
                    this.point.y -= SKEW_SPEED;
                    break;
            }
        }
    }
}
