const J2000 = require("./J2000");

const D2R = 0.017453292519943;
const JPR_RAD = 69911;

const Moons = function (date) {
  const moons = [
    { name: "Io", front: false, radius: 1820.0 / JPR_RAD },
    { name: "Europa", front: false, radius: 1560.8 / JPR_RAD },
    { name: "Ganymede", front: false, radius: 2631.2 / JPR_RAD },
    { name: "Callisto", front: false, radius: 2410.3 / JPR_RAD },
  ];

  const d = J2000.daysFromMoment(date);

  // JUPITER numbers
  const V = 172.74 + 0.00111588 * d;
  const M = 357.529 + 0.9856003 * d;
  const N = 20.020 + 0.0830853 * d + 0.329 * Math.sin(V*D2R);
  const J = 66.115 + 0.9025179 * d - 0.329 * Math.sin(V*D2R);
  const A = 1.915 * Math.sin(M*D2R) + 0.020 * Math.sin(2*M*D2R);
  const B = 5.555 * Math.sin(N*D2R) + 0.168 * Math.sin(2*N*D2R);
  const K = J + A - B;
  const R = 1.00014 - 0.01671 * Math.cos(M*D2R) - 0.00014 * Math.cos(2*M*D2R);
  const r = 5.20872 - 0.25208 * Math.cos(N*D2R) - 0.00611 * Math.cos(2*N*D2R);
  const delta = Math.sqrt(Math.pow(r,2) + Math.pow(R,2) - 2*r*R*Math.cos(K*D2R));
  const psi = Math.asin(R/delta*Math.sin(K*D2R)) / D2R;
  const lamda = 34.35 + 0.083091*d + 0.329*Math.sin(V*D2R) + B;
  const Ds = 3.12 * Math.sin( (lamda+42.8)*D2R );
  const De = Ds - 2.22 * Math.sin(psi*D2R) * Math.cos( (lamda+22)*D2R ) - 1.30 * (r-delta)/delta * Math.sin( (lamda - 100.5)*D2R ); 

  // MOON numbers
  const u = [
    163.8069 + 203.4058646 * d + psi - B,
    358.4140 + 101.2916335 * d + psi - B,
    5.7176 + 50.2345180 * d + psi - B,
    224.8092 + 21.4879800 * d + psi - B,
  ];
  const G = 331.18 + 50.310482 * d;
  const H = 87.45 + 21.569231 * d;
  const correction = [
    0.472 * Math.sin((u[0] - u[1])*D2R)*2,
    1.065 * Math.sin((u[1] - u[2])*D2R)*2,
    0.165 * Math.sin(G*D2R),
    0.843 * Math.sin(H*D2R),
  ];
  const radius = [
    5.9057 - 0.0244 * Math.cos((u[0] - u[1])*D2R)*2,
    9.3966 - 0.0882 * Math.cos((u[1] - u[2])*D2R)*2,
    14.9883 - 0.0216 * Math.cos(G*D2R),
    26.3627 - 0.1939 * Math.cos(H*D2R),
  ];
  for (let i = 0; i < 4; i += 1) {
    u[i] += correction[i];
  }
  for (let i = 0; i < 4; i += 1) {
    // x with a negative puts it into mirror-reversed view
    moons[i].x = radius[i] * Math.sin(u[i]*D2R);
    moons[i].y = radius[i] * Math.cos(u[i]*D2R)*Math.sin(De*D2R);
  }  
  // check if things are in front of jupiter
  //between 90 and 270
  for (let i = 0; i < 4; i += 1){
    if (u[i] > 360){
      while (u[i] > 360) { u[i] -= 360; }
    }
    if (u[i] < 90 || u[i] > 270) {
      moons[i].front = true;
    }
  }
  return moons;
};

module.exports = Moons;
