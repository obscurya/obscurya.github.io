function random(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

function color(r, g, b, a) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a / 255 + ')';
}

var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d'),
    hw,
    hh,
    ratio,
    pixels = [],
    particles = [],
    maxd;

function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#000';
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function Pixel(x, y) {
    this.x = x;
    this.y = y;
    this.free = true;
}

function Particle(x, y, r) {
    this.x = x;
    this.y = y;
    this.xx = random(0, canvas.width);
    this.yy = random(0, canvas.height);
    this.vx = this.x - this.xx;
    this.vy = this.y - this.yy;
    this.r = 1;
    // this.r = r;
    this.g = r * 2;
    // this.color = color(255, 255, 255, random(55, 155));
    this.color = '#fff';
}

function init() {
    pixels = [];
    particles = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    hw = canvas.width / 2;
    hh = canvas.height / 2;

    if (canvas.width > canvas.height) {
        ratio = Math.floor(canvas.width / canvas.height);
    } else {
        ratio = Math.floor(canvas.height / canvas.width);
    }

    var text = 'obscurya';

    maxd = 20;
    // maxd = Math.floor(ratio * text.length * 5);

    clear();
    drawText(text);

    var data = c.getImageData(0, 0, canvas.width, canvas.height).data,
        i = 0;

    clear();

    for (var h = 0; h < canvas.height; h++) {
        for (var w = 0; w < canvas.width; w++) {
            var r = data[i],
                g = data[i + 1],
                b = data[i + 2],
                alpha = data[i + 3];

            if (r == 255 && g == 255 && b == 255) {
                pixels.push(new Pixel(w, h));
            }

            i += 4;
        }
    }

    var particlesNumber = 500;

    if (particlesNumber > pixels.length / 2) {
        particlesNumber = pixels.length / 10;
        maxd = 10;
    }

    for (var i = 0; i < particlesNumber; i++) {
        var k = random(0, pixels.length - 1);

        while (true) {
            var px = pixels[k];

            if (px.free) {
                particles.push(new Particle(px.x, px.y, Math.floor(text.length / 2)));
                px.free = false;
                break;
            } else {
                k = random(0, pixels.length - 1);
            }
        }
    }
}

init();

function drawText(str) {
    var fontSize = Math.floor(canvas.width / (ratio * (str.length - str.length / 3)));

    c.beginPath();
    c.fillStyle = '#fff';
    c.font = fontSize + 'px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(str, hw, hh);
    c.closePath();
}

function drawParticle(p) {
    c.beginPath();
    c.fillStyle = p.color;
    c.arc(p.xx, p.yy, p.r, 0, Math.PI * 2);
    c.fill();
    c.closePath();
}

function drawLine(x1, y1, x2, y2, d) {
    var alpha = ((maxd - d) / maxd) * 255;

    c.beginPath();
    c.lineWidth = 1;
    c.strokeStyle = color(255, 255, 255, alpha);
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.closePath();
}

function draw() {
    clear();

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        for (var j = 0; j < particles.length; j++) {
            var pp = particles[j];

            if (p !== pp) {
                var dx = p.xx - pp.xx,
                    dy = p.yy - pp.yy,
                    dsqr = dx * dx + dy * dy,
                    d = Math.sqrt(dsqr);

                if (d < maxd) {
                    drawLine(p.xx, p.yy, pp.xx, pp.yy, d);
                }
            }
        }

        var dx = p.x - p.xx,
            dy = p.y - p.yy,
            dsqr = dx * dx + dy * dy,
            d = Math.sqrt(dsqr);

        if (d > 10) {
            p.vx = dx / 100;
            p.vy = dy / 100;
        }

        p.xx += p.vx;
        p.yy += p.vy;

        drawParticle(p);
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

window.onresize = function () {
    init();
}
