const mongoose = require('mongoose');


const itcSchema = new mongoose.Schema({

    ItcName : {type: String,required:true},


})

module.exports = mongoose.model('ITC', itcSchema);
