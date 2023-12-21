const express = require('express')
const Router = express.Router()

const Movie = require('../models/movie')
const Shift = require('../models/shift')
const Review = require('../models/review')

Router.get('/', (req, res) => {

    Movie.find()
        .then(movies => {
            res.json({code: 0, message: 'Lấy tất cả movie thành công', data: movies})
        })
        .catch(e => {
            res.json({code: 2, message: 'Lấy tất cả movie thất bại: ' + e.message})
        })
})

Router.post('/shifts', (req, res) => {

    const {movieId} = req.body

    if(movieId == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    Shift.find({movieId: movieId})
        .then(shifts => {
            res.json({code: 0, message: 'Lấy tất cả suất chiếu thành công', data: shifts})
        })
        .catch(e => {
            res.json({code: 2, message: 'Lấy tất cả suất chiếu thất bại: ' + e.message})
        })
})

Router.post('/reviews/add', (req, res) => {

    const {movieName, username, comment, rating} = req.body

    if(movieName == null || username == null || comment  == null || rating == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    let date = new Date()
    date = formatDateString(date.toLocaleDateString())

    let review = new Review({
        movieName, username, date, comment, rating
    })
    review.save()
        .then(r => {
            res.json({code: 0, message: 'Đánh giá thành công', data: r}) 
        })
        .catch(e => {
            res.json({code: 2, message: 'Đánh giá thất bại'}) 
        })

})

Router.post('/reviews', (req, res) => {

    const {movieName, username} = req.body

    if(movieName == null || username == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    Review.find({movieName: movieName}).sort({ date: 'desc'})
        .then(reviews => {
            res.json({code: 0, message: 'Lấy tất cả đánh giá thành công', data: reviews})
        })
        .catch(e => {
            res.json({code: 2, message: 'Lấy tất cả đánh giá thất bại: ' + e.message})
        })

})

Router.post('/add', (req, res) => {
    
    const {name, category, actor, date, description, price, url_avatar, url_trailer} = req.body

    if(name == null || category == null || actor  == null || date  == null || 
        description  == null || price  == null || url_avatar  == null || url_trailer  == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
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

function formatDateString(inputDateString) {
    let dateObject = new Date(inputDateString);

    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear();

    //"MM/DD/YYYY"
    let formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

    return formattedDate;
}

module.exports = Router