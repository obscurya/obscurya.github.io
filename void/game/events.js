document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) player.moveLeft = true;
    if (event.keyCode == 87) player.moveUp = true;
    if (event.keyCode == 68) player.moveRight = true;
    if (event.keyCode == 83) player.moveDown = true;

    if (event.keyCode == 37) player.aimLeft = true;
    if (event.keyCode == 38) player.aimUp = true;
    if (event.keyCode == 39) player.aimRight = true;
    if (event.keyCode == 40) player.aimDown = true;

    if (event.keyCode == 32) player.fire();
});

document.addEventListener('keyup', function (event) {
    if (event.keyCode == 65) player.moveLeft = false;
    if (event.keyCode == 87) player.moveUp = false;
    if (event.keyCode == 68) player.moveRight = false;
    if (event.keyCode == 83) player.moveDown = false;

    if (event.keyCode == 37) player.aimLeft = false;
    if (event.keyCode == 38) player.aimUp = false;
    if (event.keyCode == 39) player.aimRight = false;
    if (event.keyCode == 40) player.aimDown = false;
});
