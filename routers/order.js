const express = require('express')
const Router = express.Router()

const Order = require('../models/order')
const Account = require('../models/account')
const Shift = require('../models/shift')

Router.post('/add', (req, res) => {
    
    const {username, movieId, movieName, date, shift, cinema, quantity, selected, method, totalPrice, coin} = req.body

    if(username == null || movieId == null || movieName == null || date == null || shift == null || cinema == null 
        || quantity == null || selected == null || method == null || totalPrice == null || coin == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    let creation_date = new Date()
    creation_date = formatDateString(creation_date.toLocaleDateString())

    let order = new Order({
        creation_date, username, movieId, movieName, date, shift, cinema, quantity, selected, method, totalPrice
    })

    order.save()
        .then (o => {
            Account.findOne({username: username})
            .then(a => {
                if(coin === 'true') {
                    a.coin = a.coin - 100
                }
                let totalPriceNumber = parseFloat(totalPrice)
                let bonusCoin = 0
                while(totalPriceNumber >= 100000) {
                    totalPriceNumber = totalPriceNumber - 100000
                    bonusCoin = bonusCoin + 10
                }
                a.coin = a.coin + bonusCoin
                a.save()
            })
            .catch(e => {})

            Shift.findOne({
                movieId: movieId,
                time: shift
            })
                .then(s => {
                    s.selected = s.selected + ',' + selected
                    s.save()
                })
                .catch(e => {})

            res.json({code: 0, message: 'Thanh toán thành công', data: o})
        })
        .catch(e => {
            res.json({code: 2, message: 'Tạo hóa đơn thất bại: ' + e.message})
        })
})

Router.post('/', (req, res) => {
    
    const {username} = req.body

    if(username == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    Order.find({username: username}).sort({ creation_date: 'desc' })
        .then(orders => {
            res.json({code: 0, message: 'Lấy tất cả hóa đơn thành công', data: orders})
        })
        .catch(e => {
            res.json({code: 2, message: 'Lấy tất cả hóa đơn thất bại: ' + e.message})
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