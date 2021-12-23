require('./db/mongoose')
const express    = require('express')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')


const app = express()
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


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


