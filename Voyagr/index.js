const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride  = require('method-override')
const ejsMate = require('ejs-mate')
//File Handling and Storage
require('dotenv').config()
//requiring routes
const listing = require('./routes/listing.js')
const reviews = require('./routes/review.js')
const users = require('./routes/user.js')

const app = express()
//Sessioning Dependencies
const cookieParser = require('cookie-parser')
const session = require('express-session')
//Session store for mongo db for deployement
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
//Authentication dependencies
const passport =require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
let port = 5000
//Cloud database connection string
let cloud_db = process.env.ATLAS 
app.set("view engine",'ejs')
app.set("views",path.join(__dirname,"views"))
app.engine('ejs',ejsMate)

app.use(express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


//Configuring session store 
const store  = MongoStore.create({
    //using cloud db as mongourl
     mongoUrl: cloud_db,
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
//Using sessioning dependencies
app.use(cookieParser("secretcode"))
app.use(session({
    store,
     secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    //Setting options for expiry date for cookie object so that data remains persistant throughout some time in browser
    cookie:{
        expires:Date.now() + 1000*60*60*24*3,
        maxAge:1000*60*60*3,
        httpOnly:true
    }
}))


app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
//Middleware handling res.locals for flash messages
app.use((req,res,next)=>{
res.locals.listAdd = req.flash('listAdd')
res.locals.listDlt=req.flash('listDlt')
res.locals.revAdd = req.flash('revAdd')
res.locals.revDlt=req.flash('revDlt')
res.locals.error=req.flash('error')
res.locals.Usererror=req.flash('Usererror')
res.locals.Usersuccess=req.flash('Usersuccess')
res.locals.success = req.flash('success')
res.locals.currentuser = req.user
next()
})


passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res)=>{
res.redirect('/listings')
})

//Using Route for the listing route
app.use('/listings',listing)
app.use('/listings/:id/reviews',reviews)
app.use('/',users)



//Initializing DataBase
main().then(()=>{
    console.log("Connected to db!")
}).catch((err)=>{
    console.log(err)
})
async function main(){

    await mongoose.connect(cloud_db)
}


//Use app.all('*',(req,res,next)=>) for handling errors in routes that are not handled or not exist in website
//Our own error handling middleware
app.use((err,req,res,next)=>{
    let {status=400 , message='Something Went wrong'} = err

    res.render("./listings/error.ejs",{err})
})

app.listen(port,()=>{
    console.log(`App listening at http://localhost:${port}/listings`)
})

