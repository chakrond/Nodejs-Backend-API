require('../src/db/mongoose')
const Task = require('../src/models/task')


// Task.findByIdAndDelete('61b5ec70cc63a451348dfd83', { description: 'Learning Java' }).then((task) => {
//     console.log(task)

//     return Task.countDocuments({complete: false} )

// }).then((e) => {
//     console.log(e)
// })


const deleteTaskAndCount = async (id, task) => {
    const ftask = await Task.findByIdAndDelete(id, { description: task })
    const count = await Task.countDocuments({ complete: false })
    return count
}

deleteTaskAndCount('61b5f0ee3e883f5355f0228b', 'Playing game').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})