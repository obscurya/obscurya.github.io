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

function randomPhone() {
    return random(80000000000, 89999999999);
}

function randomColor(alpha) {
    return 'rgba(' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ',' + alpha + ')';
}

function calculatePrice(data, cargoId, weight, cityId, couriersNumber, packageId) {
    var ratio = data.cargoes[cargoId].ratio,
        distance = data.cities[cityId].distance,
        packagePrice = data.packages[packageId].price;

    return ratio * 10 + weight * 100 + distance * 2 + couriersNumber * 10 + packagePrice;
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
    function Group(id, group, description) {
        this.id = id;
        this.group = group;
        this.description = description;
    }

    function Customer(id, name, date, phone) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.phone = phone;
        this.orders = [];
    }

    function City(id, name, x, y, distance) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.distance = distance;
        this.orders = [];
    }

    function Courier(id, name, phone, salary) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.salary = salary;
        this.orders = [];
    }

    function Cargo(id, name, ratio) {
        this.id = id;
        this.name = name;
        this.ratio = ratio;
        this.orders = [];
    }

    function Package(id, name, size, price) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.price = price;
        this.purchase = this.price / 2;
        this.storage = this.price * 2;
        this.orders = [];
    }

    function Car(id, name, body, priceForRepair, color) {
        this.id = id;
        this.name = name;
        this.body = body;
        this.priceForRepair = priceForRepair;
        this.color = color;
        this.orders = [];
    }

    function Order(id, customerId, cargoId, packageId, cityId, couriersId, driverId, carId, weight, price, startDate, endDate) {
        this.id = id;
        this.customerId = customerId;
        this.cargoId = cargoId;
        this.packageId = packageId;
        this.cityId = cityId;
        this.couriersId = couriersId;
        this.driverId = driverId;
        this.carId = carId;
        this.weight = weight;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    data = {};

    data.groups = [];
    data.customers = [];
    data.cities = [];
    data.couriers = [];
    data.drivers = [];
    data.cargoes = [];
    data.packages = [];
    data.cars = [];
    data.orders = [];

    $.getJSON(path + 'create.json', function (json) {
        var groups = json.groups,
            names = json.names,
            cities = json.cities,
            couriers = json.couriers,
            drivers = json.drivers,
            cargoes = json.cargoes,
            packages = json.packages;
            cars = json.cars;

        for (var i = 0; i < json.groups.length; i++) {
            var group = json.groups[i].group,
                description = json.groups[i].description;

            data.groups.push(new Group(i, group, description));
        }

        for (var i = 0; i < json.names.length; i++) {
            var name = names[i],
                date = randomDate(new Date(1937, 0, 1), new Date(1997, 0, 1)),
                phone = randomPhone();

            data.customers.push(new Customer(i, name, date, phone));
        }

        for (var i = 0; i < cities.length; i++) {
            var name = cities[i].name,
                x = cities[i].x,
                y = cities[i].y,
                distance = cities[i].distance;

            data.cities.push(new City(i, name, x, y, distance));
        }

        for (var i = 0; i < couriers.length; i++) {
            var name = couriers[i],
                phone = randomPhone(),
                salary = random(20000, 30000);

            data.couriers.push(new Courier(i, name, phone, salary));
        }

        for (var i = 0; i < drivers.length; i++) {
            var name = drivers[i],
                phone = randomPhone(),
                salary = random(20000, 30000);

            data.drivers.push(new Courier(i, name, phone, salary));
        }

        for (var i = 0; i < cargoes.length; i++) {
            var name = cargoes[i].name,
                ratio = cargoes[i].ratio;

            data.cargoes.push(new Cargo(i, name, ratio));
        }

        for (var i = 0; i < packages.length; i++) {
            var name = packages[i].name,
                size = packages[i].size,
                price = packages[i].price;

            data.packages.push(new Package(i, name, size, price));
        }

        for (var i = 0; i < cars.length; i++) {
            var name = cars[i].name,
                body = cars[i].body,
                priceForRepair = cars[i].priceForRepair,
                color = randomColor(0.5);

            data.cars.push(new Car(i, name, body, priceForRepair, color));
        }

        for (var i = 0; i < length; i++) {
            var customerId = data.customers[random(0, data.customers.length - 1)].id,
                cargoId = data.cargoes[random(0, data.cargoes.length - 1)].id,
                packageId = 0,
                cityId = data.cities[random(1, data.cities.length - 1)].id,
                couriersId = [],
                driverId = data.drivers[random(0, data.drivers.length - 1)].id,
                carId = data.cars[random(0, data.cars.length - 1)].id,
                startDate = randomDate(new Date(2015, 0, 1), new Date()),
                endDate = randomDate(new Date(startDate), new Date(startDate + 5 * 24 * 60 * 60 * 1000)),
                size = [],
                weight = 0,
                price = 0;

            data.customers[customerId].orders.push(i);
            data.cities[cityId].orders.push(i);
            data.drivers[driverId].orders.push(i);
            data.cargoes[cargoId].orders.push(i);
            data.cars[carId].orders.push(i);

            if (cargoId == 0) {
                weight = random(1, 250) / 1000;
                packageId = random(0, 2);
            } else if (cargoId == 1) {
                weight = random(1, 5000) / 1000;
                packageId = random(0, 2);
            } else {
                weight = random(500, 25000) / 1000;
                packageId = random(3, data.packages.length - 1);
            }

            data.packages[packageId].orders.push(i);

            for (var j = 0; j < random(1, data.couriers.length / 2); j++) {
                var courierId = data.couriers[random(0, data.couriers.length - 1)].id;

                while (couriersId.indexOf(courierId) !== -1) {
                    courierId = data.couriers[random(0, data.couriers.length - 1)].id;
                }

                couriersId.push(courierId);
                data.couriers[courierId].orders.push(i);
            }

            price = calculatePrice(data, cargoId, weight, cityId, couriersId.length, packageId);

            data.orders.push(new Order(i, customerId, cargoId, packageId, cityId, couriersId, driverId, carId, weight, price, startDate, endDate));
        }

        saveData(data, 'data.json', 'text/plain');
    });
}

