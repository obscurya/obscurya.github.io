var output = document.getElementById('output');

var substancesNumber,
    attributesNumber,
    clustersNumber,
    border,
    borderColor,
    opacity,
    before,
    after,
    c,
    substances,
    clusters;

function Substance(name, attributes) {
    this.name = name;
    this.attributes = attributes;
}

function getColor(r, g, b, alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha / 255 + ')';
}

function Cluster(group, distances) {
    this.group = group;
    this.distances = distances;
    this.color = {};
    this.color.r = Math.floor(Math.random() * 255);
    this.color.g = Math.floor(Math.random() * 255);
    this.color.b = Math.floor(Math.random() * 255);
}

function compareClusters(clusters, c1, c2) {
    var sum = [0, 0];

    for (var i = 0; i < clusters[c1].distances.length; i++) {
        sum[0] += clusters[c1].distances[i];
    }

    for (var i = 0; i < clusters[c2].distances.length; i++) {
        sum[1] += clusters[c2].distances[i];
    }

    return sum;
}

function create() {
    var w = 15,
        h = 15;

    var str = '';

    substancesNumber = Number(document.getElementById('substancesNumber').value);
    attributesNumber = Number(document.getElementById('attributesNumber').value);
    clustersNumber = Number(document.getElementById('clustersNumber').value);

    border = document.getElementById('border');
    borderColor = document.getElementById('borderColor');
    opacity = document.getElementById('opacity');

    before = document.getElementById('before');
    after = document.getElementById('after');
    c = before.getContext('2d');

    function clear(canvas) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = '#eee';
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    substances = [];

    for (var i = 0; i < substancesNumber; i++) {
        var name = 'Substance ' + i,
            attributes = [];

        for (var j = 0; j < attributesNumber; j++) {
            attributes.push(Math.random());
        }

        substances.push(new Substance(name, attributes));
    }

    clear(before);

    c.font = '14px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    if (opacity.checked) {
        c.fillStyle = getColor(255, 255, 255, 255 / 2);
        c.strokeStyle = getColor(0, 0, 0, 255 / 2);
    } else {
        c.fillStyle = getColor(255, 255, 255, 255);
        c.strokeStyle = getColor(0, 0, 0, 255);
    }
    c.lineWidth = 2;

    for (var i = 0; i < substances.length; i++) {
        var attr = substances[i].attributes,
            x = Math.floor(attr[0] * before.width - w / 2),
            y = Math.floor(attr[1] * before.height - h / 2);

        c.beginPath();
        c.fillRect(x, y, w, h);
        if (border.checked) {
            c.strokeRect(x, y, w, h);
        }
        // c.fillText(i, x, y - 7);
        c.closePath();
    }

    clusters = [];

    for (var i = 0; i < substances.length; i++) {
        var group = [],
            distances = [];

        for (var j = 0; j < substances.length; j++) {
            var distance = 0;

            for (var n = 0; n < substances[i].attributes.length; n++) {
                var d = substances[j].attributes[n] - substances[i].attributes[n];

                distance += d * d;
            }

            distance = Math.sqrt(distance);

            distances.push(distance);
        }

        group.push(i);
        clusters.push(new Cluster(group, distances));
    }

    while (clusters.length > clustersNumber) {
        var c1 = 0,
            c2 = 1,
            min = clusters[c1].distances[c2];

        for (var i = 0; i < clusters.length; i++) {
            for (var j = 0; j < clusters[i].distances.length; j++) {
                if (i !== j && clusters[i].distances[j] < min) {
                    min = clusters[i].distances[j];
                    c1 = i;
                    c2 = j;
                }
            }
        }

        var sum = compareClusters(clusters, c1, c2);

        if (sum[0] < sum[1]) {
            clusters[c1].group = clusters[c1].group.concat(clusters[c2].group);
            for (var i = 0; i < clusters.length; i++) {
                clusters[i].distances.splice(c2, 1);
            }
            clusters.splice(c2, 1);
        } else {
            clusters[c2].group = clusters[c2].group.concat(clusters[c1].group);
            for (var i = 0; i < clusters.length; i++) {
                clusters[i].distances.splice(c1, 1);
            }
            clusters.splice(c1, 1);
        }
    }

    c = after.getContext('2d');

    clear(after);

    c.font = '14px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#fff';
    c.strokeStyle = '#000';
    c.lineWidth = 2;

    // for (var i = 0; i < clusters.length; i++) {
    //     var color = clusters[i].color;
    //
    //     var mx = 0,
    //         my = 0;
    //
    //     for (var j = 0; j < clusters[i].group.length; j++) {
    //         var attr = substances[clusters[i].group[j]].attributes,
    //             x = attr[0],
    //             y = attr[1];
    //
    //         mx += x;
    //         my += y;
    //     }
    //
    //     mx = Math.floor(mx * after.width / clusters[i].group.length);
    //     my = Math.floor(my * after.height / clusters[i].group.length);
    //
    //     var dmax = 0;
    //
    //     for (var j = 0; j < clusters[i].group.length; j++) {
    //         var attr = substances[clusters[i].group[j]].attributes,
    //             x = Math.floor(attr[0] * after.width),
    //             y = Math.floor(attr[1] * after.height),
    //             dx = x - mx,
    //             dy = y - my,
    //             d = Math.sqrt(dx * dx + dy * dy);
    //
    //         if (d > dmax) dmax = d;
    //     }
    //
    //     c.fillStyle = getColor(color.r, color.g, color.b, 55);
    //     c.beginPath();
    //     c.arc(mx, my, dmax, 0, Math.PI * 2);
    //     c.fill();
    //     c.closePath();
    // }

    for (var i = 0; i < clusters.length; i++) {
        var color = clusters[i].color;

        if (opacity.checked) {
            c.fillStyle = getColor(color.r, color.g, color.b, 255 / 2);

            if (borderColor.checked) {
                c.strokeStyle = getColor(color.r, color.g, color.b, 255 / 2);
            } else {
                c.strokeStyle = getColor(0, 0, 0, 255 / 2);
            }
        } else {
            c.fillStyle = getColor(color.r, color.g, color.b, 255);

            if (borderColor.checked) {
                c.strokeStyle = getColor(color.r, color.g, color.b, 255);
            } else {
                c.strokeStyle = getColor(0, 0, 0, 255);
            }
        }

        for (var j = 0; j < clusters[i].group.length; j++) {
            var attr = substances[clusters[i].group[j]].attributes,
                x = Math.floor(attr[0] * after.width - w / 2),
                y = Math.floor(attr[1] * after.height - h / 2);

            c.beginPath();
            c.fillRect(x, y, w, h);
            if (border.checked) {
                c.strokeRect(x, y, w, h);
            }
            c.closePath();
        }
    }

    output.innerHTML = str;
}

create();
