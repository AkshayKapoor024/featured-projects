const express = require('express')
const mongoose = require('mongoose')
const app = express()
const List = require('../models/listing.js')
const initdata = require('./data.js')
let port = 3000

main().then(()=>{
    console.log("Connected to db!")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect('mongodb://localhost:27017/Project1')
}

async function initDB(){
    await List.deleteMany({})
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'682e1ceb142544e1feb97cf4'}))
    initdata.data.forEach(element => {
        let url = element.image
        let filename = 'default'
        element.image ={url,filename}
    });
    console.log("Data entered successfully!!")
    await List.insertMany(initdata.data)
}
initDB()