var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

var img = new Image();

function clear() {
    c.fillStyle = '#000';
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    c.fillStyle = '#999';
    c.textAlign = 'left';
    c.font = '12px sans-serif';
    c.fillText('AndreyHunter v0.0.2', 20, canvas.height - 20);
    c.closePath();
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
        score = 0,
        hit = false,
        hitColor = '#000',
        hitCounter = 0,
        hitX = 0,
        hitY = 0,
        hitR = 0,
        hitAlpha = 1;

    canvas.onmousedown = function (e) {
        hit = true;
        hitCounter = 0;
        hitX = e.x;
        hitY = e.y;
        hitR = 0;
        hitAlpha = 1;

        if (e.x >= x && e.x <= x + img.width && e.y >= y && e.y <= y + img.height) {
            hitColor = 'rgba(0, 255, 0, ';
            vx = random(5, 15) * randomSign();
            vy = random(5, 15) * randomSign();
            score++;
        } else {
            hitColor = 'rgba(255, 0, 0, ';
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

        if (hit) {
            c.beginPath();
            c.fillStyle = hitColor + hitAlpha + ')';
            c.arc(hitX, hitY, hitR, 0, Math.PI * 2);
            c.fill();
            c.closePath();

            hitR += 5;
            hitAlpha -= 0.1;

            hitCounter++;

            if (hitCounter > 10) {
                hitAlpha = 1;
                hitR = 0;
                hitCounter = 0;
                hit = false;
            }
        }

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
