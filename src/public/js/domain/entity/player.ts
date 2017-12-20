/// <reference path="character.ts"/>
/// <reference path="../valueobject/input.ts"/>

module Prgr {
    private ENEMY_AREA = 180;
    private SPEED = 3;

    export class Player extends Character {
        static SHOT = "shot";

        private firstTime = true;
        private reloadTime = 0;
        shotCount = 0;

        update2(input: Input, canShot: bool): void {
            super.update();
            if (this.life <= 0)
                return;
            var direction: number;
            if (this.firstTime) {
                direction = input.direction;
                this.firstTime = false;
            }
            else {
                direction = input.directionToggled ? input.direction : 0;
            }
            var shot = input.shotToggled && input.shot;

            if (direction > 0)
                this.direction = new Direction8(direction);
            if (this.reloadTime == 0) {
                if (canShot && shot) {
                    this.eventTarget.dispatchEvent(Player.SHOT);
                    this.shotCount++;
                    this.reloadTime = 8;
                }
            }
            else {
                this.reloadTime--;
            }

            switch (this.direction.value) {
                case 7:
                case 4:
                case 1:
                    this.point.x -= SPEED;
                    break;
                case 9:
                case 6:
                case 3:
                    this.point.x += SPEED;
                    break;
            }
            switch (this.direction.value) {
                case 7:
                case 8:
                case 9:
                    this.point.y -= SPEED;
                    break;
                case 1:
                case 2:
                case 3:
                    this.point.y += SPEED;
                    break;
            }
            if (this.point.y < ENEMY_AREA)
                this.point.y = ENEMY_AREA;
            if (this.point.y >= Point.HEIGHT - Character.SAFE_AREA)
                this.point.y = Point.HEIGHT - Character.SAFE_AREA - 1;
            if (this.point.x >= Point.WIDTH - Character.SAFE_AREA)
                this.point.x = Point.WIDTH - Character.SAFE_AREA - 1;
            if (this.point.x < Character.SAFE_AREA)
                this.point.x = Character.SAFE_AREA;

        }

        hitTestEnemy(enemy: Enemy) {
            if (this.life <= 0)
                return false;
            if (enemy.life <= 0)
                return false;
            var point = enemy.point;
            var halfSize = 17;
            return this.point.x - halfSize < point.x && point.x < this.point.x + halfSize
                && this.point.y - halfSize < point.y && point.y < this.point.y + halfSize;
        }
    }
}
