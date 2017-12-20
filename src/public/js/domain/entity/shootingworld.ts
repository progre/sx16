/// <reference path="player.ts"/>
/// <reference path="enemy.ts"/>
/// <reference path="shot.ts"/>
/// <reference path="eventtarget.ts"/>
/// <reference path="../../linq.js.d.ts"/>
/// <reference path="../../utils.ts"/>

module Prgr {
    export class ShootingWorld {
        static CLEARED = "cleared";
        static FAILED = "failed";

        private eventTarget: EventTarget;
        player = new Player;
        private playerShots: Shot[] = [];
        private shots: Shot[] = [];

        constructor(public enemies: Enemy[]) {
            this.eventTarget = new EventTarget(this);

            this.player.addEventListener(Player.SHOT, () =>
                this.playerShots.push(new Shot(
                    new Direction8(8), this.player.point.shift(0, -17), false)));
            this.player.addEventListener(Character.DIED, () =>
                this.eventTarget.dispatchEvent(ShootingWorld.FAILED));
            this.enemies.forEach(enemy =>
            {
                enemy.addEventListener(Enemy.SHOT, () =>
                    this.shots.push(new Shot(enemy.direction, // ここのenemyってイベント時もちゃんと生きるのか？
                        enemy.point, enemy.type == EnemyType.SILVER)));
                enemy.addEventListener(Character.DETERMINED, () =>
                {
                    if (this.player.life > 0 && this.enemies.every(x => x.life == -1)) {
                        this.eventTarget.dispatchEvent(ShootingWorld.CLEARED);
                    }
                });
            });
        }

        allHitCount(): number {
            return Enumerable.from(this.enemies).sum(
                x => x.Type == EnemyType.SILVER
                || x.Type == EnemyType.GOLD
                ? 2 : 1);
        }

        getShots(): Shot[] {
            return Enumerable.from(this.shots).concat(this.playerShots).toArray();
        }

        addEventListener(type: string, listener: Function) {
            this.eventTarget.addEventListener(type, listener);
        }

        removeEventListener(type: string, listener: Function) {
            this.eventTarget.removeEventListener(type, listener);
        }

        update(input: Input) {
            this.player.update2(input, this.playerShots.length < 7);
            if (randomInt(50) == 0) {
                var list = this.enemies
                    .filter(x => !x.go && x.life > 0);
                if (list.length > 0)
                    list[randomInt(list.length)].toGo();
            }
            this.enemies.forEach(enemy => {
                enemy.update2(this.player.point);
            });
            Enumerable.from(this.playerShots).toArray().forEach((shot: Shot) => {
                shot.update(this.player.point);
                if (isOutOfStage(shot)) {
                    remove(this.playerShots, shot);
                    return;
                }
                var hitEnemy: Enemy = Enumerable.from(this.enemies)
                    .firstOrDefault((x: Enemy) => x.hitTestPoint(shot.point));
                if (hitEnemy == null)
                    return;
                hitEnemy.damage();
                remove(this.playerShots, shot);
            });
            Enumerable.from(this.shots).toArray().forEach((shot: Shot) => {
                shot.update(this.player.point);
                if (isOutOfStage(shot)) {
                    remove(this.shots, shot);
                    return;
                }
                if (!this.player.hitTestPoint(shot.point))
                    return;
                this.player.damage();
                remove(this.shots, shot);
            });
            if (Enumerable.from(this.enemies).any((x: Enemy) => this.player.hitTestEnemy(x))) {
                this.player.damage();
            }
        }
    }
    private isOutOfStage(shot: Shot) {
        var point = shot.point;
        return point.x < 0 || Point.WIDTH - 1 < point.x
            || point.y < 0 || Point.HEIGHT - 1 < point.y;
    }
}