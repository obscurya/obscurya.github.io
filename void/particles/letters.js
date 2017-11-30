var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 480;

var string = 'obscurya';

clear('#000');

function Char() {
    var i = random(0, pixels.length - 1),
        pixel = pixels[i];

    this.x = pixel.x;
    this.y = pixel.y;

    while (pixel.free === false) {
        i = random(0, pixels.length - 1);
        pixel = pixels[i];
        this.x = pixel.x;
        this.y = pixel.y;
    }

    pixel.free = false;

    if (pixels[i - 1]) { pixels[i - 1].free = false; }
    if (pixels[i - 2]) { pixels[i - 2].free = false; }
    if (pixels[i + 1]) { pixels[i + 1].free = false; }
    if (pixels[i + 2]) { pixels[i + 2].free = false; }

    this.content = string.charAt(random(0, string.length - 1));
    this.color = color(255, 255, 255, random(55, 155));
    this.size = random(10, 20);
}

var data = [],
    pixels = [];

function init(str) {
    clear('#000');

    begin();
    c.fillStyle = '#fff';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '700 ' + canvas.width / str.length * 1.5 + 'px sans-serif';
    c.fillText(str, canvas.width / 2, canvas.height / 2);
    close();

    data = c.getImageData(0, 0, canvas.width, canvas.height).data;

    var i = 0;

    for (var h = 0; h < canvas.height; h++) {
        for (var w = 0; w < canvas.width; w++) {
            var r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            if (r == 255 && g == 255 && b == 255) {
                var pixel = {};

                pixel.x = w;
                pixel.y = h;
                pixel.free = true;

                pixels.push(pixel);
            }

            i += 4;
        }
    }
}

function drawChar(char) {
    begin();
    c.font = 'normal ' + char.size + 'px sans-serif';
    c.fillStyle = char.color;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(char.content, char.x, char.y);
    close();
}

init(string);

var counter = 0,
    chars = [];

function draw() {
    if (counter < string.length * 50) {
        clear('#000');

        chars.push(new Char);

        for (var i = 0; i < chars.length; i++) {
            drawChar(chars[i]);
        }

        counter++;
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
