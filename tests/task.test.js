const request = require('supertest')
const mongoose = require('mongoose')
const { 
    userOne, 
    userTwo, 
    taskOne, 
    taskTwo, 
    taskThree, 
    setupDatabase } = require('./fixtures/db')
const app = require('../src/app')
const Task = require('../src/models/task')



beforeEach(setupDatabase)


test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`) //set header
        .send({
            description: 'Finishing this course'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.complete).toEqual(false)
})


test('Should get tasks for user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`) //set header
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should get tasks for user by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`) //set header
        .send()
        .expect(200)

    expect(response.body._id).toBe(taskOne._id.toString())
})

test('Should not delete tasks for unauthorized user', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`)
        .send()
        .expect(404)

    const taskUsertwo = await Task.findOne({ _id: taskThree._id, owner: userTwo._id })
    expect(taskUsertwo).not.toBeNull()
})