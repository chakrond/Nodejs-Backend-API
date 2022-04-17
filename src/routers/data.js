const express = require('express')
const auth = require('../middleware/auth')
const Data = require('../models/data')
const RTData = require('../models/RTdata')
const router = new express.Router()
const Errorlogging = require('../utils/errorlogging')

//********************************************//
//-----------------Data Method----------------//
//********************************************//

router.post('/data', auth, async (req, res) => {

    try {

        const VData = await Data.findOne({ recDate: req.body.recDate, owner: req.userInfo._id })
        
        if (VData) {
            VData.dataArray = await VData.dataArray.concat({
                recTime: new Date(Date.now() + (7*60*60*1000)),
                ...req.body.dataArray[0]
                // 'recTime': req.body.dataArray[0].recTime,
                // 'Humidity': req.body.dataArray[0].Humidity,
                // 'Temperature': req.body.dataArray[0].Temperature
            })
            await VData.save()
            return res.status(201).send()
        }

        const data = new Data({
            ...req.body,
            owner: req.userInfo._id
        })

        await data.save()
        res.status(201).send() // for speedup loop in Arduino send only status

    } catch (e) {
        Errorlogging(req, res)
        res.status(400).send(e)
    }

})


router.patch('/data/real', auth, async (req, res) => {

    try {

        const VData = await RTData.findOneAndUpdate({ owner: req.userInfo._id, userAgent: req.userAgent },
            {
                recTime: new Date(Date.now() + (7*60*60*1000)),
                ...req.body

            }, {
            new: true
        })

        if (!VData) {
            const data = new RTData({
                ...req.body,
                owner: req.userInfo._id,
                userAgent: req.userAgent
            })
            await data.save()
            res.status(201).send()
        }

        await VData.save()
        // console.log("Finding: " + VData)
        return res.status(201).send() //.send(VData) for speedup loop in Arduino send only status


    } catch (e) {
        res.status(400).send()
    }

})


router.get('/data', auth, async (req, res) => {

    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1 // if (desc) true, then parts[0] == -1 (descending)
    }

    try {

        // Virtual finding task by its owner
        await req.userInfo.populate({

            path: 'userData',
            options: {

                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }

        })

        res.status(200).send(req.userInfo.userData)

    } catch (e) {
        res.status(500).send()
    }
})


router.get('/data/date', auth, async (req, res) => {

    try {

        if (req.query.by) {

            const data = await Data.find({ recDate: new Date(req.query.by), owner: req.userInfo._id })

            if (!data) {
                return res.status(404).send()
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            res.status(200).send(obj)
        }

        if (req.query.range) {

            const parts = req.query.range.split(':')

            const data = await Data.find({ recDate: { $gte: new Date(parts[0]), $lte: new Date(parts[1]) }, owner: req.userInfo._id })

            if (!data) {
                return res.status(404).send()
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            res.status(200).send(obj)
        }

        if (req.query.month) {

            const parts = req.query.month

            const data = await Data.find({ recDate: { $gte: new Date(parts + '-01'), $lte: new Date(parts + '-31') }, owner: req.userInfo._id })

            if (!data) {
                return res.status(404).send()
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            res.status(200).send(obj)
        }

        if (req.query.year) {

            const parts = req.query.year

            const data = await Data.find({ recDate: { $gte: new Date(parts + '-01-01'), $lte: new Date(parts + '-12-31') }, owner: req.userInfo._id })

            if (!data) {
                return res.status(404).send()
            }

            // Map data
            const example = data[0].dataArray[0]
            const datajson = JSON.parse(JSON.stringify(example))
            delete datajson._id
            const keyNames = Object.keys(datajson)

            // Create nested array
            const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));
            const obj = {}

            for (let i = 0; i < keyNames.length; i++) {

                data.flatMap((a) => {
                    return a.dataArray.map((b) => {
                        return combArray[i].push(b[keyNames[i]])
                    })
                })

                Object.assign(obj, { [keyNames[i]]: combArray[i] })
            }

            res.status(200).send(obj)
        }

    } catch (e) {
        res.status(500).send(e)
    }
})


router.get('/data/real', auth, async (req, res) => {

    try {

        const VData = await RTData.findOne({ owner: req.userInfo._id })

        if (!VData) {
            throw new Error()
        }

        // console.log(VData)
        return res.status(200).send(VData)

    } catch (e) {
        res.status(404).send(e)
    }
})

router.get('/data/errorlog', async (req, res) => {

    if (req.query.email && req.query.password) {

        res.redirect('/users/login')

    }
})


module.exports = router