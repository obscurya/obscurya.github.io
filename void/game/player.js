function Player(isEnemy) {
    this.isEnemy = isEnemy;

    var borderColor = color(0, 0, 0, 255),
        playerColor = '#999',
        enemyColor = '#e57373',
        eyeColor = color(255, 255, 255, 255),
        eyeHitColor = color(255, 0, 0, 255 / 2);

    if (this.isEnemy) {
        this.x = random(background.x + padding, background.x + background.width - padding) - background.x;
        this.y = random(background.y + padding, background.y + background.height - padding) - background.y;
    } else {
        this.x = playground.width / 2;
        this.y = playground.height / 2;
    }

    this.r = 30;
    this.vx = 10;
    this.vy = 10;

    this.eyeColor = eyeColor;

    this.maxHealth = 100;
    this.health = this.maxHealth;

    this.controls = [false, false, false, false]; // left, up, right, down
    this.aim = [false, false, false, false]; // right, down, left, up

    this.checkCollision = function (obj) {
        var dx = this.x - obj.getX(),
            dy = this.y - obj.getY(),
            d = Math.sqrt(dx * dx + dy * dy);

        if (d < this.r + obj.r + this.vx) {
            return true;
        } else {
            return false;
        }
    }

    this.move = function (m) {
        if (!this.checkCollision(enemy)) {
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
        } else {
            this.x -= this.vx * Math.cos(this.angle);
            this.y -= this.vy * Math.sin(this.angle);
        }
    }

    this.beginCast = false;
    this.endCast = false;
    this.castDuration = 50;
    this.casting = 0;

    this.angle = 0;

    this.getX = function () {
        return (this.isEnemy) ? gcx(this.x) : pgcx(this.x);
    }

    this.getY = function () {
        return (this.isEnemy) ? gcy(this.y) : pgcy(this.y);
    }

    this.updateAngle = function (obj) {
        var dx = obj.getX() - this.x,
            dy = obj.getY() - this.y;

        this.angle = Math.atan2(dy, dx);
    }

    // this.calculateAngle = function (directions) {
    //     var angle = 0;
    //
    //     for (var i = 0; i < directions.length; i++) {
    //         if (directions[i]) {
    //             this.angle = angle;
    //         } else {
    //             angle += Math.PI / 2;
    //         }
    //     }
    // }

    this.hit = false;
    this.hitCounter = 0;

    this.fire = function () {
        if (this.isEnemy) {
            flames.push(new Flame(this, this.x, this.y, this.angle, true));
        } else {
            flames.push(new Flame(this, this.getX(), this.getY(), this.angle, false));
        }
    }

    this.getDamage = function (dmg) {
        if (this.health > 0) {
            this.health -= dmg;
        }
    }

    this.update = function () {
        if (this.beginCast) {
            if (this.casting !== this.castDuration) {
                this.casting++;
            } else {
                this.endCast = true;
            }
        }

        if (this.isEnemy) {
            if (!this.beginCast) {
                this.beginCast = true;
            } else {
                if (this.endCast) {
                    this.beginCast = false;
                    this.endCast = false;
                    this.casting = 0;
                    this.fire();
                }
            }
        }

        // if (this.hit) {
        //     this.eyeColor = eyeHitColor;
        //     this.hitCounter++;
        //
        //     if (this.hitCounter >= 10) {
        //         this.hit = false;
        //         this.hitCounter = 0;
        //     }
        // } else {
        //     this.eyeColor = eyeColor;
        // }
    }

    this.draw = function () {
        var hr = this.r / 2 - 5;

        var x, y;

        if (this.isEnemy) {
            x = this.getX();
            y = this.getY();
        } else {
            x = this.x;
            y = this.y;
        }

        c.fillStyle = borderColor;
        circle(x, y, this.r);

        if (this.isEnemy) {
            c.fillStyle = enemyColor;
        } else {
            c.fillStyle = playerColor;
        }
        circle(x, y, this.r - 5);

        c.fillStyle = this.eyeColor;
        circle(x + hr * Math.cos(this.angle), y + hr * Math.sin(this.angle), this.r / 2);

        var healthBarWidth = Math.floor(this.r * 2),
            healthBarHeight = Math.floor(this.r / 3),
            pad = 2,
            healthWidth = normalize(this.health, this.maxHealth, 0) * (healthBarWidth - pad * 2);

        c.fillStyle = '#000';
        rect(x - healthBarWidth / 2, y + this.r + 5, healthBarWidth, healthBarHeight);
        c.fillStyle = '#444';
        rect(x - healthBarWidth / 2 + pad, y + this.r + 5 + pad, healthWidth, healthBarHeight - pad * 2);
    }
}
