const { MongoClient } = require('mongodb');
const axios = require('axios');
function bit_test(num, bit){
    return ((num>>bit) % 2 != 0)
}
async function harshAccelerationToday(vhs) {
    const client = new MongoClient(process.env.MONGO_LIVELOCS);
    try {
        const conn = await client.connect().then(console.log("MongoDB live locations connected"));
        // Connect to the MongoDB cluster
        let today = new Date();
        let date = new Date(new Date(today).setDate(new Date(today).getDate() - 6))
        date.setMinutes(00)
        let agg =
            [
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

                     }
                  },
                  {
                    $match: { VehicleID: { $in: vhs }, RecordDateTime: { $gte: date } }
                },
                vhs.length > 1000 ?
                    {
                        $limit: 2000000
                    } : { $limit: 5000000 },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$RecordDateTime" } },
                        count: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ['$harshAcceleration',true ]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
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
module.exports ={
    harshAccelerationToday,
    getUserVehicles
}