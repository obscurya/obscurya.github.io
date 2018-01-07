function Hud() {
    this.draw = function () {
        c.beginPath();
        c.fillStyle = '#fff';
        c.font = '14px sans-serif';
        c.textAlign = 'left';
        c.fillText('x: ' + (player.x + Math.abs(background.x)) + ' y: ' + (player.y + Math.abs(background.y)), 20, 30);
        c.fillText('angle: ' + (player.angle * 180 / Math.PI).toFixed(1), 20, 50);
        c.fillText('fireballs: ' + flames.length, 20, 70);
        // c.fillText('beginCast: ' + player.beginCast, 20, 90);
        // c.fillText('endCast: ' + player.endCast, 20, 110);
        // c.fillText('casting: ' + player.casting, 20, 130);
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

        circle(gcx(enemy.x), gcy(enemy.y), enemyCastRadius);
    }
}
