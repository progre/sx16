export default class Background {
    private _stars: Star[] = [];

    constructor(private bitmapData: Phaser.BitmapData, width: number, height: number) {
        this._stars;
        for (var i = 0; i < 50; i++) {
            const light = 200;
            var point = new Phaser.Point(
                width * Math.random(),
                height * Math.random());
            this._stars.push(new Star(
                point,
                2 * Math.random() + 1,
                Phaser.Color.createColor(
                    light * Math.random(),
                    light * Math.random(),
                    light * Math.random()),
                height));
        }
    }

    extend() {
        this._stars.forEach(x => x.extend());
    }

    warp() {
        this._stars.forEach(x => x.warp());
    }

    render() {
        this._stars.forEach(x => {
            x.update();
            x.render(this.bitmapData);
        });
    }
}

class Star {
    private _length = 1;

    constructor(
        private _point: Phaser.Point,
        private _speed: number,
        private _color: any,
        private _screenHeight: number) {
    }

    get point() {
        return this._point;
    }

    update() {
        this._point.y += this._speed;
        if (this._point.y >= this._screenHeight)
            this._point.y -= this._screenHeight;
    }

    extend() {
        if (this._length < 8)
            this._length += 2;
        this._speed = 1 + this._speed * 1.15;
    }

    warp() {
        this._length *= 10;
        this._speed *= 4;
    }

    render(bitmapData: Phaser.BitmapData) {
        if (this._length === 1) {
            bitmapData.setPixel(this._point.x, this._point.y, this._color.r, this._color.g, this._color.b);
            return;
        }
        // graphics.beginFill(this._color.color, 1);
        // graphics.moveTo(this._point.x, this._point.y);
        // graphics.lineTo(this._point.x, this._point.y + this._length);
        // graphics.endFill();
    }
}
