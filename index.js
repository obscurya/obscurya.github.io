var hello = function () {
    var recipient = ['friend', 'buddy', 'human', 'Mark'],
        rnd = Math.floor(Math.random() * recipient.length);
    return 'Oh, hi, ' + recipient[rnd] + '.';
}

var output = document.getElementById('hello'),
    code = document.getElementById('code');

output.innerHTML = hello();
code.innerHTML = hello;

function loadJSON(file, callback) {
    var request = new XMLHttpRequest();
    request.overrideMimeType('application/json');
    request.open('GET', file, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == '200') {
            callback(request.responseText);
        }
    }
    request.send(null);
}

var colors = [
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#212121',
    '#4CAF50',
    '#FFEB3B'
];

function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomColor() {
    var red = random(0, 255),
        green = random(0, 255),
        blue = random(0, 255);
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}

function randomMonochromeColor(min, max) {
    var color = random(min, max);
    return 'rgb(' + color + ', ' + color + ', ' + color + ')';
}

function formArticle(article) {
    var output = '<article><div class="content"><p class="title">' + article.title + '</p><div class="buttons">';
    if (article.img !== '') {
        output += '<div class="img" style="background-image: url(images/' + article.img + ');"></div>';
    } else {
        var color1 = randomMonochromeColor(75, 205),
            color2 = randomMonochromeColor(75, 205);
        output += '<div class="img" style="background-image: linear-gradient(45deg, ' + color1 + ', ' + color2 + ');"></div>';
    }
    output += '<div class="body">';
    if (article.link_view !== '') {
        output += '<div class="view"><a href="' + article.link_view + '" target="_blank"><i class="material-icons">visibility</i><br><span>Посмотреть</span></a></div>';
    }
    if (article.link_source !== '') {
        output += '<div class="source"><a href="' + article.link_source + '" target="_blank"><i class="material-icons">code</i><br><span>Исходный код</span></a></div>';
    }
    output += '</div></div><p class="desc">' + article.desc + '</p>';
    return output;
}

// function formArticle(article) {
//     var output = '<article><div class="content"><table><tr><td class="title">' + article.title + '</td>';
//     if (article.link_view !== '') {
//         output += '<td class="view"><a href="' + article.link_view + '" target="_blank"><i class="material-icons">visibility</i></a></td>';
//     }
//     if (article.link_source !== '') {
//         output += '<td class="source"><a href="' + article.link_source + '" target="_blank"><i class="material-icons">code</i></a></td>';
//     }
//     output += '</table><div class="body"><p class="desc" style="width: 100%; padding-right: 0px;">' + article.desc + '</p>';
//     if (article.img !== '') {
//         output += '<div class="img"><img src="images/' + article.img + '"></div>';
//     }
//     output += '</div></div></article>';
//     return output;
// }

function formEmpty() {
    var output = '<article><div class="content"><p>Тут пусто.</p></div></article>';
    return output;
}

loadJSON('data.json', function (response) {
    var data = JSON.parse(response),
        articles = data.articles,
        groupNew = document.getElementById('groupNew'),
        groupOld = document.getElementById('groupOld');

    groupNew.innerHTML = formEmpty();

    if (articles.new[0]) {
        groupNew.innerHTML = '';
        for (var i = 0; i < articles.new.length; i++) {
            groupNew.innerHTML += formArticle(articles.new[i]);
        }
    }

    groupOld.innerHTML = formEmpty();

    if (articles.old[0]) {
        groupOld.innerHTML = '';
        for (var i = 0; i < articles.old.length; i++) {
            groupOld.innerHTML += formArticle(articles.old[i]);
        }
    }
});
