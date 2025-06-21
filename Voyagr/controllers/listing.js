//Index route
const List = require('../models/listing.js')
//Requiring mapboxsdk downloading for mapbox services using npm
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// stylesService exposes listStyles(), createStyle(), getStyle(), etc.
const mapToken = process.env.MAP_TOKEN
//Creating a base client using mapbox sdk services re(required above) to perform services regarding map box
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
    let mylist = await List.find({})
    res.render("./listings/index.ejs", { mylist, user: req.user })
}
//New List creation form
module.exports.createList = (req, res) => {
    res.render('./listings/form.ejs')
}

//Saving data from new list form
module.exports.saveList = async (req, res) => {

    //Finding geocoding of the place entered by user 
    let response = await geocodingClient.forwardGeocode({
        //Location passed in body object by user 
        query: `${req.body.location} , ${req.body.country}`,
        //Any place can have different coordinates based on location default limit for this is set to 5 which means we can get any 5 coordinates but we set this to1 as we need a single one
        limit: 1
    })
        .send()
    //COORDINATES ARE STORED IN response.body.features which is an array of objects containing diff output objects of same number as mentioned in limit in req
    // now inside this response.body.features we have a geometry.coordinates which contains exact coordinates 
    //So total path is let coordinates = response.body.features[0].geometry.coordinates
    //now coordinates is an array of two elements [x,y] coordinate so use this accordingly

    let obj = req.body
    //taking data of file uploaded by multer on cloudinary 
    let url = req.file.path
    let filename = req.file.filename
    let newdata = new List({
        title: obj.title,
        description: obj.desc,
        price: obj.price,
        location: obj.location,
        country: obj.country
    })
    //Storing credentials of images stored
    newdata.image = { url, filename }
    //Adding owner to the new listing 
    newdata.owner = req.user._id
    //Storing coordinates in the listings found by geocodingclient forward geocode above
    newdata.geometry = response.body.features[0].geometry
    await newdata.save()
    console.log('New data added to DB!')
    req.flash('listAdd', 'New Listing Added Successfully!')
    res.redirect('/listings')
}

//Edit List Form
module.exports.editList = async (req, res) => {
    let id = req.params.id
    let obj = await List.findById(id)
    //Finding the listing image url stored on cloudinary and then adding parameters to it for better upload
    let previousImageUrl = obj.image.url
    previousImageUrl = previousImageUrl.replace("/upload", "/upload/w_250/e_blur:100")
    //If a listing doesnt exist alone while accessing , flash a message
    if (!obj) {
        req.flash('error', 'Error ! Listing You are accessing is not available😭😭')
        res.redirect('/listings')
    } else {

        res.render('./listings/edit.ejs', { obj, previousImageUrl })
    }
}
//Saving the changes from edit form
module.exports.saveEdit = async (req, res) => {
    let obj = req.body
    let newlist = await List.findByIdAndUpdate(req.params.id, { title: obj.title, description: obj.desc, price: obj.price, location: obj.location, country: obj.country, image: obj.url })
    console.log('Data changed Successfully')
    //Checks if user uploaded a file then only make changes to it by uploading a new file otherwise not 
    if (typeof req.file !== 'undefined') {
        let url = req.file.path
        let filename = req.file.filename
        newlist.image = { url, filename }
        await newlist.save()
    }
    req.flash('success', 'Post Edited Successfully!')
    res.redirect('/listings')
}
//Showing a single list 
module.exports.showList = async (req, res) => {
    let id = req.params.id
    
    //Populating the fields with actual data which earlier stored only their object ids , also populated the author for each review using nested populate
    let obj = await List.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner')
    //If a listing doesnt exist alone while accessing , flash a message
    if (!obj) {
        req.flash('error', 'Error ! Listing You are accessing is not available😭😭')
        res.redirect('/listings')
    } else {

        res.render('./listings/alone.ejs', { obj })
    }
}
//Deleting a list from db
module.exports.deleteList = async (req, res) => {
    let id = req.params.id
    await List.findByIdAndDelete(id)
    console.log('Post deleted Successfully!!')
    req.flash('listDlt', 'Listing Deleted Successfully')
    res.redirect('/listings')
}