/// <reference path="../../utils.ts"/>
/// <reference path="character.ts"/>

module Prgr {
    private VECTOR_MAX = 4;
    private TURN_TIME = 12;
    private SPEED = 2;
    private SKEW_SPEED = 1; // 1.414

    export class Enemy extends Character {
        static SHOT = "shot";

        go: bool;
        frame: number;
        vectorX: number;
        private state: MovingState = new GroupMove();

        constructor(public type: string, point: Point) {
            super();
            super.point = point;
            if (type === EnemyType.SILVER || type === EnemyType.GOLD)
                super.life = 2;
        }

        toGo() {
            this.go = true;
        }

        update2(playerPoint: Point): void {
            super.update();
            if (this.life <= 0)
                return;
            this.frame++;
            this.state = this.state.preUpdate(this);
            this.state.update(this, playerPoint);

            // s“®”ÍˆÍ§ŒÀ
            if (this.point.y >= Point.HEIGHT)
                this.point.y -= Point.HEIGHT;
            if (this.point.x >= Point.WIDTH - 13) {
                this.point.x = Point.WIDTH - 13 - 1;
                this.vectorX = 0;
            }
            if (this.point.x < 13) {
                this.point.x = 13;
                this.vectorX = 0;
            }
        }

        score() {
            var score = 0;
            switch (this.type) {
                case EnemyType.GREEN:
                    score = 100;
                    break;
                case EnemyType.BLUE:
                    score = 200;
                    break;
                case EnemyType.RED:
                    score = 300;
                    break;
                case EnemyType.SILVER:
                    score = 400;
                    break;
                case EnemyType.GOLD:
                    score = 500;
                    break;
            }
            return score * this.state.scoreMultiply();
        }
    }

    export class EnemyType {
        static GREEN = "green";
        static BLUE = "blue";
        static RED = "red";
        static SILVER = "silver";
        static GOLD = "gold";
    }

    export interface MovingState {
        preUpdate(parent: Enemy): MovingState;
        update(parent: Enemy, playerPoint: Point): void;
        scoreMultiply(): number;
    }

    class GroupMove implements MovingState {
        preUpdate(parent: Enemy): MovingState {
            if (!parent.go) {
                return this;
            }
            parent.frame = 0;
            if (randomInt(2) === 0)
                return new TurnLeftMove();
            else
                return new TurnRightMove();
        }

        update(parent: Enemy): void {
            var myFrame = parent.frame % 140;
            if (myFrame < 35) {
                parent.point.x += SPEED;
            }
            else if (myFrame < 35 + 70) {
                parent.point.x -= SPEED;
            }
            else {
                parent.point.x += SPEED;
            }
        }

        scoreMultiply() {
            return 1;
        }
    }

    class TurnMove implements MovingState {
        preUpdate(parent: Enemy): MovingState {
            if (parent.frame < TURN_TIME * 4) {
                return this;
            }
            parent.direction = new Direction8(2);
            parent.frame = 0;
            return new AttackMove;
        }

        update(parent: Enemy, playerPoint: Point): void { }

        scoreMultiply() {
            return 2;
        }

        /** @protected */
        turnMove(parent: Enemy) {
            switch (parent.direction.value) {
                case 8:
                    parent.point.y -= SPEED;
                    break;
                case 7:
                    parent.point.x -= SKEW_SPEED;
                    parent.point.y -= SKEW_SPEED;
                    break;
                case 9:
                    parent.point.x += SKEW_SPEED;
                    parent.point.y -= SKEW_SPEED;
                    break;
                case 4:
                    parent.point.x -= SPEED;
                    break;
                case 6:
                    parent.point.x += SPEED;
                    break;
                case 1:
                    parent.point.x -= SKEW_SPEED;
                    parent.point.y += SKEW_SPEED;
                    break;
                case 3:
                    parent.point.x += SKEW_SPEED;
                    parent.point.y += SKEW_SPEED;
                    break;
            }
        }
    }

    class TurnLeftMove extends TurnMove {
        update(parent: Enemy): void {
            parent.direction = new Direction8(
                parent.frame < TURN_TIME ? 8
                : parent.frame < TURN_TIME * 2 ? 7
                : parent.frame < TURN_TIME * 3 ? 4
                : 1);
            this.turnMove(parent);
        }
    }

    class TurnRightMove extends TurnMove {
        update(parent: Enemy): void {
            parent.direction = new Direction8(
                parent.frame < TURN_TIME ? 8
                : parent.frame < TURN_TIME * 2 ? 9
                : parent.frame < TURN_TIME * 3 ? 6
                : 3);
            this.turnMove(parent);
        }
    }

    class AttackMove implements MovingState {
        preUpdate(parent: Enemy): MovingState {
            if (parent.type !== EnemyType.GOLD || randomInt(85) !== 0) {
                return this;
            }
            parent.vectorX = 0;
            parent.frame = 0;
            return new SpinAttackMove;
        }

        update(parent: Enemy, playerPoint: Point): void {
            // ˆÚ“®
            if (parent.point.x < playerPoint.x)
                parent.vectorX += parent.type === EnemyType.BLUE ? 0.2 : 0.1;
            else if (parent.point.x > playerPoint.x)
                parent.vectorX -= parent.type === EnemyType.BLUE ? 0.2 : 0.1;
            if (parent.vectorX > VECTOR_MAX)
                parent.vectorX = VECTOR_MAX;
            else if (parent.vectorX < -VECTOR_MAX)
                parent.vectorX = -VECTOR_MAX;
            parent.point.y += SPEED;
            parent.point.x += parent.vectorX;

            // ù‰ñ
            if (parent.type === EnemyType.BLUE
                || parent.type == EnemyType.RED
                || parent.type == EnemyType.SILVER) {
                var radian = getRadian(parent.point, playerPoint);
                parent.direction = Direction8.FromRadian(radian);
                if (parent.type == EnemyType.BLUE
                    || parent.type == EnemyType.SILVER) {
                    switch (parent.direction.value) {
                        case 8:
                            parent.direction = new Direction8(2);
                            break;
                        case 7:
                        case 4:
                            parent.direction = new Direction8(1);
                            break;
                        case 9:
                        case 6:
                            parent.direction = new Direction8(3);
                            break;
                    }
                }
            }

            // UŒ‚
            if (randomInt(100) == 0)
                parent.eventTarget.dispatchEvent(Enemy.SHOT);
        }

        scoreMultiply() {
            return 2;
        }
    }

    class SpinAttackMove implements MovingState {
        preUpdate(parent: Enemy): MovingState {
            if (parent.direction.value !== 2 || randomInt(10) !== 0) {
                return this;
            }
            return new AttackMove;
        }

        update(parent: Enemy): void {
            if (parent.frame == 0)
                parent.eventTarget.dispatchEvent(Enemy.SHOT);
            if (parent.frame < 3)
                return;
            parent.direction = parent.direction.turnRight();
            parent.frame = -1;
        }

        scoreMultiply() {
            return 4;
        }
    }

    private getRadian(source: Point, target: Point): number {
        var relative = target.shift(-source.x, -source.y);
        return Math.atan2(relative.y, relative.x);
    }
}