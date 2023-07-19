/** @format */
const Division = require('../models/Division')
const User = require('../models/User')
const { getMillageForUsers } = require('../helpers/helper')
const { ObjectId } = require('mongodb')
const axios = require('axios')

const addDivision = async (req, res) => {
  try {
    const { divisionName, itcs } = req.body

    const division = { divisionName, itcs }
    const newDivision = await Division.create(division)
    res.status(201).json({
      message: 'Division added successfully',
      division: newDivision,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
const getDivision = async (req, res) => {
  try {
    let agg = [
      {
        $lookup: {
          from: 'groups',
          localField: 'itcs',
          foreignField: '_id',
          as: 'itcs',
        },
      },
    ]
    const divisions = await Division.aggregate(agg)
    const result = await Promise.all(
      divisions.map(async (division) => {
        const itcIds = division.itcs.map((itc) => itc._id)
        const trainees = await User.find({
          custodyId: { $in: itcIds },
          role: 'trainer',
        })
        const safetyAdvisors = division.itcs.map((itc) => {
          return itc.SafetyAdvisor.length
        })
        // claculate millage from firebase
        let millage = 0
        const serials = trainees.map((trainee) => trainee.SerialNumber)
        const requests = serials.map((SerialNumber) => {
          const url = `https://saferoad-srialfb.firebaseio.com/${SerialNumber}.json`
          return axios.get(url)
        })

        const fireResult = await Promise.all(requests).catch((error) => {
          res.status(500).send('An error occurred')
        })
        millage = fireResult.reduce((a, b) => a + b.data.Mileage, 0)
        return {
          ...division,
          safetyAdvisorsCount: safetyAdvisors.reduce((a, b) => a + b, 0),
          itcsCount: division.itcs.length,
          traineeCount: trainees.length,
          millage,
        }
      })
    )
    res.status(200).json({
      divisions: result,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
const getDivisionById = async (req, res) => {
  try {
    const { id } = req.params
    let agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'groups',
          localField: 'itcs',
          foreignField: '_id',
          as: 'itcs',
        },
      },
    ]
    const divisions = await Division.aggregate(agg)
    const itcs = await Promise.all(
      divisions[0].itcs.map(async (itc) => {
        const itcId = [itc._id]
        const trainees = await User.find({
          custodyId: { $in: itcId },
          role: 'trainer',
        })
        const safetyAdvisorsCount = itc.SafetyAdvisor.length
        // claculate millage from firebase
        let millage = 0
        const serials = trainees.map((trainee) => trainee.SerialNumber)
        const requests = serials.map((SerialNumber) => {
          const url = `https://saferoad-srialfb.firebaseio.com/${SerialNumber}.json`
          return axios.get(url)
        })

        const fireResult = await Promise.all(requests).catch((error) => {
          res.status(500).send('An error occurred')
        })
        millage = fireResult.reduce((a, b) => a + b.data.Mileage, 0)

        return {
          ...itc,
          traineeCount: trainees.length,
          safetyAdvisorsCount,
          millage,
        }
      })
    )
    const result = divisions.map((division) => {
      return {
        ...division,
        itcs,
      }
    })
    res.status(200).json({
      division: result,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
const getDivisionsFilter = async (req, res) => {
  try {
    let agg = [
      {
        $lookup: {
          from: 'groups',
          localField: 'itcs',
          foreignField: '_id',
          as: 'itcs',
        },
      },
    ]
    const divisions = await Division.aggregate(agg)

    const treeData = divisions.map((division) => {
      const data = {
        value: division._id,
        label: division.divisionName,
        children: division.itcs.map((itc) => {
          return {
            value: itc._id,
            label: itc.custodyName,
          }
        }),
      }
      return data
    })
    res.status(200).json({
      treeData,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
module.exports = {
  addDivision,
  getDivision,
  getDivisionById,
  getDivisionsFilter,
}
