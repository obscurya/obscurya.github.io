document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) player.moveLeft = true;
    if (event.keyCode == 87) player.moveUp = true;
    if (event.keyCode == 68) player.moveRight = true;
    if (event.keyCode == 83) player.moveDown = true;

    if (event.keyCode == 37) player.aimLeft = true;
    if (event.keyCode == 38) player.aimUp = true;
    if (event.keyCode == 39) player.aimRight = true;
    if (event.keyCode == 40) player.aimDown = true;

    if (event.keyCode == 32) {
        if (!player.beginCast) {
            player.beginCast = true;
        }
    }
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

    if (event.keyCode == 32) {
        if (!player.endCast) {
            player.beginCast = false;
            player.casting = 0;
        } else {
            player.beginCast = false;
            player.endCast = false;
            player.casting = 0;
            player.fire();
        }
    }
});
