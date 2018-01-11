function random(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d'),
    img = new Image(),
    imgData;

function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#fff';
    c.fillRect(0, 0, canvas.width, canvas.height);
}

clear();

function color(r, g, b, a) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a / 255 + ')';
}

function getChunks(array, width, height, csx, csy) {
    var chunks = [],
        w = 0,
        ww = width,
        h = 0,
        hh = csy,
        k = 0,
        kk = 0,
        kkk = 0;

    while (true) {
        for (var j = h; j < hh; j++) {
            for (var i = w; i < ww; i += csx) {
                var tmp = [];

                if (i + csx > ww) {
                    tmp = array.slice(i, ww);
                } else {
                    tmp = array.slice(i, i + csx);
                }

                if (chunks[k] === undefined) chunks[k] = [];
                if (tmp.length) chunks[k] = chunks[k].concat(tmp);

                k++;
                kkk++;
            }

            k = kk;

            w += width;
            ww += width;
        }

        if (hh + csy > height) {
            hh = height;
        } else {
            hh += csy;
        }

        h += csy;

        if (h > height) {
            break;
        } else {
            kk = chunks.length;
            k = kk;
        }
    }

    return chunks;
}

var pixels = [],
    cells = [];

img.onload = function() {
    // canvas.width = img.width;
    // canvas.height = img.height;

    canvas.width = 500;
    canvas.height = 500;

    imgRatio = img.width / img.height;
    canvasRatio = canvas.width / canvas.height;

    if (imgRatio > canvasRatio) {
        canvas.height = canvas.width / imgRatio;
    } else {
        canvas.height = canvas.height / imgRatio;
    }

    c.drawImage(img, 0, 0, canvas.width, canvas.height);
    imgData = c.getImageData(0, 0, canvas.width, canvas.height);

    var size = { x: 100, y: 100 };

    for (var i = 0; i < imgData.data.length; i += 4) {
        var pixel = {};

        pixel.r = imgData.data[i];
        // pixel.g = pixel.r;
        // pixel.b = pixel.r;
        pixel.g = imgData.data[i + 1];
        pixel.b = imgData.data[i + 2];
        pixel.alpha = imgData.data[i + 3];

        pixels.push(pixel);
    }

    var chunks = getChunks(pixels, canvas.width, canvas.height, size.x, size.y);

    var k = 0;

    for (var i = 0; i < canvas.height; i += size.y) {
        for (var j = 0; j < canvas.width; j += size.x) {
            var cell = {};

            cell.x = j;
            cell.y = i;
            cell.w = size.x;
            cell.h = size.y;
            cell.pixels = chunks[k];

            cells.push(cell);

            k++;
        }
    }

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i],
            r = 0,
            g = 0,
            b = 0,
            alpha = 0;

        for (var j = 0; j < cell.pixels.length; j++) {
            var pixel = cell.pixels[j];

            r += pixel.r;
            g += pixel.g;
            b += pixel.b;
            alpha += pixel.alpha;
        }

        cell.r = Math.floor(r / cell.pixels.length);
        cell.g = Math.floor(g / cell.pixels.length);
        cell.b = Math.floor(b / cell.pixels.length);
        cell.alpha = Math.floor(alpha / cell.pixels.length);
    }

    clear();

    // setInterval(function () {
    //     clear();

        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            // var p = cell.pixels[random(0, cell.pixels.length - 1)];

            c.beginPath();
            c.fillStyle = color(cell.r, cell.g, cell.b, cell.alpha);
            // c.fillStyle = color(p.r, p.g, p.b, 255);
            c.fillRect(cell.x, cell.y, cell.w, cell.h);
            c.closePath();
        }
    // }, 1000 / 60);
};

img.src = 'img/doge.jpg';
