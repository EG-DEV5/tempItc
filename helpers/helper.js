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
          // Mileage: { $max: '$Mileage' },
        },
      },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    const vehiclesIds = result.map((e) => e._id.VehicleID)
    const userDetails = await User.find(
      { vid: { $in: vehiclesIds } },
      {
        username: 1,
        phoneNumber: 1,
        vid: 1,
        SerialNumber: 1,
        custodyId:1
      }
    ).populate('custodyId', 'custodyName')
    
    const {
      overSpeedVio,
      harshAccelerationVio,
      harshBrakeVio,
      SeatBeltVio,
      nightDriveVio,
      longDistanceVio,
    } = splitViolations(result)

    const overSpeed = mergeDetails(overSpeedVio, userDetails)
    const harshAcceleration = mergeDetails(harshAccelerationVio, userDetails)
    const harshBrake = mergeDetails(harshBrakeVio, userDetails)
    const SeatBelt = mergeDetails(SeatBeltVio, userDetails)
    const nightDrive = mergeDetails(nightDriveVio, userDetails)
    const longDistance = mergeDetails(longDistanceVio, userDetails)

    const violationCount = violationsCount(result)
    return {
      violationCount,
      sheets: {
        overSpeed,
        harshAcceleration,
        harshBrake,
        SeatBelt,
        nightDrive,
        longDistance,
      },
    }
  } catch (e) {
    return e.message
  }
}
function mergeDetails(violation, userDetails, fatigue) {
  // const mergeUsersWithViolations = violation.map((vio) => {
  //   if (fatigue) {
  //     const matchedUser = userDetails.find((user) => vio._id === user.vid)
  //     const neededUserDetails = {
  //       username: matchedUser.username,
  //       vid: matchedUser.vid,
  //       phoneNumber: matchedUser.phoneNumber,
  //       SerialNumber: matchedUser.SerialNumber,
  //     }
  //     return matchedUser ? Object.assign(vio, neededUserDetails) : null
  //   }
  //   const matchedUser = userDetails.find(
  //     (user) => vio._id.VehicleID === user.vid
  //   )
  //   const neededUserDetails = {
  //     username: matchedUser.username,
  //     vid: matchedUser.vid,
  //     phoneNumber: matchedUser.phoneNumber,
  //     SerialNumber: matchedUser.SerialNumber,
  //   }
  //   return matchedUser ? Object.assign(vio, neededUserDetails) : null
  // })
  // return mergeUsersWithViolations
  const userDetailsMap = new Map(
    userDetails.map((user) => [
      user.vid,
      {
        username: user.username,
        vid: user.vid,
        phoneNumber: user.phoneNumber,
        SerialNumber: user.SerialNumber,
      },
    ])
  )

  const mergeUsersWithViolations = violation.map((vio) => {
    const user = userDetailsMap.get(fatigue ? vio._id : vio._id.VehicleID)
    return user ? Object.assign(vio, user) : null
  })

  return mergeUsersWithViolations.filter((vio) => vio !== null)
}
function splitViolations(result) {
  const overSpeedVio = result.reduce((acc, e) => {
    if (e.OverSpeed > 0) {
      acc.push({ _id: e._id, OverSpeed: e.OverSpeed })
    }
    return acc
  }, [])
  const harshAccelerationVio = result.reduce((acc, e) => {
    if (e.harshAcceleration > 0) {
      acc.push({ _id: e._id, harshAcceleration: e.harshAcceleration })
    }
    return acc
  }, [])
  const harshBrakeVio = result.reduce((acc, e) => {
    if (e.harshBrake > 0) {
      acc.push({ _id: e._id, harshBrake: e.harshBrake })
    }
    return acc
  }, [])
  const SeatBeltVio = result.reduce((acc, e) => {
    if (e.SeatBelt > 0) {
      acc.push({ _id: e._id, SeatBelt: e.SeatBelt })
    }
    return acc
  }, [])
  const nightDriveVio = result.reduce((acc, e) => {
    if (e.nightDrive > 0) {
      acc.push({ _id: e._id, nightDrive: e.nightDrive })
    }
    return acc
  }, [])
  const longDistanceVio = result.reduce((acc, e) => {
    if (e.longDistance > 0) {
      acc.push({ _id: e._id, longDistance: e.longDistance })
    }
    return acc
  }, [])
  return {
    overSpeedVio,
    harshAccelerationVio,
    harshBrakeVio,
    SeatBeltVio,
    nightDriveVio,
    longDistanceVio,
  }
}
const violationsCount = (result) => {
  // counting how many vehicles did certain violation
  const acc = {
    harshAcceleration: 0,
    OverSpeed: 0,
    SeatBelt: 0,
    harshBrake: 0,
    nightDrive: 0,
    longDistance: 0,
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
    const vehiclesIds = vehiclesWithFatigue.map((e) => e._id)
    const userDetails = await User.find(
      { vid: { $in: vehiclesIds } },
      { username: 1, phoneNumber: 1, vid: 1, SerialNumber: 1 }
    )
    const fatigueDetails = mergeDetails(vehiclesWithFatigue, userDetails, true)
    return {
      count: vehiclesWithFatigue.length > 0 ? vehiclesWithFatigue.length : 0,
      fatigueDetails,
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
async function optimizedTrendsQuery(vehIDs,startPeriod, endPeriod ) {
  try {
    let result
    // define a function that returns a promise for a query
    function queryByDate(endDate, vehIDs) {
      // create a date range for the query
      let start = moment.utc(endDate).startOf('day').toDate()
      let end = moment.utc(endDate).endOf('day').toDate()
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
              // harshAcceleration: {
              //   $sum: {
              //     $cond: {
              //       if: {
              //         $eq: [
              //           {
              //             $function: {
              //               body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
              //               args: ['$AlarmCode', 0],
              //               lang: 'js',
              //             },
              //           },
              //           true,
              //         ],
              //       },
              //       then: 1,
              //       else: 0,
              //     },
              //   },
              // },
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
              // SeatBelt: {
              //   $sum: {
              //     $cond: {
              //       if: {
              //         $eq: [
              //           {
              //             $function: {
              //               body: `function(num, bit) { return ((num>>bit) % 2 != 0) }`,
              //               args: ['$StatusCode', 3],
              //               lang: 'js',
              //             },
              //           },
              //           true,
              //         ],
              //       },
              //       then: 1,
              //       else: 0,
              //     },
              //   },
              // },
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
              // nightDrive: {
              //   $sum: {
              //     $cond: {
              //       if: {
              //         $eq: [
              //           {
              //             $function: {
              //               body: `function(dateTime) { let hr = (new Date(dateTime)).getHours() + 3; return (hr < 8) || (hr > 20); }`,
              //               args: ['$RecordDateTime'],
              //               lang: 'js',
              //             },
              //           },
              //           true,
              //         ],
              //       },
              //       then: 1,
              //       else: 0,
              //     },
              //   },
              // },
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
              // harshAcceleration: {
              //   $sum: {
              //     $cond: {
              //       if: { $gt: ['$harshAcceleration', 0] },
              //       then: 1,
              //       else: 0,
              //     },
              //   },
              // },
              OverSpeed: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$OverSpeed', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              // SeatBelt: {
              //   $sum: {
              //     $cond: {
              //       if: { $gt: ['$SeatBelt', 0] },
              //       then: 1,
              //       else: 0,
              //     },
              //   },
              // },
              harshBrake: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$harshBrake', 0] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              // nightDrive: {
              //   $sum: {
              //     $cond: {
              //       if: { $gt: ['$nightDrive', 0] },
              //       then: 1,
              //       else: 0,
              //     },
              //   },
              // },
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
      let date = moment.utc(endPeriod).subtract(i, 'days').format()
      dates.push(date)
    }

    // create an array of promises for each date
    let promises = dates.map((date) => queryByDate(date, vehIDs))

    // use Promise.all to run all queries in parallel and wait for them to resolve
    const trends = Promise.all(promises)
      .then((results) => {
        // results is an array of query results for each date
        result = berDayCount(results.flat())
        return result
      })
      .catch((error) => {
        // handle any error
        console.error(error)
      })

    return trends
  } catch (e) {
    return e.message
  }
}
const berDayCount = (result) => {
  const overSpeed = result.map((item) => item.OverSpeed)
  const harshBrake = result.map((item) => item.harshBrake)
  const longDistance = result.map((item) => item.longDistance)
  let labels = result.map((item) => {
    return moment.utc(item._id).format('ddd')
  })
  // let maxNumber = Math.max(
  //   ...result
  //     .flatMap((obj) => Object.values(obj))
  //     .filter((value) => typeof value === 'number')
  // )

  let series = [
    {
      name: 'Over Speed',
      data: overSpeed,
    },
    {
      name: 'Harsh Brake',
      data: harshBrake,
    },
    { name: 'Long Distance', data: longDistance },
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
                Mileage: { $max: { $divide: ['$Mileage', 1000] } },
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
                // Mileage: { $sum: { $max: '$Mileage' } },
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
    // take the top 3 drivers
    const topDrivers = result.slice(0, 3)
    return topDrivers
  } catch (e) {
    console.log(e)
    return e.message
  } finally {
    // await close()
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
    })
    const itdItcs = await Division.find({ _id: { $in: itd } })
    const itdItcIds = itdItcs.flatMap((itd)=> [...itd.itcs])
      
    const itdVehicles = await User.find({
      custodyId: { $in: itdItcIds },
      role: 'trainer',
    })
    vehicles = itdVehicles.concat(itcVehicles)
    return vehicles
  } else if (itd && itd.length > 0 && !itc) {
    const itdItcs = await Division.find({ _id: { $in: itd } })
    const itdItcIds = itdItcs.flatMap((itd)=> [...itd.itcs])

    const itdVehicles = await User.find({
      custodyId: { $in: itdItcIds },
      role: 'trainer',
    })
    const vehicles = itdVehicles
    return vehicles
  } else if (!itd && itc && itc.length > 0) {
    const itcVehicles = await User.find({
      custodyId: { $in: itc },
      role: 'trainer',
    })
    const vehicles = itcVehicles
    return vehicles
  } else if (!itd && !itc) {
    const vehicles = await User.find({
      vid: { $ne: null, $exists: true },
      role: 'trainer',
    })
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
const sheetsFortrainer = (
  violationsObj,
  allVehicles,
  custodyDetails,
  divisionDetails,
  userId
) => {
  const sheets = Object.entries(violationsObj)
    .map(([key, value]) => {
      if (key === '_id') return // skip the _id key
      return {
        [key]: [
          {
            [key]: value,
            username: allVehicles[0].username,
            vid: allVehicles[0].vid,
            phoneNumber: allVehicles[0].phoneNumber,
            SerialNumber: allVehicles[0].SerialNumber,
            ...(userId && custodyDetails.length > 0
              ? { custodyName: custodyDetails[0].custodyName }
              : { custodyName: null }),
            ...(divisionDetails.length > 0 && {itdName : divisionDetails[0].divisionName})
          },
        ],
      }
    })
    .filter((e) => e !== null)
    .reduce((acc, curr) => {
      return { ...acc, ...curr }
    }, {})
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
  sheetsFortrainer,
}
