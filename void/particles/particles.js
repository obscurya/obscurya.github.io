var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

var padding = 100;

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.spx = x;
    this.spy = y;
    this.w = 1;
    this.h = 1;
    this.vx = 0;
    this.vy = 0;
    this.color = color(255, 255, 255, 255);
}

function BlackHole() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.r = 100;
    this.g = this.r / 2;
}

var spacing = Math.floor((canvas.width - padding * 2) / (canvas.height - padding * 2) * 2);

var particles = [],
    bh = new BlackHole;

for (var h = spacing / 2 + padding; h < canvas.height - padding; h += spacing) {
    for (var w = spacing / 2 + padding; w < canvas.width - padding; w += spacing) {
        particles.push(new Particle(w, h));
    }
}

function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];

        rect(particle.x, particle.y, particle.w, particle.h, particle.color);
    }
}

canvas.addEventListener('mousemove', function (e) {

    bh.x = e.clientX;
    bh.y = e.clientY;

}, false);

function draw() {

    clear('#000');
    drawParticles();

    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];

        var dx = bh.x - particle.x,
            dy = bh.y - particle.y,
            distanceSquare = dx * dx + dy * dy,
            distance = Math.sqrt(distanceSquare);

        // if (distance < bh.r) {
        //     particle.vx -= bh.g * dx / distanceSquare;
        //     particle.vy -= bh.g * dy / distanceSquare;
        // } else {
        //     particle.vx += bh.g * dx / distanceSquare;
        //     particle.vy += bh.g * dy / distanceSquare;
        // }

        if (distance < bh.r) {
            particle.vx -= bh.g * dx / distanceSquare;
            particle.vy -= bh.g * dy / distanceSquare;
        } else {
            particle.vx = (particle.spx - particle.x) / particles.length * 100;
            particle.vy = (particle.spy - particle.y) / particles.length * 100;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
    }

    requestAnimationFrame(draw);

}

requestAnimationFrame(draw);
