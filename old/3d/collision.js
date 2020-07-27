// LINE/CIRCLE
let lineCircle = (x1, y1, x2, y2, cx, cy, r) => {
  // is either end INSIDE the circle?
  // if so, return true immediately
  if (pointCircle(x1, y1, cx, cy, r)) return [x1, y1];
  if (pointCircle(x2, y2, cx, cy, r)) return [x2, y2];

  // get length of the line
  let len = dist(x1, y1, x2, y2);

  // get dot product of the line and circle
  let dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(len, 2);

  // find the closest point on the line
  let closestX = x1 + dot * (x2 - x1);
  let closestY = y1 + dot * (y2 - y1);

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  let onSegment = linePoint(x1, y1, x2, y2, closestX, closestY);

  if (!onSegment) return false;

  // get distance to closest point
  let distance = dist(closestX, closestY, cx, cy);

  if (distance <= r) return [closestX, closestY];

  return false;
};

// POINT/CIRCLE
let pointCircle = (px, py, cx, cy, r) => {
  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  let distance = dist(px, py, cx, cy);

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) return true;

  return false;
};

// LINE/POINT
let linePoint = (x1, y1, x2, y2, px, py) => {
  // get distance from the point to the two ends of the line
  let d1 = dist(px, py, x1, y1);
  let d2 = dist(px, py, x2, y2);

  // get the length of the line
  let lineLen = dist(x1, y1, x2, y2);

  // since lets are so minutely accurate, add
  // a little buffer zone that will give collision
  let buffer = 0.1; // higher # = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  // rather than one #
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) return true;

  return false;
};

// LINE/LINE
let lineLine = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  // calculate the distance to intersection point
  let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // optionally, draw a circle where the lines meet
    let intersectionX = x1 + uA * (x2 - x1);
    let intersectionY = y1 + uA * (y2 - y1);

    return [intersectionX, intersectionY];
  }

  return false;
};

let dist = (x1, y1, x2, y2) => {
  let distX = x1 - x2;
  let distY = y1 - y2;
  let distance = Math.sqrt(distX * distX + distY * distY);

  return distance;
};
