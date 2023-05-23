const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const checkToken = require('../middleware/tokenChecker')
const jwt = require('jsonwebtoken')

const { User } = db

router.post('/', async (req, res) => {

  const user = await User.findOne({
    where: { email: req.body.email }
  })

  if (!user || !await bcrypt.compare(req.body.password, user.password_digest)) {
    res.status(401).json({ 
      message: "Incorrect email or password"
    }) 
  } else {
    const token = jwt.sign({ user }, process.env.ACCESS_SECRET, { expiresIn: 900 })
    res.status(200).json({ user, token })
  }

})

router.get('/profile', checkToken, async (req, res) => {
  try {

    let user = await User.findOne({
      where: {
        userId: req.decoded.user.userId
      }
    })

    res.json(user)

  } catch {
    res.json(null)
  }
})

module.exports = router
