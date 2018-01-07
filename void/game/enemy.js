function Enemy() {
    var enemyDefaultFillColor = '#000',
        enemyDefaultStrokeColor = '#fff';

    this.w = player.r * 2;
    this.h = this.w;
    this.r = player.r;

    this.x = random(background.x + padding, background.x + background.width - padding) - background.x;
    this.y = random(background.y + padding, background.y + background.height - padding) - background.y;

    this.beginCast = false;
    this.endCast = false;
    this.castDuration = 50;
    this.casting = 0;

    this.angle = 0;

    this.draw = function () {
        var x = gcx(this.x),
            y = gcy(this.y);

        c.fillStyle = enemyDefaultFillColor;
        circle(x, y, this.r);

        c.fillStyle = '#E57373';
        circle(x, y, this.r - 5);

        // c.strokeStyle = color(255, 255, 255, 255 / 5);
        // c.beginPath();
        // c.lineWidth = 2;
        // c.moveTo(player.x, player.y);
        // c.lineTo(x, y);
        // c.stroke();
        // c.closePath();
    }

    this.fire = function () {
        flames.push(new Flame(this.x, this.y, this.angle, true));
    }
}
