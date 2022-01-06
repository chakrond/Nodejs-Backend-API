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

// const Data = require('./models/data')

// const test = async () => {

//     const req = '2022-01-01:2022-01-02'

//     try {
//         const parts = req.split(':')

//         const data = await Data.find({ recDate: { $gte: new Date(parts[0]), $lte: new Date(parts[1]) } })

//         if (!data) {
//             return console.log('Not Found')
//         }

//         // Map data
//         const example = data[0].dataArray[0]
//         const datajson = JSON.parse(JSON.stringify(example))
//         delete datajson._id
//         const keyNames = Object.keys(datajson)

//         // Create nested array
//         const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));

//         for (let i = 0; i < keyNames.length; i++) {

//             data.flatMap((a) => {
//                 return a.dataArray.map((b) => {
//                     return combArray[i].push(b[keyNames[i]])
//                 })
//             })
//         }

//         // splice insert keynames at index 0
//         combArray.splice(0, 0, keyNames)

//         console.log(combArray)

//     } catch (e) {
//         console.log(e)
//     }
// }

// test()




app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


