const app = require('./app')


const port = process.env.PORT

// Disable HTTP Methods
// app.use((req, res, next) => {

//     const methodArray = ['GET', 'POST', 'DELETE', 'PATCH']
//     const isValid = methodArray.includes(req.method)

//     if (isValid) {

//         res.status(503).send('Method are disabled, site is currently down. Check back soon!')

//     } else {
//         next()
//     }

// })

// const User = require('./models/user')
// const jwt = require('jsonwebtoken')
// const test = async () => {

//     try {
//         const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWQyYTM0ZDZlYWQ4Y2I3ZDBmMWRhYTUiLCJpYXQiOjE2NDExOTQzMTd9.Q5rbxuVGiBiWU7hsAGb2S2FtA1xCVnOy35tU88bBAE4"
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findOne({ _id: decoded._id, 'tokensArray.token.key': token, 'tokensArray.token.userAgent': 'PostmanRuntime/7.28.4' })
//         console.log(decoded._id)

//     } catch (e) {
//         console.log(e)
//     }
// }

// test()




app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


