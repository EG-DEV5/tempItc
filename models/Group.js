const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({

    groupName : {type: String,required:true},
    trainerIds : [{ type : mongoose.Types.ObjectId, ref: 'User' }],
    itcId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ITC',
    }
})

module.exports = mongoose.model('Group', groupSchema);
