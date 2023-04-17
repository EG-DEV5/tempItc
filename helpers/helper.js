const { MongoClient } = require('mongodb')
const { configConnection, stageDBConnection } = require('./mongodbConn')
const User = require('../models/User')
const axios = require('axios')
function bit_test(num, bit) {
  return (num >> bit) % 2 != 0
}
async function harshAccelerationQuery(strDate, endDate, vehIDs) {
  const client = new MongoClient(process.env.MONGO_LIVELOCS)
  try {
    await client.connect().then(console.log('MongoDB live locations connected'))
    console.log(strDate)
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
    const result = await client
      .db('StageDB')
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    await client.close()
  }
}

async function HarshBreakingQuery(strDate, endDate, vehIDs) {
  const client = new MongoClient(process.env.MONGO_LIVELOCS)
  try {
    await client.connect().then(console.log('MongoDB live locations connected'))
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

    const result = await client
      .db('StageDB')
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    await client.close()
  }
}
async function IsOverSpeedQuery(strDate, endDate, vehIDs) {
  const client = new MongoClient(process.env.MONGO_LIVELOCS)
  try {
    await client.connect().then(console.log('MongoDB live locations connected'))
    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
          RecordDateTime: { $gte: new Date(strDate), $lte: new Date(endDate) },
          AlarmCode: { $bitsAllSet: [2] },
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
    const result = await client
      .db('StageDB')
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    await client.close()
  }
}
async function seatBeltQuery(strDate, endDate, vehIDs) {
  const client = new MongoClient(process.env.MONGO_LIVELOCS)
  try {
    await client.connect().then(console.log('MongoDB live locations connected'))
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
    const result = await client
      .db('StageDB')
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    await client.close()
  }
}

async function nightDriveQuery(strDate, endDate, vehIDs) {
  const client = new MongoClient(process.env.MONGO_LIVELOCS)
  try {
    await client.connect().then(console.log('MongoDB live locations connected'))
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
    const result = await client
      .db('StageDB')
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    await client.close()
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
  const client = new MongoClient(process.env.MONGO_LIVELOCS)
  try {
    await client.connect().then(console.log('MongoDB live locations connected'))
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
        },
      },

      { $sort: { _id: 1 } },
    ]
    const result = await client
      .db('StageDB')
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch (e) {
    return e.message
  } finally {
    await client.close()
  }
}
async function vehicleViolationsQuery(strDate, endDate, vehIDs) {
  const client = new MongoClient(process.env.MONGO_LIVELOCS)
  try {
    await client.connect().then(console.log('MongoDB live locations connected'))

    let agg = [
      {
        $match: {
          VehicleID: { $in: vehIDs },
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
              },
            },
          ],
        },
      },
    ]
    const result = await client
      .db('StageDB')
      .collection('LiveLocations')
      .aggregate(agg)
      .toArray()
    return result
  } catch {}
}

async function getUserDetails(ids) {
  try {
    const agg = [
      {
        $match: { vid: { $in: ids } },
      },
      {
        $project: {
          username: 1,
          phoneNumber: 1,
          email: 1,
          vid: 1,
        },
      },
    ]

    const result = await configConnection
      .useDb('ITC')
      .collection('users')
      .aggregate(agg)
      .toArray()
    return result
  } catch (error) {
    await configConnection.close()
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
  nightDriveQuery,
  getUserDetails,
}
