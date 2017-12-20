/// <reference path="stagefactory.ts"/>
/// <reference path="shootingworld.ts"/>
/// <reference path="../../infrastructure/stagedata.ts"/>

module Prgr {
    private CLEARED_TIME = 50;
    private FAILED_TIME = 50;

    export class ShootingGame {
        cleared = false;
        failed = false;
        world: ShootingWorld;
        //soundManager: SoundManager; // todo
        time = 3 * 60 * 1000; // 3分(ms)
        score = 0;
        stageNo = 0;
        missCount = 0;
        private stageFactory: StageFactory;
        private intervalFrame = -1;
        private newWorld = true;
        private secondTimeKeeper = 0;
        private allHitCount = 0;
        private shotCountHistory = 0;
        private allClear = false;

        constructor(private isEx: bool) {
            this.stageFactory = StageFactory.fromData(!isEx ? normalStage() : extraStage());
        }

        totalHitRatioPercent() {
            return this.shotCountHistory == 0 ? 0 : this.allHitCount * 100 / this.shotCountHistory;
        }

        hitRatioPercent() {
            return this.world.player.shotCount == 0
                ? 0
                : this.world.allHitCount() * 100 / this.world.player.shotCount;
        }

        bonusTime() {
            var hitRatio = this.hitRatioPercent();
            if (hitRatio >= 100)
                return 15;
            if (hitRatio >= 90)
                return 10;
            if (hitRatio >= 80)
                return 7;
            if (hitRatio >= 70)
                return 5;
            return 0;
        }

        update(input: Input) {
            if (this.time <= 0) {
                this.time = 0;
                if (input.shareToggled && input.share) {
                    var text =
                        (this.isEx ? "SCARLEX'13 EXTRA" : "SCARLEX'13")
                        + " Score: " + this.score
                        + " Level: " + (this.allClear ? "★" : "" + (this.stageNo + 1))
                        + " Ratio: " + this.totalHitRatioPercent
                        + "% Miss: " + this.missCount;
                    //todo                    Process.Start("https://twitter.com/intent/tweet?text=" + Uri.EscapeUriString(text) + "&hashtags=scarlex13");
                }
                return;
            }
            if (this.newWorld) {
                this.createWorld();
                this.newWorld = false;
            }

            if (!this.cleared) {
                // １フレームの時間は17ms, 17ms, 16ms
                if (this.secondTimeKeeper < 2) {
                    this.time -= 17;
                }
                else {
                    this.time -= 16;
                    this.secondTimeKeeper = 0;
                }

                this.world.update(input);
                if (!this.failed)
                    return;
            }
            this.intervalFrame++;
            if (this.cleared && this.intervalFrame > CLEARED_TIME) {
                if (this.stageNo === this.stageFactory.lastStage()) {
                    this.allClear = true;
                    //new File().SaveExFlag(); todo exフラグどこに保存すればいいんだ?
                }
                else
                    this.stageNo++;
                this.newWorld = true;
                return;
            }
            if (this.failed && this.intervalFrame > FAILED_TIME) {
                this.missCount++;
                this.time -= 10 * 1000;
                this.newWorld = true;
                return;
            }
        }

        createWorld() {
            if (this.cleared && this.world != null) {
                this.allHitCount += this.world.allHitCount();
                this.shotCountHistory += this.world.player.shotCount;
            }
            this.cleared = false;
            this.failed = false;
            this.intervalFrame = -1;
            this.world = new ShootingWorld(this.stageFactory.getEnemies(this.stageNo));
            this.world.addEventListener(ShootingWorld.CLEARED, () =>
            {
                this.cleared = true;
                this.time += this.bonusTime() * 1000;
            });
            this.world.addEventListener(ShootingWorld.FAILED, () => this.failed = true);
            this.world.enemies.forEach(enemy => {
                enemy.addEventListener(Character.DAMAGED, () =>
                {
                    switch (enemy.type) // ここのenemyって生きてるのｋ
                    {
                        case EnemyType.SILVER:
                            this.score += 50;
                            break;
                        case EnemyType.GOLD:
                            this.score += 100;
                            break;
                    }
                });
                enemy.addEventListener(Character.DIED, () =>
                {
                    this.score += enemy.score();
                });
            });
        }
    }
}
