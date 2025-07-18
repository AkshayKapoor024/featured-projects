const express = require('express')
const app = express()
const mongoose = require('mongoose')
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
//Emailing and notification system 
const startAgenda = require('./utils/Agenda/agendaInit')
const eventRoute = require('./routes/eventsRoute')
const reviewRoute = require('./routes/reviewRoutes')
const rsvpRoute = require('./routes/rsvpRoutes')
const userRoute = require('./routes/userRoute')
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
console.log('Cloud name:', process.env.CLOUD_NAME);
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


app.use('/events', eventRoute)
app.use('/', userRoute)
app.use('/events/:eventid', reviewRoute)
app.use('/events/:eventid/rsvp/:userid', rsvpRoute)

//Explicitly called session checking router handler to help create server to make client create a session id
app.get('/session-check', (req, res) => {
  req.session.greeting = 'Welcome, Akshay!';
  res.send('Session initialized');
});

//Index route
app.get('/', (req, res) => {
  res.send(`working`)
})

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