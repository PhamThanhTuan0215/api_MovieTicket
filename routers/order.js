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

    let order = new Order({
        username, movieId, movieName, date, shift, cinema, quantity, selected, method, totalPrice
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

module.exports = Router