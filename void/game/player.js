function Player() {
    var playerDefaultFillColor = '#000',
        playerDefaultStrokeColor = '#fff';

    this.x = playground.width / 2;
    this.px = this.x;
    this.y = playground.height / 2;
    this.py = this.y;
    this.r = 30;
    this.vx = 10;
    this.vy = 10;

    this.moveLeft = false;
    this.moveUp = false;
    this.moveRight = false;
    this.moveDown = false;

    this.angle = 0;

    this.draw = function () {
        c.fillStyle = playerDefaultFillColor;
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fill();
        c.closePath();

        c.fillStyle = playerDefaultStrokeColor;
        c.beginPath();
        c.arc(this.x, this.y, this.r - 5, 0, Math.PI * 2);
        c.fill();
        c.closePath();

        // c.fillStyle = 'red';
        // c.beginPath();
        // c.arc(this.px, this.py, this.r / 2, 0, Math.PI * 2);
        // c.fill();
        // c.closePath();
    }

    this.calculateAngle = function (left, up, right, down) {
        if (left || up || right || down) {
            var angle = 0;

            if (left) angle = Math.PI;
            if (up) angle = -Math.PI / 2;
            if (right) angle = 0;
            if (down) angle = Math.PI / 2;

            this.angle = angle;
        }
    }

    this.fire = function () {
        flames.push(new Flame(this.angle));
    }
}
