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
  topDriversQuery,
  getusersvehIDs,
  getRatingsQuery,
  getRatingsQueryById,
  getTraineeViolations,
  violationsQueryById,
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

    const requests = result.SerialNumbers.map((serialNumber) => {
      return axios.get(
        `https://saferoad-srialfb.firebaseio.com/${serialNumber}.json`
      )
    })

    let online = 0
    let offline = 0

    Promise.all(requests)
      .then((responses) => {
        responses.forEach((response) => {
          if (response.data.EngineStatus) ++online
          else ++offline
        })
      })
      .catch((error) => {
        res.status(500).send('An error occurred')
      })
      .finally(() => {
        delete result.SerialNumbers
        res.status(200).json({ ...result, online, offline })
      })
  } catch (error) {
    console.log(
      '🚀 ~ file: dashboardController.js:134 ~ mainDashboard ~ error:',
      error
    )
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

    const vehiclesSerial = result.map((vehicle) => vehicle.SerialNumber[0])

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
const vehicleViolationsById = async (req, res, next) => {
  try {
    const { userId, custodyId } = req.query
    let allVehicles
    let validVids
    let result
    let totalViolation
    const strDate = new Date()
    const endDate = new Date()
    strDate.setDate(strDate.getDate() - 7)
    // handle user violation (trainee)
    if (userId) {
      // get the user data
      allVehicles = await User.find(
        { _id: userId, vid: { $ne: null, $exists: true } },
        { password: 0 }
      )
      // get the user vehicles ids
      validVids = allVehicles.map((vehicle) => vehicle.vid)
      // get the user violations
      let queryResult = await getTraineeViolations(strDate, endDate, validVids)
      result = queryResult.result
      totalViolation = queryResult.totalViolation
    } else if (custodyId) {
      // handle custody violation
      // get the custody data
      allVehicles = await User.find(
        { custodyId: custodyId, vid: { $ne: null, $exists: true } },
        { password: 0 }
      )
      // get the custody vehicles ids
      validVids = allVehicles.map((vehicle) => vehicle.vid)
      // get the custody violations
      let queryResult = await violationsQueryById(strDate, endDate, validVids)
      result = queryResult.result
      totalViolation = queryResult.totalViolation
    }

    if (!totalViolation) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
      )
    }
    // handle the online/offline status
    const SerialNumbers = result.map((vehicle) => vehicle.SerialNumber[0])
    const requests = SerialNumbers.map((SerialNumber) => {
      const url = `https://saferoad-srialfb.firebaseio.com/${SerialNumber}.json`
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
          users: allVehicles,
          totalViolation: { ...totalViolation[0], online, offline },
        })
      })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const bestDrivers = async (req, res, next) => {
  try {
    // get all users veh ids
    const usersVehIds = await getusersvehIDs()
    // get top drivers from the last 7 days
    let result = await topDriversQuery(usersVehIds)

    if (!result) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "there is no data", "arMessage" :"لا توجد بيانات "}'
      )
    }
    //  extract top drivers ids
    const topArray = result.map((vehs) => {
      return vehs._id
    })
    // get top drivers details
    const usersDetails = await getUserDetails(topArray)

    if (usersDetails) {
      return res.status(200).json({ result: usersDetails })
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const getRatingsById = async (req, res) => {
  try {
    const { id } = req.params

    let result = await getRatingsQueryById(id)
    // loop over the result array and convert the day to the day name
    result = result.map((item) => {
      const date = new Date(item.day)
      const day = date.toLocaleString('default', { weekday: 'long' })
      return { ...item, day }
    })

    return res.status(StatusCodes.OK).json({ result })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json()
  }
}
const getRatings = async (req, res) => {
  try {
    const vehicles = await User.find(
      { vid: { $ne: null, $exists: true } },
      { vid: 1 }
    )

    const validVids = vehicles.map((vehicle) => vehicle.vid)

    let result = await getRatingsQuery(validVids)
    // loop over the result array and convert the day to the day name
    result = result.map((item) => {
      const date = new Date(item.day)
      const day = date.toLocaleString('default', { weekday: 'long' })
      return { ...item, day }
    })

    return res.status(StatusCodes.OK).json({ result })
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
  vehicleViolationsById,
  vehicleViolations,
  bestDrivers,
  getRatings,
  getRatingsById,
}
