var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

var img = new Image();

function clear() {
    c.fillStyle = '#000';
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomSign() {
    if (Math.random() > 0.5) {
        return 1;
    } else {
        return -1;
    }
}

img.onload = function () {

    var x = random(0, canvas.width - img.width),
        y = random(0, canvas.height - img.height),
        vx = random(5, 20) * randomSign(),
        vy = random(5, 20) * randomSign(),
        score = 0;

    canvas.onmousedown = function (e) {
        if (e.x >= x && e.x <= x + img.width && e.y >= y && e.y <= y + img.height) {
            vx = random(5, 15) * randomSign();
            vy = random(5, 15) * randomSign();
            score++;
        } else {
            score--;
        }
    }

    clear();

    setInterval(function () {

        clear();

        x += vx;
        y += vy;

        if (x <= 0 || x + img.width >= canvas.width) {
            vx = -vx;
        }

        if (y <= 0 || y + img.height >= canvas.height) {
            vy = -vy;
        }

        c.drawImage(img, x, y);

        c.beginPath();
        c.fillStyle = '#fff';
        c.font = '64px sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(score, canvas.width / 2, 64);
        c.closePath();

    }, 1000 / 60);

}

img.src = 'andrey.png';
