/// <reference path="../valueobject/direction8.ts"/>
/// <reference path="../valueobject/point.ts"/>
/// <reference path="eventtarget.ts"/>

module Prgr {
    private DETERMINE_TIME = 25;

    export class Character {
        static DETERMINED = "determined";
        static DIED = "died";
        static DAMAGED = "damaged";

        /** @protected */
        static SAFE_AREA = 17;
        point = new Prgr.Point(250, 400);
        /** 0=éÄñS -1=è¡ñ≈ */
        life = 1;
        direction = new Prgr.Direction8(8);
        /** @protected */
        eventTarget: Prgr.EventTarget;
        private deadTime = -1;

        constructor() {
            this.eventTarget = new Prgr.EventTarget(this);
        }

        addEventListener(type: string, listener: Function) {
            this.eventTarget.addEventListener(type, listener);
        }

        removeEventListener(type: string, listener: Function) {
            this.eventTarget.removeEventListener(type, listener);
        }

        update() {
            if (this.life <= -1 || 0 < this.life)
                return;

            if (this.life === 0 && this.deadTime < DETERMINE_TIME) {
                this.deadTime++;
            }
            if (this.deadTime != DETERMINE_TIME)
                return;
            this.life = -1;
            this.eventTarget.dispatchEvent(Character.DETERMINED);
        }

        damage() {
            this.life--;
            if (this.life > 0)
                this.eventTarget.dispatchEvent(Character.DAMAGED);
            else
                this.eventTarget.dispatchEvent(Character.DIED);
        }

        hitTestPoint(point: Point) {
            if (this.life <= 0)
                return false;
            var HALF_SIZE = 17;
            return this.point.x - HALF_SIZE < this.point.x
                && this.point.x < this.point.x + HALF_SIZE
                && this.point.y - HALF_SIZE < this.point.y
                && this.point.y < this.point.y + HALF_SIZE;
        }
    }
}