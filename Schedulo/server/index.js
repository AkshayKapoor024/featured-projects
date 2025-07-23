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
    secure: false, // set to true only if using HTTPS
    httpOnly: false,
    sameSite: 'none'
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


async function getResponse(Query) {
  return await GEMINI_API_FUNCTION(Query)
}

const getList = async (Query) => {
  const queryObj = await getResponse(Query);
  console.log(queryObj);

  if (!queryObj.error) {
    // Build flexible date query
    let dateFilter = {};
    if (queryObj.startDate && queryObj.endDate) {
      dateFilter.date = {
        $gte: new Date(queryObj.startDate),
        $lte: new Date(queryObj.endDate)
      };
    } else if (queryObj.startDate) {
      dateFilter.date = { $gte: new Date(queryObj.startDate) };
    } else if (queryObj.endDate) {
      dateFilter.date = { $lte: new Date(queryObj.endDate) };
    }

    const mongoQuery = {
      ...(queryObj.title && { title: { $regex: queryObj.title, $options: 'i' } }),
      ...(queryObj.description && { description: { $regex: queryObj.description, $options: 'i' } }),
      ...(queryObj.venue && { venue: { $regex: queryObj.venue, $options: 'i' } }),
      ...(queryObj.enums?.length && { enums: { $in: queryObj.enums } }),
      ...dateFilter
    };

    const results = await Event.find(mongoQuery);
    return results;
  } else {
     return new customError(404,'Bad Request!!');
  }
};

app.use('/events', eventRoute)
app.use('/', userRoute)
app.use('/events/:eventid', reviewRoute)
app.use('/events/:eventid/rsvp/:userid', rsvpRoute)

//Explicitly called session checking router handler to help create server to make client create a session id
app.post('/session-check', (req, res) => {
  console.log('🌐 Session:', req.session);
  console.log('🧠 User:', req.user);
  console.log('🔐 Authenticated:', req.isAuthenticated());
  res.send(`Session active. Authenticated: ${req.isAuthenticated()}`);
});

//Index route
app.get('/', (req, res) => {
  res.send(`working`)
})

app.get('/api/searchResults',wrapAsync(async(req,res)=>{
  let {inputQuery} =req.query
  let eventList = await getList(inputQuery)
  console.log(eventList)
  if(Array.isArray(eventList))res.send(eventList)
    else res.status(404).send(`No Event found`)
}))

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
