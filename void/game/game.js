var playground = document.getElementById('playground'),
    c = playground.getContext('2d');

playground.width = 640;
playground.height = 480;

function Hud() {
    this.draw = function () {
        c.beginPath();
        c.fillStyle = '#fff';
        c.font = '14px sans-serif';
        c.textAlign = 'left';
        c.fillText('x: ' + gcx(player.x) + ' y: ' + gcy(player.y), 20, 30);
        c.fillText('angle: ' + (player.angle * 180 / Math.PI).toFixed(1), 20, 50);
        c.fillText('fireballs: ' + flames.length, 20, 70);
        // c.fillText('beginCast: ' + player.beginCast, 20, 90);
        // c.fillText('endCast: ' + player.endCast, 20, 110);
        // c.fillText('casting: ' + player.casting, 20, 130);
        c.closePath();

        var healthWidth = player.health / player.maxHealth * playground.width;

        c.fillStyle = color(255, 255, 255, 255 / 2);
        rect(0, playground.height - 15, healthWidth, 15);

        var castRadius = player.casting / player.castDuration * player.r;

        c.fillStyle = color(255, 255, 0, 255 / 2);
        circle(player.x, player.y, castRadius);
        // rect(0, playground.height - 20, castWidth, 5);
    }
}

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
        var alpha = (1 - (flameParticleMaxLifespan - this.lifespan) / (flameParticleMaxLifespan - flameParticleMinLifespan)) * 255;

        c.fillStyle = color(255, this.green, 0, alpha);
        circle(background.x + this.x, background.y + this.y, this.r);
    }
}

function Flame(angle) {
    // this.x = random(background.x + padding, background.x + background.width - padding) - background.x;
    // this.y = random(background.y + padding, background.y + background.height - padding) - background.y;

    this.x = player.x + Math.abs(background.x);
    this.y = player.y + Math.abs(background.y);
    this.r = flameRadius;
    this.vx = 5 * Math.cos(angle);
    this.vy = 5 * Math.sin(angle);
    this.particlesNumber = 64;
    this.particles = [];

    for (var i = 0; i < this.particlesNumber; i++) {
        var particle = new Particle();

        particle.create(this.x, this.y, this.r, angle);

        this.particles.push(particle);
    }

    this.draw = function () {
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

function gcx(x) {
    return x + background.x;
}

function gcy(y) {
    return y + background.y;
}

var padding = 100;

var flameRadius = 30,
    flameParticleMaxRadius = flameRadius,
    flameParticleMinRadius = flameRadius / 6,
    flameParticleMaxLifespan = flameParticleMaxRadius,
    flameParticleMinLifespan = flameParticleMinRadius,
    flameParticleMaxSpeed = flameParticleMaxRadius,
    flameParticleMinSpeed = flameParticleMinRadius;

var background = new Background(2, 2),
    player = new Player(),
    hud = new Hud(),
    flames = [];

function draw() {
    clear();

    background.draw();
    player.draw();
    hud.draw();

    for (var i = flames.length - 1; i >= 0; i--) {
        var flame = flames[i];

        flame.draw();

        flame.x += flame.vx;
        flame.y += flame.vy;

        // c.beginPath();
        // c.strokeStyle = color(255, 255, 255, 255 / 5);
        // c.lineWidth = 2;
        // c.moveTo(player.x, player.y);
        // c.lineTo(gcx(flame.x), gcy(flame.y));
        // c.stroke();
        // c.closePath();

        if (flame.x <= 0 || flame.x >= background.width || flame.y <= 0 || flame.y >= background.height) {
            flames.splice(i, 1);
        }
    }

    var left = player.moveLeft,
        up = player.moveUp,
        right = player.moveRight,
        down = player.moveDown,
        aimLeft = player.aimLeft,
        aimUp = player.aimUp,
        aimRight = player.aimRight,
        aimDown = player.aimDown;

    player.calculateAngle([aimRight, aimDown, aimLeft, aimUp]);
    // player.calculateAngle([aimLeft, aimUp, aimRight, aimDown]);

    if (left) {
        if (player.x - player.r <= 0 + padding && background.x < 0) {
            background.x += player.vx;
        } else {
            if (player.x - player.r > 0) {
                player.x -= player.vx;
            }
        }
    }
    if (up) {
        if (player.y - player.r <= 0 + padding && background.y < 0) {
            background.y += player.vy;
        } else {
            if (player.y - player.r > 0) {
                player.y -= player.vy;
            }
        }
    }
    if (right) {
        if (player.x + player.r >= playground.width - padding && background.x + background.width > playground.width) {
            background.x -= player.vx;
        } else {
            if (player.x + player.r < playground.width) {
                player.x += player.vx;
            }
        }
    }
    if (down) {
        if (player.y + player.r >= playground.height - padding && background.y + background.height > playground.height) {
            background.y -= player.vy;
        } else {
            if (player.y + player.r < playground.height) {
                player.y += player.vy;
            }
        }
    }

    if (player.beginCast) {
        if (player.casting !== player.castDuration) {
            player.casting++;
        } else {
            player.endCast = true;
        }
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
