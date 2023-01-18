const {faker} =  require('@faker-js/faker')
const {getUserVehicles,harshAccelerationQuery,mainDashboardQuery} = require('../helpers/helper')
    const mainDashboard = (req,res)=>{
        res.status(200).json({
            harshAcceleration : {
                month : faker.datatype.number(),
                year : faker.datatype.number(),
                week : faker.datatype.number(),
            },
            overSpeeding : {
                month : faker.datatype.number(),
                year : faker.datatype.number(),
                week : faker.datatype.number(),
            },
            harshBrake : {
                month : faker.datatype.number(),
                year : faker.datatype.number(),
                week : faker.datatype.number(),
            },
            seatBelt : {
                month : faker.datatype.number(),
                year : faker.datatype.number(),
                week : faker.datatype.number(),
            },
            nightDriving : {
                month : faker.datatype.number(),
                year : faker.datatype.number(),
                week : faker.datatype.number(),
            },
            sharpTurns : {
                month : faker.datatype.number(),
                year : faker.datatype.number(),
                week : faker.datatype.number(),
            },
        })
    }


    const harshAcceleration = async (req,res)=>{
        const data = await getUserVehicles()
       const {dataTime} = req.body
       let result = await harshAccelerationQuery(data,dataTime)
        res.json({result})
    }


    const mainDashboardt = async (req,res)=>{
        const data = await getUserVehicles()
       const {dataTime} = req.body
       let result = await mainDashboardQuery(data,dataTime)
        res.json({result})
    }

    // const overSpeeding = (req,res)=>{
    //     res.status(200).json({
    //         total : faker.datatype.number(),
    //         weak : {
    //             sat : faker.datatype.number(),
    //             sun : faker.datatype.number(),
    //             mon : faker.datatype.number(),
    //             Tue : faker.datatype.number(),
    //             Wed : faker.datatype.number(),
    //             Thu : faker.datatype.number(),
    //             Fri : faker.datatype.number(),
    //         },
    //         month : {
    //             '02' : faker.datatype.number(),
    //             '01' : faker.datatype.number(),
    //             '03' : faker.datatype.number(),
    //             '04' : faker.datatype.number(),
    //             '05' : faker.datatype.number(),
    //             '06' : faker.datatype.number(),
    //             '07' : faker.datatype.number(),
    //             '08' : faker.datatype.number(),
    //             '09' : faker.datatype.number(),
    //             '10' : faker.datatype.number(),
    //             '11' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //         }
    //     })
    // }
    // const harshBrake = (req,res)=>{
    //     res.status(200).json({
    //         total : faker.datatype.number(),
    //         weak : {
    //             sat : faker.datatype.number(),
    //             sun : faker.datatype.number(),
    //             mon : faker.datatype.number(),
    //             Tue : faker.datatype.number(),
    //             Wed : faker.datatype.number(),
    //             Thu : faker.datatype.number(),
    //             Fri : faker.datatype.number(),
    //         },
    //         month : {
    //             '01' : faker.datatype.number(),
    //             '02' : faker.datatype.number(),
    //             '03' : faker.datatype.number(),
    //             '04' : faker.datatype.number(),
    //             '05' : faker.datatype.number(),
    //             '06' : faker.datatype.number(),
    //             '07' : faker.datatype.number(),
    //             '08' : faker.datatype.number(),
    //             '09' : faker.datatype.number(),
    //             '10' : faker.datatype.number(),
    //             '11' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //         }
    //     })
    // }
    // const seatBelt = (req,res)=>{
    //     res.status(200).json({
    //         total : faker.datatype.number(),
    //         weak : {
    //             sat : faker.datatype.number(),
    //             sun : faker.datatype.number(),
    //             mon : faker.datatype.number(),
    //             Tue : faker.datatype.number(),
    //             Wed : faker.datatype.number(),
    //             Thu : faker.datatype.number(),
    //             Fri : faker.datatype.number(),
    //         },
    //         month : {
    //             '01' : faker.datatype.number(),
    //             '02' : faker.datatype.number(),
    //             '03' : faker.datatype.number(),
    //             '04' : faker.datatype.number(),
    //             '05' : faker.datatype.number(),
    //             '06' : faker.datatype.number(),
    //             '07' : faker.datatype.number(),
    //             '08' : faker.datatype.number(),
    //             '09' : faker.datatype.number(),
    //             '10' : faker.datatype.number(),
    //             '11' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //         }
    //     })
    // }
    // const nightDriving = (req,res)=>{
    //     res.status(200).json({
    //         total : faker.datatype.number(),
    //         weak : {
    //             sat : faker.datatype.number(),
    //             sun : faker.datatype.number(),
    //             mon : faker.datatype.number(),
    //             Tue : faker.datatype.number(),
    //             Wed : faker.datatype.number(),
    //             Thu : faker.datatype.number(),
    //             Fri : faker.datatype.number(),
    //         },
    //         month : {
    //             '01' : faker.datatype.number(),
    //             '02' : faker.datatype.number(),
    //             '03' : faker.datatype.number(),
    //             '04' : faker.datatype.number(),
    //             '05' : faker.datatype.number(),
    //             '06' : faker.datatype.number(),
    //             '07' : faker.datatype.number(),
    //             '08' : faker.datatype.number(),
    //             '09' : faker.datatype.number(),
    //             '10' : faker.datatype.number(),
    //             '11' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //         }
    //     })
    // }
    // const sharpTurns = (req,res)=>{
    //     res.status(200).json({
    //         total : faker.datatype.number(),
    //         weak : {
    //             sat : faker.datatype.number(),
    //             sun : faker.datatype.number(),
    //             mon : faker.datatype.number(),
    //             Tue : faker.datatype.number(),
    //             Wed : faker.datatype.number(),
    //             Thu : faker.datatype.number(),
    //             Fri : faker.datatype.number(),
    //         },
    //         month : {
    //             '01' : faker.datatype.number(),
    //             '02' : faker.datatype.number(),
    //             '03' : faker.datatype.number(),
    //             '04' : faker.datatype.number(),
    //             '05' : faker.datatype.number(),
    //             '06' : faker.datatype.number(),
    //             '07' : faker.datatype.number(),
    //             '08' : faker.datatype.number(),
    //             '09' : faker.datatype.number(),
    //             '10' : faker.datatype.number(),
    //             '11' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //             '12' : faker.datatype.number(),
    //         }
    //     })
    // }



module.exports = {
    mainDashboard,
    harshAcceleration,
     mainDashboardt
}