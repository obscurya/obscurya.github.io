function Hud() {
    this.draw = function () {
        var text = [
                'unknown game v 0.6.5',
                'x: ' + player.getX().toFixed(2) + ' y: ' + player.getY().toFixed(2),
                'angle: ' + (player.angle * 180 / Math.PI).toFixed(2),
                'fireballs: ' + flames.length,
                // 'controls: ' + player.controls,
                // 'aim: ' + player.aim,
                'enemy hp: ' + enemy.health
            ],
            step = 30;

        c.fillStyle = color(255, 255, 255, 255 / 2);
        c.font = '14px sans-serif';
        c.textAlign = 'left';

        c.beginPath();

        for (var i = 0; i < text.length; i++) {
            c.fillText(text[i], 20, step);
            step += 20;
        }

        c.closePath();

        var healthWidth = player.health / player.maxHealth * playground.width;

        c.fillStyle = color(255, 255, 255, 255 / 2);
        rect(0, playground.height - 15, healthWidth, 15);

        c.fillStyle = color(255, 255, 255, 255 / 2);
        // c.fillStyle = color(255, 255, 0, 255 / 2);

        var castRadius = player.casting / player.castDuration * player.r;

        circle(player.x, player.y, castRadius);
        // rect(0, playground.height - 20, castWidth, 5);

        var enemyCastRadius = enemy.casting / enemy.castDuration * enemy.r;

        circle(enemy.getX(), enemy.getY(), enemyCastRadius);
    }
}