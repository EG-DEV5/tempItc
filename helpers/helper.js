const { MongoClient } = require('mongodb')
const { configConnection, stageDBConnection } = require('./mongodbConn')
const User = require('../models/User')
const axios = require('axios')
const moment = require('moment')
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
          Mileage: { $max: '$Mileage' },
        },
      },
    ]
    const result = await stageDBConnection
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    const violationCount = violationsCount(result)
    return violationCount
  } catch (e) {
    return e.message
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
    Mileage: 0,
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
      lowSpeed: item.OverSpeed < 120 ? acc.lowSpeed + 1 : acc.lowSpeed,
      mediumSpeed:
        item.OverSpeed >= 120 && item.OverSpeed < 140
          ? acc.mediumSpeed + 1
          : acc.mediumSpeed,
      highSpeed: item.OverSpeed >= 140 ? acc.highSpeed + 1 : acc.highSpeed,
      SerialNumber: [...new Set([...acc.SerialNumber, ...item.SerialNumbers])],
      Mileage: acc.Mileage + item.Mileage,
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
          count: {
            $sum: {
              $cond: {
                if: { $gt: ['$Duration', 20 * 60 * 60] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      // filter out documents where count is 0
      { $match: { count: { $gt: 0 } } },
      { $count: 'count' },
    ]
    const result = await stageDBConnection
      .collection('WorkSteps')
      .aggregate(agg)
      .toArray()
    return result.length > 0 ? result[0].count : 0
  } catch (e) {
    return e.message
  }
}
async function weeklyTrendsQuery(vehIDs) {
  try {
    let startDate = moment.utc().subtract(20, 'days').format()
    let endDate = moment.utc().format()
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
      {
        $limit: 300000,
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
                    2,
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
                  $eq: ['$StatusCode', 3],
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
                    1,
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
                if: { $gt: ['$HarshAcceleration', 0] },
                then: 1,
                else: 0,
              },
            },
          },
          OverSpeed: {
            $sum: {
              $cond: {
                if: { $gt: ['$IsOverSpeed', 0] },
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
                if: { $gt: ['$HarshBrake', 0] },
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
const berDayCount = (result) => {
  let count = result.map((item) => {
    return {
      day: item._id,
      vioCount:
        item.harshAcceleration +
        item.OverSpeed +
        item.SeatBelt +
        item.harshBrake +
        item.nightDrive +
        item.longDistance,
    }
  })
  let labels = count.slice(-7).map((item) => {
    return moment.utc(item.day).format('ddd')
  })
  let series = [
    {
      name: 'Over Speed',
      data: count.slice(0, 7).map((item) => item.vioCount),
    },
    {
      name: 'Harsh Brake',
      data: count.slice(7, 14).map((item) => item.vioCount),
    },
    { name: 'Seat Belt', data: count.slice(-7).map((item) => item.vioCount) },
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
                Mileage: { $sum: { $max: '$Mileage' } },
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
async function topDriversQuery(usersVehIds) {
  try {
    // await connect()
    let strDate = new Date()
    strDate.setDate(strDate.getDate() - 1)
    let endDate = new Date()

    // aggregation query that take all the vehiclesids of the user and return data
    // based on the number of violations and the duration of the drive of the last 24 hours
    let agg = [
      {
        $match: {
          VehicleID: { $in: usersVehIds },
          RecordDateTime: {
            $gte: new Date(strDate),
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

    const result = await await stageDBConnection
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
}
