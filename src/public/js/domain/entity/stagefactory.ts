/// <reference path="../valueobject/point.ts"/>
/// <reference path="enemy.ts"/>

module Prgr {
    export class StageFactory {
        static fromData(data: string): StageFactory {
            var list = [];
            var queue: number[] = []; // キーコードの配列
            //            foreach(char c in data)
            for (var i = 0, len = data.length; i < len; i++) () => {
                var c = data.charCodeAt(i);
                if (isNumber(c)) {
                    queue.push(c);
                    return; // continue
                }
                if (queue.length > 0) {
                    var str = "";
                    queue.map(x => String.fromCharCode(x)).forEach(x => str += x);
                    list.push(parseInt(str));
                    queue = [];
                }
                list.push(String.fromCharCode(c));
            };

            var stages: { enemyType: string; point: Point; }[][] = [];
            var enemies: { enemyType: string; point: Point; }[] = [];
            var enemy: number[] = [];
            list.forEach(o => {
                if (typeof o === 'number') {// 数値
                    enemy.push(o);
                    return; //continue
                }
                // 異常値判定
                //if (!(o is char))
                //{
                //    enemy.Clear();
                //    continue;
                //}
                var c = o;
                if (c !== '\n')
                    return; //continue
                if (enemy.length === 0 && enemies.length > 0) {
                    stages.push(enemies);
                    enemies = [];
                    return;  //continue
                }
                if (enemy.length < 3) { // 異常
                    console.log('invalid enemydata');
                    enemy = [];
                    return; //continue
                }
                enemies.push({
                    enemyType: toEnemyType(enemy[0]),
                    point: new Point(enemy[1], enemy[2])
                });
                enemy = [];
            });
            return new StageFactory(stages);
        }

        constructor(private stages: { enemyType: string; point: Point; }[][]) {
        }

        getEnemies(stageNo: number): Enemy[] {
            return this.stages[stageNo]
                .map(x => new Enemy(
                    x.enemyType,
                    x.point));
        }

        lastStage(): number {
            return this.stages.length - 1;
        }

        // エディタ系は未実装
    }

    private isNumber(c: number): bool {
        return '0'.charCodeAt(0) <= c && c <= '9'.charCodeAt(0);
    }

    private toEnemyType(i: number): string {
        switch (i) {
            case 1:
                return EnemyType.GREEN;
            case 2:
                return EnemyType.BLUE;
            case 3:
                return EnemyType.RED;
            case 4:
                return EnemyType.SILVER;
            case 5:
                return EnemyType.GOLD;
            default:
                return "";
        }
    }
}
