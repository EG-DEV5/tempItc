const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({

    custodyName : {type: String,required:true,},
    pendingTrainers : [{ type : mongoose.Types.ObjectId, ref: 'User',default : null }],
    SafetyAdvisor : { type : mongoose.Types.ObjectId, ref: 'User' ,default : null },
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
