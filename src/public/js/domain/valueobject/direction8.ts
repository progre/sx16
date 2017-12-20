module Prgr {
    private DIRECTIONS = [8, 9, 6, 3, 2, 1, 4, 7];

    export class Direction8 {
        static FromRadian(rad: number) {
            var PI_PAR_8 = Math.PI / 8;
            if (rad < -PI_PAR_8 * 7) return new Direction8(7);
            if (rad < -PI_PAR_8 * 5) return new Direction8(8);
            if (rad < -PI_PAR_8 * 3) return new Direction8(9);
            if (rad < PI_PAR_8) return new Direction8(6);
            if (rad < PI_PAR_8 * 3) return new Direction8(3);
            if (rad < PI_PAR_8 * 5) return new Direction8(2);
            if (rad < PI_PAR_8 * 7) return new Direction8(1);
            if (rad < PI_PAR_8 * 9) return new Direction8(4);
            return new Direction8(7);
        }

        constructor(public value: number) {
        }

        turnLeft(): Direction8 {
            var index = DIRECTIONS.indexOf(this.value) + 1;
            if (index >= DIRECTIONS.length)
                index -= DIRECTIONS.length;
            return new Direction8(DIRECTIONS[index]);
        }

        turnRight(): Direction8 {
            var index = DIRECTIONS.indexOf(this.value) - 1;
            if (index < 0)
                index += DIRECTIONS.length;
            return new Direction8(DIRECTIONS[index]);
        }

        getEarliest(target: Direction8): number            {
            var ti = DIRECTIONS.indexOf(target.value);
            var ci = DIRECTIONS.indexOf(this.value);
            var i = ti - ci;
            if (i < 0)
                i += DIRECTIONS.length;
            else if (i >= DIRECTIONS.length)
                i -= DIRECTIONS.length;
            if (i < 4)
                return 1;
            else if (i != 4)
                return -1;
            return 0;
        }
    }
}
