const Review = require('../models/review.js')
const Rsvp = require('../models/rsvp.js')
const User = require('../models/user.js')
const {Layout} = require('../utils/Email/Layout')
const defaultProfilePic = 'https://wallpaperaccess.com/full/959317.jpg'
module.exports.signupUser = async (req, res) => {
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
}

module.exports.loginUser = (req, res) => {
    console.log(`User logged in successfully!! ${req.user}`)
    res.send('User logged in successfully')
}

module.exports.logoutUser = (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                next(err)
            } else res.send('User logout successful!!')
        })
    } catch (err) {
        res.status(400).send(err)
    }
}

module.exports.googleAuthCallbackFunction = async (req, res) => {
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

module.exports.AuthenticationCheck = (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.send('❌ Not authenticated');
    }
}

module.exports.userDetailing = async (req, res) => {
    let id = req.user._id
    let response = await User.findById(id)
    res.send(response);
}

module.exports.findUsers = async (req, res) => {
    let obj = req.query
    if (obj.email) {
        let data = await User.find({ email: obj.email })
        console.log(data)
        res.send(data)
    } else {
        res.send({ err: 'Not found' })
    }
}

module.exports.saveUserInfo = async (req, res) => {
    let obj = req.body
    console.log(req.body)
    const url = req.file?.path || req.body.profilepic || defaultProfilePic;
    let resp = await User.findByIdAndUpdate(req.body._id, { ...obj, profilepic: url })
    if (!resp) return res.status(400).send('User not found or update failed');
    else res.send('Success: Details added successfully!')
}
module.exports.findRsvp = async (req, res) => {
    let response = await Rsvp.find({ userid: req.currentUser._id })
    if (response) {

        res.send(response)
    } else return res.status(404).send('User not found!!')
}

module.exports.findReviews = async (req, res) => {
    let { userid } = req.params
    let reviews = await Review.find({ author: userid }).populate('event')
    //let obj = await Review.find({author:userid})
    res.send(reviews)
}