const express = require('express')
const auth = require('../middleware/auth')
const Data = require('../models/data')
const RTData = require('../models/RTdata')
const router = new express.Router()

//********************************************//
//-----------------Data Method----------------//
//********************************************//

router.post('/data', auth, async (req, res) => {

    const VData = await Data.findOne({ recDate: req.body.recDate, owner: req.userInfo._id })
    // console.log("Finding" + VData.dataArray)
    try {

        if (VData) {
            VData.dataArray = await VData.dataArray.concat({
                'recTime': req.body.dataArray[0].recTime,
                'Humidity': req.body.dataArray[0].Humidity,
                'Temperature': req.body.dataArray[0].Temperature
            })
            await VData.save()
            return res.status(201).send(VData)
        }

        const data = new Data({
            ...req.body,
            owner: req.userInfo._id
        })

        await data.save()
        res.status(201).send(data)

    } catch (e) {
        res.status(400).send(e)
    }

})


router.patch('/data/real', auth, async (req, res) => {

    try {

        const VData = await RTData.findOneAndUpdate({ owner: req.userInfo._id },
            {
                recTime: req.body.recTime,
                Humidity: req.body.Humidity,
                Temperature: req.body.Temperature

            }, {
            new: true
        })

        if (!VData) {
            const data = new RTData({
                ...req.body,
                owner: req.userInfo._id
            })
            await data.save()
            res.send(data)
        }

        await VData.save()
        // console.log("Finding: " + VData)
        return res.status(201).send(VData)


    } catch (e) {
        res.status(400).send(e)
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

            const data = await Data.find({ recDate: new Date(req.query.by) })

            if (!data) {
                return res.status(404).send()
            }

            res.status(200).send(data)
        }

        if (req.query.range) {

            const parts = req.query.range.split(':')

            const data = await Data.find({ recDate: { $gte: new Date(parts[0]), $lte: new Date(parts[1]) } })

            if (!data) {
                return res.status(404).send()
            }

            res.status(200).send(data)
        }

        if (req.query.month) {

            const parts = req.query.month

            const data = await Data.find({ recDate: { $gte: new Date(parts + '-01'), $lte: new Date(parts + '-31') } })

            if (!data) {
                return res.status(404).send()
            }

            res.status(200).send(data)
        }

        if (req.query.year) {

            const parts = req.query.year

            const data = await Data.find({ recDate: { $gte: new Date(parts + '-01-01'), $lte: new Date(parts + '-12-31') } })

            if (!data) {
                return res.status(404).send()
            }

            res.status(200).send(data)
        }

    } catch (e) {
        res.status(500).send()
    }
})


router.get('/data/real', auth, async (req, res) => {

    try {

        const VData = await RTData.find({ owner: req.userInfo._id })

        if (!VData) {
            throw new Error()
        }

        return res.status(200).send(VData)

    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router