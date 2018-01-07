function Part(x, y, partColor, map) {
    this.x = x;
    this.y = y;
    this.color = partColor;
    this.map = map;
}

function Background(width, height) {
    this.partWidth = playground.width;
    this.partHeight = playground.height;
    this.width = this.partWidth * width;
    this.height = this.partHeight * height;
    this.x = (playground.width - this.width) / 2;
    this.y = (playground.height - this.height) / 2;
    this.parts = [];

    this.backgroundStyle = [];

    for (var i = 0; i < 10; i++) {
        var col = (i + 4) * 10;

        this.backgroundStyle.push(color(col, col, col, 255));
    }

    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
            var partColor = randomMonochromeColor(40, 70),
                map = [];

            for (var hh = 0; hh < height; hh += height / 15) {
                var tmp = [];
                for (var ww = 0; ww < width; ww += width / 15) {
                    tmp.push(random(0, 1));
                }
                map.push(tmp);
            }

            this.parts.push(new Part(this.partWidth * w, this.partHeight * h, partColor, map));
        }
    }

    this.draw = function () {
        // c.beginPath();
        for (var i = 0; i < this.parts.length; i++) {
            var p = this.parts[i];

            var x = this.x + p.x,
                y = this.y + p.y;

            var tmpX = x,
                tmpY = y,
                tmpWidth = this.partWidth / p.map[0].length,
                tmpHeight = this.partHeight / p.map[0].length;

            for (var j = 0; j < p.map.length; j++) {
                tmpX = x;
                for (var n = 0; n < p.map[j].length; n++) {
                    c.beginPath();
                    c.fillStyle = this.backgroundStyle[p.map[j][n]];
                    rect(tmpX, tmpY, tmpWidth, tmpHeight);
                    c.closePath();

                    tmpX += tmpWidth;
                }
                tmpY += tmpHeight;
            }

            // c.fillStyle = this.parts[i].color;
            // rect(x, y, this.partWidth, this.partHeight);
        }
        // c.closePath();

        // c.font = '64px sans-serif';
        // c.textAlign = 'center';
        // c.textBaseline = 'middle';
        //
        // c.beginPath();
        // for (var i = 0; i < this.parts.length; i++) {
        //     var x = this.x + this.parts[i].x,
        //         y = this.y + this.parts[i].y;
        //
        //     c.fillStyle = '#ddd';
        //     // c.fillText(i + 1, (x + this.partWidth) / 2, (y + this.partHeight) / 2);
        //     c.fillText(i + 1, x + this.partWidth / 2, y + this.partHeight / 2);
        // }
        // c.closePath();
    }
}
