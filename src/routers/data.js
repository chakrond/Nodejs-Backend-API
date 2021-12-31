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
            res.status(201).send(data)
        }

        await VData.save()
        // console.log("Finding: " + VData)
        return res.status(201).send(VData)
        

    } catch (e) {
        res.status(400).send(e)
    }

})




module.exports = router