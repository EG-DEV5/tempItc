const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({

    groupName : {type: String,required:true,unique:true},
    trainerIds : [{ type : mongoose.Types.ObjectId, ref: 'User' }],
    TeamLeader : { type : mongoose.Types.ObjectId, ref: 'User' },
    itcCenter : {
        type: String,
        required: true,
    },
    image: {
        url: { type: String },
        public_id: { type: String },
      },
})

module.exports = mongoose.model('Group', groupSchema);
