export let hoge: any;

class Star {
    private _length = 1;

    constructor(
        private _point: Phaser.Point,
        private _speed: number,
        private _color: Phaser.Color,
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

    render(Renderer renderer) {
        if (_length == 1) {
            renderer.DrawPixel(_point, _color);
            return;
        }
        renderer.DrawLine(_point, _point.Shift(0, _length), _color);
    }
}

class BackgroundView {
    private _stars: Star[] = [];

    constructor(game: boolean) {
        this._stars;
        for (var i = 0; i < 50; i++) {
            const light = 200;
            Point point;
            if (game)
                point = new Point((short)r.Next(Point.Width),
                    (short)r.Next(Point.Height));
            else
                point = new Point((short)r.Next(800),
                    (short)r.Next(500));
            _stars.Add(new Star(
                point,
                r.Next(1, 3),
                new Color(
                    (byte)r.Next(light), (byte)r.Next(light), (byte)r.Next(light))));
        }
    }

    public Renderer Renderer { private get; set; }

        public void Extend()
{
    foreach(Star star in _stars)
    star.Extend();
}

        public void Warp()
{
    foreach(Star star in _stars)
    star.Warp();
}

        public void Render()
{
    foreach(Star star in _stars)
    {
        star.Update();
        star.Render(Renderer);
    }
}
    }