home();

function home() {
    clearOutput();

    h.innerHTML = '<h1>RAM</h1>';
    table.innerHTML = '<h2>Resource Analysis Master</h2><p>Версия 1.13.146</p>';
}

// loadAllOrders();

function loadAllOrders() {
    clearOutput();

    data = {};

    $.getJSON(path + 'data.json', function (json) {
        data = json;

        var lineWidthMax = 10;

        h.innerHTML = '<h1>Таблица заказов</h1>';
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
            sumMin = data.orders.length,
            money = [],
            profit = 0;

        for (var i = 1; i < data.cities.length; i++) {
            var sum = 0,
                m = 0;

            for (var j = 0; j < data.orders.length; j++) {
                if (data.orders[j].cityId === i) {
                    sum++;
                    m += data.orders[j].price;
                }
            }

            if (sum > sumMax) {
                sumMax = sum;
            }

            if (sum < sumMin) {
                sumMin = sum;
            }

            profit += m;

            sums.push(sum);
            money.push(m);
        }

        var j = 0;

        for (var i = 1; i < data.cities.length; i++) {
            var n = 1 - (sumMax - sums[j]) / (sumMax - 0);

            c.lineWidth = n * lineWidthMax;
            c.strokeStyle = 'rgba(55, 85, 155, ' + n + ')';

            c.beginPath();
            c.moveTo(data.cities[0].x * canvas.width, data.cities[0].y * canvas.height);
            c.lineTo(data.cities[i].x * canvas.width, data.cities[i].y * canvas.height);
            c.stroke();
            c.closePath();

            j++;
        }

        for (var i = 0; i < data.cities.length; i++) {
            var city = data.cities[i],
                radius = lineWidthMax,
                left = 0;

            if (i === 0) {
                c.font = '16px sans-serif';
                radius *= 1.5;
                left = 45;
            } else {
                c.font = '12px sans-serif';
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
            c.fillText(city.name, city.x * canvas.width - left, city.y * canvas.height - (lineWidthMax * 2.5));
            c.closePath();
        }

        c.beginPath();
        c.fillStyle = '#000';
        c.font = '24px sans-serif';
        c.fillText('Ивановская область', canvas.width / 2, 0.85 * canvas.height);
        c.closePath();

        var str = '',
            orders = data.orders,
            sumYear = 0;

        for (var y = 2017; y > 2014; y--) {
            sumYear = 0;

            str += '<h2>' + y + '</h2>';
            str += '<table>';
            str += '<tr><td>id</td><td>Заказчик</td><td>Цена, руб.</td><td>Груз</td><td>Упаковка</td><td>Вес, кг</td><td>Пункт назначения</td><td>Машина</td><td>Водитель</td><td>Сопровождение</td><td>Дата открытия заказа</td><td>Дата закрытия заказа</td></tr>';
            for (var i = 0; i < orders.length; i++) {
                var d = new Date(orders[i].startDate);

                if (d.getFullYear() == y) {
                    var order = orders[i];

                    sumYear += order.price;

                    str += '<tr>';
                    str += '<td>' + order.id + '</td>';
                    str += '<td>' + data.customers[order.customerId].name + '</td>';
                    str += '<td>' + order.price.toFixed(2) + '</td>';
                    str += '<td>' + data.cargoes[order.cargoId].name + '</td>';
                    str += '<td>' + data.packages[order.packageId].name + '</td>';
                    str += '<td>' + order.weight.toFixed(3) + '</td>';
                    str += '<td>' + data.cities[order.cityId].name + '</td>';
                    str += '<td>' + data.cars[order.carId].name + '</td>';
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
            }
            str += '</table>';
            str += '<p id="sum">Выгода за год: ' + sumYear.toFixed(2) + '</p>';
        }

        table.innerHTML = str;
    });
}

function loadOrders(data, orders) {
    var str = '';

    str += '<table>';
    str += '<tr><td>id</td><td>Заказчик</td><td>Цена, руб.</td><td>Груз</td><td>Упаковка</td><td>Вес, кг</td><td>Пункт назначения</td><td>Машина</td><td>Водитель</td><td>Сопровождение</td><td>Дата открытия заказа</td><td>Дата закрытия заказа</td></tr>';
    for (var i = 0; i < orders.length; i++) {
        var order = data.orders[orders[i]];

        str += '<tr>';
        str += '<td>' + order.id + '</td>';
        str += '<td>' + data.customers[order.customerId].name + '</td>';
        str += '<td>' + order.price.toFixed(2) + '</td>';
        str += '<td>' + data.cargoes[order.cargoId].name + '</td>';
        str += '<td>' + data.packages[order.packageId].name + '</td>';
        str += '<td>' + order.weight.toFixed(3) + '</td>';
        str += '<td>' + data.cities[order.cityId].name + '</td>';
        str += '<td>' + data.cars[order.carId].name + '</td>';
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

    return str;
}

function loadCustomer(data, id) {
    clearOutput();

    var customer = data.customers[id];

    h.innerHTML = '<h1>Данные о клиенте ' + customer.name + '</h1>';

    table.innerHTML = loadOrders(data, customer.orders);
}

function loadCity(data, id) {
    clearOutput();

    var city = data.cities[id];

    h.innerHTML = '<h1>Данные о пункте назначения ' + city.name + '</h1>';

    table.innerHTML = loadOrders(data, city.orders);
}

function loadCourier(data, id) {
    clearOutput();

    var courier = data.couriers[id];

    h.innerHTML = '<h1>Данные о фельдъегере ' + courier.name + '</h1>';

    table.innerHTML = loadOrders(data, courier.orders);
}

function loadDriver(data, id) {
    clearOutput();

    var driver = data.drivers[id];

    h.innerHTML = '<h1>Данные о водителе ' + driver.name + '</h1>';

    table.innerHTML = loadOrders(data, driver.orders);
}

function loadCargo(data, id) {
    clearOutput();

    var cargo = data.cargoes[id];

    h.innerHTML = '<h1>Данные о грузе ' + cargo.name + '</h1>';

    table.innerHTML = loadOrders(data, cargo.orders);
}

function loadPackage(data, id) {
    clearOutput();

    var p = data.packages[id];

    h.innerHTML = '<h1>Данные об упаковке ' + p.name + '</h1>';

    table.innerHTML = loadOrders(data, p.orders);
}

function loadCar(data, id) {
    clearOutput();

    var car = data.cars[id];

    h.innerHTML = '<h1>Данные о транспорте ' + car.name + '</h1>';

    table.innerHTML = loadOrders(data, car.orders);
}

// loadTables();

function loadTables() {
    clearOutput();

    data = {};

    $.getJSON(path + 'data.json', function (json) {
        data = json;

        h.innerHTML = '<h1>Другие таблицы</h1>';
        // divCanvas.innerHTML = '<canvas id="canvas"></canvas>';

        var str = '';

        str += '<h2>Клиенты</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>ФИО</td><td>Дата рождения</td><td>Номер телефона</td></tr>';
        for (var i = 0; i < data.customers.length; i++) {
            var customer = data.customers[i];

            str += '<tr onclick="loadCustomer(data, ' + customer.id + ');">';

            str += '<td>' + customer.id + '</td>';
            str += '<td>' + customer.name + '</td>';

            var d = new Date(customer.date),
                age = (new Date()).getFullYear() - d.getFullYear(),
                options = {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                };

            str += '<td>' + d.toLocaleString('ru', options) + ' (' + age + ')' + '</td>';
            str += '<td>' + customer.phone + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>Пункты назначения</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>Город</td><td>Расстояние от Иванова, км</td></tr>';
        for (var i = 1; i < data.cities.length; i++) {
            var city = data.cities[i];

            str += '<tr onclick="loadCity(data, ' + city.id + ');">';

            str += '<td>' + city.id + '</td>';
            str += '<td>' + city.name + '</td>';
            str += '<td>' + city.distance + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>Фельдъегеря</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>ФИО</td><td>Номер телефона</td><td>Зарплата, руб.</td></tr>';
        for (var i = 0; i < data.couriers.length; i++) {
            var courier = data.couriers[i];

            str += '<tr onclick="loadCourier(data, ' + courier.id + ');">';

            str += '<td>' + courier.id + '</td>';
            str += '<td>' + courier.name + '</td>';
            str += '<td>' + courier.phone + '</td>';
            str += '<td>' + courier.salary + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>Водители</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>ФИО</td><td>Номер телефона</td><td>Зарплата, руб.</td></tr>';
        for (var i = 0; i < data.drivers.length; i++) {
            var driver = data.drivers[i];

            str += '<tr onclick="loadDriver(data, ' + driver.id + ');">';

            str += '<td>' + driver.id + '</td>';
            str += '<td>' + driver.name + '</td>';
            str += '<td>' + driver.phone + '</td>';
            str += '<td>' + driver.salary + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>Перевозимые грузы</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>Название</td></tr>';
        for (var i = 0; i < data.cargoes.length; i++) {
            var cargo = data.cargoes[i];

            str += '<tr onclick="loadCargo(data, ' + cargo.id + ');">';

            str += '<td>' + cargo.id + '</td>';
            str += '<td>' + cargo.name + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>Упаковки</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>Название</td><td>Размер</td><td>Цена, руб.</td><td>Стоимость закупки, руб.</td><td>Стоимость хранения, руб.</td></tr>';
        for (var i = 0; i < data.packages.length; i++) {
            var p = data.packages[i];

            str += '<tr onclick="loadPackage(data, ' + p.id + ');">';

            str += '<td>' + p.id + '</td>';
            str += '<td>' + p.name + '</td>';
            str += '<td>' + p.size + '</td>';
            str += '<td>' + p.price + '</td>';
            str += '<td>' + p.purchase + '</td>';
            str += '<td>' + p.storage + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>Транспорт</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>Название</td><td>Кузов</td><td>Цена за ежемесячное обслуживание, руб.</td></tr>';
        for (var i = 0; i < data.cars.length; i++) {
            var car = data.cars[i];

            str += '<tr onclick="loadCar(data, ' + car.id + ');">';

            str += '<td>' + car.id + '</td>';
            str += '<td>' + car.name + '</td>';
            str += '<td>' + car.body + '</td>';
            str += '<td>' + car.priceForRepair + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        table.innerHTML = str;
    });
}

analysis(2017);

function analysis(year) {
    clearOutput();

    data = {};

    $.getJSON(path + 'data.json', function (json) {
        data = json;

        function Car(id, usageCar) {
            this.id = id;
            this.usageCar = usageCar;
        }

        function Package(id, price, count, profit) {
            this.id = id;
            this.price = price;
            this.count = count;
            this.profit = profit;
            this.rate = 0;
        }

        function Cluster(products, distances, sum) {
            this.products = products;
            this.distances = distances;
            this.sum = sum;
            this.profit = 0;
            this.rate = 0;
            this.stock = 0;
            this.abc = 0;
            this.blocks = [0, 0, 0, 0];
            this.average = 0;
            this.meanSquare = 0;
            this.variation = 0;
            this.xyz = 0;
        }

        var padding = 30;

        h.innerHTML = '<h1>Анализ ресурсов за ' + year + ' год</h1>';
        divCanvas.innerHTML = '<canvas id="canvas"></canvas>';

        var canvas = document.getElementById('canvas'),
            c = canvas.getContext('2d');

        canvas.width = 640;
        canvas.height = 360;

        c.clearRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = '#fff';

        c.fillRect(0, 0, canvas.width, canvas.height);

        var cars = [],
            usageMax = 0;

        for (var i = 0; i < data.cars.length; i++) {
            var car = data.cars[i],
                usageCar = [];

            for (var month = 0; month < 12; month++) {
                var usage = 0;

                for (var j = 0; j < car.orders.length; j++) {
                    var order = data.orders[car.orders[j]],
                        d = new Date(order.startDate);

                    if (d.getFullYear() == year && d.getMonth() == month) {
                        usage++;
                    }
                }

                usageCar.push(usage);

                if (usage > usageMax) {
                    usageMax = usage;
                }
            }

            cars.push(new Car(i, usageCar));
        }

        var stepW = Math.floor((canvas.width - padding * 2) / 11),
            stepH = (canvas.height - padding * 2) / usageMax;

        for (var i = padding; i <= canvas.height - padding; i += stepH) {
            c.beginPath();
            c.strokeStyle = '#CFD8DC';
            c.lineWidth = 1;
            c.moveTo(padding, i);
            c.lineTo(canvas.width - padding, i);
            c.stroke();
            c.closePath();
        }

        c.beginPath();
        c.fillStyle = '#000';
        c.font = '10px sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(usageMax, padding / 2, padding);
        c.closePath();

        var month = 1;

        for (var x = padding; x <= canvas.width - padding; x += stepW) {
            c.beginPath();
            c.strokeStyle = '#CFD8DC';
            c.lineWidth = 1;
            c.moveTo(x, padding);
            c.lineTo(x, canvas.height - padding);
            c.stroke();
            c.closePath();

            c.beginPath();
            c.fillStyle = '#000';
            c.font = '10px sans-serif';
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.fillText(month, x, canvas.height - padding / 2);
            c.closePath();

            month++;
        }

        for (var i = 0; i < cars.length; i++) {
            var car = cars[i],
                color = data.cars[car.id].color,
                x = padding;

            c.beginPath();
            c.strokeStyle = color;
            c.lineWidth = 5;
            for (var j = 0; j < car.usageCar.length; j++) {
                var usage = ((usageMax - car.usageCar[j]) / (usageMax - 0)) * (canvas.height - padding * 2) + padding;

                c.lineTo(x, usage);

                x += stepW;
            }
            c.stroke();
            c.closePath();
        }

        var packages = [],
            totalProfit = 0;

        for (var i = 0; i < data.packages.length; i++) {
            var p = data.packages[i],
                count = 0;

            for (var j = 0; j < p.orders.length; j++) {
                var order = data.orders[p.orders[j]],
                    d = new Date(order.startDate);

                if (d.getFullYear() == year) {
                    count++;
                }
            }

            var profit = p.price * count;

            totalProfit += profit;

            packages.push(new Package(i, p.price, count, profit));
        }

        for (var i = 0; i < packages.length; i++) {
            packages[i].rate = packages[i].profit / totalProfit;
        }

        var clustersTmp = [];

        for (var i = 0; i < packages.length; i++) {
            var p1 = packages[i],
                products = [i],
                distances = [],
                sum = 0;

            for (var j = 0; j < packages.length; j++) {
                var p2 = packages[j],
                    distance;

                if (i === j) {
                    distance = 0;
                } else {
                    var dx = p2.price - p1.price,
                        dy = p2.profit - p1.profit;

                    distance = Math.sqrt(dx * dx + dy * dy);
                }

                sum += distance;

                distances.push(distance);
            }

            clustersTmp.push(new Cluster(products, distances, sum));
        }

        var clustersNumber = clustersTmp.length;

        while (clustersNumber > 3) {
            var distanceMin = 10000000,
                cluster1 = 0,
                cluster2 = 0;

            for (var i = 0; i < clustersTmp.length; i++) {
                if (clustersTmp[i].products !== 0) {
                    for (var j = 0; j < clustersTmp[i].distances.length; j++) {
                        if (clustersTmp[i].distances[j] < distanceMin && clustersTmp[i].distances[j] !== -1 && i !== j) {
                            distanceMin = clustersTmp[i].distances[j];
                            cluster1 = i;
                            cluster2 = j;
                        }
                    }
                }
            }

            if (clustersTmp[cluster1].sum > clustersTmp[cluster2].sum) {
                for (var i = 0; i < clustersTmp.length; i++) {
                    clustersTmp[i].distances[cluster1] = -1;
                }

                clustersTmp[cluster2].products = clustersTmp[cluster2].products.concat(clustersTmp[cluster1].products);
                clustersTmp[cluster1].products = 0;
            } else {
                for (var i = 0; i < clustersTmp.length; i++) {
                    clustersTmp[i].distances[cluster2] = -1;
                }

                clustersTmp[cluster1].products = clustersTmp[cluster1].products.concat(clustersTmp[cluster2].products);
                clustersTmp[cluster2].products = 0;
            }

            clustersNumber--;
        }

        var clusters = [];

        for (var i = 0; i < clustersTmp.length; i++) {
            if (clustersTmp[i].products !== 0) {
                clustersTmp[i].products.sort();

                for (var j = 0; j < clustersTmp[i].products.length; j++) {
                    var p = packages[clustersTmp[i].products[j]];

                    clustersTmp[i].profit += p.profit;
                    clustersTmp[i].rate += p.rate;
                }

                clustersTmp[i].stock = clustersTmp[i].rate;

                clusters.push(clustersTmp[i]);
            }
        }

        clusters.sort(function (a, b) {
            return b.rate - a.rate;
        });

        for (var i = 1; i < clusters.length; i++) {
            clusters[i].stock += clusters[i - 1].stock;
        }

        for (var i = 0; i < clusters.length; i++) {
            if (clusters[i].stock * 100 < 80) {
                clusters[i].abc = data.groups[0].id;
            } else if (clusters[i].stock * 100 >= 80 && clusters[i].stock * 100 <= 95) {
                clusters[i].abc = data.groups[1].id;
            } else {
                clusters[i].abc = data.groups[2].id;
            }
        }

        for (var i = 0; i < clusters.length; i++) {
            for (var j = 0; j < clusters[i].products.length; j++) {
                var p = data.packages[clusters[i].products[j]];

                for (var k = 0; k < p.orders.length; k++) {
                    var order = data.orders[p.orders[k]],
                        d = new Date(order.startDate);

                    if (d.getFullYear() == year) {
                        var blockNumber = 0,
                            month = d.getMonth();

                        if (month >= 0 && month <= 2) {
                            blockNumber = 0;
                        } else if (month >= 3 && month <= 5) {
                            blockNumber = 1;
                        } else if (month >= 6 && month <= 8) {
                            blockNumber = 2;
                        } else {
                            blockNumber = 3;
                        }

                        clusters[i].blocks[blockNumber]++;
                    }
                }
            }

            var sum = 0,
                meanSquare = 0;

            for (var j = 0; j < clusters[i].blocks.length; j++) {
                sum += clusters[i].blocks[j];
            }

            clusters[i].average = sum / 4;

            for (var j = 0; j < clusters[i].blocks.length; j++) {
                meanSquare += (clusters[i].blocks[j] - clusters[i].average) * (clusters[i].blocks[j] - clusters[i].average);
            }

            clusters[i].meanSquare = Math.sqrt(meanSquare / 4);
            clusters[i].variation = clusters[i].meanSquare / clusters[i].average;

            if (clusters[i].variation * 100 < 10) {
                clusters[i].xyz = data.groups[3].id;
            } else if (clusters[i].variation * 100 >= 10 && clusters[i].variation * 100 <= 25) {
                clusters[i].xyz = data.groups[4].id;
            } else {
                clusters[i].xyz = data.groups[5].id;
            }
        }

        var str = '';

        str += '<h2>Спрос на упаковочные материалы</h2>';
        str += '<table>';
        str += '<tr><td>id</td><td>Упаковка</td><td>Цена, руб.</td><td>Продано, шт.</td><td>Выручка, руб.</td><td>Доля, %</td></tr>';
        for (var i = 0; i < packages.length; i++) {
            str += '<tr>';

            var p = packages[i];

            str += '<td>' + p.id + '</td>';
            str += '<td>' + data.packages[p.id].name + '</td>';
            str += '<td>' + p.price + '</td>';
            str += '<td>' + p.count + '</td>';
            str += '<td>' + p.profit + '</td>';
            str += '<td>' + (p.rate * 100).toFixed(2) + '</td>';

            str += '</tr>';
        }
        str += '<tr><td></td><td>Всего</td><td></td><td></td><td>' + totalProfit + '</td><td>100</td></tr>';
        str += '</table>';

        str += '<h2>ABC-анализ</h2>';
        str += '<table>';
        str += '<tr><td>Кластер</td><td>Упаковки</td><td>Выручка, руб.</td><td>Доля, %</td><td>Доля накопительным итогом, %</td><td>Группа</td><td>Пояснение</td></tr>';
        for (var i = 0; i < clusters.length; i++) {
            var cluster = clusters[i];

            str += '<tr>';

            str += '<td>' + (i + 1) + '</td>';
            str += '<td>';
            for (var j = 0; j < cluster.products.length; j++) {
                var p = packages[cluster.products[j]];

                str += '<p>' + data.packages[p.id].name + '</p>';
            }
            str += '</td>';
            str += '<td>' + cluster.profit + '</td>';
            str += '<td>' + (cluster.rate * 100).toFixed(2) + '</td>';
            str += '<td>' + (cluster.stock * 100).toFixed(2) + '</td>';
            str += '<td>' + data.groups[cluster.abc].group + '</td>';
            str += '<td>' + data.groups[cluster.abc].description + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>XYZ-анализ</h2>';
        str += '<table>';
        str += '<tr><td>Кластер</td><td>Упаковки</td><td>Квартал 1, шт.</td><td>Квартал 2, шт.</td><td>Квартал 3, шт.</td><td>Квартал 4, шт.</td><td>Cреднее</td><td>СКО</td><td>Коэф. вариации, %</td><td>Группа</td><td>Пояснение</td></tr>';
        for (var i = 0; i < clusters.length; i++) {
            var cluster = clusters[i];

            str += '<tr>';

            str += '<td>' + (i + 1) + '</td>';
            str += '<td>';
            for (var j = 0; j < cluster.products.length; j++) {
                var p = packages[cluster.products[j]];

                str += '<p>' + data.packages[p.id].name + '</p>';
            }
            str += '</td>';
            for (var j = 0; j < cluster.blocks.length; j++) {
                str += '<td>' + cluster.blocks[j] + '</td>';
            }
            str += '<td>' + cluster.average + '</td>';
            str += '<td>' + cluster.meanSquare.toFixed(3) + '</td>';
            str += '<td>' + (cluster.variation * 100).toFixed(2) + '</td>';
            str += '<td>' + data.groups[cluster.xyz].group + '</td>';
            str += '<td>' + data.groups[cluster.xyz].description + '</td>';

            str += '</tr>';
        }
        str += '</table>';

        str += '<h2>Вывод</h2>';
        str += '<table>';
        str += '<tr><td>Кластер</td><td>Упаковки</td><td>Группа</td><td>Пояснение</td></tr>';
        for (var i = 0; i < clusters.length; i++) {
            var cluster = clusters[i];

            str += '<tr>';

            str += '<td>' + (i + 1) + '</td>';
            str += '<td>';
            for (var j = 0; j < cluster.products.length; j++) {
                var p = packages[cluster.products[j]];

                str += '<p>' + data.packages[p.id].name + '</p>';
            }
            str += '</td>';
            str += '<td>' + data.groups[cluster.abc].group + data.groups[cluster.xyz].group + '</td>';
            str += '<td><p>' + data.groups[cluster.abc].description + '</p><p>' + data.groups[cluster.xyz].description + '</p></td>';

            str += '</tr>';
        }
        str += '</table>';

        table.innerHTML = str;

        /*

        var str = '';

        str += '<h2>Затраченные ресурсы на обслуживание транспорта</h2>';
        str += '<table>';
        str += '<tr><td>Цвет</td><td>Транспорт</td><td>Стоимость, руб.</td></tr>';
        for (var i = 0; i < cars.length; i++) {
            str += '<tr>';

            var car = data.cars[cars[i].id],
                price = 0;

            str += '<td><div style="width: 100%; height: 10px; background: ' + car.color + ';"></div></td>';
            str += '<td>' + car.name + '</td>';

            for (var j = 0; j < cars[i].usageCar.length; j++) {
                price += cars[i].usageCar[j] * car.priceForRepair;
            }

            str += '<td>' + price.toFixed(2) + '</td>';
            str += '</tr>';
        }
        str += '</table>';

        table.innerHTML = str;

        */
    })
}
