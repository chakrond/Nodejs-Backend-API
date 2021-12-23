const express = require('express')
const Task = require('../models/task')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

//********************************************//
//-----------------Task Method----------------//
//********************************************//

router.post('/tasks', auth, async (req, res) => {

    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.userInfo._id
    })

    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }


    // const task = new Task(req.body)

    // task.save().then(() => {
    //     res.status(201).send(task)

    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

})

router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort  = {}

    if (req.query.complete) {
        match.complete = req.query.complete == 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1 // if (desc) true, then parts[0] == -1 (descending)
    }

    try {

        // Virtual finding task by its owner
        await req.userInfo.populate({

            path: 'userTask',
            match,
            options: {

                limit: parseInt(req.query.limit),
                skip:  parseInt(req.query.skip),
                sort
            }

        })

        res.status(200).send(req.userInfo.userTask)

    } catch (e) {
        res.status(500).send()
    }


    // Task.find({}).then((task) => {
    //     res.status(200).send(task)

    // }).catch((e) => {
    //     res.status(500).send()
    // })

})


router.get('/tasks/:id', auth, async (req, res) => {

    // console.log(req.params)
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.userInfo._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(500).send()
    }

    // console.log(req.params)
    // const _id = req.params.id

    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }

    //     res.send(task)

    // }).catch((e) => {
    //     res.status(500).send()

    // })
})


router.patch('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id
    const prop_req = Object.keys(req.body)
    const allowedUpdates = ['description', 'complete']
    const isValid = prop_req.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "Properties Invalid" })
    }

    try {

        const task = await Task.findOne({ _id, owner: req.userInfo._id })

        if (!task) {
            return res.status(404).send()
        }

        prop_req.forEach((upd) => {

            task[upd] = req.body[upd]
        })

        await task.save()

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }

})


router.delete('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.userInfo._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router