const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({

    groupName : {type: String,required:true},
    trainerIds : [{ type : mongoose.Types.ObjectId, ref: 'User' }],
    TeamLeader : { type : mongoose.Types.ObjectId, ref: 'User' },
    itcCenter : {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Group', groupSchema);
