const bcrypt = require('bcrypt')
const db = require('../models')

const saltRounds = 10

const { User } = db

const userController = {
  register: (req, res) => {
    res.render('user/register')
  },
  handleRegister: (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      req.flash('errorMessage', '錯誤：請輸入資料')
      return next()
    }
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        req.flash('errorMessage', err.toString())
        return next()
      }
      try {
        const user = await User.create({
          username,
          password: hash
        })
          req.session.username = user.username
          res.redirect('/')
      } catch (err) {
        req.flash('errorMessage', err.toString())
        return next()
      }
    })
  },
  login: (req, res) => {
    res.render('user/login')
  },
  handleLogin: async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      req.flash('errorMessage', '錯誤：請輸入資料')
      return next()
    }
    try {
      const user = await User.findOne({
        where: {
          username
        }
      })
      if (!user) {
        req.flash('errorMessage', '錯誤：使用者不存在')
      }
      bcrypt.compare(password, user.password, (err, isSuccess) => {
        if (err || !isSuccess) {
          req.flash('errorMessage', '錯誤：使用者或密碼輸入錯誤')
          return next()
        }
        req.session.username = user.username
        res.redirect('/')
      })
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return next()
    }
  },
  handleLogout: (req, res) => {
    req.session.username = null
    res.redirect('/')
  }
}

module.exports = userController
