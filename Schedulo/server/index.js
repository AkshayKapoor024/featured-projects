const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Event = require('./models/event')
const wrapAsync = require('./utils/wrapAsync')
const ValidateEvents = require('./utils/ValidateEvents')
const customError = require('./utils/customError')
require('dotenv').config()
let port = 3000
//Sessioning done 
const cookieParser = require('cookie-parser')
const session = require('express-session')
//Authorization dependencies 
const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user')
const Review = require('./models/review')
const ValidateUser = require('./utils/ValidateUser')
const ValidateRsvp = require('./utils/ValidateRsvp')
const Rsvp = require('./models/rsvp')
//Emailing and notification system 
const startAgenda = require('./utils/Agenda/agendaInit')
const agenda = require('./utils/Agenda/agendaInstance')
const { Layout, LayoutSchedule } = require('./utils/Email/Layout')
const {cloudinary , storage} = require('./utils/cloudConfig')
const multer = require('multer')
const upload = multer({storage})
//Used to parse json data coming from requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//Starting Agenda on initializing the backend
startAgenda()
// backend/index.js or server.js
const cors = require('cors');
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Schedulo');
  console.log('Connected to mongodb!')
}
//MongoDb Connection
main()
//This allows backend to get session related information regarding sessions
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
//Applying sessioning in backend
app.use(cookieParser("Secret-code"))
app.use(session({
  secret: 'YemeraSecretHai',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true only if using HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}))
//Passport requirements
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

/*Configuring google oauth strategy */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) return done(null, existingUser);

    // Otherwise, create a new user
    const newUser = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      username: profile.displayName // optional
    });

    await newUser.save();
    done(null, newUser);
  } catch (err) {
    done(err);
  }
}));


//Events Validation before any route to check if event is coming in correct format or not
const eventValidation = (req, res, next) => {
  const response = ValidateEvents.validate(req.body)
  if (response.error) {
    throw new customError(400, response.error.details[0].message)
  } else next()

}
//User validation 
const userValidation = (req, res, next) => {
  const response = ValidateUser.validate(req.body)
  if (response.error) {
    throw new customError(400, response.error.details[0].message)
  } else next()
}
//RSVP Validation
const rsvpValidation = (req, res, next) => {
  const response = ValidateRsvp.validate(req.body)
  if (response.error) {
    throw new customError(400, response.error.details[0].message)
  } else next()
}


const requireAuthUser = async (req, res, next) => {
  if (!req.user || !req.user.email) {
    return res.status(401).send({ error: 'Not authenticated' });
  }
  req.currentUser = await User.findOne({ email: req.user.email });
  if (!req.currentUser) {
    return res.status(404).send({ error: 'User not found' });
  }
  next();
};
//Explicitly called session checking router handler to help create server to make client create a session id
app.get('/session-check', (req, res) => {
  req.session.greeting = 'Welcome, Akshay!';
  res.send('Session initialized');
});

//Index route
app.get('/', (req, res) => {
  res.send(`working`)
})
// Home route (Get all events)
app.get('/events', wrapAsync(async (req, res) => {
  let currentEvents = await Event.find({})
  res.send(currentEvents)
}))

// single event (Detailed view)
app.get('/events/:id', wrapAsync(async (req, res) => {
  let obj = await Event.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('rsvps')
  res.send(obj)
}))

//Post request for adding events to the events list 
app.post('/events',upload.single('image') ,eventValidation, requireAuthUser, wrapAsync(async (req, res) => {
  let obj = req.body
  let event = new Event(obj)
  //Taking file link from req.file after storing into cloudinary via multer
  const url = req.file?.path ||'https://wallpaperaccess.com/full/959317.jpg'
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
}))

// Update request for changing the data 
app.put('/events/:id/updateDetails',upload.single('image'),eventValidation, requireAuthUser, wrapAsync(async (req, res) => {
  let newdata = req.body
  const { cohosts } = req.body;
  console.log('Received cohosts:', cohosts);
  let id = req.params.id
  let event = await Event.findById(id)
  const oldPublicId = event.banner?.split('/').pop().split('.')[0];
if (oldPublicId) cloudinary.uploader.destroy(oldPublicId);
  const url = req.file?.path ||'https://wallpaperaccess.com/full/959317.jpg'

  if (event.owner.toString() === req.currentUser._id.toString()) {

    let resp =await Event.findByIdAndUpdate(id, { ...newdata, owner: event.owner , banner:url}, { new: true });
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
}))
//Delete Event Handler
app.delete('/events/:id', requireAuthUser, wrapAsync(async (req, res) => {
  let id = req.params.id
  let event = await Event.findById(id)
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
}))

app.get('/users', async (req, res) => {
  let obj = req.query
  if (obj.email) {
    let data = await User.find({ email: obj.email })
    console.log(data)
    res.send(data)
  } else {
    res.send({ err: 'Not found' })
  }
})

//Authentication routes
//Sign-up route
app.post('/signup', userValidation, wrapAsync(async (req, res) => {
  try {

    let { username, email, password } = req.body
    let user = new User({ email, username })
    await User.register(user, password)
    //Sending the email to user
    await Layout(user.email, "Welcome to Schedulo!", user.username, "We're thrilled to have you onboard. Start browsing upcoming events and RSVP today.")

    req.login(user, (err) => {
      if (err) {
        next(err)
      } else {
        console.log(req.user)
        res.send('User signup in Successfully' + req.user)
      }
    })
  } catch (err) {
    res.send(err)
  }
}))
//Login route
app.post('/login', userValidation, passport.authenticate('local', {
  failureRedirect: '/login',
}), (req, res) => {
  console.log(`User logged in successfully!! ${req.user}`)
  res.send('User logged in successfully')
})

//Logout user 
app.get('/logout', (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        next(err)
      } else res.send('User logout successful!!')
    })
  } catch (err) {
    res.status(400).send(err)
  }
})


