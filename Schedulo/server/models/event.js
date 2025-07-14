const mongoose = require('mongoose');
const Rsvp = require('./rsvp')
const Review = require('./review')
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        default: () => new Date().toString().slice(0, 15)
    },
    time: {
        type: String,
        required: true,
        default: () => new Date().toString().slice(16, 24)
    },
    venue: {
        type: String,
        required: true
    },
    enums: [{
        type: String,
    }],
    banner: {
        type: String,
        default: `https://wallpaperaccess.com/full/959317.jpg`,
        required: true
    },
    host: {
        //type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    cohosts: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
        //type: mongoose.Schema.Types.ObjectId,
    }],
    rsvps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rsvp'
    }],
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }],
});
eventSchema.post("findOneAndDelete", async (event) => {
    if (event) {
        await Rsvp.deleteMany({ _id: { $in: event.rsvps } });
        await Review.deleteMany({_id:{$in:event.reviews}})
    }
})
const Event = mongoose.model('event', eventSchema);
module.exports = Event;
