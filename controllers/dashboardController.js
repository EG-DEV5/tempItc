const {faker} =  require('@faker-js/faker')


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


    const harshAcceleration = (req,res)=>{
        res.status(200).json({
            total : 230,
            weak : {
                sat : 410,
                sun : 320,
                mon : 185,
                Tue : 230,
                Wed : 287,
                Thu : 365,
                Fri : 132,
            },
            month : {
                '01' : faker.datatype.number(),
                '02' : faker.datatype.number(),
                '03' : faker.datatype.number(),
                '04' : faker.datatype.number(),
                '05' : faker.datatype.number(),
                '06' : faker.datatype.number(),
                '07' : faker.datatype.number(),
                '08' : faker.datatype.number(),
                '09' : faker.datatype.number(),
                '10' : faker.datatype.number(),
                '11' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '13' : faker.datatype.number(),
                '14' : faker.datatype.number(),
                '15' : faker.datatype.number(),
                '16' : faker.datatype.number(),
                '17' : faker.datatype.number(),
                '18' : faker.datatype.number(),
                '19' : faker.datatype.number(),
                '20' : faker.datatype.number(),
                '11' : faker.datatype.number(),
                '22' : faker.datatype.number(),
                '23' : faker.datatype.number(),
                '24' : faker.datatype.number(),
                '25' : faker.datatype.number(),
                '26' : faker.datatype.number(),
                '27' : faker.datatype.number(),
                '28' : faker.datatype.number(),
                '29' : faker.datatype.number(),
                '30' : faker.datatype.number(),
            }
        })
    }

    const overSpeeding = (req,res)=>{
        res.status(200).json({
            total : faker.datatype.number(),
            weak : {
                sat : faker.datatype.number(),
                sun : faker.datatype.number(),
                mon : faker.datatype.number(),
                Tue : faker.datatype.number(),
                Wed : faker.datatype.number(),
                Thu : faker.datatype.number(),
                Fri : faker.datatype.number(),
            },
            month : {
                '02' : faker.datatype.number(),
                '01' : faker.datatype.number(),
                '03' : faker.datatype.number(),
                '04' : faker.datatype.number(),
                '05' : faker.datatype.number(),
                '06' : faker.datatype.number(),
                '07' : faker.datatype.number(),
                '08' : faker.datatype.number(),
                '09' : faker.datatype.number(),
                '10' : faker.datatype.number(),
                '11' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
            }
        })
    }
    const harshBrake = (req,res)=>{
        res.status(200).json({
            total : faker.datatype.number(),
            weak : {
                sat : faker.datatype.number(),
                sun : faker.datatype.number(),
                mon : faker.datatype.number(),
                Tue : faker.datatype.number(),
                Wed : faker.datatype.number(),
                Thu : faker.datatype.number(),
                Fri : faker.datatype.number(),
            },
            month : {
                '01' : faker.datatype.number(),
                '02' : faker.datatype.number(),
                '03' : faker.datatype.number(),
                '04' : faker.datatype.number(),
                '05' : faker.datatype.number(),
                '06' : faker.datatype.number(),
                '07' : faker.datatype.number(),
                '08' : faker.datatype.number(),
                '09' : faker.datatype.number(),
                '10' : faker.datatype.number(),
                '11' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
            }
        })
    }
    const seatBelt = (req,res)=>{
        res.status(200).json({
            total : faker.datatype.number(),
            weak : {
                sat : faker.datatype.number(),
                sun : faker.datatype.number(),
                mon : faker.datatype.number(),
                Tue : faker.datatype.number(),
                Wed : faker.datatype.number(),
                Thu : faker.datatype.number(),
                Fri : faker.datatype.number(),
            },
            month : {
                '01' : faker.datatype.number(),
                '02' : faker.datatype.number(),
                '03' : faker.datatype.number(),
                '04' : faker.datatype.number(),
                '05' : faker.datatype.number(),
                '06' : faker.datatype.number(),
                '07' : faker.datatype.number(),
                '08' : faker.datatype.number(),
                '09' : faker.datatype.number(),
                '10' : faker.datatype.number(),
                '11' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
            }
        })
    }
    const nightDriving = (req,res)=>{
        res.status(200).json({
            total : faker.datatype.number(),
            weak : {
                sat : faker.datatype.number(),
                sun : faker.datatype.number(),
                mon : faker.datatype.number(),
                Tue : faker.datatype.number(),
                Wed : faker.datatype.number(),
                Thu : faker.datatype.number(),
                Fri : faker.datatype.number(),
            },
            month : {
                '01' : faker.datatype.number(),
                '02' : faker.datatype.number(),
                '03' : faker.datatype.number(),
                '04' : faker.datatype.number(),
                '05' : faker.datatype.number(),
                '06' : faker.datatype.number(),
                '07' : faker.datatype.number(),
                '08' : faker.datatype.number(),
                '09' : faker.datatype.number(),
                '10' : faker.datatype.number(),
                '11' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
            }
        })
    }
    const sharpTurns = (req,res)=>{
        res.status(200).json({
            total : faker.datatype.number(),
            weak : {
                sat : faker.datatype.number(),
                sun : faker.datatype.number(),
                mon : faker.datatype.number(),
                Tue : faker.datatype.number(),
                Wed : faker.datatype.number(),
                Thu : faker.datatype.number(),
                Fri : faker.datatype.number(),
            },
            month : {
                '01' : faker.datatype.number(),
                '02' : faker.datatype.number(),
                '03' : faker.datatype.number(),
                '04' : faker.datatype.number(),
                '05' : faker.datatype.number(),
                '06' : faker.datatype.number(),
                '07' : faker.datatype.number(),
                '08' : faker.datatype.number(),
                '09' : faker.datatype.number(),
                '10' : faker.datatype.number(),
                '11' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
                '12' : faker.datatype.number(),
            }
        })
    }



module.exports = {
    mainDashboard,
    harshAcceleration,
    overSpeeding
}