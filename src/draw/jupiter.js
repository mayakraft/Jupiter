const math = require("../math");
const SVG = require("rabbit-ear-svg");
const J2000 = require("../ephemeris/J2000");
const RedSpot = require("../ephemeris/redSpot");
const noise = require("../lib/toolkit").noise;

const Jupiter = (date, warp = 1) => {
  const svg = SVG();
  svg.size(-1, -1, 2, 2);

  const jDay = J2000.daysFromMoment(date);
  const level2Degrees = RedSpot(jDay);
  const e = {
    // time: frameNum / 100
    time: jDay * 20,
  };

  const spherize = p => {
    const r = p.distanceTo(0, 0);
    const a = Math.atan2(p.y, p.x);
    const r2 = Math.sin(r * (Math.PI / 2));
    // return math.vector.fromAngle(a).scale(r2);
    return p.lerp(math.vector.fromAngle(a).scale(r2), warp);
  };

  // const defs = SVG.defs();
  const clip = SVG.clipPath();
  clip.circle(1);
  const clouds = svg.g();
  clouds.clipPath(clip);

  const projection = list => list
    .map(p => p.distanceTo(0,0) < 1 ? spherize(p) : p)

  const flatRow = (n) => Array.from(Array(n + 1))
    .map((_, i) => math.vector(-1 + (i/n)*2, 0));

  const flat = (y1 = 0, y2 = 0) => {
    const there = flatRow(50).map(v => v.add(0, y1))
    const back = flatRow(50).map(v => v.add(0, y2)).reverse();
    return projection([...there, ...back]);
  };

  const noiseRow = (t, freq = 1, amp = 0.01, phase = 0, waveFreq=1.5, waveAmp = 0.02, n = 200) => Array
  .from(Array(n + 1))
  .map((_, i) => math.vector
    .fromAngle((Math.PI/2) * (3/4) * noise(t + i*freq + phase))
    .scale(amp))
  .map((vec, i) => vec.add(math.vector
    .fromAngle(Math.PI*0.5*noise(t+i*freq*waveFreq)).scale(waveAmp)))
  .map((vec, i) => vec.add(-1 + (i/n)*2, 0));

  const choppy = (t, y1 = 0, y2 = 0.05, speed = 1, freq = 1/10) => {
    const top = noiseRow(t*speed, freq, 0.01, 0, 1.2, 0.01, 100)
      .map(v => v.add(0, y1))
    const bottom = noiseRow(t*speed, freq*1.05, 0.01, 5, 1.2, 0.01, 100)
      .map(v => v.add(0, y2)).reverse();
    return projection([...top, ...bottom]);
  };
  const slowwave = (t, y1 = 0, y2 = 0, amp = 0.01, ph = 0, wave = 1.5) => {
    const top = noiseRow(t/4, 1/9*2, amp, ph+0, wave, 0.02, 50)
      .map(v => v.add(0, y1))
    const bottom = noiseRow(t/4, 1/10*2, amp, ph+5, wave, 0.02, 50)
      .map(v => v.add(0, y2)).reverse();
    return projection([...top, ...bottom]);
  };
  const wavy = (t, y1 = 0, y2 = 0, freq = 1/20, amp = 0.05, speed = 1, wave = 1.5) => {
    const top = noiseRow(t*speed, freq, amp, 0, wave, 0.02, 100)
      .map(v => v.add(-0.06, y1))
    const bottom = noiseRow(t*speed, freq, amp, 5, wave, 0.02, 100)
      .map(v => v.add(-0.06, y2)).reverse();
    return projection([...top, ...bottom]);
  };

  const redSpot = (degrees, t) => {
    let x = ((degrees + 270) % 360) / 360 * 4;
    x = x > 2 ? x - 4 : x;
    const backPoints = Array.from(Array(40))
      .map((_, i) => i / 40 * Math.PI * 2)
      .map(a => {
        const n = noise(Math.cos(a), Math.sin(a), t / 2);
        const vec = math.vector.fromAngle(a).scale(n * 0.02);
        return math.vector(Math.cos(a) * 0.18, Math.sin(a) * 0.1).add(vec)
      })
      .map(p => p.add(x, 0.33));
    clouds.polygon(projection(backPoints)).fill("#ad9b85");//.fill("#b89d85");
  
    const points = Array.from(Array(20))
      .map((_, i) => i / 20 * Math.PI * 2)
      .map(a => {
        const n = noise(Math.cos(a)*0.5, Math.sin(a)*0.5, t / 2);
        const vec = math.vector.fromAngle(a).scale(n * 0.02);
        return math.vector(Math.cos(a) * 0.1, Math.sin(a) * 0.06).add(vec)
      })
      .map(p => p.add(x, 0.33));
    clouds.polygon(projection(points)).fill("#b66d50");
  };

  // clouds.removeChildren();
  // light bars, top to bottom

  const g = SVG.g();
  clouds.polygon(flat(-1, -0.5)).fill("#796d57");
  clouds.polygon(flat(-0.7, -0.2)).fill("#b1afb6");
  clouds.polygon(flat(-0.2, 0.15)).fill("#b8b6ae");
  clouds.polygon(flat(0.15, 0.8)).fill("#b5b6c0");
  clouds.polygon(flat(0.8, 1)).fill("#796d57");
  // top bacon
  clouds.polygon(wavy(-e.time, -0.1, -0.4, 1/20, 0.05, 1, 1.3)).fill("#97826f");
  clouds.polygon(wavy(-e.time, -0.18, -0.32, 1/20, 0.05, 1, 1.5)).fill("#6d4846");
  // topper stuff
  clouds.polygon(wavy(-e.time, -0.9, -0.6, 1/30, 0.05, 0.3)).fill("#9a8265");
  // middle bottom
  clouds.polygon(choppy(-e.time, 0.1, 0.3, 0.8)).fill("#ad9b85");
  clouds.polygon(wavy(-e.time, 0.5, 1, 1/20, 0.05, 0.5)).fill("#a99f8e");
  // very bottom
  clouds.polygon(wavy(-e.time, 0.65, 1.1, 1/15, 0.015, 0.3)).fill("#8e7e69");
  redSpot(level2Degrees, e.time);
  clouds.polygon(choppy(-e.time, 0.175, 0.25, 0.5)).fill("#947a6f");

  const darks = SVG.g();
  darks.clipPath(clip);

  const SHADE = 50;
  for (let i = 0; i < SHADE; i++) {
    const r = Math.pow((i/SHADE), 0.25);
    const mask = SVG.mask();
    mask.rect(-1, -1, 2, 2).fill("white");
    mask.circle(0, 0, r).fill("black");
    darks.rect(-1, -1, 2, 2)
      .fill("black")
      .opacity(0.03)
      .mask(mask);
    g.appendChild(mask);
  }

  g.appendChild(clip);
  g.appendChild(clouds);
  g.appendChild(darks);
  g.circle(1).fill("none").stroke("black").strokeWidth(0.02);
  return g;
};

module.exports = Jupiter;
