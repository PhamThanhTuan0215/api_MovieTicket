const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
})

module.exports = mongoose.model('Account', AccountSchema)