const mongoose = require('mongoose')
const rsvp = new mongoose.Schema({

    status:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    eventid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'event',
        required:true

    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    checkedIn:{
        type:Boolean,
        default:false,
    },
    feedback:{
        type:String,
    },
    info:{
        type:String
    }
})

const Rsvp = mongoose.model('rsvp',rsvp)
module.exports = Rsvp