const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const UserSchema = new mongoose.Schema({
    //Email and password already added by passportlocalmongoose in the schema
    username:{
        type:String,
        required:true
    }
})
UserSchema.plugin(passportLocalMongoose , {usernameField:'email'})
const User = mongoose.model("user",UserSchema)
module.exports=User