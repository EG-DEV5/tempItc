/** @format */
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { faker } = require('@faker-js/faker')
const User = require('../models/User')
const axios = require('axios')
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
  getUserDetails,
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
  try {
    const startDate = new Date()
    const endDate = new Date()
    startDate.setDate(startDate.getDate() - 7)

    const vehicles = await User.find(
      { vid: { $ne: null, $exists: true } },
      { vid: 1 }
    )

    const validVids = vehicles.map((vehicle) => vehicle.vid)

    let result = await mainDashboardQuery(startDate, endDate, validVids)

    const vehiclesSerial = result.map((vehicle) => vehicle.SerialNumber)

    const requests = vehiclesSerial.map((serialNumber) => {
      const url = `https://saferoad-srialfb.firebaseio.com/${serialNumber}.json`
      return axios.get(url)
    })

    let online = 0
    let offline = 0

    Promise.all(requests)
      .then((responses) => {
        responses.forEach((response) => {
          const vehicle = result.find(
            (vehicle) => vehicle.SerialNumber == response.data.SerialNumber
          )
          if (vehicle) {
            if (response.data.EngineStatus) ++online
            else ++offline
            vehicle.EngineStatus = response.data.EngineStatus
          }
        })
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send('An error occurred')
      })
      .finally(() => {
        // delete result[0]._id
        // result[0].nightDriving = 0
        res.status(200).json({ ...result[0], online, offline })
      })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' })
  }
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

    const usersDetails = await getUserDetails(vehIDs)

    if (usersDetails) {
      result.map((res) => {
        const userDetails = usersDetails.find((user) => user.vid == res._id)

        if (userDetails) return Object.assign(res, userDetails)

        return res
      })
    }

    const vehiclesSerial = result.map((vehicle) => vehicle.SerialNumber)

    const requests = vehiclesSerial.map((serialNumber) => {
      const url = `https://saferoad-srialfb.firebaseio.com/${serialNumber}.json`
      return axios.get(url)
    })

    let online = 0
    let offline = 0

    Promise.all(requests)
      .then((responses) => {
        responses.forEach((response) => {
          const vehicle = result.find(
            (vehicle) => vehicle.SerialNumber == response.data.SerialNumber
          )
          if (vehicle) {
            if (response.data.EngineStatus) ++online
            else ++offline
            vehicle.EngineStatus = response.data.EngineStatus
          }
        })
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send('An error occurred')
      })
      .finally(() => {
        res.status(StatusCodes.OK).json({
          result,
          totalViolation: { ...totalViolation[0], online, offline },
        })
      })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json()
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
