/** @format */
const Division = require('../models/Division')

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
    res.status(200).json({
      divisions,
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
}
