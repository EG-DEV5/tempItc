const { MongoClient } = require('mongodb');
const axios = require('axios');
function bit_test(num, bit){
    return ((num>>bit) % 2 != 0)
}
async function harshAccelerationQuery(vhs,dataTime) {
    const client = new MongoClient(process.env.MONGO_LIVELOCS);
    try {
         await client.connect().then(console.log("MongoDB live locations connected"));
        let today = new Date();
        let date = new Date(new Date(today).setDate(new Date(today).getDate() - dataTime))
        date.setMinutes(00)
        let agg =
            [
                  {
                    $match: { VehicleID: { $in: vhs }, RecordDateTime: { $gte: date }, AlarmCode: { $bitsAllSet: [ 0 ] }   }
                },
                vhs.length > 1000 ?
                    {
                        $limit: 2000000
                    } : { $limit: 5000000 },

                {
                    $group: {
                        _id: null,
                        count: {
                            $sum:1
                            }
                        }
                    }
                
                , { $sort: { '_id': 1 } }
            ]
        const result = await client.db("StageDB").collection("LiveLocations").aggregate(agg).toArray();
        return result
    } catch (e) {
        return e.message
    } finally {
        await client.close();
    }
}

async function HarshBreaking(vhs,dataTime) {
    const client = new MongoClient(process.env.MONGO_LIVELOCS);
    try {
         await client.connect().then(console.log("MongoDB live locations connected"));
        let today = new Date();
        let date = new Date(new Date(today).setDate(new Date(today).getDate() - dataTime))
        date.setMinutes(00)
        let agg =
            [
                  {
                    $match: { VehicleID: { $in: vhs }, RecordDateTime: { $gte: date }, AlarmCode: { $bitsAllSet: [ 1 ] }   }
                },
                vhs.length > 1000 ?
                    {
                        $limit: 2000000
                    } : { $limit: 5000000 },

                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$RecordDateTime" } },
                        count: {
                            $sum:1
                            }
                        }
                    }
                
                , { $sort: { '_id': 1 } }
            ]
            
        const result = await client.db("StageDB").collection("LiveLocations").aggregate(agg).toArray();
        return result
    } catch (e) {
        return e.message
    } finally {
        await client.close();
    }
}
async function IsOverSpeed(vhs,dataTime) {
    const client = new MongoClient(process.env.MONGO_LIVELOCS);
    try {
         await client.connect().then(console.log("MongoDB live locations connected"));
        let today = new Date();
        let date = new Date(new Date(today).setDate(new Date(today).getDate() - dataTime))
        date.setMinutes(00)
        let agg =
            [
                  {
                    $match: { VehicleID: { $in: vhs }, RecordDateTime: { $gte: date }, AlarmCode: { $bitsAllSet: [ 2 ] }   }
                },
                vhs.length > 1000 ?
                    {
                        $limit: 2000000
                    } : { $limit: 5000000 },

                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$RecordDateTime" } },
                        count: {
                            $sum:1
                            }
                        }
                    }
                
                , { $sort: { '_id': 1 } }
            ]
        const result = await client.db("StageDB").collection("LiveLocations").aggregate(agg).toArray();
        return result
    } catch (e) {
        return e.message
    } finally {
        await client.close();
    }
}
async function seatBelt(vhs,dataTime) {
    const client = new MongoClient(process.env.MONGO_LIVELOCS);
    try {
         await client.connect().then(console.log("MongoDB live locations connected"));
        let today = new Date();
        let date = new Date(new Date(today).setDate(new Date(today).getDate() - dataTime))
        date.setMinutes(00)
        let agg =
            [
                  {
                    $match: { VehicleID: { $in: vhs }, RecordDateTime: { $gte: date }, StatusCode: { $bitsAllSet: [ 3 ] }   }
                },
                vhs.length > 1000 ?
                    {
                        $limit: 2000000
                    } : { $limit: 5000000 },

                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$RecordDateTime" } },
                        count: {
                            $sum:1
                            }
                        }
                    }
                
                , { $sort: { '_id': 1 } }
            ]
        const result = await client.db("StageDB").collection("LiveLocations").aggregate(agg).toArray();
        return result
    } catch (e) {
        return e.message
    } finally {
        await client.close();
    }
}



async function getUserVehicles(){
    const config = {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhMjM3NWM3LWZkMjAtNDYyOC1hNDg0LTc1MWE2NTgyZTA1NiIsInVzZXJuYW1lIjoidGQiLCJleHAiOjE2NzY1MzYwMDYsImFjY291bnRJZCI6MzY2LCJyb2xlIjoidXNlciIsImlhdCI6MTY3MTM1MjAwNn0.HpEzqi1BcF4ZJyjqkDwUh0wcZt26beqkyPNXz91shfI`,
        },
      };
      const data = await axios
        .get('https://api.v6.saferoad.net/dashboard/vehicles', config)
        .then((apiResponse) => {
          // process the response
          return apiResponse.data.Vehicles.map(e=>e.VehicleID);
        });
        return data

}

async function mainDashboardQuery(vhs,dataTime) {
    const client = new MongoClient(process.env.MONGO_LIVELOCS);
    try {
         await client.connect().then(console.log("MongoDB live locations connected"));
        let today = new Date();
        let date = new Date(new Date(today).setDate(new Date(today).getDate() - dataTime))
        date.setMinutes(00)
        let agg =
            [
                  {
                    $match: { VehicleID: { $in: vhs }, RecordDateTime: { $gte: date }, AlarmCode: { $bitsAnySet: [ 0,1,2 ] }   }
                },
                { $addFields:
                    {
                        harshAcceleration:
                          { $function:
                             {
                                body: `function(num, bit) {
                                    return ((num>>bit) % 2 != 0)
                                }`,
                                args: [ "$AlarmCode", 0],
                                lang: "js"
                             }
                          },
                          IsOverSpeed:
                          { $function:
                             {
                                 body: `function(num, bit) {
                                     return ((num>>bit) % 2 != 0)
                                 }`,
                                 args: [ "$AlarmCode", 2],
                                 lang: "js"
                             }
                          }
                        }
                     },
                vhs.length > 1000 ?
                    {
                        $limit: 2000000
                    } : { $limit: 5000000 },

                {
                    $group: {
                        _id: null,
                        harshAcceleration: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$harshAcceleration", true],
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
                                        $eq: ["$IsOverSpeed", true],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        }
                    }
                
                , { $sort: { '_id': 1 } }
            ]
        const result = await client.db("StageDB").collection("LiveLocations").aggregate(agg).toArray();
        return result
    } catch (e) {
        return e.message
    } finally {
        await client.close();
    }
}
module.exports ={
    harshAccelerationQuery,
    getUserVehicles,
    HarshBreaking,
    IsOverSpeed,
    seatBelt,
    mainDashboardQuery
}