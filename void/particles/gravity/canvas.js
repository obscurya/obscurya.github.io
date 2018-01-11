function random(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

function color(r, g, b, a) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a / 255 + ')';
}

function getRandomSign() {
    if (Math.random() > 0.5) {
        return 1;
    } else {
        return -1;
    }
}

function clear(color) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function rect(x, y, w, h, color) {
    var hw = Math.floor(w / 2),
        hh = Math.floor(h / 2);

    c.beginPath();
    c.fillStyle = color;
    c.fillRect(x - hw, y - hh, w, h);
    c.closePath();
}

function circle(x, y, r, color) {
    c.beginPath();
    c.fillStyle = color;
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.closePath();
}

function line(x1, y1, x2, y2, width, color) {
    c.beginPath();
    c.lineWidth = width;
    c.strokeStyle = color;
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.closePath();
}