//GOOGLE AUTH ROUTES
// Trigger Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login'
  }),
  async (req, res) => {
    // ✔️ Email logic here — fires only on success
    await Layout(
      req.user.email,
      "Welcome to Schedulo!",
      req.user.username || req.user.fullname,
      "We're thrilled to have you onboard via Google. Start browsing upcoming events and RSVP today."
    );

    // Then redirect
    res.redirect('http://localhost:5173/');
  }
);
//Check Authenticated
app.get('/isAuthenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send('❌ Not authenticated');
  }
})
app.get('/userDetails', async (req, res) => {
  let id = req.user._id
  let response = await User.findById(id)
  res.send(response);
})

//68658791b06040e9f8ac7e11

//RSVP Model 
app.post('/events/:id/rsvp/:userid', wrapAsync(async (req, res, next) => {
  const { id, userid } = req.params
  const details = req.body
  const exists = await Rsvp.findOne({ eventid: id, userid });
  if (exists) return res.status(409).send("Already RSVPed");

  const event = await Event.findById(id)
  const newRegister = new Rsvp({ ...details, eventid: id, userid: userid })
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
  res.send({ id, userid, details })
}))

//Put request to change the rsvp details
app.put('/events/:eventid/rsvp/:userid', requireAuthUser, wrapAsync(async (req, res, next) => {
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
}));


//Delete route for deleting rsvps
app.delete('/events/:eventid/rsvp/:userid', requireAuthUser, wrapAsync(async (req, res, next) => {
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
}));
//Checking if user is registred or not
app.get('/events/:eventid/rsvp/:userid/isRegistered', requireAuthUser, wrapAsync(async (req, res, next) => {
  let { eventid, userid } = req.params
  console.log(eventid, userid)
  let response = await Rsvp.findOne({ eventid: eventid, userid: userid })
  if (response) res.send(response)
  else res.status(404).send({ error: 'Rsvp not found for this user and event' })
}))


//Only for owner of event
app.get('/events/:id/attendees', requireAuthUser, wrapAsync(async (req, res, next) => {
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
}))

//Saving user details on user form in user Dashboard
app.post('/userDashboard/profile/saveDetails',upload.single('image'),requireAuthUser, wrapAsync(async (req, res) => {
  let obj = req.body
  const url = req.file?.path ||'https://wallpaperaccess.com/full/959317.jpg'
;
  let resp = await User.findByIdAndUpdate(req.body._id,{...obj , profilepic:url})
  if (!resp) return res.status(400).send('User not found or update failed');
  else res.send('Success: Details added successfully!')
}))
//Route for giving user rsvps currently done !!!
app.get('/userRsvp', requireAuthUser, wrapAsync(async (req, res) => {
  let response = await Rsvp.find({ userid: req.currentUser._id })
  if (response) {

    res.send(response)
  } else return res.status(404).send('User not found!!')
}))


//Review Model routes 
app.post('/events/:eventid/newReview', requireAuthUser, wrapAsync(async (req, res) => {
  let { eventid } = req.params
  let { comment, rating } = req.body
  const review = new Review({ comment, rating, event: eventid })
  review.author = req.currentUser._id
  let event = await Event.findById(eventid);
  event.reviews.push(review._id);
  await event.save();
  await review.save()
  res.send(`Successfully Added a review`)
}))

app.delete('/events/:eventid/deleteReview/:reviewid', wrapAsync(async (req, res) => {
  let { eventid, reviewid } = req.params
  await Event.findByIdAndUpdate(eventid, { $pull: { reviews: reviewid } })
  await Review.findByIdAndDelete(reviewid)
  console.log("review deleted successfully")
  res.send(`Review deleted successfully`)
}))

app.get(`/users/:userid/reviews/YourReviews`, wrapAsync((async (req, res) => {
  let { userid } = req.params
  let reviews = await Review.find({ author: userid }).populate('event')
  //let obj = await Review.find({author:userid})
  res.send(reviews)
})))

//Our own error handling middleware
app.use((err, req, res, next) => {
  let { status = 400, message = 'Something Went wrong' } = err
  console.error(err.stack); // inside error middleware
  res.status(status).send(message)
})

//Website backend running at this port
app.listen(port, () => {
  console.log(`App Listening to port http://localhost:${port}`)
})