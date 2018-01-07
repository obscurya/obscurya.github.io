function Player(isEnemy) {
    this.isEnemy = isEnemy;

    var playerDefaultFillColor = '#000',
        playerDefaultStrokeColor = '#fff';

    if (isEnemy) {
        this.x = random(background.x + padding, background.x + background.width - padding) - background.x;
        this.y = random(background.y + padding, background.y + background.height - padding) - background.y;
    } else {
        this.x = playground.width / 2;
        this.y = playground.height / 2;
    }

    this.r = 30;
    this.vx = 10;
    this.vy = 10;

    this.maxHealth = 100;
    this.health = this.maxHealth;

    this.controls = [false, false, false, false]; // left, up, right, down
    this.aim = [false, false, false, false]; // right, down, left, up

    this.move = function (m) {
        if (m[0]) {
            if (this.x - this.r <= 0 + padding && background.x < 0) {
                background.x += this.vx;
            } else {
                if (this.x - this.r > 0) {
                    this.x -= this.vx;
                }
            }
        }
        if (m[1]) {
            if (this.y - this.r <= 0 + padding && background.y < 0) {
                background.y += this.vy;
            } else {
                if (this.y - this.r > 0) {
                    this.y -= this.vy;
                }
            }
        }
        if (m[2]) {
            if (this.x + this.r >= playground.width - padding && background.x + background.width > playground.width) {
                background.x -= this.vx;
            } else {
                if (this.x + this.r < playground.width) {
                    this.x += this.vx;
                }
            }
        }
        if (m[3]) {
            if (this.y + this.r >= playground.height - padding && background.y + background.height > playground.height) {
                background.y -= this.vy;
            } else {
                if (this.y + this.r < playground.height) {
                    this.y += this.vy;
                }
            }
        }
    }

    this.beginCast = false;
    this.endCast = false;
    this.castDuration = 50;
    this.casting = 0;

    this.angle = 0;

    this.draw = function () {
        var hr = this.r / 2 - 5;

        var x, y;

        if (this.isEnemy) {
            x = gcx(this.x);
            y = gcy(this.y);
        } else {
            x = this.x;
            y = this.y;
        }

        c.fillStyle = playerDefaultFillColor;
        circle(x, y, this.r);

        if (this.isEnemy) {
            c.fillStyle = '#E57373';
        } else {
            c.fillStyle = '#999';
        }
        circle(x, y, this.r - 5);

        c.fillStyle = playerDefaultStrokeColor;
        circle(x + hr * Math.cos(this.angle), y + hr * Math.sin(this.angle), this.r / 2);
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

    this.updateAngle = function (obj) {
        var dx = this.x - obj.x,
            dy = this.y - obj.y;

        if (this.isEnemy) {
            this.angle = Math.atan2(-gcy(dy), -gcx(dx));
        } else {
            this.angle = Math.atan2(-pgcy(dy), -pgcx(dx));
        }
    }

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
        if (this.isEnemy) {
            flames.push(new Flame(this.x, this.y, this.angle, true));
        } else {
            flames.push(new Flame(pgcx(this.x), pgcy(this.y), this.angle));
        }
    }

    this.damage = function () {
        this.health -= random(0, this.maxHealth);
    }
}
