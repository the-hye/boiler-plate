const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const config = require('./config/key');

const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World! 안녕하세요'))

app.post('/register', (req, res) => {
    //회원 가입 필요 정보 client to database

    const user = new User(req.body)
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))