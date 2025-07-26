const {Layout} = require('../utils/Email/Layout')
const Event = require('../models/event')
const Rsvp = require('../models/rsvp')
const User = require('../models/user')
const {LayoutSchedule} = require('../utils/Email/Layout')
const { v4: uuidv4 } = require('uuid');
const { renderImage, renderPDF, generateTicketHTML } = require('../utils/QrCodeUtils.js')
const { cloudinary, storage } = require('../cloudConfig.js')
const { Readable } = require('stream');
const { LayoutTicket } = require('../utils/Email/Layout.js')

module.exports.addRsvp = async (req, res, next) => {
        //RSVP Model 
        const { eventid, userid } = req.params
        const details = req.body
        const exists = await Rsvp.findOne({ eventid: eventid, userid });
        if (exists) return res.status(409).send("Already RSVPed");

        const event = await Event.findById(eventid)
        const newRegister = new Rsvp({ ...details, eventid: eventid, userid: userid })
        console.log(newRegister)
        await newRegister.save()
        event.rsvps.push(newRegister._id)
        await event.save()
        const user = await User.findById(userid)
        let safeDate = event.date ?? '';
        let safeTime = event.time ?? '00:00:00';

        const fullDateTimeString = `${safeDate}T${safeTime}`;
        const fullDateTime = new Date(fullDateTimeString);

        // Only calculate oneDayBefore if fullDateTime is valid
        if (!isNaN(fullDateTime)) {
            const oneDayBefore = new Date(fullDateTime.getTime() - 24 * 60 * 60 * 1000).toISOString();

            await LayoutSchedule(
                user.email,
                "Reminder: Your Event is Tomorrow!",
                user.username,
                `Just a quick reminder about "<strong>${event.title}</strong>" happening on ${event.date} at ${event.time}. Don't forget to show up and have a great time!`,
                oneDayBefore
            );
        }
        //Sending the rsvp confirmation email to the user logged in 
        await Layout(user.email, "RSVP Confirmed for Your Event", user.username, `Thank you for registering for "<strong>${event.title}</strong>". We look forward to seeing you there! You can manage your RSVP anytime in your profile.`)
        console.log(newRegister)
        res.send({ eventid, userid, details })
    }

    module.exports.updateRsvp = async (req, res, next) => {

        //Put request to change the rsvp details
        const { eventid, userid } = req.params;
        const newdetails = req.body;
        // 1. Find the current RSVP
        const currRsvp = await Rsvp.findOne({ eventid, userid });
        if (!currRsvp) {
            return res.status(404).send({ error: 'RSVP not found for this user and event' });
        }
        // 2. Update RSVP status and other fields
        await Rsvp.findByIdAndUpdate(currRsvp._id, { ...newdetails, eventid, userid });
        // 3. Update Event document accordingly
        const event = await Event.findById(eventid);
        // Remove RSVP ID from both arrays to prevent duplicates
        event.rsvps = event.rsvps.filter(id => !id.equals(currRsvp._id));
        // Determine updated placement based on status
        if (newdetails.status === 'Sure') {
            event.rsvps.push(currRsvp._id);
        }
        await event.save();
        res.send('RSVP status updated and event record synchronized');
    }

    module.exports.deleteRsvp = async (req, res, next) => {


        //Delete route for deleting rsvps
        const { eventid, userid } = req.params;
        // 1. Find the RSVP document
        const currRsvp = await Rsvp.findOne({ eventid, userid });
        let event = await Event.findById(eventid)
        if (!currRsvp) {
            return res.status(404).send({ error: 'RSVP not found for this user and event' });
        }
        // 2. Remove RSVP reference from both arrays in Event
        await Event.findByIdAndUpdate(eventid, {
            $pull: {
                rsvps: currRsvp._id,
            }
        });
        // 3. Delete the RSVP document itself
        await Rsvp.findByIdAndDelete(currRsvp._id);
        //Sending rsvp withdraw confirmation
        await Layout(req.currentUser.email, "You've Withdrawn from an Event", req.currentUser.username, `You have successfully withdrawn your RSVP for "<strong>${event.title}</strong>". If this was a mistake, feel free to register again anytime.`)
        res.send('RSVP cancellation successful');
    }

    module.exports.checkRsvp = async (req, res, next) => {
    let { eventid, userid } = req.params
    console.log(eventid, userid)
    let response = await Rsvp.findOne({ eventid: eventid, userid: userid })
    if (response) res.send(response)
    else res.status(404).send({ error: 'Rsvp not found for this user and event' })
}

function bufferToStream(buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}
module.exports.generateTicket = async (req, res) => {
    let { eventid, userid } = req.params
    let { type } = req.query
    const event = await Event.findById(eventid)
    const user = await User.findById(userid)
    let rsvp = await Rsvp.findOne({ eventid, userid })
    if (!rsvp) return res.status(404).send('Error: Rsvp not found for this user!')
    if (rsvp.ticketId && rsvp.ticketURL) {
        // Construct download link using ticketURL and desired download flag
        const downloadLink = rsvp.ticketURL.replace('/upload/', '/upload/fl_attachment/');
        try {
            await LayoutTicket(user.email, `Ticket for event ${event.title}`, user.username, event, user, downloadLink)
        } catch (err) {
            return res.status(500).send(`Internal server error , email could not be sent`)
        }
        return res.send('Ticket sent again to the user email');
    } else {

        const ticketId = uuidv4()
        rsvp.ticketId = ticketId
        await rsvp.save()
        const htmlContent = await generateTicketHTML(user, event, ticketId)
        if (type === 'pdf') {
            const ticketPDF = await renderPDF(htmlContent)
            await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Project1/tickets',
                        public_id: `ticket_${ticketId}`,
                        format: 'pdf',
                        resource_type: 'raw' // critical for non-image files like PDF
                    },
                    async (error, result) => {
                        if (error) return reject(error);
                        rsvp.ticketURL = result.secure_url;
                        await rsvp.save();
                        resolve()
                    }
                );
                bufferToStream(ticketPDF).pipe(stream);
            });
            const downloadURL = rsvp.ticketURL.replace('/upload/', '/upload/fl_attachment/');
            try {

                await LayoutTicket(user.email, `Ticket for event ${event.title}`, user.username, event, user, downloadURL)
            } catch (err) {
                return res.status(500).send(`Internal server error , email could not be sent`)
            }
            res.send(`Congratulations!,Your ticket is sent on your registered email`)
        }
        else if (type === 'img') {
            const ticketImage = await renderImage(htmlContent)
            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Project1/tickets',
                        public_id: `ticket_${ticketId}`,
                        format: 'jpg',
                        resource_type: 'image'
                    },
                    async (error, result) => {
                        if (error) return reject(error);
                        rsvp.ticketURL = result.secure_url;
                        await rsvp.save();
                        resolve();
                    }
                );
                bufferToStream(ticketImage).pipe(uploadStream);
            });
            const downloadURL = rsvp.ticketURL.replace('/upload/', '/upload/fl_attachment/');
            await LayoutTicket(user.email, `Ticket for event ${event.title}`, user.username, event, user, downloadURL)
            res.send(`Congratulations!,Your ticket is sent on your registered email`)
        } else {
            res.status(400).send(`Bad Request`)
        }
    }
}
