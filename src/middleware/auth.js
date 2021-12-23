const User = require('../models/user')
const jwt  = require('jsonwebtoken')



const auth = async (req, res, next) => {

    try {

        const token     = req.header('Authorization').replace('Bearer ', '')
        const decoded   = jwt.verify(token, 'thisismysecrete')
        const user      = await User.findOne({ _id: decoded._id, 'tokensArray.token': token })
        

        if (!user) {
            throw new Error()
        }

        req.tokenInfo = token
        req.userInfo  = user
        next()

    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth