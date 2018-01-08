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
        flames[i].update(i);
    }

    // player.calculateAngle(player.aim);

    if (player.health > 0 && enemy.health > 0) {
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
