/** @format */

const { faker } = require('@faker-js/faker');
const {
  getUserVehiclesFMS,
  harshAccelerationQuery,
  mainDashboardQuery,
  getusersVhs,
  HarshBreakingQuery,
  IsOverSpeedQuery,
  seatBeltQuery,
} = require('../helpers/helper');

const harshAcceleration = async (req, res) => {
  const vhs = await getusersVhs();
  const { dateTime } = req.query;
  console.log(dateTime)
  let result = await harshAccelerationQuery(vhs, dateTime);

    res.status(200).json({ result });
};
const HarshBreaking = async (req, res) => {
  const data = await getusersVhs();
  const { dateTime } = req.query;
  let result = await HarshBreakingQuery(data, dateTime);
  res.status(200).json({ result });
};
const IsOverSpeed = async (req, res) => {
  const data = await getusersVhs();
  const { dateTime } = req.query;
  let result = await IsOverSpeedQuery(data, dateTime);
  res.status(200).json({ result });
};
const seatBelt = async (req, res) => {
  const vhs = await getusersVhs();
  const { dateTime } = req.query;
  let result = await seatBeltQuery(vhs, dateTime);
  // let data = [];
// result.forEach((element, i) => {
//     if(data.filter(e => e?.date == element._id.date) .length > 0) {
//         data[data.findIndex(ee => ee?.date == element._id.date)].count ++ 
//     }else{
//         data.push({
//             date: element._id.date,
//             count: 1
//         })
//     }
// });
  res.status(200).json({ result });
};

const mainDashboard = async (req, res) => {
  const data = await getusersVhs();
  const { dateTime } = req.query;
  let result = await mainDashboardQuery(data, dateTime);
  delete result[0]._id;
  result[0].nightDriving = 0;
  result[0].sharpTurns = 0;
  res.status(200).json(result);
};

const nightDriving = (req, res) => {
  res.status(200).json({
    result: [],
  });
};
const sharpTurns = (req, res) => {
  res.status(200).json({
    result: [],
  });
};

module.exports = {
  mainDashboard,
  HarshBreaking,
  harshAcceleration,
  IsOverSpeed,
  nightDriving,
  sharpTurns,
  seatBelt,
};
