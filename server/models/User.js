const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const config = require('../config/key');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    //토큰 유효기간
    type: Number,
  },
});

// 비밀번호를 암호화
userSchema.pre('save', function (next) {
  var user = this;

  // 유저정보를 수정할때(아이디,이메일 등)도 save메소드를 사용하면서
  // 패스워드 암호화가 일어나지 않도록 패스워드를 수정할때만 이라는 조건을 넣는다.
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Login
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword = 1234567 , 암호화된 비빌번호
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

// Json Web Token
userSchema.methods.generateToken = function (cb) {
  var user = this;
  console.log('user', user);
  console.log('userSchema', userSchema);
  var token = jwt.sign(user._id.toHexString(), config.bcryptWord);

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// 토큰 복호화(암호해제)
userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, config.bcryptWord, function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음
    // 클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이
    // 일치하는지 확인한다.
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
