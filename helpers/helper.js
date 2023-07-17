const { configConnection, stageDBConnection } = require('./mongodbConn')
const User = require('../models/User')
const axios = require('axios')
const moment = require('moment')
const Division = require('../models/Division')
function bit_test(num, bit) {
  return (num >> bit) % 2 != 0
}
async function harshAccelerationQuery(strDate, endDate, vehIDs) {
  try {
    // await connect()
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: { $gte: new Date(strDate), $lte: new Date(endDate) },
          AlarmCode: { $bitsAllSet: [0] },
        },
      },
      vehIDs.length > 1000
        ? {
            $limit: 2000000,
          }
        : { $limit: 5000000 },

      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$RecordDateTime' },
          },
          count: {
            $sum: 1,
          },
        },
      },

      { $sort: { _id: 1 } },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}

async function HarshBreakingQuery(strDate, endDate, vehIDs) {
  try {
    // await connect()
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: { $gte: new Date(strDate), $lte: new Date(endDate) },
          AlarmCode: { $bitsAllSet: [1] },
        },
      },
      vehIDs.length > 1000
        ? {
            $limit: 2000000,
          }
        : { $limit: 5000000 },

      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$RecordDateTime' },
          },
          count: {
            $sum: 1,
          },
        },
      },

      { $sort: { _id: 1 } },
    ]

    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}
async function IsOverSpeedQuery(strDate, endDate, vehIDs) {
  try {
    // await connect()
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: { $gte: new Date(strDate), $lte: new Date(endDate) },
          AlarmCode: { $bitsAllSet: [2] },
        },
      },
      vehIDs.length > 100
        ? {
            $limit: 2000000,
          }
        : { $limit: 5000000 },

      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$RecordDateTime' },
          },
          count: {
            $sum: 1,
          },
        },
      },

      { $sort: { _id: 1 } },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}
async function seatBeltQuery(strDate, endDate, vehIDs) {
  try {
    // await connect()
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: { $gte: new Date(strDate), $lte: new Date(endDate) },
          StatusCode: { $bitsAllSet: [3] },
        },
      },
      vehIDs.length > 1000
        ? {
            $limit: 2000000,
          }
        : { $limit: 5000000 },

      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$RecordDateTime' },
          },
          count: {
            $sum: 1,
          },
        },
      },

      { $sort: { _id: 1 } },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}

