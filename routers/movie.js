const express = require('express')
const Router = express.Router()

const Movie = require('../models/movie')

Router.get('/', (req, res) => {

    Movie.find()
    .then(movies => {
        res.json({code: 0, message: 'Get all movies success', data: movies})
    })
})

Router.post('/', (req, res) => {
    
    const {name, category, actor, date, description, price, url_avatar, url_trailer} = req.body

    if(name === null || category === null || actor  === null || date  === null || 
        description  === null || price  === null || url_avatar  === null || url_trailer  === null) {
            res.json({code: 2, message: 'Lack of information'}) 
    }

    let movie = new Movie({
        name, category, actor, date, description, price, url_avatar, url_trailer
    })

    movie.save()
    .then (m => {
        res.json({code: 0, message: 'Add movie successs', data: m}) 
    })
})

module.exports = Router