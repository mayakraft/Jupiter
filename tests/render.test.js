const fs = require("fs");
const SVG = require("../src/svg");
const svg2img = require("svg2img");

const svg = SVG(-1.5, -0.5, 4, 2);
svg.background("black");

const fills = [
  "#333535",
  "#464B46",
  "#616659",
  "#73847A",
  "#73847A",
];

const paths = [
  "M0.9805,0.3926C0.9436,0.1997,0.7547,0.0344,0.4957,0.0402S0.1903,0.1256,0.1169,0.1989S0.0627,0.378,0.0343,0.4298s-0.0521,0.1001,0,0.1938S0.0266,0.765,0.1882,0.867s0.4589,0.1088,0.6215,0S1.0137,0.5664,0.9805,0.3926z",
  "M0.8355,0.2366C0.7939,0.0991,0.3911,0.0584,0.2518,0.142S0.0662,0.3317,0.0893,0.3636s0.0154,0.061-0.0383,0.0882c-0.0537,0.0273,0.0182,0.1805,0.0551,0.2298s-0.0508,0.068,0.0834,0.1566s0.41,0.1149,0.552,0.0371s0.1695-0.1288,0.1541-0.2059s0.0832-0.0887,0.0662-0.1889S0.8706,0.3528,0.8355,0.2366z",
  "M0.8167,0.4005c-0.169-0.0389-0.079-0.061-0.0247-0.0798C0.8462,0.302,0.8117,0.1996,0.7082,0.1534S0.3151,0.1192,0.2307,0.1978S0.133,0.3347,0.3224,0.3595C0.5117,0.3842,0.3585,0.4109,0.256,0.4149C0.1536,0.4189,0.0413,0.4964,0.0965,0.56s0.1332,0.0542,0.0869,0.1101S0.1212,0.7484,0.2688,0.8085S0.5353,0.891,0.7185,0.8179s0.1843-0.0883,0.1286-0.1477C0.7913,0.6108,0.8844,0.5757,0.9146,0.5229S0.9309,0.4268,0.8167,0.4005z",
  "M0.7327,0.4471c-0.2281-0.0365-0.3768-0.029-0.531,0.0025S0.0933,0.5441,0.266,0.5637s0.3107,0.0099,0.4853-0.0276C0.8755,0.5095,0.8535,0.4664,0.7327,0.4471z",
  "M0.368,0.6601C0.1998,0.7039,0.1961,0.7519,0.3588,0.7653s0.2629,0.0375,0.3958-0.0075c0.1328-0.045,0.014-0.0818-0.1047-0.0977C0.5311,0.6441,0.5085,0.6235,0.368,0.6601z",
];

svg.circle(0.5, 0.5, 0.5).fill("#1F1E25");
paths.forEach((p, i) => svg.path(p).fill(fills[i]));

svg2img(svg.save(), {"width": 800, "height": 400}, (error, buffer) => {
  fs.writeFileSync('jupiter.png', buffer);
});

// const string = svg.save();
// fs.writeFile("jupiter.svg", svg.save(), (err) => {});