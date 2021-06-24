const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;

const { User } = require('./models/User');
const config = require('./config/key');

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(express.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected !!!'))
  .catch((err) => console.error(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', (req, res) => {
  // 회원 가입 할때 필요한 정보들을 Cilent에서 가져오면
  // 데이터베이스에 넣어준다.
  const user = new User(req.body);

  // 몽고DB method
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`My app listening at http://localhost:${port}`);
});
