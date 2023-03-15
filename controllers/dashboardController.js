/** @format */
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { faker } = require('@faker-js/faker')
const {
  getUserVehiclesFMS,
  harshAccelerationQuery,
  mainDashboardQuery,
  getusersVhs,
  HarshBreakingQuery,
  IsOverSpeedQuery,
  seatBeltQuery,
  vehicleViolationsQuery,
  nightDriveQuery,
} = require('../helpers/helper')

const harshAcceleration = async (req, res) => {
  // const vhs = await getusersVhs();
  let { strDate, endDate, vehIDs } = req.query
  if (vehIDs || vehIDs == 'string') {
    vehIDs = JSON.parse(vehIDs)
  }
  let result = await harshAccelerationQuery(strDate, endDate, vehIDs)
  if (result.length == 0) {
    throw new CustomError.BadRequestError(
      '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
    )
  }
  res.status(200).json({ result })
}
const HarshBreaking = async (req, res) => {
  // const data = await getusersVhs();
  let { strDate, endDate, vehIDs } = req.query
  if (vehIDs || vehIDs == 'string') {
    vehIDs = JSON.parse(vehIDs)
  }
  let result = await HarshBreakingQuery(strDate, endDate, vehIDs)
  if (result.length == 0) {
    throw new CustomError.BadRequestError(
      '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
    )
  }
  res.status(200).json({ result })
}
const IsOverSpeed = async (req, res) => {
  // const data = await getusersVhs();
  let { strDate, endDate, vehIDs } = req.query
  if (vehIDs || vehIDs == 'string') {
    vehIDs = JSON.parse(vehIDs)
  }
  let result = await IsOverSpeedQuery(strDate, endDate, vehIDs)
  if (result.length == 0) {
    throw new CustomError.BadRequestError(
      '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
    )
  }
  res.status(200).json({ result })
}
const seatBelt = async (req, res) => {
  // const vhs = await getusersVhs();
  let { strDate, endDate, vehIDs } = req.query
  if (vehIDs || vehIDs == 'string') {
    vehIDs = JSON.parse(vehIDs)
  }
  let result = await seatBeltQuery(strDate, endDate, vehIDs)
  if (result.length == 0) {
    throw new CustomError.BadRequestError(
      '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
    )
  }
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
  res.status(200).json({ result })
}

const mainDashboard = async (req, res) => {
  // const data = await getusersVhs();
  let { strDate, endDate, vehIDs } = req.query
  let result = await mainDashboardQuery(strDate, endDate, vehIDs)
  delete result[0]._id
  result[0].nightDriving = 0
  res.status(200).json(result[0])
}

const nightDriving = async (req, res) => {
  let { strDate, endDate, vehIDs } = req.query
  if (vehIDs || vehIDs == 'string') {
    vehIDs = JSON.parse(vehIDs)
  }
  let result = await nightDriveQuery(strDate, endDate, vehIDs)
  if (result.length == 0) {
    throw new CustomError.BadRequestError(
      '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
    )
  }
  res.send({ result })
}
const sharpTurns = (req, res) => {
  res.status(200).json({
    result: [],
  })
}
const vehicleViolations = async (req, res, next) => {
  let { strDate, endDate, vehIDs } = req.query
  try {
    if (vehIDs || vehIDs == 'string') {
      vehIDs = JSON.parse(vehIDs)
    }

    let [{ result, totalViolation }] = await vehicleViolationsQuery(
      strDate,
      endDate,
      vehIDs
    )

    if (!result) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
      )
    }

    res.status(200).json({ result, totalViolation })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  mainDashboard,
  HarshBreaking,
  harshAcceleration,
  IsOverSpeed,
  nightDriving,
  sharpTurns,
  seatBelt,
  vehicleViolations,
}
