const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')

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
    req.session.userId = user.userId
    res.status(200).json({ user })
  }

})

router.get('/profile', async (req, res) => {
  try {
    console.log(req.session.userId)
    let user = await User.findOne({
      where: {
        userId: req.session.userId
      }
    })
    res.json(user)
  } catch {
    res.json(null)
  }
})

module.exports = router
