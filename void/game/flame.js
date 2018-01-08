function Particle(destruction) {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.angle = 0;
    this.destruction = destruction;

    this.create = function (x, y, r, angle) {
        this.x = x + random(-r / 4, r / 4);
        this.y = y + random(-r / 4, r / 4);
        this.r = random(flameParticleMinRadius, flameParticleMaxRadius);
        this.speed = ((flameParticleMaxSpeed - this.r) / (flameParticleMaxSpeed - flameParticleMinSpeed)) * flameParticleMinSpeed;
        this.green = random(155, 225);
        this.lifespan = Math.round((flameParticleMaxLifespan - this.r) / (flameParticleMaxLifespan - flameParticleMinLifespan) * flameParticleMaxLifespan);
        this.angle = angle;
    }

    this.update = function (x, y, r) {
        this.x -= this.speed * Math.cos(this.angle);
        this.y -= this.speed * Math.sin(this.angle);
        this.lifespan--;

        if (!this.destruction) {
            if (this.lifespan <= 0) {
                this.create(x, y, r, this.angle);
            }
        }
    }

    this.draw = function () {
        var x = gcx(this.x),
            y = gcy(this.y);

        var alpha = (1 - (flameParticleMaxLifespan - this.lifespan) / (flameParticleMaxLifespan - flameParticleMinLifespan)) * 255;

        c.fillStyle = color(255, this.green, 0, alpha);
        circle(x, y, this.r);

        c.strokeStyle = color(0, 0, 0, alpha);
        c.lineWidth = 2;
        ring(x, y, this.r);
    }
}

// function DestructionParticle() {
//     this.x = 0;
//     this.y = 0;
//     this.r = 0;
//     this.angle = 0;
//
//     this.create = function (x, y, r, angle) {
//         this.x = x + random(-r / 4, r / 4);
//         this.y = y + random(-r / 4, r / 4);
//         this.r = random(flameParticleMinRadius, flameParticleMaxRadius);
//         this.speed = ((flameParticleMaxSpeed - this.r) / (flameParticleMaxSpeed - flameParticleMinSpeed)) * flameParticleMinSpeed;
//         this.green = random(155, 225);
//         this.lifespan = Math.round((flameParticleMaxLifespan - this.r) / (flameParticleMaxLifespan - flameParticleMinLifespan) * flameParticleMaxLifespan);
//         this.angle = angle;
//     }
//
//     this.update = function (x, y, r) {
//         this.x -= this.speed * Math.cos(this.angle);
//         this.y -= this.speed * Math.sin(this.angle);
//         this.lifespan--;
//
//         // if (this.lifespan <= 0) {
//         //     this.create(x, y, r, this.angle);
//         // }
//     }
//
//     this.draw = function () {
//         var x = gcx(this.x),
//             y = gcy(this.y);
//
//         var alpha = (1 - (flameParticleMaxLifespan - this.lifespan) / (flameParticleMaxLifespan - flameParticleMinLifespan)) * 255;
//
//         c.fillStyle = color(255, this.green, 0, alpha);
//         circle(x, y, this.r);
//
//         c.strokeStyle = color(0, 0, 0, alpha);
//         c.lineWidth = 2;
//         ring(x, y, this.r);
//     }
// }

function Flame(x, y, angle, isEnemy) {
    this.x = x;
    this.y = y;
    this.r = flameRadius;
    this.angle = angle;
    // this.range = this.r * 2;
    this.vx = 5 * Math.cos(this.angle);
    this.vy = 5 * Math.sin(this.angle);
    this.particlesNumber = 64;
    this.particles = [];
    this.damage = 25;
    this.isEnemy = isEnemy;

    for (var i = 0; i < this.particlesNumber; i++) {
        var particle = new Particle(false);

        particle.create(this.x, this.y, this.r, this.angle);

        this.particles.push(particle);
    }

    this.getX = function () {
        return (this.isEnemy) ? gcx(this.x) : this.x;
    }

    this.getY = function () {
        return (this.isEnemy) ? gcy(this.y) : this.y;
    }

    this.checkCollision = function (obj) {
        var dx = obj.x - this.getX(),
            dy = obj.y - this.getY(),
            d = Math.sqrt(dx * dx + dy * dy);

        if (d <= obj.r + this.r / 2) {
            this.beginDestruction = true;
            this.destruction();
            obj.getDamage(this.damage);
        }
    }

    this.update = function () {
        if (!this.beginDestruction) {
            this.x += this.vx;
            this.y += this.vy;

            if (this.isEnemy) {
                this.checkCollision(player);
            } else {
                this.checkCollision(enemy);
            }

            // c.beginPath();
            // c.strokeStyle = color(255, 255, 255, 255 / 5);
            // c.lineWidth = 2;
            // c.moveTo(player.x, player.y);
            // c.lineTo(gcx(flame.x), gcy(flame.y));
            // c.stroke();
            // c.closePath();

            if (this.x - this.r <= 0 || this.x + this.r >= background.width || this.y - this.r <= 0 || this.y + this.r >= background.height) {
                this.beginDestruction = true;
                this.destruction();
            }
        }
    }

    this.beginDestruction = false;

    this.destruction = function () {
        this.vx = 0;
        this.vy = 0;

        this.particles = [];

        for (var i = 0; i < this.particlesNumber; i++) {
            var particle = new Particle(true),
                angle = randomDouble(-Math.PI, Math.PI);

            particle.create(this.x, this.y, this.r, angle);

            this.particles.push(particle);
        }
    }

    this.draw = function (index) {
        if (!this.beginDestruction) {
            c.fillStyle = color(255, 255, 255, 15);
            circle(gcx(this.x), gcy(this.y), this.r * 2);
        }

        for (var i = this.particles.length - 1; i >= 0; i--) {
            var particle = this.particles[i];

            particle.draw();
            particle.update(this.x, this.y, this.r);

            if (particle.lifespan <= 0) {
                this.particles.splice(i, 1);
            }

            if (this.particles.length <= 0) {
                flames.splice(index, 1);
            }
        }
    }
}
