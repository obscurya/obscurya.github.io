document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

/* HANDLE KEY EVENTS */

let keysMap = { w: false, a: false, s: false, d: false, ArrowLeft: false, ArrowRight: false };

window.onkeydown = e => {
  let key = e.key;

  switch (key.toLowerCase()) {
    case 'ц':
      key = 'w';
      break;
    case 'ф':
      key = 'a';
      break;
    case 'ы':
      key = 's';
      break;
    case 'в':
      key = 'd';
      break;
    default:
      break;
  }

  if (key in keysMap) keysMap[key] = true;
};

window.onkeyup = e => {
  let key = e.key;

  switch (key.toLowerCase()) {
    case 'ц':
      key = 'w';
      break;
    case 'ф':
      key = 'a';
      break;
    case 'ы':
      key = 's';
      break;
    case 'в':
      key = 'd';
      break;
    default:
      break;
  }

  if (key in keysMap) keysMap[key] = false;
};

window.onmousemove = e => {
  let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;

  player.angle += (playerMoveAngle * movementX) / 50;

  if (player.angle >= Math.PI * 2) player.angle = playerMoveAngle;
  if (player.angle <= 0) player.angle = Math.PI * 2 - playerMoveAngle;
};

/* INIT CANVASES */

let pixelRatio = (() => {
  let ctx = document.createElement('canvas').getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  return dpr / bsr;
})();

