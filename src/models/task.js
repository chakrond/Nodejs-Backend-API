const mongoose = require('mongoose')
// const validator = require('validator')
// const bcrypt = require('bcryptjs')


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true

    },
    complete: {
        type: Boolean,
        default: false

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users' // Create reference to 'users' schema
    }
}, {
    timestamps: true
})


const Task = mongoose.model('tasks', taskSchema)

module.exports = Task