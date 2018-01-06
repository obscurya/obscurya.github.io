function Part(x, y, partColor) {
    this.x = x;
    this.y = y;
    this.color = partColor;
}

function Background(width, height) {
    this.partWidth = playground.width;
    this.partHeight = playground.height;
    this.width = this.partWidth * width;
    this.height = this.partHeight * height;
    this.x = (playground.width - this.width) / 2;
    this.y = (playground.height - this.height) / 2;
    this.parts = [];

    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
            var partColor = randomMonochromeColor(40, 70);
            this.parts.push(new Part(this.partWidth * w, this.partHeight * h, partColor));
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
            // c.fillText(i + 1, (x + this.partWidth) / 2, (y + this.partHeight) / 2);
            c.fillText(i + 1, x + this.partWidth / 2, y + this.partHeight / 2);
        }
        c.closePath();
    }
}
