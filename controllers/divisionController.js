/** @format */
const Division = require('../models/Division')
const User = require('../models/User')
const { getMillageForUsers } = require('../helpers/helper')
const { ObjectId } = require('mongodb')

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
        const traineeCount = await User.find({
          custodyId: { $in: itcIds },
          role: 'trainer',
        }).count()
        const safetyAdvisors = division.itcs.map((itc) => {
          return itc.SafetyAdvisor.length
        })
        const millage = await getMillageForUsers(itcIds)
        return {
          ...division,
          safetyAdvisorsCount: safetyAdvisors.reduce((a, b) => a + b, 0),
          itcsCount: division.itcs.length,
          traineeCount,
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
    const result = await Promise.all(
      divisions.map(async (division) => {
        const itcIds = division.itcs.map((itc) => itc._id)
        const traineeCount = await User.find({
          custodyId: { $in: itcIds },
          role: 'trainer',
        }).count()
        const safetyAdvisors = division.itcs.map((itc) => {
          return itc.SafetyAdvisor.length
        })
        const millage = await getMillageForUsers(itcIds)
        return {
          ...division,
          safetyAdvisorsCount: safetyAdvisors.reduce((a, b) => a + b, 0),
          itcsCount: division.itcs.length,
          traineeCount,
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
module.exports = {
  addDivision,
  getDivision,
  getDivisionById,
}