async function nightDriveQuery(strDate, endDate, vehIDs) {
  try {
    // await connect()
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: { $gte: new Date(strDate), $lte: new Date(endDate) },
          $or: [
            { AlarmCode: { $bitsAnySet: [0, 1, 2] } },
            { StatusCode: { $bitsAllSet: [3] } },
          ],
        },
      },

      {
        $addFields: {
          startnight: {
            $function: {
              body: `function(dateTime) {
                                     let start = new Date(dateTime);
                                     start.setHours(16,0,0,0);
                                    return start
                                 }`,
              args: ['$RecordDateTime'],
              lang: 'js',
            },
          },
          endnight: {
            $function: {
              body: `function(dateTime) {
                                     let end = new Date(dateTime);
                                     end.setDate(end.getDate()+1)
                                     end.setHours(04,0,0,0);
                                    return end
                                 }`,
              args: ['$RecordDateTime'],
              lang: 'js',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$RecordDateTime' },
          },
          count: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$RecordDateTime', '$startnight'] },
                    { $lte: ['$RecordDateTime', '$endnight'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}
async function getUserVehiclesFMS() {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhMjM3NWM3LWZkMjAtNDYyOC1hNDg0LTc1MWE2NTgyZTA1NiIsInVzZXJuYW1lIjoidGQiLCJleHAiOjE2NzY1MzYwMDYsImFjY291bnRJZCI6MzY2LCJyb2xlIjoidXNlciIsImlhdCI6MTY3MTM1MjAwNn0.HpEzqi1BcF4ZJyjqkDwUh0wcZt26beqkyPNXz91shfI`,
    },
  }
  const data = await axios
    .get('https://api.v6.saferoad.net/dashboard/vehicles', config)
    .then((apiResponse) => {
      // process the response
      return apiResponse.data.Vehicles.map((e) => e.VehicleID)
    })
  return data
}
async function getusersvehIDs() {
  let uservehIDs = await User.find({ role: 'trainer' }, { vid: 1, _id: 0 })
  uservehIDs = uservehIDs.map((e) => e.vid)
  return uservehIDs
}
async function mainDashboardQuery(strDate, endDate, vehIDs) {
  try {
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: { $gte: new Date(strDate), $lte: new Date(endDate) },
        },
      },
      {
        $addFields: {
          HarshAcceleration: {
            $function: {
              body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
              args: ['$AlarmCode', 0],
              lang: 'js',
            },
          },
          IsOverSpeed: {
            $function: {
              body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
              args: ['$AlarmCode', 2],
              lang: 'js',
            },
          },
          HarshBrake: {
            $function: {
              body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
              args: ['$AlarmCode', 1],
              lang: 'js',
            },
          },
          SeatBelt: {
            $function: {
              body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
              args: ['$StatusCode', 3],
              lang: 'js',
            },
          },
          nightDrive: {
            $function: {
              body: `function(dateTime) { let hr = (new Date(dateTime)).getHours() + 3; return (hr < 8) || (hr > 18); }`,
              args: ['$RecordDateTime'],
              lang: 'js',
            },
          },
          longDistance: {
            $function: {
              body: `function(Distance) { return (Distance > 100) ;}`,
              args: ['$Distance'],
              lang: 'js',
            },
          },
          swerving: {
            $function: {
              body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
              args: ['$StatusCode', 100],
              lang: 'js',
            },
          }
        },
      },
      {
        $group: {
          _id: { VehicleID: '$VehicleID' },
          harshAcceleration: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$HarshAcceleration', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          OverSpeed: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$IsOverSpeed', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          SeatBelt: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$SeatBelt', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          harshBrake: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$HarshBrake', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          nightDrive: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$nightDrive', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          longDistance: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$longDistance', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          SerialNumbers: {
            $addToSet: '$SerialNumber',
          },
          address: {
            $last: {
              $ifNull: ['$Address', 'No Adress'],
            },
          },
          lan: {
            $last: '$Longitude',
          },
          lat: {
            $last: '$Latitude',
          },
          swerving: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$swerving', true],
                },
                then: 1,
                else: 0,
              },
            },
          }
        },
      },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    // const vehiclesIds = result.map((e) => e._id.VehicleID)
    const userDetails = await User.find({ vid: { $in: vehIDs } })
      .populate({
        path: 'custodyId',
        select: 'custodyName',
      })
      .select('-password -__v ')
      .lean()
    const formatedDuration = formatDuration(strDate, endDate) // duration of the violations

    const {
      overSpeedVio,
      harshAccelerationVio,
      harshBrakeVio,
      SeatBeltVio,
      nightDriveVio,
      longDistanceVio,
      swervingVio,
    } = splitViolations(result)

    // merging the user details with vehicle details to generate sheets
    const overSpeed = mergeDetails(overSpeedVio, userDetails, formatedDuration)
    const harshAcceleration = mergeDetails(
      harshAccelerationVio,
      userDetails,
      formatedDuration
    )
    const harshBrake = mergeDetails(
      harshBrakeVio,
      userDetails,
      formatedDuration
    )
    const SeatBelt = mergeDetails(SeatBeltVio, userDetails, formatedDuration)
    const nightDrive = mergeDetails(
      nightDriveVio,
      userDetails,
      formatedDuration
    )
    const longDistance = mergeDetails(
      longDistanceVio,
      userDetails,
      formatedDuration
    )
    const swerving = mergeDetails(swervingVio, userDetails,formatedDuration)
    const violationCount = violationsCount(result) // counting how many vehicles did certain violation
    // let fatigue = await fatigueQuery(endDate, vehIDs)
    const users = getUsersWithViolations(userDetails, result)
    return {
      violationCount,
      // fatigue: fatigue.count,
      users,
      sheets: {
        overSpeed,
        harshAcceleration,
        harshBrake,
        SeatBelt,
        nightDrive,
        longDistance,
        swerving
      },
    }
  } catch (e) {
    console.log({errorMsg: e.message, stack: e.stack});
    return e.message
  }
}
function getUsersWithViolations(userDetails, result) {
  const vehicleData = {}
  const violationKeys = [
    'OverSpeed',
    'harshAcceleration',
    'harshBrake',
    'SeatBelt',
    'nightDrive',
    'longDistance',
    'swerving' ]
  const vehiclesWithViolaions = result.filter((veh) => {
    // loop over violation keys and check if any vehicle has at least one key > 0
    return violationKeys.some((violation) => {
      return veh[violation] > 0
    })
  })
  // returning users with there violations
  vehiclesWithViolaions.forEach((veh) => {
    const vehicleId = veh._id.VehicleID
    vehicleData[vehicleId] = {
      ...veh,
    }
  })

  const users = []

  for (let key in vehicleData) {
    const user = userDetails.find((u) => u.vid == +key)
    const userObject = { ...user, ...vehicleData[key] }
    userObject.custodyName = userObject.custodyId.custodyName,
    delete userObject.address
    delete userObject.endCoords
    delete userObject.startCoords
    delete userObject.startAdress
    delete userObject.endAdress
    delete userObject.SerialNumbers
    delete userObject.custodyId
    delete userObject.lat
    delete userObject.lan
    delete userObject.GroupID
    delete userObject.GroupName
    users.push(userObject)
  }
  return users
}
function formatDuration(strDate, endDate) {
  const date1 = moment(strDate)
  const date2 = moment(endDate)
  const duration = moment.duration(date2.diff(date1))
  const days = Math.floor(duration.asDays())
  const hours = duration.hours()
  return `${days} Day(s) : ${hours} Hour(s)`
}
function mergeDetails(violation, userDetails, formatedDuration, isFatigue) {
  try {
    const userDetailsMap = new Map(
      userDetails.map((user) => [
        user.vid,
        {
          _id: user._id,
          duration: formatedDuration,
          username: user.username,
          vehicleID: user.vid,
          email: user.email,
          phoneNumber: user.phoneNumber,
          SerialNumber: user.SerialNumber,
          custodyId: user.custodyId._id,
          custodyName: user.custodyId.custodyName,
          idNumber: user.idNumber,
          image: user.image,
          role: user.role,
          isOnline: user.isOnline,
        },
      ])
    )

    const mergeUsersWithViolations = violation.map((vio) => {
      const user = userDetailsMap.get(isFatigue ? vio._id : vio._id.VehicleID)
      return user && Object.assign({ ...vio }, user)
    })

    return mergeUsersWithViolations
  } catch (errer) {
    return errer.message
  }
}
function splitViolations(result) {
  const overSpeedVio = result.reduce((acc, e) => {
    if (e.OverSpeed > 0) { 
        acc.push({
        _id: e._id,
        OverSpeed: e.OverSpeed,
        address: e.address,
        startCoords: e.lan,
        endCoords: e.lat,
      }) }
    return acc
  }, [])
  const harshAccelerationVio = result.reduce((acc, e) => {
    if (e.harshAcceleration > 0) {
      acc.push({
        _id: e._id,
        harshAcceleration: e.harshAcceleration,
        address: e.address,
        startCoords: e.lan,
        endCoords: e.lat,
      })}
    return acc
  }, [])
  const harshBrakeVio = result.reduce((acc, e) => {
    if (e.harshAcceleration > 0) {
      acc.push({
        _id: e._id,
        harshBrake: e.harshBrake,
        address: e.address,
        startCoords: e.lan,
        endCoords: e.lat,
      })}
    return acc
  }, [])
  const SeatBeltVio = result.reduce((acc, e) => {
    if (e.SeatBelt > 0) {
      acc.push({
        _id: e._id,
        SeatBelt: e.SeatBelt,
        address: e.address,
        startCoords: e.lan,
        endCoords: e.lat,
      })}
    return acc
  }, [])
  const nightDriveVio = result.reduce((acc, e) => {
    if (e.nightDrive > 0) {
      acc.push({
        _id: e._id,
        nightDrive: e.nightDrive,
        address: e.address,
        startCoords: e.lan,
        endCoords: e.lat,
      })}
    return acc
  }, [])
  const longDistanceVio = result.reduce((acc, e) => {
    if (e.longDistance > 0) {
      acc.push({
        _id: e._id,
        longDistance: e.longDistance,
        address: e.address,
        startCoords: e.lan,
        endCoords: e.lat,
      })}
    return acc
  }, [])
  const swervingVio = result.reduce((acc, e) => {
    if (e.swerving > 0) {
      acc.push({
        _id: e._id,
        swerving: e.swerving,
        address: e.address,
        startCoords: e.lan,
        endCoords: e.lat,
      })}
    return acc
  },[])
  return {
    overSpeedVio,
    harshAccelerationVio,
    harshBrakeVio,
    SeatBeltVio,
    nightDriveVio,
    longDistanceVio,
    swervingVio,
  }
}
function violationsCount(result) {
  // counting how many vehicles did certain violation
  const acc = {
    harshAcceleration: 0,
    OverSpeed: 0,
    SeatBelt: 0,
    harshBrake: 0,
    nightDrive: 0,
    longDistance: 0,
    swerving:0,
    lowSpeed: 0,
    mediumSpeed: 0,
    highSpeed: 0,
    SerialNumber: [],
    // Mileage: 0,
  }
  const violationCount = result.reduce((acc, item) => {
    return {
      ...acc,
      harshAcceleration:
        item.harshAcceleration > 0
          ? acc.harshAcceleration + 1
          : acc.harshAcceleration,
      OverSpeed: item.OverSpeed > 0 ? acc.OverSpeed + 1 : acc.OverSpeed,
      SeatBelt: item.SeatBelt > 0 ? acc.SeatBelt + 1 : acc.SeatBelt,
      harshBrake: item.harshBrake > 0 ? acc.harshBrake + 1 : acc.harshBrake,
      nightDrive: item.nightDrive > 0 ? acc.nightDrive + 1 : acc.nightDrive,
      longDistance:
        item.longDistance > 0 ? acc.longDistance + 1 : acc.longDistance,
      swerving: item.swerving > 0 ? acc.swerving + 1 : acc.swerving,
      lowSpeed:
        item.OverSpeed < 120 && item.OverSpeed > 0
          ? acc.lowSpeed + 1
          : acc.lowSpeed,
      mediumSpeed:
        item.OverSpeed >= 120 && item.OverSpeed < 140
          ? acc.mediumSpeed + 1
          : acc.mediumSpeed,
      highSpeed: item.OverSpeed >= 140 ? acc.highSpeed + 1 : acc.highSpeed,
      SerialNumber: [...new Set([...acc.SerialNumber, ...item.SerialNumbers])],
      // Mileage: acc.Mileage + item.Mileage,
    }
  }, acc)
  return violationCount
}
async function fatigueQuery(enddate, vehIDs) {
  try {
    let strDate = moment.utc(enddate).subtract(1, 'days').format()
    let endDate = moment.utc(enddate).format()
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          StrDate: { $gte: new Date(strDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$VehicleID',
          Duration: { $sum: '$Duration' },
          address: {
            $last: {
              $ifNull: ['$Address', 'No Adress'],
            },
          },
          coord: {
            $last: '$Coord',
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          fatigue: {
            $sum: {
              $cond: {
                if: { $gt: ['$Duration', 20 * 60 * 60] },
                then: 1,
                else: 0,
              },
            },
          },
          address: { $first: '$address' },
          coords: {
            $last: '$coord',
          },
          fatigueDuration: { $sum: '$Duration' },
        },
      },
      // filter out documents where count is > 0
      // { $match: { count: { $gt: 0 } } },
      // { $count: 'count' },
    ]
    // fatigue: {
    //   // count: { $gt: 0 },
    //   $sum: {
    //     $cond: {
    //       if: {
    //         $gt: [
    //           {
    //             $sum: {
    //               $cond: {
    //                 if: { $gt: ['$Duration', 20 * 60 * 60] },
    //                 then: 1,
    //                 else: 0,
    //               },
    //             },
    //           },
    //           0,
    //         ],
    //       },
    //       then: 1,
    //       else: 0,
    //     },
    //   },
    // },

    const result = await stageDBConnection
      .collection('WorkSteps')
      .aggregate(agg)
      .toArray()
    const vehiclesWithFatigue = result.filter((item) => item.fatigue > 0)
    // optimizing vehicle's address & coords to generate sheets
    const formatedVehs = vehiclesWithFatigue.map((veh) => {
      if (typeof veh.address === 'object') {
        // veh.startAdress = veh.address[0]
        // veh.endAdress = veh.address[1]
        // delete veh.address
        ;(veh.address = veh.address[0]), veh.address[1]
      }
      if (typeof veh.coords === 'object') {
        veh.startCoords = `(${veh.coords[0]},${veh.coords[1]})`
        veh.endCoords = `(${veh.coords[2]},${veh.coords[3]})`
        delete veh.coords
      }
      delete veh.fatigue
      return veh
    })
    const vehiclesIds = vehiclesWithFatigue.map((e) => e._id)
    const userDetails = await User.find({ vid: { $in: vehiclesIds } }).populate(
      'custodyId',
      'custodyName'
    )
    const formatedDuration = formatDuration(strDate, endDate) // duration of the violations
    // merging the user details with vehicle details to generate sheets
    const fatigueDetails = mergeDetails(
      formatedVehs,
      userDetails,
      formatedDuration,
      true
    )
    return {
      count: vehiclesWithFatigue.length > 0 ? vehiclesWithFatigue.length : 0,
      vehiclesWithFatigue,
      fatigueDetails, // sheets
    }
  } catch (e) {
    return e.message
  }
}
async function weeklyTrendsQuery(vehIDs) {
  try {
    let startDate = moment.utc().subtract(6, 'days').format()
    let endDate = moment.utc().format()
    // let agg = [
    //   {
    //     $match: {
    //       VehicleID: { $in: vehIDs },
    //       RecordDateTime: {
    //         $gte: new Date(startDate),
    //         $lte: new Date(endDate),
    //       },
    //     },
    //   },
    //   // {
    //   //   $limit: 300000,
    //   // },
    //   {
    //     $group: {
    //       _id: {
    //         VehicleID: '$VehicleID',
    //         RecordDateTime: {
    //           $dateToString: { format: '%Y-%m-%d', date: '$RecordDateTime' },
    //         },
    //       },
    //       harshAcceleration: {
    //         $sum: {
    //           $cond: {
    //             if: {
    //               $eq: [
    //                 {
    //                   $function: {
    //                     body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
    //                     args: ['$AlarmCode', 0],
    //                     lang: 'js',
    //                   },
    //                 },
    //                 true,
    //               ],
    //             },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       OverSpeed: {
    //         $sum: {
    //           $cond: {
    //             if: {
    //               $eq: [
    //                 {
    //                   $function: {
    //                     body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
    //                     args: ['$AlarmCode', 2],
    //                     lang: 'js',
    //                   },
    //                 },
    //                 true,
    //               ],
    //             },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       SeatBelt: {
    //         $sum: {
    //           $cond: {
    //             if: {
    //               $eq: [
    //                 {
    //                   $function: {
    //                     body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
    //                     args: ['$StatusCode', 3],
    //                     lang: 'js',
    //                   },
    //                 },
    //                 true,
    //               ],
    //             },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       harshBrake: {
    //         $sum: {
    //           $cond: {
    //             if: {
    //               $eq: [
    //                 {
    //                   $function: {
    //                     body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
    //                     args: ['$AlarmCode', 1],
    //                     lang: 'js',
    //                   },
    //                 },
    //                 true,
    //               ],
    //             },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       nightDrive: {
    //         $sum: {
    //           $cond: {
    //             if: {
    //               $eq: [
    //                 {
    //                   $function: {
    //                     body: `function(dateTime) { let hr = (new Date(dateTime)).getHours() + 3; return (hr < 8) || (hr > 20); }`,
    //                     args: ['$RecordDateTime'],
    //                     lang: 'js',
    //                   },
    //                 },
    //                 true,
    //               ],
    //             },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       longDistance: {
    //         $sum: {
    //           $cond: {
    //             if: {
    //               $eq: [
    //                 {
    //                   $function: {
    //                     body: `function(Distance) { return (Distance > 100) ;}`,
    //                     args: ['$Distance'],
    //                     lang: 'js',
    //                   },
    //                 },
    //                 true,
    //               ],
    //             },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$_id.RecordDateTime',
    //       harshAcceleration: {
    //         $sum: {
    //           $cond: {
    //             if: { $gt: ['$HarshAcceleration', 0] },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       OverSpeed: {
    //         $sum: {
    //           $cond: {
    //             if: { $gt: ['$IsOverSpeed', 0] },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       SeatBelt: {
    //         $sum: {
    //           $cond: {
    //             if: { $gt: ['$SeatBelt', 0] },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       harshBrake: {
    //         $sum: {
    //           $cond: {
    //             if: { $gt: ['$HarshBrake', 0] },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       nightDrive: {
    //         $sum: {
    //           $cond: {
    //             if: { $gt: ['$nightDrive', 0] },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //       longDistance: {
    //         $sum: {
    //           $cond: {
    //             if: { $gt: ['$longDistance', 0] },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // {
    //   //   $group: {
    //   //     _id: '$_id.RecordDateTime',
    //   //     harshAcceleration: {
    //   //       $sum: '$HarshAcceleration',
    //   //     },
    //   //     OverSpeed: {
    //   //       $sum: '$IsOverSpeed',
    //   //     },
    //   //     SeatBelt: {
    //   //       $sum: '$SeatBelt',
    //   //     },
    //   //     harshBrake: {
    //   //       $sum: '$HarshBrake',
    //   //     },
    //   //     nightDrive: {
    //   //       $sum: '$nightDrive',
    //   //     },
    //   //     longDistance: {
    //   //       $sum: '$longDistance',
    //   //     },
    //   //   },
    //   // },
    //   {
    //     $sort: { _id: -1 },
    //   },
    // ]
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      // {
      //   $limit: 300000,
      // },
      {
        $sort: {
          RecordDateTime: 1,
        },
      },
      {
        $group: {
          _id: {
            VehicleID: '$VehicleID',
            RecordDateTime: {
              $dateToString: { format: '%Y-%m-%d', date: '$RecordDateTime' },
            },
          },
          harshAcceleration: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $function: {
                        body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                        args: ['$AlarmCode', 0],
                        lang: 'js',
                      },
                    },
                    true,
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          OverSpeed: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $function: {
                        body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                        args: ['$AlarmCode', 2],
                        lang: 'js',
                      },
                    },
                    true,
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          SeatBelt: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $function: {
                        body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                        args: ['$StatusCode', 3],
                        lang: 'js',
                      },
                    },
                    true,
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          harshBrake: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $function: {
                        body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                        args: ['$AlarmCode', 1],
                        lang: 'js',
                      },
                    },
                    true,
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          nightDrive: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $function: {
                        body: `function(dateTime) { let hr = (new Date(dateTime)).getHours() + 3; return (hr < 8) || (hr > 20); }`,
                        args: ['$RecordDateTime'],
                        lang: 'js',
                      },
                    },
                    true,
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          longDistance: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $function: {
                        body: `function(Distance) { return (Distance > 100) ;}`,
                        args: ['$Distance'],
                        lang: 'js',
                      },
                    },
                    true,
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.RecordDateTime',
          harshAcceleration: {
            $sum: {
              $cond: {
                if: { $gt: ['$harshAcceleration', 0] },
                then: 1,
                else: 0,
              },
            },
          },
          OverSpeed: {
            $sum: {
              $cond: {
                if: { $gt: ['$OverSpeed', 0] },
                then: 1,
                else: 0,
              },
            },
          },
          SeatBelt: {
            $sum: {
              $cond: {
                if: { $gt: ['$SeatBelt', 0] },
                then: 1,
                else: 0,
              },
            },
          },
          harshBrake: {
            $sum: {
              $cond: {
                if: { $gt: ['$harshBrake', 0] },
                then: 1,
                else: 0,
              },
            },
          },
          nightDrive: {
            $sum: {
              $cond: {
                if: { $gt: ['$nightDrive', 0] },
                then: 1,
                else: 0,
              },
            },
          },
          longDistance: {
            $sum: {
              $cond: {
                if: { $gt: ['$longDistance', 0] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    const vioCount = berDayCount(result)
    return vioCount
  } catch (e) {
    return e.message
  }
}
async function optimizedTrendsQuery(vehIDs, startPeriod, endPeriod) {
  try {
    let result
    // define a function that returns a promise for a query
    function queryByDate(endDate, vehIDs) {
      // create a date range for the query
      let start = moment.utc(endDate).subtract(10, 'minutes').toDate()
      let end = moment.utc(endDate).toDate()
      // return a promise that resolves with the query result
      return stageDBConnection
        .collection('LiveLocations')
        .aggregate([
          {
            $match: {
              VehicleID: { $in: vehIDs },
              RecordDateTime: {
                $gte: new Date(start),
                $lte: new Date(end),
              },
            },
          },
          // {
          //   $limit: 300000,
          // },
          {
            $sort: {
              RecordDateTime: 1,
            },
          },
          {
            $group: {
              _id: {
                VehicleID: '$VehicleID',
                RecordDateTime: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$RecordDateTime',
                  },
                },
              },
              harshAcceleration: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $function: {
                            body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                            args: ['$AlarmCode', 0],
                            lang: 'js',
                          },
                        },
                        true,
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              OverSpeed: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $function: {
                            body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                            args: ['$AlarmCode', 2],
                            lang: 'js',
                          },
                        },
                        true,
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              SeatBelt: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $function: {
                            body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                            args: ['$StatusCode', 3],
                            lang: 'js',
                          },
                        },
                        true,
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              harshBrake: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $function: {
                            body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
                            args: ['$AlarmCode', 1],
                            lang: 'js',
                          },
                        },
                        true,
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              nightDrive: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $function: {
                            body: `function(dateTime) { let hr = (new Date(dateTime)).getHours() + 3; return (hr < 8) || (hr > 20); }`,
                            args: ['$RecordDateTime'],
                            lang: 'js',
                          },
                        },
                        true,
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              longDistance: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $function: {
                            body: `function(Distance) { return (Distance > 100) ;}`,
                            args: ['$Distance'],
                            lang: 'js',
                          },
                        },
                        true,
                      ],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: '$_id.RecordDateTime',
              harshAcceleration: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$harshAcceleration', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              OverSpeed: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$OverSpeed', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              SeatBelt: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$SeatBelt', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              harshBrake: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$harshBrake', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              nightDrive: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$nightDrive', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              longDistance: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$longDistance', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $sort: { _id: -1 },
          },
        ])
        .toArray()
    }

    // create an array of dates for the last 7 days
    let dates = []
    for (let i = 0; i < 7; i++) {
      let date = moment.utc(endPeriod).subtract(i, 'hours').format()
      dates.push(date)
    }
    let labels = []
    for (let i = 0; i < 7; i++) {
      let date = moment.utc(endPeriod).subtract(i, 'days').format()
      labels.push(moment.utc(date).format('ddd'))
    }

    // create an array of promises for each date
    let promises = dates.map((date) => queryByDate(date, vehIDs))
    // let fatiguePromises = dates.map((date) => fatigueQuery(date, vehIDs))

    // use Promise.all to run all queries in parallel and wait for them to resolve
    const promisesResult = await Promise.all(promises)
    const trendsData = berDayCount(promisesResult, dates)

    // const fatigueResult = await Promise.all(fatiguePromises)
    // const fatigueData = fatigueResult.map((item) => item.count)
    // const fatigueObject = {
    //   name: 'Fatigue',
    //   data: fatigueData,
    // }
    // trendsData.series.push(fatigueObject)
    trendsData.labels = labels
    return trendsData
  } catch (e) {
    return e.message
  }
}

const checkMissingDays = (result) => {
  result.forEach((item, idx) => {
    if (item.length === 0) {
      result[idx] = [
        {
          OverSpeed: 0,
          harshAcceleration: 0,
          SeatBelt: 0,
          harshBrake: 0,
          nightDrive: 0,
          longDistance: 0,
        },
      ]
    }
  })

  const results = result.flat()
  return results
}
const berDayCount = (result, dates) => {
  let labels = []

  let overSpeed = []
  let harshAcceleration = []
  let seatBelt = []
  let harshBrake = []
  let nightDrive = []
  let longDistance = []

  const data = checkMissingDays(result)

  data.forEach((item, idx) => {
    labels.push(moment.utc(dates[idx]).format('ddd'))

    overSpeed.push(item.OverSpeed)
    harshAcceleration.push(item.harshAcceleration)
    seatBelt.push(item.SeatBelt)
    harshBrake.push(item.harshBrake)
    nightDrive.push(item.nightDrive)
    longDistance.push(item.longDistance)
  })

  let series = [
    {
      name: 'Over Speed',
      data: overSpeed,
    },
    {
      name: 'Harsh Brake',
      data: harshBrake,
    },
    { name: 'Tampering', data: longDistance },
    {
      name: 'Seat Belt',
      data: seatBelt,
    },
    {
      name: 'Night Drive',
      data: nightDrive,
    },
    {
      name: 'Harsh Acceleration',
      data: harshAcceleration,
    },
    {
      name: 'Swerving',
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ]
  return { labels, series }
}
async function vehicleViolationsQuery(strDate, endDate, vehIDs) {
  try {
    // await connect()

    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: {
            $gte: new Date(strDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $addFields: {
          harshAcceleration: {
            $function: {
              body: `function(num, bit) {
                                   return ((num>>bit) % 2 != 0)
                               }`,
              args: ['$AlarmCode', 0],
              lang: 'js',
            },
          },
          IsOverSpeed: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 2],
              lang: 'js',
            },
          },
          harshBrake: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 1],
              lang: 'js',
            },
          },
          SeatBelt: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$StatusCode', 3],
              lang: 'js',
            },
          },
          startnight: {
            $function: {
              body: `function(dateTime) {
                                    let start = new Date(dateTime);
                                    start.setHours(16,0,0,0);
                                   return start
                                }`,
              args: ['$RecordDateTime'],
              lang: 'js',
            },
          },
          endnight: {
            $function: {
              body: `function(dateTime) {
                                    let end = new Date(dateTime);
                                    end.setDate(end.getDate()+1)
                                    end.setHours(04,0,0,0);
                                   return end
                                }`,
              args: ['$RecordDateTime'],
              lang: 'js',
            },
          },
        },
      },

      {
        $facet: {
          result: [
            {
              $group: {
                _id: '$VehicleID',
                harshAcceleration: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshAcceleration', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                OverSpeed: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$IsOverSpeed', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                SeatBelt: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$SeatBelt', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                harshBrake: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshBrake', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                nightDrive: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gte: ['$RecordDateTime', '$startnight'] },
                          { $lte: ['$RecordDateTime', '$endnight'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                Mileage: { $max: { $divide: ['$Mileage', 1000] } },
              },
            },
            { $sort: { OverSpeed: 1 } },
          ],
          totalViolation: [
            {
              $group: {
                _id: null,
                harshAcceleration: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshAcceleration', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                OverSpeed: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$IsOverSpeed', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                SeatBelt: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$SeatBelt', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                harshBrake: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshBrake', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                nightDrive: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gte: ['$RecordDateTime', '$startnight'] },
                          { $lte: ['$RecordDateTime', '$endnight'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                Mileage: { $max: { $divide: ['$Mileage', 1000] } },
              },
            },
          ],
        },
      },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}
async function violationsQueryById(strDate, endDate, validVids) {
  try {
    // await connect()

    let agg = [
      {
        $match: {
          VehicleID: { $in: validVids },
          RecordDateTime: {
            $gte: new Date(strDate),
            $lte: new Date(endDate),
          },
          $or: [
            { AlarmCode: { $bitsAnySet: [0, 1, 2, 3, 4] } },
            { StatusCode: { $bitsAllSet: [3] } },
          ],
        },
      },
      {
        $addFields: {
          harshAcceleration: {
            $function: {
              body: `function(num, bit) {
                                   return ((num>>bit) % 2 != 0)
                               }`,
              args: ['$AlarmCode', 0],
              lang: 'js',
            },
          },
          IsOverSpeed: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 2],
              lang: 'js',
            },
          },
          harshBrake: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 1],
              lang: 'js',
            },
          },
          SeatBelt: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$StatusCode', 3],
              lang: 'js',
            },
          },
          nightDrive: {
            $function: {
              body: `function(dateTime) { let hr = (new Date(dateTime)).getHours() + 3; return (hr < 8) || (hr > 18); }`,
              args: ['$RecordDateTime'],
              lang: 'js',
            },
          },
          longDistance: {
            $function: {
              body: `function(Distance) { return (Distance > 100) ;}`,
              args: ['$Distance'],
              lang: 'js',
            },
          },
        },
      },

      {
        $facet: {
          result: [
            {
              $group: {
                _id: '$VehicleID',
                harshAcceleration: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshAcceleration', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                OverSpeed: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$IsOverSpeed', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                SeatBelt: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$SeatBelt', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                harshBrake: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshBrake', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                nightDrive: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$nightDrive', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                longDistance: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$longDistance', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                Mileage: { $max: '$Mileage' },
                SerialNumber: { $addToSet: '$SerialNumber' },
              },
            },
            { $sort: { OverSpeed: 1 } },
          ],
          totalViolation: [
            {
              $group: {
                _id: null,
                harshAcceleration: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshAcceleration', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                OverSpeed: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$IsOverSpeed', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                SeatBelt: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$SeatBelt', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                harshBrake: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshBrake', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                nightDrive: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$nightDrive', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                longDistance: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$longDistance', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                Mileage: { $sum: { $max: { $divide: ['$Mileage', 1000] } } },
              },
            },
          ],
        },
      },
    ]
    const [{ result, totalViolation }] = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return { result, totalViolation }
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}
async function getTraineeViolations(strDate, endDate, validVids) {
  try {
    // await connect()
    let agg = [
      {
        $match: {
          VehicleID: { $in: validVids },
          RecordDateTime: {
            $gte: new Date(strDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $addFields: {
          harshAcceleration: {
            $function: {
              body: `function(num, bit) {
                                   return ((num>>bit) % 2 != 0)
                               }`,
              args: ['$AlarmCode', 0],
              lang: 'js',
            },
          },
          IsOverSpeed: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 2],
              lang: 'js',
            },
          },
          harshBrake: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 1],
              lang: 'js',
            },
          },
          SeatBelt: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$StatusCode', 3],
              lang: 'js',
            },
          },
          nightDrive: {
            $function: {
              body: `function(dateTime) { let hr = (new Date(dateTime)).getHours() + 3; return (hr < 8) || (hr > 18); }`,
              args: ['$RecordDateTime'],
              lang: 'js',
            },
          },
          longDistance: {
            $function: {
              body: `function(Distance) { return (Distance > 100) ;}`,
              args: ['$Distance'],
              lang: 'js',
            },
          },
          swerving: [ {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$StatusCode', 100],
              lang: 'js',
            },
          }]
        },
      },
      {
        $facet: {
          result: [
            {
              $project: {
                _id: 0,
                OverSpeed: '$IsOverSpeed',
                harshAcceleration: 1,
                SeatBelt: 1,
                harshBrake: 1,
                nightDrive: 1,
                longDistance: 1,
                swerving: 1,
                VehicleID: 1,
                Speed: { $ifNull: ['$Speed', 0] },
                Latitude: 1,
                Longitude: 1,
                Address: { $ifNull: ['$Address', 'No Address Found'] },
                Distance: 1,
                ActualWeight: 1,
                SerialNumber: 1,
                RecordDateTime: {
                  $dateToString: {
                    format: '%Y-%m-%d %H:%M:%S',
                    date: '$RecordDateTime',
                  },
                },
                Mileage: 1,
              },
            },
          ],
          totalViolation: [
            {
              $group: {
                _id: null,
                harshAcceleration: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshAcceleration', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                OverSpeed: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$IsOverSpeed', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                SeatBelt: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$SeatBelt', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                harshBrake: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$harshBrake', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                nightDrive: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$nightDrive', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                longDistance: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$longDistance', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                swerving: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ['$swerving', true],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                }
              },
            },
          ],
        },
      },
    ]
    const [{ result, totalViolation }] = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return { result, totalViolation }
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}
async function topDriversQuery(startDate, endDate, validVids) {
  try {
    let agg = [
      {
        $match: {
          VehicleID: { $in: validVids },
          RecordDateTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$VehicleID',
          count: {
            $sum: {
              $cond: {
                if: {
                  $gte: ['$AlarmCode', 0],
                },
                then: 1,
                else: 0,
              },
            },
          },
          Duration: { $sum: '$Duration' },
        },
      },
      {
        $sort: {
          count: 1,
          Duration: -1,
        },
      },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    // take the top drivers
    const topDrivers = result.filter((driver) => driver.count === 0)
    return topDrivers
  } catch (e) {
    console.log(e)
    return e.message
  }
}
async function getUserDetails(ids) {
  try {
    const agg = [
      {
        $match: { vid: { $in: ids } },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          phoneNumber: 1,
          email: 1,
          idNumber: 1,
          vid: 1,
          image: 1,
        },
      },
    ]

    const result = await configConnection
      .collection('users')
      .aggregate(agg)
      .toArray()
    return result
  } catch (error) {
    await configConnection.close()
  }
}

async function getRatingsQuery(vehicles) {
  try {
    // await connect()

    let strDate = new Date()
    let endDateTime = new Date()
    strDate.setDate(endDateTime.getDate() - 1)

    let agg = [
      {
        $match: {
          VehicleID: { $in: vehicles },
          RecordDateTime: { $gte: strDate, $lte: endDateTime },
          $or: [
            { AlarmCode: { $bitsAnySet: [0, 1, 2] } },
            { StatusCode: { $bitsAllSet: [3] } },
          ],
        },
      },
      {
        $addFields: {
          harshAcceleration: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 0],
              lang: 'js',
            },
          },
          IsOverSpeed: {
            $function: {
              body: `function(num, bit) {
                                     return ((num>>bit) % 2 != 0)
                                 }`,
              args: ['$AlarmCode', 2],
              lang: 'js',
            },
          },
          harshBrake: {
            $function: {
              body: `function(num, bit) {
                                     return ((num>>bit) % 2 != 0)
                                 }`,
              args: ['$AlarmCode', 1],
              lang: 'js',
            },
          },
          SeatBelt: {
            $function: {
              body: `function(num, bit) {
                                     return ((num>>bit) % 2 != 0)
                                 }`,
              args: ['$StatusCode', 3],
              lang: 'js',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $cond: [
                {
                  $eq: [
                    { $dayOfMonth: '$RecordDateTime' },
                    { $dayOfMonth: '$RecordDateTime' },
                  ],
                },
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$RecordDateTime',
                  },
                },
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: {
                      $subtract: ['$RecordDateTime', 3 * 24 * 60 * 60 * 1000],
                    },
                  },
                },
              ],
            },
            VehicleID: '$VehicleID',
          },
          harshAcceleration: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$harshAcceleration', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          OverSpeed: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$IsOverSpeed', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          SeatBelt: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$SeatBelt', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          harshBrake: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$harshBrake', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            day: '$_id.day',
            VehicleID: '$_id.VehicleID',
          },
          harshAcceleration: { $sum: '$harshAcceleration' },
          OverSpeed: { $sum: '$OverSpeed' },
          SeatBelt: { $sum: '$SeatBelt' },
          harshBrake: { $sum: '$harshBrake' },
          total: {
            $sum: {
              $add: [
                '$harshAcceleration',
                '$OverSpeed',
                '$SeatBelt',
                '$harshBrake',
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.day',
          data: {
            $push: {
              VehicleID: '$_id.VehicleID',
              value: {
                $sum: {
                  $add: [
                    '$harshAcceleration',
                    '$OverSpeed',
                    '$SeatBelt',
                    '$harshBrake',
                  ],
                },
              },
            },
          },
          total: {
            $sum: {
              $add: [
                '$harshAcceleration',
                '$OverSpeed',
                '$SeatBelt',
                '$harshBrake',
              ],
            },
          },
        },
      },
      {
        $addFields: {
          positive: {
            $reduce: {
              input: '$data',
              initialValue: 0,
              in: {
                $cond: {
                  if: {
                    $lt: ['$$this.value', { $divide: ['$total', 2] }],
                  },
                  then: { $add: ['$$value', 1] },
                  else: '$$value',
                },
              },
            },
          },
          negative: {
            $reduce: {
              input: '$data',
              initialValue: 0,
              in: {
                $cond: {
                  if: {
                    $gt: ['$$this.value', { $divide: ['$total', 2] }],
                  },
                  then: { $add: ['$$value', 1] },
                  else: '$$value',
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          positive: 1,
          negative: 1,
        },
      },
      {
        $sort: {
          day: 1,
        },
      },
    ]

    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    // await close()
  }
}
// ! review
async function getMillageForUsers(ids) {
  try {
    const strDate = moment.utc().subtract(1, 'days').format('YYYY-MM-DD')
    const endDate = moment.utc().format('YYYY-MM-DD')
    const vehicles = await User.find({
      custodyId: { $in: ids },
      role: 'trainer',
    })
    const vehicleIds = vehicles.map((v) => v.vid)

    let agg = [
      {
        $match: {
          VehicleID: { $in: vehicleIds },
          RecordDateTime: {
            $gte: new Date(strDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          Mileage: { $sum: { $max: '$Mileage' } },
        },
      },
    ]
    const [result] = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result.Mileage
  } catch (e) {
    return e.message
  }
}
// ! review
async function getMillageFortrainer(vid) {
  try {
    const strDate = moment.utc().subtract(1, 'days').format('YYYY-MM-DD')
    const endDate = moment.utc().format('YYYY-MM-DD')

    let agg = [
      {
        $match: {
          VehicleID: { $in: vid },
          RecordDateTime: {
            $gte: new Date(strDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          Mileage: { $sum: { $max: '$Mileage' } },
        },
      },
    ]
    const [result] = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result.Mileage
  } catch (e) {
    return e.message
  }
}

const getVehicleDataFromFireBase = (serialNumber) => {
  return axios.get(
    `https://saferoad-srialfb.firebaseio.com/${serialNumber}.json`
  )
}

async function getRatingsQueryById(id) {
  try {
    // await connect()

    let strDate = new Date()
    let endDateTime = new Date()
    strDate.setDate(endDateTime.getDate() - 9)

    let agg = [
      {
        $match: {
          VehicleID: +id,
          RecordDateTime: { $gte: strDate, $lte: endDateTime },
          // $or: [
          //   { AlarmCode: { $bitsAnySet: [0, 1, 2] } },
          //   { StatusCode: { $bitsAllSet: [3] } },
          // ],
        },
      },
      {
        $addFields: {
          harshAcceleration: {
            $function: {
              body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
              args: ['$AlarmCode', 0],
              lang: 'js',
            },
          },
          IsOverSpeed: {
            $function: {
              body: `function(num, bit) {
                                     return ((num>>bit) % 2 != 0)
                                 }`,
              args: ['$AlarmCode', 2],
              lang: 'js',
            },
          },
          harshBrake: {
            $function: {
              body: `function(num, bit) {
                                     return ((num>>bit) % 2 != 0)
                                 }`,
              args: ['$AlarmCode', 1],
              lang: 'js',
            },
          },
          SeatBelt: {
            $function: {
              body: `function(num, bit) {
                                     return ((num>>bit) % 2 != 0)
                                 }`,
              args: ['$StatusCode', 3],
              lang: 'js',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $cond: [
                {
                  $eq: [
                    { $dayOfMonth: '$RecordDateTime' },
                    { $dayOfMonth: '$RecordDateTime' },
                  ],
                },
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$RecordDateTime',
                  },
                },
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: {
                      $subtract: ['$RecordDateTime', 3 * 24 * 60 * 60 * 1000],
                    },
                  },
                },
              ],
            },
            VehicleID: '$VehicleID',
          },
          harshAcceleration: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$harshAcceleration', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          OverSpeed: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$IsOverSpeed', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          SeatBelt: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$SeatBelt', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          harshBrake: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$harshBrake', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            day: '$_id.day',
            VehicleID: '$_id.VehicleID',
          },
          harshAcceleration: { $sum: '$harshAcceleration' },
          OverSpeed: { $sum: '$OverSpeed' },
          SeatBelt: { $sum: '$SeatBelt' },
          harshBrake: { $sum: '$harshBrake' },
          total: {
            $sum: {
              $add: [
                '$harshAcceleration',
                '$OverSpeed',
                '$SeatBelt',
                '$harshBrake',
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.day',
          data: {
            $push: {
              VehicleID: '$_id.VehicleID',
              value: {
                $sum: {
                  $add: [
                    '$harshAcceleration',
                    '$OverSpeed',
                    '$SeatBelt',
                    '$harshBrake',
                  ],
                },
              },
            },
          },
          total: {
            $sum: {
              $add: [
                '$harshAcceleration',
                '$OverSpeed',
                '$SeatBelt',
                '$harshBrake',
              ],
            },
          },
        },
      },
      {
        $addFields: {
          positive: {
            $reduce: {
              input: '$data',
              initialValue: 0,
              in: {
                $cond: {
                  if: {
                    $lt: ['$$this.value', { $divide: ['$total', 2] }],
                  },
                  then: { $add: ['$$value', 1] },
                  else: '$$value',
                },
              },
            },
          },
          negative: {
            $reduce: {
              input: '$data',
              initialValue: 0,
              in: {
                $cond: {
                  if: {
                    $gt: ['$$this.value', { $divide: ['$total', 2] }],
                  },
                  then: { $add: ['$$value', 1] },
                  else: '$$value',
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          positive: 1,
          negative: 1,
        },
      },
      {
        $sort: {
          day: 1,
        },
      },
    ]

    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  }
}
const custodyFilter = async (itd, itc) => {
  if (itd) itd = itd.split(',')
  if (itc) itc = itc.split(',')
  let vehicles
  if (itd && itd.length > 0 && itc && itc.length > 0) {
    const itcVehicles = await User.find({
      custodyId: { $in: itc },
      role: 'trainer',
    }).lean()
    const itdItcs = await Division.find({ _id: { $in: itd } })
    const itdItcIds = itdItcs.flatMap((itd) => [...itd.itcs])

    const itdVehicles = await User.find({
      custodyId: { $in: itdItcIds },
      role: 'trainer',
    }).lean()
    vehicles = itdVehicles.concat(itcVehicles)
    return vehicles
  } else if (itd && itd.length > 0 && !itc) {
    const itdItcs = await Division.find({ _id: { $in: itd } })
    const itdItcIds = itdItcs.flatMap((itd) => [...itd.itcs])

    const itdVehicles = await User.find({
      custodyId: { $in: itdItcIds },
      role: 'trainer',
    }).lean()
    const vehicles = itdVehicles
    return vehicles
  } else if (!itd && itc && itc.length > 0) {
    const itcVehicles = await User.find({
      custodyId: { $in: itc },
      role: 'trainer',
    }).lean()
    const vehicles = itcVehicles
    return vehicles
  } else if (!itd && !itc) {
    const vehicles = await User.find({
      vid: { $ne: null, $exists: true },
      role: 'trainer',
    }).lean()
    return vehicles
  }
}
const dateFilter = (startDate, endDate) => {
  startDate = startDate
    ? moment.utc(startDate).format()
    : moment.utc().subtract(1, 'hours').format()
  endDate = endDate ? moment.utc(endDate).format() : moment.utc().format()
  return { startPeriod: startDate, endPeriod: endDate }
}
// const sheetsFortrainee = (
//   violationsObj,
//   userVehicle,
//   custodyDetails,
//   divisionDetails,
//   userId
// ) => {
//   const sheets = Object.entries(violationsObj)
//     .map(([key, value]) => {
//       if (key === '_id') return // skip the _id key
//       return {
//         [key]: [
//           {
//             [key]: value,
//             username: allVehicles[0].username,
//             vid: allVehicles[0].vid,
//             phoneNumber: allVehicles[0].phoneNumber,
//             SerialNumber: allVehicles[0].SerialNumber,
//             ...(userId && custodyDetails.length > 0
//               ? { custodyName: custodyDetails[0].custodyName }
//               : { custodyName: null }),
//             ...(divisionDetails.length > 0 && {
//               itdName: divisionDetails[0].divisionName,
//             }),
//           },
//         ],
//       }
//     })
//     .filter((e) => e !== null)
//     .reduce((acc, curr) => {
//       return { ...acc, ...curr }
//     }, {})
//   return sheets
// }
function deleteProperties(obj, toBeModified, neededKey) {
  // delete other violations from each object to get every violation sperately
  Object.keys(obj).forEach((key) => {
    if (key === neededKey) return
    delete toBeModified[key]
  })
}
const sheetsFortrainee = (
  result,
  userDetails,
  custodyDetails,
  divisionDetails
) => {
  const user = {
    userName:userDetails[0].userName,
    vid: userDetails[0].vid,
    phoneNumber: userDetails[0].phoneNumber,
    SerialNumber: userDetails[0].SerialNumber,
    custodyName: custodyDetails[0].custodyName ?? 'Not Assigned',
    itdName: divisionDetails[0].divisionName ?? 'Not Assigned'
  }
  const acc = {
    OverSpeed: [],
    harshAcceleration: [],
    harshBrake: [],
    nightDrive: [],
    longDistance: [],
    SeatBelt: [],
    swerving: [],
  }

  const sheets = result.reduce((acc, curr) => {
    if (curr.OverSpeed === true) {
      deleteProperties(acc, curr,'OverSpeed')
      acc.OverSpeed.push({...curr,...user})
    }
    if (curr.SeatBelt === true) {
      deleteProperties(acc, curr, 'SeatBelt')
      acc.seatBelt.push({...curr,...user})
    }
    if (curr.harshAcceleration === true) {
      deleteProperties(acc, curr, 'harshAcceleration')
      acc.harshAcceleration.push({...curr,...user})
    }
    if (curr.harshBrake === true) {
      deleteProperties(acc, curr,'harshBrake')
      acc.harshBrake.push({...curr,...user})
    }
    if (curr.nightDrive === true) {
      deleteProperties(acc, curr, 'nightDrive')
      acc.nightDrive.push({...curr,...user})
    }
    if (curr.longDistance === true) {
      deleteProperties(acc, curr,'longDistance')
      acc.longDistance.push({...curr,...user})
    }
    return acc
  }, acc)
  return sheets
}

module.exports = {
  harshAccelerationQuery,
  HarshBreakingQuery,
  IsOverSpeedQuery,
  seatBeltQuery,
  getUserVehiclesFMS,
  getusersvehIDs,
  mainDashboardQuery,
  vehicleViolationsQuery,
  violationsQueryById,
  getTraineeViolations,
  nightDriveQuery,
  getUserDetails,
  topDriversQuery,
  getRatingsQuery,
  getRatingsQueryById,
  fatigueQuery,
  weeklyTrendsQuery,
  optimizedTrendsQuery,
  custodyFilter,
  dateFilter,
  getMillageForUsers,
  getMillageFortrainer,
  sheetsFortrainee,
  getVehicleDataFromFireBase,
}
