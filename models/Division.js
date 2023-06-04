const mongoose = require('mongoose')

const divisionSchema = new mongoose.Schema({
  divisionName: { type: String, required: true },
  itcs: [{ type: mongoose.Types.ObjectId, ref: 'Custody', default: null }],
})

module.exports = mongoose.model('Division', divisionSchema)
