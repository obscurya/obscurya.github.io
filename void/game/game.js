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

function color(red, green, blue, alpha) {
    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha / 255 + ')';
}

function randomMonochromeColor() {
    var mono = random(55, 155);
    return color(mono, mono, mono, 255);
}

function Part(x, y, partColor) {
    this.x = x;
    this.y = y;
    this.color = partColor;
}

function Background(width, height) {
    this.x = 0;
    this.y = 0;
    this.partWidth = playground.width;
    this.partHeight = playground.height;
    this.width = this.partWidth * width;
    this.height = this.partHeight * height;
    this.parts = [];

    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
            var partColor = randomMonochromeColor();
            this.parts.push(new Part(this.x + this.partWidth * w, this.y + this.partHeight * h, partColor));
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

var padding = 50;

var background = new Background(4, 3),
    player = new Player();

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
