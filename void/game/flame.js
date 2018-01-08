function Particle(x, y, r, angle) {
    this.x = 0;
    this.y = 0;
    this.r = 0;

    this.create = function (x, y, r) {
        this.x = x + random(-r / 4, r / 4);
        this.y = y + random(-r / 4, r / 4);
        this.r = random(flameParticleMinRadius, flameParticleMaxRadius);
        this.speed = ((flameParticleMaxSpeed - this.r) / (flameParticleMaxSpeed - flameParticleMinSpeed)) * flameParticleMinSpeed;
        this.green = random(155, 225);
        this.lifespan = Math.round((flameParticleMaxLifespan - this.r) / (flameParticleMaxLifespan - flameParticleMinLifespan) * flameParticleMaxLifespan);
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

function Flame(x, y, angle, isEnemy) {
    this.x = x;
    this.y = y;
    this.r = flameRadius;
    // this.range = this.r * 2;
    this.vx = 5 * Math.cos(angle);
    this.vy = 5 * Math.sin(angle);
    this.particlesNumber = 64;
    this.particles = [];
    this.damage = 25;
    this.isEnemy = isEnemy;

    for (var i = 0; i < this.particlesNumber; i++) {
        var particle = new Particle();

        particle.create(this.x, this.y, this.r, angle);

        this.particles.push(particle);
    }

    this.getX = function () {
        return (this.isEnemy) ? gcx(this.x) : this.x;
    }

    this.getY = function () {
        return (this.isEnemy) ? gcy(this.y) : this.y;
    }

    this.checkCollision = function (index, obj) {
        var dx = obj.x - this.getX(),
            dy = obj.y - this.getY(),
            d = Math.sqrt(dx * dx + dy * dy);

        if (d <= obj.r + this.r / 2) {
            flames.splice(index, 1);
            obj.getDamage(this.damage);
        }
    }

    this.update = function (index) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.isEnemy) {
            this.checkCollision(index, player);
        } else {
            this.checkCollision(index, enemy);
        }

        // c.beginPath();
        // c.strokeStyle = color(255, 255, 255, 255 / 5);
        // c.lineWidth = 2;
        // c.moveTo(player.x, player.y);
        // c.lineTo(gcx(flame.x), gcy(flame.y));
        // c.stroke();
        // c.closePath();

        if (this.x - this.r <= 0 || this.x + this.r >= background.width || this.y - this.r <= 0 || this.y + this.r >= background.height) {
            flames.splice(index, 1);
        }

        this.draw();
    }

    this.draw = function () {
        c.fillStyle = color(255, 255, 255, 15);
        circle(gcx(this.x), gcy(this.y), this.r * 2);

        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];

            particle.draw();

            particle.y -= particle.speed * Math.sin(angle);
            particle.x -= particle.speed * Math.cos(angle);
            particle.lifespan--;

            if (particle.lifespan <= 0) {
                particle.create(this.x, this.y, this.r);
            }
        }
    }
}
