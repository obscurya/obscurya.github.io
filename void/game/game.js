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

function Part(x, y, partColor) {
    this.x = x;
    this.y = y;
    this.color = partColor;
}

function Background(width, height) {
    this.partWidth = playground.width;
    this.partHeight = playground.height;
    this.width = this.partWidth * width;
    this.height = this.partHeight * height;
    this.x = (playground.width - this.width) / 2;
    this.y = (playground.height - this.height) / 2;
    this.parts = [];

    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
            var partColor = randomMonochromeColor(25, 55);
            this.parts.push(new Part(this.partWidth * w, this.partHeight * h, partColor));
        }
    }

    this.draw = function () {
        c.beginPath();
        for (var i = 0; i < this.parts.length; i++) {
            var x = this.x + this.parts[i].x,
                y = this.y + this.parts[i].y;

            c.fillStyle = this.parts[i].color;
            c.fillRect(x, y, this.partWidth, this.partHeight);
        }
        c.closePath();

        c.font = '64px sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        c.beginPath();
        for (var i = 0; i < this.parts.length; i++) {
            var x = this.x + this.parts[i].x,
                y = this.y + this.parts[i].y;

            c.fillStyle = '#ddd';
            // c.fillText(i + 1, (x + this.partWidth) / 2, (y + this.partHeight) / 2);
            c.fillText(i + 1, x + this.partWidth / 2, y + this.partHeight / 2);
        }
        c.closePath();
    }
}

function Player() {
    var playerDefaultFillColor = '#000',
        playerDefaultStrokeColor = '#fff';

    this.x = playground.width / 2;
    this.y = playground.height / 2;
    this.r = 30;
    this.vx = 10;
    this.vy = 10;

    this.moveLeft = false;
    this.moveUp = false;
    this.moveRight = false;
    this.moveDown = false;

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
    }
}

function Hud() {
    this.draw = function () {
        c.beginPath();
        c.fillStyle = '#fff';
        c.font = '14px sans-serif';
        c.textAlign = 'left';
        c.fillText(getCoordinates(player), 20, 30);
        c.closePath();
    }
}

function Particle(x, y, r) {
    this.x = 0;
    this.y = 0;
    this.r = 0;

    this.create = function (x, y) {
        this.x = x;
        this.y = y;
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

function Flame() {
    this.x = random(background.x, background.x + background.width) - background.x;
    this.y = random(background.y, background.y + background.height) - background.y;
    this.r = flameRadius;
    this.particlesNumber = 64;
    this.particles = [];

    for (var i = 0; i < this.particlesNumber; i++) {
        var particle = new Particle(),
            particleX = this.x + random(-this.r / 2, this.r / 2),
            particleY = this.y + random(-this.r / 2, this.r / 2);

        particle.create(particleX, particleY);

        this.particles.push(particle);
    }

    this.draw = function () {
        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];

            particle.draw();

            particle.y -= particle.speed;
            particle.lifespan--;

            if (particle.lifespan <= 0) {
                var particleX = this.x + random(-this.r / 2, this.r / 2),
                    particleY = this.y + random(-this.r / 2, this.r / 2);

                particle.create(particleX, particleY);
            }
        }
    }
}

function getCoordinates(obj) {
    return -(background.x + background.width / 2 - obj.x) + ' ' + -(background.y + background.height / 2 - obj.y);
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
    flame = new Flame();

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) player.moveLeft = true;
    if (event.keyCode == 38) player.moveUp = true;
    if (event.keyCode == 39) player.moveRight = true;
    if (event.keyCode == 40) player.moveDown = true;
});

document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) player.moveLeft = false;
    if (event.keyCode == 38) player.moveUp = false;
    if (event.keyCode == 39) player.moveRight = false;
    if (event.keyCode == 40) player.moveDown = false;
});

function draw() {
    clear();

    background.draw();
    player.draw();
    hud.draw();
    flame.draw();

    if (player.moveLeft) {
        if (player.x - player.r <= 0 + padding && background.x < 0) {
            background.x += player.vx;
        } else {
            if (player.x - player.r > 0) {
                player.x -= player.vx;
            }
        }
    }
    if (player.moveUp) {
        if (player.y - player.r <= 0 + padding && background.y < 0) {
            background.y += player.vy;
        } else {
            if (player.y - player.r > 0) {
                player.y -= player.vy;
            }
        }
    }
    if (player.moveRight) {
        if (player.x + player.r >= playground.width - padding && background.x + background.width > playground.width) {
            background.x -= player.vx;
        } else {
            if (player.x + player.r < playground.width) {
                player.x += player.vx;
            }
        }
    }
    if (player.moveDown) {
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
