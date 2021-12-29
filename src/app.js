require('./db/mongoose')
const express = require('express')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')


const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


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


module.exports = app