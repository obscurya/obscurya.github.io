document.addEventListener('keydown', function (event) {
    var code = event.keyCode;

    if (code == 65) player.controls[0] = true;
    if (code == 87) player.controls[1] = true;
    if (code == 68) player.controls[2] = true;
    if (code == 83) player.controls[3] = true;

    if (code == 37) player.aim[2] = true;
    if (code == 38) player.aim[3] = true;
    if (code == 39) player.aim[0] = true;
    if (code == 40) player.aim[1] = true;

    if (event.keyCode == 32) {
        if (!player.beginCast) {
            player.beginCast = true;
        }
    }
});

document.addEventListener('keyup', function (event) {
    var code = event.keyCode;

    if (code == 65) player.controls[0] = false;
    if (code == 87) player.controls[1] = false;
    if (code == 68) player.controls[2] = false;
    if (code == 83) player.controls[3] = false;

    if (code == 37) player.aim[2] = false;
    if (code == 38) player.aim[3] = false;
    if (code == 39) player.aim[0] = false;
    if (code == 40) player.aim[1] = false;

    if (code == 32) {
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
