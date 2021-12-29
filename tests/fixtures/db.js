const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

// Create&Save user in the database
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Donkey',
    email: 'Donkey12efas@gm.com',
    password: 'Donkeydfsa11fj',
    tokensArray: [{
        token: jwt.sign({ _id: userOneId.toString() }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Mikey',
    email: 'Mikey@gm.com',
    password: 'Mikeydfsa11fj',
    tokensArray: [{
        token: jwt.sign({ _id: userTwoId.toString() }, process.env.JWT_SECRET)
    }]
}


// Create&Save task in the database
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First: Going to AfterYou",
    complete: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second: To be great",
    complete: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Thrid: Being creative",
    complete: false,
    owner: userTwo._id
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
    
}

module.exports = ({
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
})