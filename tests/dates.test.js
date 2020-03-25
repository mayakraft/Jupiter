const dateSequence = require("../src/dateSequence");
const moment = require('moment');

// const startDate = moment().set("date", 5);
// const endDate = moment();
const startDate = moment();
const endDate = moment().add(12, "hours");

// console.log(moment.duration(endDate.diff(startDate)));

const sequence = dateSequence(startDate, endDate, 20);
const sequenceStrings = sequence
  .map(d => d.format("YYYY-MM-DD-hh-mm-ss"))
  .map(s => s.split("-").map(parseFloat));
console.log(sequenceStrings);
