// the value returned is in degrees

const D2R = 0.017453292519943;

const correction = function (jd) {
  const jup_mean = (jd - 2455636.938) * 360 / 4332.89709;
  const eqn_center = 5.55 * Math.sin(jup_mean * D2R);
  const angle = (jd - 2451870.628) * 360 / 398.884 - eqn_center;
  const correction = 11 * Math.sin(angle * D2R)
                    + 5 * Math.cos(angle * D2R)
                 - 1.25 * Math.cos(jup_mean * D2R) - eqn_center;
  return correction;
};

// System I
// 156.84 + 877.8169147 * jd + correction
// System II
// 181.62 + 870.1869147 * jd + correction
// System III
// 138.41 + 870.4535567 * jd + correction

// the great red spot is in cloud system 2
const centralMeridian = (jd) => (181.62 + 870.1869147 * jd + correction(jd)) % 360;

// according to centralMeridian calculation and predictions on
// Sky and Telescope great red spot transit occurs at these values
// 355.833890912123    // 2019
// 356.03636794444174  // 2019
// 355.6348914373666   // 2019
// 351.4890765445307   // 2020 mar
// 351.0452500889078   // 2020 mar
// 351.206223490648    // 2020 mar
// 352.0022765668109   // 2020 dec
// 352.08962339162827  // 2020 dec
// 352.17675103247166  // 2020 dec

// const redSpot = (jd) => (8 + centralMeridian(jd)) % 360;
const redSpot = (jd) => (43 + centralMeridian(jd)) % 360;

module.exports = redSpot;
