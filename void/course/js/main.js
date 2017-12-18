var path = 'json/',
    data = {},
    output = document.getElementById('output'),
    h,
    preJSON,
    table,
    divCanvas;

function clearOutput() {
    output.innerHTML = '<div id="h"></div><div id="divCanvas"></div><div id="table"></div><pre id="json"></pre>';
    h = document.getElementById('h');
    preJSON = document.getElementById('json');
    divCanvas = document.getElementById('divCanvas');
    table = document.getElementById('table');
}

function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomDate(startDate, endDate) {
    startDate = startDate.getTime();
    endDate = endDate.getTime();

    var date = new Date(startDate + Math.random() * (endDate - startDate));

    return Date.parse(date);
}

// сохранение всех данных
function saveData(data, fileName, type) {
    data = JSON.stringify(data, null, 4);

    var a = document.createElement('a'),
        file = new Blob([data], {type: type});

    a.href = window.URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(fileName);
}

// загрузка всех данных
function loadData() {
    clearOutput();

    data = {};

    $.getJSON(path + 'data.json', function (json) {
        data = json;

        preJSON.innerHTML = JSON.stringify(data, null, 4);
    });
}

//генерация новых данных
function createData(length) {
    function Customer(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    function City(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
    }

    function Courier(id, name, phone) {
        this.id = id;
        this.name = name;
        this.phone = phone;
    }

    function Cargo(id, name) {
        this.id = id;
        this.name = name;
    }

    function Order(id, customerId, cargoId, cityId, couriersId, driverId, startDate, endDate) {
        this.id = id;
        this.customerId = customerId;
        this.cargoId = cargoId;
        this.cityId = cityId;
        this.couriersId = couriersId;
        this.driverId = driverId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    data = {};

    data.customers = [];
    data.cities = [];
    data.couriers = [];
    data.drivers = [];
    data.cargoes = [];
    data.orders = [];

    $.getJSON(path + 'create.json', function (json) {
        var names = json.names,
            cities = json.cities,
            couriers = json.couriers,
            drivers = json.drivers,
            cargoes = json.cargoes;

        for (var i = 0; i < length; i++) {
            var id = i,
                name = names[random(0, names.length - 1)],
                age = random(18, 70);

            data.customers.push(new Customer(id, name, age));
        }

        for (var i = 0; i < cities.length; i++) {
            var id = i,
                name = cities[i].name,
                x = cities[i].x,
                y = cities[i].y;

            data.cities.push(new City(id, name, x, y));
        }

        for (var i = 0; i < couriers.length; i++) {
            var id = i,
                name = couriers[i],
                phone = random(10000000000, 99999999999);

            data.couriers.push(new Courier(id, name, phone));
        }

        for (var i = 0; i < drivers.length; i++) {
            var id = i,
                name = drivers[i],
                phone = random(10000000000, 99999999999);

            data.drivers.push(new Courier(id, name, phone));
        }

        for (var i = 0; i < cargoes.length; i++) {
            var id = i,
                name = cargoes[i];

            data.cargoes.push(new Cargo(id, name));
        }

        for (var i = 0; i < length * 10; i++) {
            var id = i,
                customerId = data.customers[random(0, data.customers.length - 1)].id,
                cargoId = data.cargoes[random(0, data.cargoes.length - 1)].id,
                cityId = data.cities[random(1, data.cities.length - 1)].id,
                couriersId = [],
                driverId = data.drivers[random(0, data.drivers.length - 1)].id,
                startDate = randomDate(new Date(2015, 0, 1), new Date()),
                endDate = randomDate(new Date(startDate), new Date(startDate + 5 * 24 * 60 * 60 * 1000));

            for (var j = 0; j < random(1, data.couriers.length / 2); j++) {
                var courierId = data.couriers[random(0, data.couriers.length - 1)].id;

                while (couriersId.indexOf(courierId) !== -1) {
                    courierId = data.couriers[random(0, data.couriers.length - 1)].id;
                }

                couriersId.push(courierId);
            }

            data.orders.push(new Order(id, customerId, cargoId, cityId, couriersId, driverId, startDate, endDate));
        }

        saveData(data, 'data.json', 'text/plain');
    });
}

loadAllOrders();

function loadAllOrders() {
    clearOutput();

    data = {};

    $.getJSON(path + 'data.json', function (json) {
        data = json;

        var lineWidthMax = 10;

        h.innerHTML = '<h1>Просмотр всех заказов</h1>';
        divCanvas.innerHTML = '<canvas id="canvas"></canvas>';

        var canvas = document.getElementById('canvas'),
            c = canvas.getContext('2d');

        canvas.width = 640;
        canvas.height = 480;

        c.clearRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = '#fff';

        c.fillRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = '#ECEFF1';
        c.lineWidth = 2;
        c.strokeStyle = '#B0BEC5';

        c.beginPath();
        c.moveTo(0.1 * canvas.width, 0.6 * canvas.height);
        c.lineTo(0.2 * canvas.width, 0.4 * canvas.height);
        c.lineTo(0.6 * canvas.width, 0.1 * canvas.height);
        c.lineTo(0.85 * canvas.width, 0.15 * canvas.height);
        c.lineTo(0.95 * canvas.width, 0.5 * canvas.height);
        c.lineTo(0.8 * canvas.width, 0.7 * canvas.height);
        c.lineTo(0.6 * canvas.width, 0.8 * canvas.height);
        c.closePath();
        c.fill();
        c.stroke();

        var sums = [],
            sumMax = 0,
            sumMin = data.orders.length;

        for (var i = 1; i < data.cities.length; i++) {
            var sum = 0;

            for (var j = 0; j < data.orders.length; j++) {
                if (data.orders[j].cityId === i) {
                    sum++;
                }
            }

            if (sum > sumMax) {
                sumMax = sum;
            }

            if (sum < sumMin) {
                sumMin = sum;
            }

            sums.push(sum);
        }

        var j = 0;

        for (var i = 1; i < data.cities.length; i++) {
            var n = 1 - (sumMax - sums[j]) / (sumMax - 0);

            c.lineWidth = n * lineWidthMax;
            c.strokeStyle = 'rgba(55, 85, 155, ' + n + ')';
            // c.strokeStyle = 'rgba(0, 0, 0, ' + n + ')';

            c.beginPath();
            c.moveTo(data.cities[0].x * canvas.width, data.cities[0].y * canvas.height);
            c.lineTo(data.cities[i].x * canvas.width, data.cities[i].y * canvas.height);
            c.stroke();
            c.closePath();

            c.beginPath();
            c.fillStyle = '#000';
            c.textAlign = 'left';
            c.textBaseline = 'middle';
            c.font = '14px sans-serif';
            c.fillText(data.cities[i].name + ' = ' + sums[j] + ' отправлений (' + (sums[j] / data.orders.length * 100).toFixed(2) + '%)', 10, (j + 1) * 20);
            c.closePath();

            j++;
        }

        for (var i = 0; i < data.cities.length; i++) {
            var city = data.cities[i],
                radius = city.name.length * 5;

            if (i === 0) {
                c.font = '16px sans-serif';
                radius = city.name.length * 6;
            } else {
                c.font = '11px sans-serif';
            }

            c.beginPath();
            c.fillStyle = 'rgba(255, 255, 255, 1)';
            c.lineWidth = 1;
            c.strokeStyle = 'rgb(55, 85, 155)';
            // c.fillStyle = '#FFF9C4';
            c.arc(city.x * canvas.width, city.y * canvas.height, radius, 0, Math.PI * 2);
            c.fill();
            c.stroke();
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.fillStyle = '#000';
            c.fillText(city.name, city.x * canvas.width, city.y * canvas.height);
            c.closePath();
        }

        c.beginPath();
        c.fillStyle = '#000';
        c.font = '24px sans-serif';
        c.fillText('Ивановская область', canvas.width / 2, 0.85 * canvas.height);
        c.closePath();

        var str = '',
            orders = data.orders;

        str += '<table>';
        str += '<tr><td>id</td><td>Заказчик</td><td>Груз</td><td>Пункт назначения</td><td>Водитель</td><td>Сопровождение</td><td>Дата открытия заказа</td><td>Дата закрытия заказа</td></tr>';
        for (var i = 0; i < orders.length; i++) {
        // for (var i = 0; i < 5; i++) {
            var order = orders[i];

            str += '<tr>';
            str += '<td>' + order.id + '</td>';
            str += '<td>' + data.customers[order.customerId].name + '</td>';
            str += '<td>' + data.cargoes[order.cargoId].name + '</td>';
            str += '<td>' + data.cities[order.cityId].name + '</td>';
            str += '<td>' + data.drivers[order.driverId].name + '</td>';
            str += '<td>';
            for (var j = 0; j < order.couriersId.length; j++) {
                str += '<p>' + data.couriers[order.couriersId[j]].name + '</p>';
            }
            str += '</td>';
            str += '<td>' + new Date(order.startDate).toLocaleString() + '</td>';
            str += '<td>' + new Date(order.endDate).toLocaleString() + '</td>';
            str += '</tr>';
        }
        str += '</table>';

        table.innerHTML = str;
        // preJSON.innerHTML = JSON.stringify(data.orders, null, 4);
    });
}
