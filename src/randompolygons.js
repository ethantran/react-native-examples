import * as d3 from 'd3';
export default function randomPolygons(numShapes, width, height) {
  return d3.range(numShapes).map(randomPolygon, width, height);
}
export function randomPolygon(width, height) {
  var sides = 3 + Math.floor(Math.random() * 10),
      r = 50 + Math.random() * 100,
      x = r + Math.random() * (width - r * 2),
      y = r + Math.random() * (height - r * 2);
  return d3.range(sides).map(function(i) {
    return [
      Math.cos(Math.PI / 2 + 2 * Math.PI * i / sides) * r + x,
      Math.sin(Math.PI / 2 + 2 * Math.PI * i / sides) * r + y
    ];
  });
}
