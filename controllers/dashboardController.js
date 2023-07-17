/** @format */
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { faker } = require('@faker-js/faker')
const User = require('../models/User')
const Group = require('../models/Custody')
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
  fatigueQuery,
  weeklyTrendsQuery,
  optimizedTrendsQuery,
  custodyFilter,
  sheetsFortrainee,
  dateFilter,
} = require('../helpers/helper')
const moment = require('moment')
const Division = require('../models/Division')

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

// const dateFilter = (startDate, endDate) => {
//   startDate = startDate
//     ? moment.utc(startDate).format()
//     : moment.utc().subtract(24, 'hours').format()
//   endDate = endDate ? moment.utc(endDate).format() : moment.utc().format()
//   return { startPeriod: startDate, endPeriod: endDate }
// }

const isOffline = (data) => {
  let targetDate = moment.utc(data.RecordDateTime).toDate()

  var current = new Date(new Date().toUTCString())
  let diffInMinutes = Math.ceil((current - targetDate) / 60000)
  // console.log({ targetDate, current, diffInMinutes, fire: data.RecordDateTime })

  return (
    (!data.EngineStatus && diffInMinutes / 60 >= 48) ||
    (data.EngineStatus && diffInMinutes / 60 > 12)
  )
}
const isSleep = (data) => {
  let targetDate = moment.utc(data.RecordDateTime).toDate()

  var current = new Date(new Date().toUTCString())
  let diffInMinutes = Math.ceil((current - targetDate) / 60000)
  return !data.EngineStatus && diffInMinutes / 60 < 48 && diffInMinutes / 60 > 4
}
const isStopped = (data) => {
  let targetDate = moment.utc(data.RecordDateTime).toDate()

  var current = new Date(new Date().toUTCString())
  let diffInMinutes = Math.ceil((current - targetDate) / 60000)
  return !data.EngineStatus && diffInMinutes / 60 < 4
}
const vehStatus = (data) => {
  let vehicleStatus = {
    offline: 'offline',
    sleep: 'sleep',
    stopped: 'stopped',
    idling: 'idling',
    overSpeed: 'overSpeed',
    running: 'running',
    invalidLocation: 'invalidLocation',
  }
  if (isOffline(data)) {
    return vehicleStatus.offline
  } else if (isSleep(data)) {
    return vehicleStatus.sleep
  } else if (isStopped(data)) {
    return vehicleStatus.stopped
  } else if (data.IsFuelCutOff || data.IsPowerCutOff) {
    return vehicleStatus.invalidLocation
  } else if (data.EngineStatus && data.Speed <= 5) {
    return vehicleStatus.idling
  } else if (data.EngineStatus && data.Speed > 120) {
    return vehicleStatus.overSpeed
  } else if (data.EngineStatus && data.Speed < 120 && data.Speed > 5) {
    return vehicleStatus.running
  } else if (!data.EngineStatus && data.Speed > 0) {
    return vehicleStatus.invalidLocation
  } else if (!data.EngineStatus) {
    return vehicleStatus.stopped
  }
  return vehicleStatus.offline
}
const mainDashboard = async (req, res) => {
  try {
    let { endDate, startDate, itd, itc } = req.query
    let { startPeriod, endPeriod } = dateFilter(startDate, endDate)
    if (startPeriod > endPeriod)
      return res.status(400).send('Invalid date range')

    let vehicles = await custodyFilter(itd, itc)
    const validVids = vehicles.reduce((acc, vehicle) => {
      if (vehicle.vid !== null || vehicle.vid !== undefined) {
        acc.push(vehicle.vid)
      }
      return acc
    }, [])

    const serials = vehicles
      .map((vehicle) => vehicle.SerialNumber)
      .filter((serial) => serial != null || serial != undefined)
    // const nullSerials = vehicles.length - serials.length

    let result = await mainDashboardQuery(startPeriod, endPeriod, validVids)

    const requests =
      serials.length > 0 &&
      serials.map((SerialNumber) => {
        const url = `https://saferoad-srialfb.firebaseio.com/${SerialNumber}.json`
        return axios.get(url)
      })

    let online = 0
    let offline = 0
    let mileage = 0
    let tampering = 0
    let acctiveUsers = []
    let offlineUsers = []

    const firebaseResponses = await Promise.all(requests)    
    firebaseResponses.forEach((response) => {
      const status = vehStatus(response.data)
      if (status !== 'offline') ++online , acctiveUsers.push(response.data.SerialNumber)
      else ++offline , offlineUsers.push(response.data.SerialNumber)
      mileage += response.data.Mileage
      if (response.data.IsPowerCutOff) ++tampering
    })
    const finalResponse = finalResult(
      result, online, offline, mileage, tampering, acctiveUsers, offlineUsers, vehicles
    )
    res.status(200).json(finalResponse)
    // requests
    //   ? Promise.all(requests)
    //       .then((responses) => {
            // responses.forEach((response) => {
            //   const status = vehStatus(response.data)
            //   if (status !== 'offline') ++online , acctiveUsers.push(response.data.SerialNumber)
            //   else ++offline , offlineUsers.push(response.data.SerialNumber)
            //   mileage += response.data.Mileage
            //   if (response.data.IsPowerCutOff) ++tampering
            //   // if (response.data.EngineStatus) ++online
            //   // else ++offline
            // })
    //       })
    //       .catch((error) => {
    //         res.status(500).send('An error occurred')
    //       })
    //       .finally(() => {
    //         const finalResponse = finalResult(
    //           result,
    //           online,
    //           offline,
    //           mileage,
    //           tampering,
    //           acctiveUsers,
    //           offlineUsers,
    //           vehicles
    //           // fatigue
    //         )
    //         res.status(200).json(finalResponse)
    //       })
    //   : res.status(200).json({
    //       // if there is no data
    //       ...result.violationCount,
    //       allItd: 0,
    //       online,
    //       offline,
    //       mileage,
    //       tampering,
    //       users: [],
    //       incentivePoints : 0
    //     })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' })
  }
}
function finalResult(result,online,offline,mileage,tampering,acctiveUsers,offlineUsers,vehicles) {
  let active = []
  let unActive = []
  acctiveUsers.forEach((serial) => {
   const onlineVeh =  vehicles.find((vehicle) => vehicle.SerialNumber === serial)
   if (typeof onlineVeh == 'object') {
     delete onlineVeh.password
     delete onlineVeh.__V
     delete onlineVeh.isOnline
    active.push({...onlineVeh, status : 'online'})
  }
  })
  offlineUsers.forEach((serial) => {
   const offlineVeh =  vehicles.find((vehicle) => vehicle.SerialNumber === serial)
   if (typeof offlineVeh == 'object') {
     delete offlineVeh.password
     delete offlineVeh.__V
     delete offlineVeh.isOnline
    unActive.push( {...offlineVeh, status : 'offline'} )
  }
  })
  let final = {
    harshAcceleration: result.violationCount.harshAcceleration,
    overSpeed: result.violationCount.OverSpeed,
    lowSpeed: result.violationCount.lowSpeed,
    mediumSpeed: result.violationCount.mediumSpeed,
    highSpeed: result.violationCount.highSpeed,
    seatBelt: result.violationCount.SeatBelt,
    harshBrake: result.violationCount.harshBrake,
    nightDrive: result.violationCount.nightDrive,
    longDistance: result.violationCount.longDistance,
    users: result.users,
    fatigue: result.fatigue,
    mileage,
    online,
    offline,
    incentivePoints : (online + offline) * 100,
    onlineUsers : active,
    offlineUsers : unActive,
    tampering,
    sheets: result.sheets,
  }
  // get the max value from violations to get the ITD
  const allItd = Math.max(
    final?.harshAcceleration,
    final?.overSpeed,
    final?.seatBelt,
    final?.harshBrake,
    final?.nightDrive,
    final?.longDistance,
    final?.tampering
  )
  final.allItd = allItd
  return final
}
const weeklyTrends = async (req, res) => {
  try {
    let { endDate, startDate, itd, itc } = req.query
    let { startPeriod, endPeriod } = dateFilter(startDate, endDate)
    if (startPeriod > endPeriod)
      return res.status(400).send('Invalid date range')

    let vehicles = await custodyFilter(itd, itc)
    const validVids = vehicles.reduce((acc, vehicle) => {
      if (vehicle.vid !== null && vehicle.vid !== undefined) {
        acc.push(vehicle.vid)
      }
      return acc
    }, [])

    // let Trends = await weeklyTrendsQuery(validVids)
    let Trends = await optimizedTrendsQuery(validVids, startPeriod, endPeriod)

    res.status(200).json({ Trends })
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

    result.map((res) => {
      const userDetails = usersDetails.find((user) => user.vid == res._id)

      if (userDetails) {
        return Object.assign(res, userDetails)
      } else {
        // Add dummy data when userDetails is not found
        return Object.assign(res, {
          username: 'No Data',
          email: 'No Data',
          phoneNumber: 'No Data',
          image: 'No Data',
          username: 'No Data',
        })
      }
    })

    return res
      .status(StatusCodes.OK)
      .json({ result, totalViolation: totalViolation[0] })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json()
  }
}
 function requestsHandler(SerialNumbers)  {
  const requests = SerialNumbers.map((SerialNumber) => {
    const url = `https://saferoad-srialfb.firebaseio.com/${SerialNumber}.json`
    return axios.get(url)
  })
  return requests
}

