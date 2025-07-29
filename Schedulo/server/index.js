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
const { GEMINI_API_FUNCTION } = require('./GeminiAPI')
const Event = require('./models/event')
const customError = require('./utils/customError')
const wrapAsync = require('./utils/wrapAsync')
const MongoStore = require('connect-mongo');
const { google } = require('googleapis');
const createCalendarEvent = require('./utils/googleCalendar')
//Used to parse json data coming from requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//Starting Agenda on initializing the backend
startAgenda()
// backend/index.js or server.js
const cors = require('cors');
async function main() {
  await mongoose.connect(process.env.ATLASURL);
  console.log('Connected to mongodb!')
  console.log('Using DB:', mongoose.connection.name);
}
console.log('Cloud name:', process.env.CLOUD_NAME);
//MongoDb Connection
main()
//This allows backend to get session related information regarding sessions
app.use(cors({ origin: 'https://go-schedulo.vercel.app', credentials: true }));


const store  = MongoStore.create({
    //using cloud db as mongourl
     mongoUrl: process.env.ATLASURL,
     //Crypto used for encryption of sensitive information
     //Secret code for sessioning 
      crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600
     })
     //error handling in mongosession store
store.on('error',()=>{
    console.log(`ERROR IN MONGO SESSION STORE`)
})


//Applying sessioning in backend
app.use(cookieParser(process.env.SECRET))
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: true, // 🔥 HTTPS required
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  }
}))

//Passport requirements
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
  console.log('🔐 Serializing user:', user._id);
  done(null, user._id); // store only the user ID in session
});

passport.deserializeUser((userId, done) => {
  console.log('🧩 Deserializing User ID:', userId);
  User.findById(userId)
    .then(user => {
      console.log('✅ User found:', user);
      done(null, user);
    })
    .catch(err => {
      console.error('❌ Deserialize error:', err);
      done(err);
    });
});
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

/*Configuring google oauth strategy */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACKURL
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


passport.use('google-calendar', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://schedulo-server-pfcu.onrender.com/auth/google/calendar/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  // Attach OAuth data to request (NOT session)
  req.calendarData = {
    accessToken,
    refreshToken,
    email: profile.emails[0].value,
    displayName: profile.displayName
  };

  return done(null, { calendarAuth: req.calendarData }); // Skip serialization
}));


function getOAuthClient(refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}
app.use('/events', eventRoute)
app.use('/', userRoute)
app.use('/events/:eventid', reviewRoute)
app.use('/events/:eventid/rsvp/:userid', rsvpRoute)

//Explicitly called session checking router handler to help create server to make client create a session id
app.get('/session-check', (req, res) => {
  if (req.isAuthenticated()) {
    req.session.touch(); // Keeps session alive
    return res.send({ status: 'authenticated', user: req.user });
  } else {
    return res.status(401).send({ status: 'unauthenticated' });
  }
});

//Index route
app.get('/', (req, res) => {
  res.send(`working`)
})


app.get('/calendar/authorize', (req, res, next) => {
  const eventDetails = {
    summary: req.query.title,
    startTime: req.query.startTime,
    endTime: req.query.endTime,
    location: req.query.venue,
    description: req.query.description
  };
  console.log(eventDetails)
  const state = encodeURIComponent(JSON.stringify(eventDetails));

  passport.authenticate('google-calendar', {
    scope: ['https://www.googleapis.com/auth/calendar.events', 'profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
    session: false,
    state
  })(req, res, next);
});

app.get('/auth/google/calendar/callback',
  passport.authenticate('google-calendar', {
    failureRedirect: 'https://go-schedulo.vercel.app/',
    session: false
  }),
  async (req, res) => {
    try {
      const state = JSON.parse(decodeURIComponent(req.query.state));
      console.log(state)
      const { accessToken, refreshToken, email } = req.calendarData;

      const oauth2Client = getOAuthClient(refreshToken);
      const { token } = await oauth2Client.getAccessToken();
      if (!token) {
        console.warn('⚠️ No access token returned from refresh');
        return res.status(401).send('Token refresh failed');
      }
      console.log('🕓 Incoming times:', state.startTime, state.endTime);
      console.log('📌 Type of startTime:', typeof state.startTime); // Should be 'string'
      console.log('📦 Parsed state object:', JSON.stringify(state, null, 2));
      const result = await createCalendarEvent(token, {
        summary: state.summary,
        location: state.location,
        description: state.description,
        startTime: state.startTime,
        endTime: state.endTime

      });
      console.log(result)
      console.log('📆 Event created:', result.htmlLink);

      const user = await User.findOne({ email });
      if (user) {
        user.calendar = { accessToken: token, refreshToken };
        await user.save();
      }

      res.redirect('http://localhost:5173/?calendar=success');
    } catch (error) {
      console.error('🔑 Token refresh failed:', error);
      res.redirect('http://localhost:5173/?calendar=failure');
    }
  }
);




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
