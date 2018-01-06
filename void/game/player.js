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

    this.maxHealth = 100;
    this.health = this.maxHealth;

    this.moveLeft = false;
    this.moveUp = false;
    this.moveRight = false;
    this.moveDown = false;

    this.aimLeft = false;
    this.aimUp = false;
    this.aimRight = false;
    this.aimDown = false;

    this.beginCast = false;
    this.endCast = false;
    this.castDuration = 50;
    this.casting = 0;

    this.angle = 0;

    this.draw = function () {
        var hr = this.r / 2 - 5;

        c.fillStyle = playerDefaultFillColor;
        circle(this.x, this.y, this.r);

        c.fillStyle = '#999';
        circle(this.x, this.y, this.r - 5);

        c.fillStyle = playerDefaultStrokeColor;
        circle(this.x + hr * Math.cos(this.angle), this.y + hr * Math.sin(this.angle), this.r / 2);
    }

    // this.calculateAngle = function (d) {
    //     if (d[0] || d[1] || d[2] || d[3]) {
    //         var a = 0;
    //
    //         if (d[0]) a = 180;
    //         if (d[1]) a = 270;
    //         if (d[2]) a = 0;
    //         if (d[3]) a = 90;
    //         if (d[0] && d[1]) a = 180 + 45;
    //         if (d[1] && d[2]) a = 270 + 45;
    //         if (d[2] && d[3]) a = 45;
    //         if (d[3] && d[0]) a = 90 + 45;
    //
    //         this.angle = a * Math.PI / 180;
    //     }
    // }

    this.calculateAngle = function (directions) {
        var angle = 0;

        for (var i = 0; i < directions.length; i++) {
            if (directions[i]) {
                this.angle = angle;
            } else {
                angle += Math.PI / 2;
            }
        }
    }

    this.fire = function () {
        flames.push(new Flame(this.angle));
    }

    this.damage = function () {
        this.health -= random(0, this.maxHealth);
    }
}