const trainerHandler = async (userId, endDate, startDate, res) => {
  startDate = startDate
    ? moment.utc(startDate).format()
    : moment.utc().subtract(1, 'hours').format()
  endDate = endDate ? moment.utc(endDate).format() : moment.utc().format()
  if (startDate > endDate) return res.status(400).send('Invalid date range')

  const userVehicle = await User.find(
    { _id: userId, vid: { $ne: null, $exists: true } },
    { password: 0 }
  ).lean()
 
  const custodyDetails = await Group.find({ _id: userVehicle[0].custodyId }) 
  const divisionDetails = await Division.find({
    itcs: { $in: userVehicle[0].custodyId },
  }).select('divisionName')

  const validVids = userVehicle.map((vehicle) => vehicle.vid)
  const traineeSerial = userVehicle.map((vehicle) => vehicle.SerialNumber)

  const queryResult = await getTraineeViolations(startDate, endDate, validVids)
  const result = queryResult.result
  const totalViolation = queryResult.totalViolation
  const violationsObj = totalViolation[0]

  let sumViolations = 0;
  let sheets = [];

  if(result.length > 0 ) {
    sumViolations = 
    violationsObj.harshAcceleration +
    violationsObj.harshBrake +
    violationsObj.OverSpeed +
    violationsObj.SeatBelt +
    violationsObj.nightDrive +
    violationsObj.longDistance +
    violationsObj.swerving
        
    sheets = sheetsFortrainee(
      result,
      userVehicle,
      custodyDetails,
      divisionDetails,
    )
  }

  if (totalViolation.length === 0) {
    throw new CustomError.BadRequestError(
      '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
    )
  }
  let online = 0
  let offline = 0
  if (traineeSerial[0] != null) {
    const requests = requestsHandler(traineeSerial)
    const firebaseResponses = await Promise.all(requests)
    firebaseResponses.forEach((response) => {
      const vehicle = traineeSerial.find(
        (vehicle) => vehicle == response.data.SerialNumber
      )
      const status = vehStatus(response.data)
      if (vehicle) {
        if (status !== 'offline') ++online
        else ++offline
        vehicle.EngineStatus = response.data.EngineStatus
      }
    })
    res.status(StatusCodes.OK).json({
      custodyName: custodyDetails[0].custodyName ?? 'Not Assigned',
      itdName: divisionDetails[0].divisionName ?? 'Not Assigned',
      totalViolation: {
        sumViolations,
        ...totalViolation[0],
        online,
        offline,
        Mileage: 100,
        incentivePoints: 100,
        sheets,
      },
      users: userVehicle ?? [],
    })
    // Promise.all(requests)
    //   .then((responses) => {
    //     responses.forEach((response) => {
    //       const vehicle = traineeSerial.find(
    //         (vehicle) => vehicle == response.data.SerialNumber
    //       )
    //       const status = vehStatus(response.data)
    //       if (vehicle) {
    //         if (status !== 'offline') ++online
    //         else ++offline
    //         vehicle.EngineStatus = response.data.EngineStatus
    //       }
    //     })
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //     res.status(500).send('An error occurred')
    //   })
    //   .finally(() => {
        // res.status(StatusCodes.OK).json({
        //   custodyName: custodyDetails[0].custodyName ?? 'Not Assigned',
        //   itdName: divisionDetails[0].divisionName ?? 'Not Assigned',
        //   totalViolation: {
        //     sumViolations,
        //     ...totalViolation[0],
        //     online,
        //     offline,
        //     Mileage: 100,
        //     incentivePoints: 100,
        //     sheets,
        //   },
        //   users: userVehicle ?? [],
        // })
    //   })
  } else {
    offline = 1
    res.status(StatusCodes.OK).json({
      custodyName: custodyDetails[0].custodyName ?? 'Not Assigned',
      itdName: divisionDetails[0].divisionName ?? 'Not Assigned',
      users: userVehicle ?? [],
      totalViolation: {
        ...totalViolation[0],
        online,
        offline,
      },
    })
  }
}
const custodyHandler = async (custodyId, res) => {
  const strDate = moment.utc().subtract(1, 'days').toDate()
  const endDate = moment.utc().toDate()
  const allVehicles = await User.find(
    {
      custodyId: custodyId,
      vid: { $ne: null, $exists: true },
      role: 'trainer',
    },
    { password: 0 }
  )
  // get the custody vehicles ids
  const validVids = allVehicles.map((vehicle) => vehicle.vid)
  // get the custody violations
  const queryResult = await violationsQueryById(strDate, endDate, validVids)
  const result = queryResult.result
  const totalViolation = queryResult.totalViolation
  const fatigue = await fatigueQuery(endDate, validVids)
  const vioCount = await mainDashboardQuery(strDate, endDate, validVids)
  const speedRanges = vioCount && {
    lowSpeed: vioCount.violationCount.lowSpeed,
    mediumSpeed: vioCount.violationCount.mediumSpeed,
    highSpeed: vioCount.violationCount.highSpeed,
  }
  if (!totalViolation) {
    throw new CustomError.BadRequestError(
      '{"enMessage" : "there is no data in this period", "arMessage" :"لا توجد بيانات فى هذه الفترة"}'
    )
  }
  // handle the online/offline status
  // const requestsHandler = (SerialNumbers) => {
  //   const requests = SerialNumbers.map((SerialNumber) => {
  //     const url = `https://saferoad-srialfb.firebaseio.com/${SerialNumber}.json`
  //     return axios.get(url)
  //   })
  //   return requests
  // }
  const serials = allVehicles
    .map((vehicle) => vehicle.SerialNumber)
    .filter((serial) => serial != null || serial != undefined)
  const requests = requestsHandler(serials)

  let online = 0
  let offline = 0
  let mileage = 0
  Promise.all(requests)
    .then((responses) => {
      responses.forEach((response) => {
        const vehicle = serials.find(
          (vehicle) => vehicle == response.data.SerialNumber
        )
        const status = vehStatus(response.data)
        if (vehicle) {
          if (status !== 'offline') ++online
          else ++offline
          vehicle.EngineStatus = response.data.EngineStatus
          mileage += response.data.Mileage
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
        totalViolation: {
          // ...totalViolation[0],
          online,
          offline,
          fatigue: fatigue.count,
          ...(custodyId && speedRanges),
          ...vioCount.violationCount,
          Mileage: mileage,
          SerialNumber: [],
        },
      })
    })
}
const vehicleViolationsById = async (req, res, next) => {
  try {
    const { userId, custodyId, endDate, startDate } = req.query

    if (userId) {
      trainerHandler(userId, endDate, startDate, res)
    } else if (custodyId) {
      custodyHandler(custodyId, res)
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const bestDrivers = async (req, res, next) => {
  try {
    let { endDate, startDate, itd, itc } = req.query
    startDate = startDate
      ? moment.utc(startDate).format()
      : moment.utc().subtract(24, 'hours').format()
    endDate = endDate ? moment.utc(endDate).format() : moment.utc().format()
    if (startDate > endDate) return res.status(400).send('Invalid date range')
    let vehicles = await custodyFilter(itd, itc)

    const validVids = vehicles.reduce((acc, vehicle) => {
      if (vehicle.vid !== null || vehicle.vid !== undefined) {
        acc.push(vehicle.vid)
      }
      return acc
    }, [])

    let result = await topDriversQuery(startDate, endDate, validVids)

    if (result.length === 0) {
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

    if (usersDetails.length === 0) {
      throw new CustomError.BadRequestError(
        '{"enMessage" : "there is no data", "arMessage" :"لا توجد بيانات "}'
      )
    }

    return res.status(200).json({ result: usersDetails })
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
  weeklyTrends,
}
