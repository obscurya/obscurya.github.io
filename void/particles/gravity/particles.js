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

var spacing = Math.floor((canvas.width - padding * 2) / (canvas.height - padding * 2) * 1.5);

var particles = [],
    bh = new BlackHole;

// var up = [], left = [], right = [], down = [];
//
// for (var h = spacing / 2 + padding; h < canvas.height - padding; h += spacing) {
//     for (var w = spacing / 2 + padding; w < canvas.width - padding; w += spacing) {
//         var p = new Particle(w, h);
//
//         if (h == spacing / 2 + padding) {
//             particles.push(p);
//             up.push(p);
//         } else if (h >= canvas.height - padding - spacing / 2) {
//             particles.push(p);
//             down.push(p);
//         } else {
//             if (w == spacing / 2 + padding) {
//                 particles.push(p);
//                 left.push(p);
//             } else if (w >= canvas.width - padding - spacing / 2) {
//                 particles.push(p);
//                 right.push(p);
//             }
//         }
//     }
// }

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

    // c.beginPath();
    // c.fillStyle = 'rgba(255, 255, 255, 0.5)';
    // c.moveTo(up[0].x, up[0].y);
    // for (var i = 1; i < up.length; i++) {
    //     c.lineTo(up[i].x, up[i].y);
    // }
    // for (var i = 0; i < right.length; i++) {
    //     c.lineTo(right[i].x, right[i].y);
    // }
    // for (var i = down.length - 1; i >= 0; i--) {
    //     c.lineTo(down[i].x, down[i].y);
    // }
    // for (var i = left.length - 1; i >= 0; i--) {
    //     c.lineTo(left[i].x, left[i].y);
    // }
    // c.closePath();
    // c.fill();

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
            particle.vx = (particle.spx - particle.x) / 50;
            particle.vy = (particle.spy - particle.y) / 50;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
    }

    requestAnimationFrame(draw);

}

requestAnimationFrame(draw);
