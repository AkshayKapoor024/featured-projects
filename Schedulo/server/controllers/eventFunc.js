const Event = require('../models/event.js')
const User = require('../models/user.js')
const Rsvp = require('../models/rsvp.js')
const {Layout} = require('../utils/Email/Layout.js')
const { cloudinary } = require('../cloudConfig.js');
module.exports.getAllEvents = async (req, res) => {
    let currentEvents = await Event.find({})
    res.send(currentEvents)
}
module.exports.postNewEvent = async (req, res) => {
    //Post request for adding events to the events list 
    //Early Termination if file not found
    if (!req.file) return res.status(400).send('Upload failed: No file received');

    let obj = req.body
    let event = new Event(obj)
    //Taking file link from req.file after storing into cloudinary via multer
    const url = req.file?.path || 'https://wallpaperaccess.com/full/959317.jpg'

    if (req.currentUser) {
        event.owner = req.currentUser._id
        event.banner = url
        await event.save()
        console.log(req.body.cohosts)
        console.log('New Event Added to Db!!')
        res.send(event)
        //Sending email to user upon creating an event 
        await Layout(req.currentUser.email, "Your Event Has Been Created Successfully", req.currentUser.username, `Here are the details:<br/><br/><strong>Title:</strong> ${obj.title}<br/><strong>Date:</strong> ${obj.date}<br/><strong>Venue:</strong> ${obj.venue}<br/><br/>You can manage your event anytime from your dashboard.`)
    } else return res.status(403).send({ error: 'You are not allowed to modify this resource' });
}

module.exports.singleEvent = async (req, res) => {
    // single event (Detailed view)
    let obj = await Event.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('rsvps')
    res.send(obj)
}

module.exports.deleteEvent = async (req, res) => {
    //Delete Event Handler
    let id = req.params.id
    let event = await Event.findById(id)
    //Early termination 
    if (!event) return res.status(404).send('Event not found');
    if (req.currentUser._id.toString() === event.owner.toString()) {

        let owner = await User.findById(event.owner)
        //Sending email upon cancelling the event to the owner
        await Layout(owner.email, "Important: Event Cancelled", owner.username, `We regret to inform you that the event "<strong>${event.title}</strong>" scheduled on ${event.date} has been cancelled. We apologize for any inconvenience.`)

        //Sending this to every rsvped user 
        let rsvps = event.rsvps
        if (rsvps) {

            rsvps.forEach(async (element) => {
                let rsvp = await Rsvp.findById(element)
                let user = await User.findById(rsvp.userid)
                if (user.email) {

                    await Layout(user.email, "Important: Event Cancelled", user.username, `We regret to inform you that the event "<strong>${event.title}</strong>" scheduled on ${event.date} has been cancelled. We apologize for any inconvenience.`)
                }
            });
        }
        await Event.findByIdAndDelete(id)
        console.log('Item Successfully deleted!!')
        res.send('Item Deleted')
    } else return res.status(403).send({ error: 'You are not allowed to modify this resource' });
}

module.exports.updateEvent = async (req, res) => {

    // Update request for changing the data 
    let newdata = req.body
    const { cohosts } = req.body;
    console.log('Received cohosts:', cohosts);
    let id = req.params.id
    let event = await Event.findById(id)

    //Early termination
    if (!event) return res.status(404).send('Event not found');


    const oldPublicId = event.banner?.split('/').pop().split('.')[0];
    if (oldPublicId) cloudinary.uploader.destroy(oldPublicId);
    const url = req.file?.path || 'https://wallpaperaccess.com/full/959317.jpg'

    if (event.owner.toString() === req.currentUser._id.toString()) {

        let resp = await Event.findByIdAndUpdate(id, { ...newdata, owner: event.owner, banner: url }, { new: true });
        if (!resp) return res.status(400).send('User not found or update failed');
        let owner = await User.findById(event.owner)
        console.log('Data Successfully Updated!!')
        res.send(newdata)
        //Sending notification to event rsvps that the event details have been changed successfully 
        let rsvps = event.rsvps
        rsvps.forEach(async (element) => {
            let rsvp = await Rsvp.findById(element)
            let user = await User.findById(rsvp.userid)
            if (user.email) {
                await Layout(user.email, "Event Updated: Please Check New Details", user.username, `The event "<strong>${event.title}</strong>" has been updated by the organizer.<br/><br/>Please review the latest details in your dashboard to stay informed.`)
            }
        });

    } else return res.status(403).send({ error: 'You are not allowed to modify this resource' });
}

module.exports.attendeeList = async (req, res, next) => {
  const { id } = req.params
  const event = await Event.findById(id)
  if (!event) {
    return res.status(404).send({ error: 'Event not found' });
  }
  const currid = req.currentUser._id
  if (currid.toString() === event.owner.toString()) {

    const rsvpList = await Rsvp.find({ eventid: id }).populate('userid').populate('eventid')
    res.send(rsvpList)
  } else return res.status(403).send({ error: 'User not authorized for accessing this section' })
}