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
    c.fillText('AndreyHunter v0.0.4', 20, canvas.height - 20);
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
        hitText = '',
        hitTextAlpha = 1,
        hitTextSize = 64,
        hitCounter = 0,
        hitX = 0,
        hitY = 0,
        hitR = 0,
        hitAlpha = 1;

    var goodBoy = ['Красава', 'Красавчик', 'Лучший', 'Крэйзи', 'Батька', 'Хедшот', 'Двоечка', 'Четко в жбан', 'Базаришь', 'Дыщ', 'Класс', 'Жесть'],
        badBoy = ['Лох', 'Лошара', 'Ну такое', 'Мда', 'Ой все', 'Ну дебил'];

    canvas.onmousedown = function (e) {
        hit = true;
        hitColor = '#000';
        hitTextAlpha = 1;
        hitTextSize = 64;
        hitCounter = 0;
        hitX = e.x;
        hitY = e.y;
        hitR = 0;
        hitAlpha = 1;

        if (e.x >= x && e.x <= x + img.width && e.y >= y && e.y <= y + img.height) {
            hitColor = 'rgba(0, 255, 0, ';
            hitText = goodBoy[random(0, goodBoy.length - 1)];
            vx = random(5, 15) * randomSign();
            vy = random(5, 15) * randomSign();
            score++;
        } else {
            hitColor = 'rgba(255, 0, 0, ';
            hitText = badBoy[random(0, badBoy.length - 1)];
            score--;
        }
    }

    clear();

    setInterval(function () {

        clear();

        x += vx;
        y += vy;

        if (x <= 0) {
            x = 0;
            vx = -vx;
        }

        if (x + img.width >= canvas.width) {
            x = canvas.width - img.width;
            vx = -vx;
        }

        if (y <= 0) {
            y = 0;
            vy = -vy;
        }

        if (y + img.height >= canvas.height) {
            y = canvas.height - img.height;
            vy = -vy;
        }

        c.drawImage(img, x, y);

        if (hit) {
            c.beginPath();
            c.fillStyle = hitColor + hitAlpha + ')';
            c.arc(hitX, hitY, hitR, 0, Math.PI * 2);
            c.fill();
            c.closePath();

            c.beginPath();
            c.fillStyle = 'rgba(255, 255, 255, ' + hitTextAlpha + ')';
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.font = 'bold ' + hitTextSize + 'px sans-serif';
            c.fillText(hitText.toUpperCase(), canvas.width / 2, canvas.height / 2);
            c.closePath();

            hitR += 5;
            hitAlpha -= 0.1;
            hitTextAlpha -= 0.1;
            hitTextSize += 5;

            hitCounter++;

            if (hitCounter > 10) {
                hitColor = '#000';
                hitText = '';
                hitTextSize = 64;
                hitAlpha = 1;
                hitR = 0;
                hitCounter = 0;
                hit = false;
            }
        }

        c.beginPath();
        c.fillStyle = '#fff';
        c.font = '32px sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(score, canvas.width / 2, 64);
        c.closePath();

    }, 1000 / 60);

}

img.src = 'andrey.png';
