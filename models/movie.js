const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    name: { type: String, unique: true },
    category: String,
    actor: String,
    date: String,
    description: String,
    price: Number,
    url_avatar: String,
    url_trailer: String
})

module.exports = mongoose.model('Movie', MovieSchema)