let setCanvasResolution = (canvas, w, h) => {
  canvas.width = w * pixelRatio;
  canvas.height = h * pixelRatio;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

  canvas.getContext('2d').setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

let canvas2d = document.querySelector('#two-d');
let ctx2d = canvas2d.getContext('2d');
let w = 100;
let h = 100;

setCanvasResolution(canvas2d, w, h);

let canvas3d = document.querySelector('#three-d');
let ctx3d = canvas3d.getContext('2d');
let c3dw = window.screen.width;
let c3dh = window.screen.height;

setCanvasResolution(canvas3d, c3dw, c3dh);

canvas3d.onclick = () => {
  canvas3d.requestPointerLock = canvas3d.requestPointerLock || canvas3d.mozRequestPointerLock || canvas3d.webkitRequestPointerLock;

  canvas3d.requestPointerLock();
};

// document.exitPointerLock();

/* INIT MAIN VARS */

let wallSize = 2;
let player = { x: 0.2 * w, y: 0.8 * h, angle: (Math.PI / 2) * 3 };
let playerRadius = 5;
let playerMoveSpeed = 0.5;
let playerMoveAngle = 0.05;
let wall3dSize = 70;
// let rayLength = 60;
let rayLength = Math.sqrt(w * w + h * h);
let rayFOV = Math.PI / 3;
let raysNumber = 10000;
let rayStep = rayFOV / (raysNumber - 1);

/* CREATE WALLS */

walls.forEach((wall, wallIndex) => {
  let p1 = wall[0];
  let p2 = wall[1];

  if (p1[0] < p2[0]) {
    p1 = wall[1];
    p2 = wall[0];
  }

  walls[wallIndex].p1 = { x: p1[0] * w, y: p1[1] * h };
  walls[wallIndex].p2 = { x: p2[0] * w, y: p2[1] * h };
});

/* MAIN LOOP */

let render2d = c => {
  /* RAYCASTING */

  let rayPoints = [];
  let angle = player.angle - rayFOV / 2;

  for (let i = 0; i < raysNumber; i++) {
    rayPoints.push({
      x: player.x + rayLength * Math.cos(angle),
      y: player.y + rayLength * Math.sin(angle)
    });

    angle += rayStep;
  }

  let collidedRaysWalls = {};

  rayPoints.forEach((rayPoint, rayPointIndex) => {
    walls.forEach((wall, wallIndex) => {
      let rayWallCollision = lineLine(player.x, player.y, rayPoint.x, rayPoint.y, wall.p1.x, wall.p1.y, wall.p2.x, wall.p2.y);

      if (rayWallCollision) {
        if (!collidedRaysWalls[rayPointIndex]) collidedRaysWalls[rayPointIndex] = [];

        collidedRaysWalls[rayPointIndex].push({ wallIndex, collision: rayWallCollision });
      }
    });
  });

  let rPoints = {};

  for (let crwKey in collidedRaysWalls) {
    let rayWallCollisionPoint = collidedRaysWalls[crwKey][0];

    if (collidedRaysWalls[crwKey].length > 1) {
      let playerWallDistanceMin = rayLength;
      let playerWallDistanceMinIndex = 0;

      collidedRaysWalls[crwKey].forEach((collidedRayWall, crwIndex) => {
        let playerWallDistance = dist(player.x, player.y, collidedRayWall.collision[0], collidedRayWall.collision[1]);

        if (playerWallDistance < playerWallDistanceMin) {
          playerWallDistanceMin = playerWallDistance;
          playerWallDistanceMinIndex = crwIndex;
        }
      });

      rayWallCollisionPoint = collidedRaysWalls[crwKey][playerWallDistanceMinIndex];
    }

    rPoints[crwKey] = rayWallCollisionPoint;
  }

  // console.log(rPoints);

  let rpKeys = Object.keys(rPoints);
  let rWalls = {};

  if (rpKeys.length) {
    let rWallLastIndex = rPoints[rpKeys[0]].wallIndex;

    rpKeys.forEach((rpKey, rpKeyIndex) => {
      let rWallIndex = rPoints[rpKey].wallIndex;

      if (!rWalls[rWallIndex]) rWalls[rWallIndex] = [{ rpKey, collision: rPoints[rpKey].collision }];

      if (rWallIndex !== rWallLastIndex) {
        if (rWalls[rWallIndex] && rWalls[rWallIndex].length > 1) rWalls[rWallIndex].push({ rpKey, collision: rPoints[rpKey].collision });

        let rpKeyPrev = rpKeys[rpKeyIndex - 1];
        let rPointPrev = rPoints[rpKeyPrev];

        rWalls[rPointPrev.wallIndex].push({ rpKey: rpKeyPrev, collision: rPointPrev.collision });

        rWallLastIndex = rWallIndex;
      }
    });

    rWalls[rWallLastIndex].push({ rpKey: rpKeys.slice(-1)[0], collision: rPoints[rpKeys.slice(-1)[0]].collision });

    // console.log(rWalls);
  }

  render3d(ctx3d, rWalls);

  /* HANDLE PLAYER-WALLS COLLISION & MOVE PLAYER */

  let newPlayerX;
  let newPlayerY;

  if (keysMap.w) {
    newPlayerX = player.x + playerMoveSpeed * Math.cos(player.angle);
    newPlayerY = player.y + playerMoveSpeed * Math.sin(player.angle);
  } else if (keysMap.s) {
    newPlayerX = player.x - playerMoveSpeed * Math.cos(player.angle);
    newPlayerY = player.y - playerMoveSpeed * Math.sin(player.angle);
  }

  if ((keysMap.a || keysMap.d) && !newPlayerX && !newPlayerY) {
    newPlayerX = player.x;
    newPlayerY = player.y;
  }

  if (keysMap.a) {
    newPlayerX += playerMoveSpeed * Math.cos(player.angle - Math.PI / 2);
    newPlayerY += playerMoveSpeed * Math.sin(player.angle - Math.PI / 2);
  } else if (keysMap.d) {
    newPlayerX += playerMoveSpeed * Math.cos(player.angle + Math.PI / 2);
    newPlayerY += playerMoveSpeed * Math.sin(player.angle + Math.PI / 2);
  }

  if (keysMap.ArrowLeft) {
    player.angle -= playerMoveAngle;
  } else if (keysMap.ArrowRight) {
    player.angle += playerMoveAngle;
  }

  if (player.angle >= Math.PI * 2) player.angle = playerMoveAngle;
  if (player.angle <= 0) player.angle = Math.PI * 2 - playerMoveAngle;

  let wallPlayerCollisions = [];

  for (let i = 0; i < walls.length; i++) {
    let wall = walls[i];
    let wallPlayerCollision = lineCircle(wall.p1.x, wall.p1.y, wall.p2.x, wall.p2.y, newPlayerX, newPlayerY, playerRadius);

    if (wallPlayerCollision) wallPlayerCollisions.push({ collision: wallPlayerCollision, wallIndex: i });
  }

  if (wallPlayerCollisions.length === 1) {
    let pdx = player.x - newPlayerX;
    let pdy = player.y - newPlayerY;
    let playerAngle = Math.atan2(-pdy, -pdx);

    if (playerAngle < 0) playerAngle += Math.PI * 2;

    let wall = walls[wallPlayerCollisions[0].wallIndex];
    let wpdx = wall.p2.x - wall.p1.x;
    let wpdy = wall.p2.y - wall.p1.y;
    let wallDirectionAngle = Math.atan2(wpdy, wpdx);

    if (wallDirectionAngle < 0) wallDirectionAngle += Math.PI * 2;

    if (Math.abs(playerAngle - wallDirectionAngle) >= Math.PI / 2) {
      wallDirectionAngle += Math.PI;
    }

    player.x += playerMoveSpeed * Math.cos(wallDirectionAngle);
    player.y += playerMoveSpeed * Math.sin(wallDirectionAngle);
  } else if (wallPlayerCollisions.length > 1) {
    let cpx = 0;
    let cpy = 0;

    wallPlayerCollisions.forEach(wallPlayerCollision => {
      cpx += wallPlayerCollision.collision[0];
      cpy += wallPlayerCollision.collision[1];
    });

    cpx /= wallPlayerCollisions.length;
    cpy /= wallPlayerCollisions.length;

    let dx = cpx - player.x;
    let dy = cpy - player.y;
    let collisionAngle = Math.atan2(dy, dx);

    player.x -= playerMoveSpeed * Math.cos(collisionAngle);
    player.y -= playerMoveSpeed * Math.sin(collisionAngle);
  } else if (newPlayerX && newPlayerY) {
    player.x = newPlayerX;
    player.y = newPlayerY;
  }

  /* CLEAR CANVAS2D */

  c.clearRect(0, 0, w, h);

  c.fillStyle = '#eee';

  c.fillRect(0, 0, w, h);

  /* DRAW FLOUR LINES */

  // c.fillStyle = '#ccc';

  // for (let i = 0; i < mapData.length; i++) {
  //   let row = mapData[i];

  //   c.fillRect(row[0].x, row[0].y, row[row.length - 1].x - row[0].x, 1);
  // }

  // for (let i = 0; i < mapData[0].length; i++) {
  //   let p1 = mapData[0][i];
  //   let p2 = mapData[mapData.length - 1][i];

  //   c.fillRect(p1.x, p1.y, 1, p2.y - p1.y);
  // }

  /* DRAW WALLS */

  c.strokeStyle = '#000';
  c.lineWidth = wallSize;

  for (let i = 0; i < walls.length; i++) {
    let wall = walls[i];

    c.beginPath();
    c.moveTo(wall.p1.x, wall.p1.y);
    c.lineTo(wall.p2.x, wall.p2.y);
    c.stroke();
    c.closePath();
  }

  /* DRAW PLAYER'S RAY (RAYCASTING RESULT) */

  let rayAngle1 = player.angle - rayFOV / 2;
  let rayAngle2 = player.angle + rayFOV / 2;

  c.fillStyle = 'rgba(255, 99, 0, 0.25)';

  c.beginPath();
  c.moveTo(player.x, player.y);
  c.lineTo(player.x + rayLength * Math.cos(rayAngle1), player.y + rayLength * Math.sin(rayAngle1));
  c.arc(player.x, player.y, rayLength, rayAngle1, rayAngle2);
  c.closePath();
  c.fill();

  c.strokeStyle = '#f90';
  c.lineWidth = wallSize * 2;
  c.lineCap = 'round';
  c.lineJoin = 'round';

  for (let rwKey in rWalls) {
    let rWall = rWalls[rwKey];

    if (rWall.length < 2) continue;

    for (let i = 0; i < rWall.length - 1; i += 2) {
      c.beginPath();
      c.moveTo(rWall[i].collision[0], rWall[i].collision[1]);
      c.lineTo(rWall[i + 1].collision[0], rWall[i + 1].collision[1]);
      c.stroke();
      c.closePath();
    }
  }

  /* DRAW PLAYER'S BODY */

  c.fillStyle = '#a00';

  c.beginPath();
  c.arc(player.x, player.y, playerRadius + wallSize, 0, Math.PI * 2);
  c.fill();
  c.closePath();

  c.fillStyle = '#f00';

  c.beginPath();
  c.arc(player.x, player.y, playerRadius, 0, Math.PI * 2);
  c.fill();
  c.closePath();

  requestAnimationFrame(() => render2d(c));
};

let render3d = (c, rWallsOrigin) => {
  let rWalls = [];

  for (let rWallKey in rWallsOrigin) {
    let rWall = rWallsOrigin[rWallKey];

    if (rWall.length < 2) continue;

    for (let i = 0; i < rWall.length - 1; i += 2) {
      let wcx = (rWall[i].collision[0] + rWall[i + 1].collision[0]) / 2;
      let wcy = (rWall[i].collision[1] + rWall[i + 1].collision[1]) / 2;
      let playerWallCenterDistance = dist(player.x, player.y, wcx, wcy);

      rWalls.push({ points: [rWall[i], rWall[i + 1]], distance: playerWallCenterDistance });
    }
  }

  rWalls = rWalls.sort((w1, w2) => {
    return w2.distance - w1.distance;
  });

  c.clearRect(0, 0, c3dw, c3dh);

  c.fillStyle = '#000';

  c.fillRect(0, 0, c3dw, c3dh);

  c.strokeStyle = '#fff';
  c.lineWidth = 2;
  c.lineCap = 'round';
  c.lineJoin = 'round';

  rWalls.forEach(rWall => {
    let rWallSides = [];

    rWall.points.forEach(rWallPoint => {
      let playerWallSideDistance = dist(player.x, player.y, rWallPoint.collision[0], rWallPoint.collision[1]);

      rWallSides.push({
        x: ((parseInt(rWallPoint.rpKey) * rayStep) / rayFOV) * c3dw,
        height: (wall3dSize * rayLength) / playerWallSideDistance,
        distance: playerWallSideDistance
      });
    });

    rWallSides = rWallSides.sort((rws1, rws2) => {
      return rws1.x - rws2.x;
    });

    let rws1x = rWallSides[0].x;
    let rws2x = rWallSides[1].x;
    let rws1d = rWallSides[0].distance;
    let rws2d = rWallSides[1].distance;
    let color1 = (1 - rws1d / rayLength) * 225;
    let color2 = (1 - rws2d / rayLength) * 225;

    color1 = `rgb(${color1}, ${color1}, ${color1})`;
    color2 = `rgb(${color2}, ${color2}, ${color2})`;

    let gradient = c.createLinearGradient(rws1x, 0, rws2x, 0);

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    c.fillStyle = gradient;

    // c.strokeStyle = `rgb(${color}, ${color}, ${color})`;
    // c.strokeStyle = gradient;

    c.beginPath();
    c.moveTo(rws1x, c3dh / 2 - rWallSides[0].height / 2);
    c.lineTo(rws2x, c3dh / 2 - rWallSides[1].height / 2);
    c.lineTo(rws2x, c3dh / 2 + rWallSides[1].height / 2);
    c.lineTo(rws1x, c3dh / 2 + rWallSides[0].height / 2);
    c.closePath();
    c.fill();
    // c.stroke();
  });
};

render2d(ctx2d);
