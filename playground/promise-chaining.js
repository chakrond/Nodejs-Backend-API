require('../src/db/mongoose')
const User = require('../src/models/user')

// 61b5ed37a0dfdb67cefbd9bd

// User.findByIdAndUpdate('61b5ed37a0dfdb67cefbd9bd', { age: 21}).then((user) => {
//     console.log(user)

//     return User.countDocuments( {age:21} )

// }).then((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user  = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('61b5ed37a0dfdb67cefbd9bd', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})