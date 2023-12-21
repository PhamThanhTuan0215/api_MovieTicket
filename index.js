const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

require('dotenv').config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/movies', require('./routers/movie'))

app.use('/accounts', require('./routers/account'))

app.use('/orders', require('./routers/order'))

app.use((req, res) => {
    res.json({
        code: 1,
        message: `Method ${req.method} not supported with URL ${req.url}`
    })
})

const PORT = process.env.PORT || 3000
const LINK_WEB = process.env.LINK_WEB || 'http://localhost:' + PORT
const {MONGODB_URI, DB_NAME} = process.env
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME
})
.then(() => {
    app.listen(PORT, () => {
        console.log(LINK_WEB)
    })
})
.catch(e => console.log('Can not connect db server: ' + e.message))