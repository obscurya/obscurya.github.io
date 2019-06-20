random = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
let hw;
let hh;

let devicePixelRatio = window.devicePixelRatio || 1;
let backingStoreRatio = c.webkitBackingStorePixelRatio ||
  c.mozBackingStorePixelRatio ||
  c.msBackingStorePixelRatio ||
  c.oBackingStorePixelRatio ||
  c.backingStorePixelRatio || 1;
let ratio = devicePixelRatio / backingStoreRatio;

let PERSPECTIVE;
let PROJECTION_CENTER_X;
let PROJECTION_CENTER_Y;

let terrain;
let gradient;
let numberOfPoints = [30, 30];
let lineWidthMax = 2;
let ground;
let minDepth;
let maxDepth;
let sx;
let ex;
let ix;
let iz;
let flying;

getCoord = p => {
  return {
    x: p.xProjected,
    y: p.yProjected
  };
}

fillPolygon = ([p1, p2, p3, z]) => {
  let np1 = getCoord(p1);
  let np2 = getCoord(p2);
  let np3 = getCoord(p3);
  let nz = (maxDepth - z) / (maxDepth - minDepth);
  let lineWidth = nz * lineWidthMax;

  let fill = [
    nz * 140,
    nz * 30,
    nz * 255
  ];
  let stroke = [
    nz * 242,
    nz * 34,
    nz * 255
  ];

  c.lineJoin = 'round';
  // c.lineWidth = lineWidth === 0 ? 0.01 : lineWidth;
  c.lineWidth = lineWidth < 1 ? 1 : lineWidth;
  // c.lineWidth = 1;
  c.fillStyle = `rgb(${fill[0]},${fill[1]},${fill[2]})`;
  // c.strokeStyle = `rgb(${fill[0]},${fill[1]},${fill[2]})`;
  c.strokeStyle = `rgb(${stroke[0]},${stroke[1]},${stroke[2]})`;

  c.beginPath();
  c.moveTo(np1.x, np1.y);
  c.lineTo(np2.x, np2.y);
  c.lineTo(np3.x, np3.y);
  c.closePath();
  c.fill();
  c.stroke();
}

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.xProjected = 0;
    this.yProjected = 0;
    this.scaleProjected = 0;
  }

  project() {
    this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
    this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
    this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
  }

  render() {
    c.beginPath();
    c.arc(this.xProjected, this.yProjected, 5, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
}

class Terrain {
  constructor() {
    this.points = [];

    let x = sx;
    let y = ground;
    let z = maxDepth;
    let xoff = 0;
    let yoff = 0;
    let time = 0.2;

    for (let i = 0; i < numberOfPoints[1]; i++) {
      this.points[i] = [];
      x = sx;
      xoff = 0;

      for (let j = 0; j < numberOfPoints[0]; j++) {
        this.points[i][j] = new Point(x, y + noise.perlin2(xoff, yoff) * 300, z);

        x += ix;
        xoff += time;
      }

      z -= iz;
      yoff += time;
    }
  }

  render() {
    // c.fillStyle = 'rgba(255,41,117,1)';

    for (let i = 0; i < numberOfPoints[1]; i++) {
      for (let j = 0; j < numberOfPoints[0]; j++) {
        this.points[i][j].project();
        // this.points[i][j].render();
      }
    }

    let ps = this.points;
    let polygons = [];

    for (let i = 0; i < numberOfPoints[1]; i++) {
      for (let j = 0; j < numberOfPoints[0]; j++) {
        if (ps[i][j + 1] && ps[i - 1] && ps[i - 1][j + 1]) {
          let z = (ps[i][j].z + ps[i][j + 1].z + ps[i - 1][j + 1].z) / 3;

          polygons.push([ps[i][j], ps[i][j + 1], ps[i - 1][j + 1], z]);
        }
        if (ps[i][j + 1] && ps[i + 1] && ps[i + 1][j]) {
          let z = (ps[i][j].z + ps[i][j + 1].z + ps[i + 1][j].z) / 3;

          polygons.push([ps[i][j], ps[i][j + 1], ps[i + 1][j], z]);
        }
      }
    }

    polygons.sort((a, b) => {
      return b[3] - a[3];
    });

    for (let i = 0; i < polygons.length; i++) {
      fillPolygon(polygons[i]);
    }
  }

  update() {
    flying -= 0.2;

    let x = sx;
    let y = ground;
    let z = maxDepth;
    let xoff = 0;
    let yoff = flying;
    let time = 0.2;

    for (let i = 0; i < numberOfPoints[1]; i++) {
      x = sx;
      xoff = 0;

      for (let j = 0; j < numberOfPoints[0]; j++) {
        this.points[i][j] = new Point(x, y + noise.perlin2(xoff, yoff) * 300, z);

        x += ix;
        xoff += time;
      }

      z -= iz;
      yoff += time;
    }
  }
}

window.onresize = function() {
  w = window.innerWidth;
  h = window.innerHeight;

  canvas.width = w;
  canvas.height = h;

  if (devicePixelRatio !== backingStoreRatio) {
    canvas.width = w * ratio;
    canvas.height = h * ratio;

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    c.scale(ratio, ratio);
  }

  hw = w / 2;
  hh = h / 2;

  PERSPECTIVE = w * 0.8;
  PROJECTION_CENTER_X = w / 2;
  PROJECTION_CENTER_Y = h / 2;

  ground = hh;
  minDepth = -hw;
  maxDepth = w * 2;
  sx = -hw;
  ex = hw;
  ix = (ex - sx) / (numberOfPoints[0] - 1);
  iz = (maxDepth - minDepth) / (numberOfPoints[1] - 1);

  init();
}

init = () => {
  noise.seed(new Date().getMinutes() / 60);

  flying = 0;
  terrain = new Terrain();
  animation = undefined;
  gradient = c.createLinearGradient(hw, 0, hw, h);

  // gradient.addColorStop(0, 'rgb(255,144,31)');
  // gradient.addColorStop(1, 'rgb(255,41,117)');
  gradient.addColorStop(0, 'rgb(38,20,71)');
  gradient.addColorStop(1, 'rgb(13,2,33)');

  render();
}

render = () => {
  if (animation) {
    cancelAnimationFrame(animation);
    animation = undefined;
  }

  c.clearRect(0, 0, w, h);

  c.fillStyle = gradient;

  c.fillRect(0, 0, w, h);

  terrain.render();
  // terrain.update();

  // animation = requestAnimationFrame(render);
}

window.onresize();
