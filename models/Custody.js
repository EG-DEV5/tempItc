const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({

    custodyName : {type: String,required:true,unique:true},
    trainerIds : [{ type : mongoose.Types.ObjectId, ref: 'User' }],
    SafetyAdvisor : { type : mongoose.Types.ObjectId, ref: 'User' },
    city : {
        type: String,
        required: true,
    },
    image: {
        url: { type: String },
        public_id: { type: String },
      },
})

module.exports = mongoose.model('Group', groupSchema);
