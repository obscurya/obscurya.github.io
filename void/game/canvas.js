function clear() {
    c.fillStyle = 'black';
    c.clearRect(0, 0, playground.width, playground.height);
    c.fillRect(0, 0, playground.width, playground.height);
}

function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomDouble(min, max) {
    return Math.random() * (max - min) + min;
}

function color(red, green, blue, alpha) {
    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha / 255 + ')';
}

function randomMonochromeColor(min, max) {
    var mono = random(min, max);
    return color(mono, mono, mono, 255);
}

function circle(x, y, r) {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.closePath();
}

function circleShadow(x, y, r, color, blur) {
    c.beginPath();
    c.fillStyle = 'transparent';
    c.shadowColor = color;
    c.shadowBlur = blur;
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.closePath();
}

function ring(x, y, r) {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.stroke();
    c.closePath();
}

function rect(x1, y1, x2, y2) {
    c.beginPath();
    c.fillRect(x1, y1, x2, y2);
    c.closePath();
}
