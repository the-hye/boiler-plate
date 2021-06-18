const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
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

app.post('/api/users/register', (req, res) => {
    //회원 가입 필요 정보 client to database

    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        });
    });
});

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일은 db에서 검색
    User.findOne({ email: req.body.emal }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일에 해당하는 user가 없습니다."
            });
        };

        // 이메일이 db에 있다면 비밀번호 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                });
            // 이메일, 비밀번호 맞다면 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400), send(err);

                // 토큰 저장
                res.cookie("x_auth", user.token)
                    .status(200)
                    .join({ loginSuccess: true, userId: user._id })

            });
        });
    });
});

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));