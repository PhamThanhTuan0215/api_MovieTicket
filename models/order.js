const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    creation_date: String,
    username: String,
    movieId: String,
    movieName: String,
    date: String,
    shift: String,
    cinema: String,
    quantity: Number,
    selected: String,
    method: String,
    totalPrice: Number
})

module.exports = mongoose.model('Order', OrderSchema)