const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
    mode: {
        type: String,
        required: true,
        // enum:[]
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['ongoing','completed', 'abandoned', 'draw'],
        default:'ongoing'
    },
    resultType: {
        type: String,
        enum: ['firstCorrect', 'timeout','disconnect'],
        default:null
    }
})

const Match = mongoose.model('match', matchSchema)

module.exports = Match