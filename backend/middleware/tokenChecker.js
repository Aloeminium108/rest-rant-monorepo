const jwt = require('jsonwebtoken')

async function checkToken(req, res, next) {

  const token = req.headers.authorization

  if (token) {
    
    jwt.verify(token, process.env.ACCESS_SECRET, function(err, decoded) {

      if (err) {
        return res.status(401).json({ error: true, message: 'Unauthorized access.' })
      }

      req.decoded = decoded

      next()

    })

  } else {

    return res.status(403).json({ error: true, message: 'No token provided.' })

  }

}

module.exports = checkToken