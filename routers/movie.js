const express = require('express')
const Router = express.Router()

const Movie = require('../models/movie')

Router.get('/', (req, res) => {

    Movie.find()
        .then(movies => {
            res.json({code: 0, message: 'Lấy tất cả movie thành công', data: movies})
        })
        .catch(e => {
            res.json({code: 2, message: 'Lấy tất cả movie thất bại: ' + e.message})
        })
})

Router.post('/add', (req, res) => {
    
    const {name, category, actor, date, description, price, url_avatar, url_trailer} = req.body

    if(name == null || category == null || actor  == null || date  == null || 
        description  == null || price  == null || url_avatar  == null || url_trailer  == null) {
            res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    let movie = new Movie({
        name, category, actor, date, description, price, url_avatar, url_trailer
    })

    movie.save()
        .then (m => {
            res.json({code: 0, message: 'Thêm thành công', data: m}) 
        })
        .catch(e => {
            res.json({code: 0, message: 'Thêm thất bại: ' + e.message}) 
        })
})

module.exports = Router