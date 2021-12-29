const request = require('supertest')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')


beforeEach(setupDatabase)

// afterEach( () => {
//     console.log('after Each')
// })

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Chakron',
            email: 'godloofgf@gm.com',
            password: 'cdfad11dffj'
        }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Chakron',
            email: 'godloofgf@gm.com',
        },
        token: user.tokensArray[0].token
    })
    // Expect not to be a plain password
    expect(user.password).not.toBe('cdfad11dffj')
})

test('Should login existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        }).expect(200)
})

test('Should second token is saved in the exisiting user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        }).expect(200)

    // // Assert that the database was changed correctly
    const user = await User.findById(userOneId)

    // // Assertions about the response
    expect(response.body.token).toBe(user.tokensArray[1].token)

})

test('Should not login nonexisting user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'nonexistinguser@gm.com',
            password: 'nonexistinguser'
        }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`) //set header
        .send()
        .expect(200)
})

test('Should not get user profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`) //set header
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`)
        .attach('avatar', 'tests/fixtures/coyote.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) // Object use to Equal, expect.any(...)
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`)
        .send({
            name: 'Tony Stark',
            email: 'tonoy@gm.com'
        })
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Tony Stark')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokensArray[0].token}`)
        .send({
            Sex: 'male',
            Phone: '045176123453'
        })
        .expect(400)
})


