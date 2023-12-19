const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')

const Account = require('../models/account')

Router.post('/login', (req, res) => {
    
    const {username, password} = req.body

    if(username === null || password == null) {
        res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    let account = undefined

    Account.findOne({ username: username })
        .then(acc => {
            if (!acc) {
                return res.json({code: 2, message: 'Tài khoản không tồn tại'}) 
            }
            else {
                account = acc
                bcrypt.compare(password, acc.password)
                .then(passwordMatch => {
                    if (!passwordMatch) {
                        res.json({code: 2, message: 'Sai mật khẩu'}) 
                    }
                    else {
                        res.json({code: 0, message: 'Đăng nhập thành công', data: account}) 
                    }
                })
            }     
        })
        .catch(e => {
            res.json({code: 2, message: 'Đăng nhập thất bại'}) 
    })
})

Router.post('/register', (req, res) => {
    
    const {username, email, password} = req.body

    if(username == null || email == null || password == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    const hashed = bcrypt.hashSync(password, 5)

    let account = new Account({
        username, email, password: hashed
    })

    account.save()
        .then (a => {
            res.json({code: 0, message: 'Đăng ký thành công', data: a})
        })
        .catch(e => {
            if (e.message.includes('username')) {
                res.json({code: 2, message: 'Tên tài khoản đã tồn tại'}) 
            }
            else if (e.message.includes('email')) {
                res.json({code: 2, message: 'Email đã tồn tại'}) 
            }
            else {
                res.json({code: 2, message: 'Đăng ký thất bại: ' + e.message}) 
            }
        })
})

Router.post('/update', (req, res) => {
    
    const {id, username, email, password} = req.body

    if(id == null || username == null || email == null || password == null) {
        return res.json({code: 2, message: 'Thiếu thông tin'}) 
    }

    const hashed = bcrypt.hashSync(password, 5)

    let dataUpdate = {
        username, email, password: hashed
    }

    Account.findByIdAndUpdate(id, dataUpdate, {
        new: true
    })
        .then (a => {
            res.json({code: 0, message: 'Cập nhật thành công', data: a})
        })
        .catch(e => {
            if (e.message.includes('username')) {
                res.json({code: 2, message: 'Tên tài khoản đã tồn tại'}) 
            }
            else if (e.message.includes('email')) {
                res.json({code: 2, message: 'Email đã tồn tại'}) 
            }
            else {
                res.json({code: 2, message: 'Cập nhật thất bại: ' + e.message})
            }
        })

})

module.exports = Router