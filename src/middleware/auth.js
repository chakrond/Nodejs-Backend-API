const User = require('../models/user')
const jwt = require('jsonwebtoken')



const auth = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const reqAgent = req.header('User-Agent')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokensArray.token.key': token, 'tokensArray.token.userAgent': reqAgent })
        // _id: decoded._id is user object _id

        if (!user) {
            throw new Error()
        }

        req.userAgent = reqAgent 
        req.tokenInfo = token
        req.userInfo = user
        next()

    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth