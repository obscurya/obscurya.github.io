var playground = document.getElementById('playground'),
    c = playground.getContext('2d');

playground.width = 640;
playground.height = 480;

function clear() {
    c.fillStyle = 'black';
    c.clearRect(0, 0, playground.width, playground.height);
    c.fillRect(0, 0, playground.width, playground.height);
}

function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomDouble(min, max) {
    return Math.random() * (max - min) + min;
}

function color(red, green, blue, alpha) {
    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha / 255 + ')';
}

function randomMonochromeColor(min, max) {
    var mono = random(min, max);
    return color(mono, mono, mono, 255);
}

function Hud() {
    this.draw = function () {
        c.beginPath();
        c.fillStyle = '#fff';
        c.font = '14px sans-serif';
        c.textAlign = 'left';
        c.fillText('x: ' + getCoordinateX(player.x) + ' y: ' + getCoordinateY(player.y), 20, 30);
        // c.fillText('px: ' + getCoordinateX(player.px) + ' py: ' + getCoordinateY(player.py), 20, 50);
        c.fillText('angle: ' + (player.angle * 180 / Math.PI).toFixed(1), 20, 50);
        c.fillText('fireballs: ' + flames.length, 20, 70);
        c.closePath();
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

        c.beginPath();
        c.fillStyle = color(0, this.green, 255, alpha);
        c.arc(background.x + this.x, background.y + this.y, this.r, 0, Math.PI * 2);
        c.fill();
        c.closePath();
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

function getCoordinates(obj) {
    return -(background.x + background.width / 2 - obj.x) + ' ' + -(background.y + background.height / 2 - obj.y);
}

function getCoordinateX(x) {
    return x + Math.abs(background.x);
}

function getCoordinateY(y) {
    return y + Math.abs(background.y);
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

        if (getCoordinateX(flame.x) <= 0 || getCoordinateX(flame.x) >= getCoordinateX(background.width) || getCoordinateY(flame.y) <= 0 || getCoordinateY(flame.y) >= getCoordinateY(background.height)) {
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

    player.calculateAngle(aimLeft, aimUp, aimRight, aimDown);

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

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
