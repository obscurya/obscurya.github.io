var hello = function () {
    var recipient = ['friend', 'buddy', 'human', 'Mark'],
        rnd = Math.floor(Math.random() * recipient.length);
    return 'Oh, hi, ' + recipient[rnd] + '.';
}

var output = document.getElementById('hello'),
    code = document.getElementById('code');

output.innerHTML = hello();
code.innerHTML = hello;
