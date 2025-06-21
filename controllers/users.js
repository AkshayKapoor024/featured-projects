const User = require('../models/user')
//Rendering signup form
module.exports.renderSignup = (req,res)=>{
        res.render('./users/signup.ejs')
    }
    //Sign up and Login user
    module.exports.signupUser = async(req,res)=>{
   try{
        console.log(req.body)
       let {username , email , password} = req.body
       let newuser = new User({username,email})
       await User.register(newuser,password)
       console.log('New User added successfully!!')
       //Automatic login using req.login of passport
       req.login(newuser,(err)=>{
        if(err){
          next(err)
        }else{
          req.flash('Usersuccess','New User Login Successful')
          res.redirect('/listings')         
        }
       })
    }catch(err){
        req.flash('Usererror',err.message)
        res.redirect('/listings')
    }
}
//Render login form
module.exports.renderLogin =(req, res) => {
    res.render('./users/login.ejs');
}
//Log in user by authentication
module.exports.loginUser = (req, res) => {
    console.log("✅ req.user after login:", req.user);
    req.flash('success', 'Logged in successfully');
    //Checks the redirect url if undefined set to listings and if not then redirects to the url of page requested after logging in 
    const redirectUrl=res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
  }
//Logging user out
  module.exports.logoutUser = (req,res)=>{
  req.logout((err)=>{
    if(err){
      next(err)
    }else{
      const redirectUrl=res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
    }
  })
}
//Debug route for checking if user is authenticated or not
module.exports.debug = (req, res) => {
  console.log("🟢 Session User:", req.user);
  if (req.isAuthenticated()) {
    res.send(`✅ Logged in as: ${req.user.email}`);
  } else {
    res.send('❌ Not authenticated');
  }
}