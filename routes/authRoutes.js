const express = require('express')
const passport = require('passport')
const authController = require('../controllers/authController')
const router = express.Router()
const {notAuthenticated} = require('../middlewares/authMiddleware')

router.get('/login', notAuthenticated, (req, res) => {
  res.render('pages/login')
})

router.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))


router.get('/signup', notAuthenticated, (req, res) => {
  res.render('pages/signup')
})

router.post('/signup', authController.registerUser)

router.get('/logout', (req, res) => {
  req.logout(err => {
    if(err) console.log(err)
      res.redirect('/login')
  })
})

module.exports = router