const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    movieName: String,
    username: String,
    date: String,
    comment: String,
    rating: Number
})

module.exports = mongoose.model('Review', ReviewSchema)