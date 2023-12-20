const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShiftSchema = new Schema({
    movieId: String,
    time: String,
    selected: String
})

module.exports = mongoose.model('Shift', ShiftSchema)