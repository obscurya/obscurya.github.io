var playground = document.getElementById('playground'),
    c = playground.getContext('2d');

playground.width = 640;
playground.height = 480;

function gcx(x) {
    return x + background.x;
}

function gcy(y) {
    return y + background.y;
}

function pgcx(x) {
    return x + Math.abs(background.x);
}

function pgcy(y) {
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
    player = new Player(false),
    flames = [],
    enemy = new Player(true),
    hud = new Hud();

function draw() {
    clear();

    background.draw();
    player.draw();
    player.update();
    player.move(player.controls);
    player.updateAngle(enemy);
    enemy.draw();
    enemy.updateAngle(player);

    for (var i = flames.length - 1; i >= 0; i--) {
        var flame = flames[i],
            dx = player.x - gcx(flame.x),
            dy = player.y - gcy(flame.y),
            d = Math.sqrt(dx * dx + dy * dy);

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

        if (d <= player.r + flame.r / 2 && flame.isEnemy) {
            flames.splice(i, 1);
            player.getDamage(flame.damage);
        }

        if (flame.x - flame.r <= 0 || flame.x + flame.r >= background.width || flame.y - flame.r <= 0 || flame.y + flame.r >= background.height) {
            flames.splice(i, 1);
        }
    }

    // player.calculateAngle(player.aim);

    if (player.health > 0) {
        enemy.update();
    } else {
        enemy.beginCast = false;
        enemy.endCast = false;
        enemy.casting = 0;
    }

    hud.draw();

    requestAnimationFrame(draw);
}

draw();
