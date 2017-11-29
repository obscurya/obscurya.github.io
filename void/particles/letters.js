var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 480;

var string = 'МАКСИМКА';

clear('#fff');

function Char() {
    var pixel = pixels[random(0, pixels.length - 1)];

    this.x = pixel.x;
    this.y = pixel.y;

    while (pixel.free === false) {
        pixel = pixels[random(0, pixels.length - 1)];
        this.x = pixel.x;
        this.y = pixel.y;
    }

    pixel.free = false;

    this.content = string.charAt(random(0, string.length - 1));
    this.color = color(0, 0, 0, random(55, 255));
    this.size = random(5, 15);
}

var data = [],
    pixels = [];

function init(str) {
    clear('#fff');

    begin();
    c.fillStyle = '#000';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '700 ' + canvas.width / str.length + 'px sans-serif';
    c.fillText(str, canvas.width / 2, canvas.height / 2);
    close();

    data = c.getImageData(0, 0, canvas.width, canvas.height).data;

    var i = 0;

    for (var h = 0; h < canvas.height; h++) {
        for (var w = 0; w < canvas.width; w++) {
            var r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            if (r == 0 && g == 0 && b == 0) {
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
    c.font = char.size + 'px sans-serif';
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
    if (counter < string.length * 150) {
        clear('#fff');

        chars.push(new Char);

        for (var i = 0; i < chars.length; i++) {
            drawChar(chars[i]);
        }

        counter++;
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
