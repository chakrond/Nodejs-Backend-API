const express   = require('express')
const multer    = require('multer')
const sharp     = require('sharp')
const User      = require('../models/user')
const auth      = require('../middleware/auth')
const router    = new express.Router()
const { sendWelcEmail, sendCancleEmail } = require('../emails/account')

//********************************************************//
//-----------------User Account Management----------------//
//********************************************************//

router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {

        await user.save()
        sendWelcEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({ msg: 'Login successfully', user, token })

    } catch (e) {
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)

    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

})

router.post('/users/login', async (req, res) => {

    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({ user, token })

    } catch (e) {
        res.status(400).send()
    }


})


router.post('/users/logout', auth, async (req, res) => {

    try {

        req.userInfo.tokensArray = req.userInfo.tokensArray.filter((t) => {
            return t.token !== req.tokenInfo
        })

        await req.userInfo.save()

        res.send()

    } catch (e) {
        res.status(500).send()
    }

})


router.post('/users/logoutAll', auth, async (req, res) => {

    try {

        req.userInfo.tokensArray = []

        await req.userInfo.save()

        res.send()

    } catch (e) {
        res.status(500).send()
    }

})



router.get('/users/me', auth, async (req, res) => {

    res.send(req.userInfo)
    // User.find({}).then((users) => {
    //     res.status(200).send(users)

    // }).catch((e) => {
    //     res.status(500).send()
    // })

})

// router.get('/users/:id', async (req, res) => {

//     // console.log(req.params)
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)

//     } catch (e) {
//         res.status(500).send()
//     }


//     // console.log(req.params)
//     // const _id = req.params.id

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)

//     // }).catch((e) => {
//     //     res.status(500).send()

//     // })
// })

router.patch('/users/me', auth, async (req, res) => {


    const prop_req = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValid = prop_req.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "Properties Invalid" })
    }
    // for (let i = 0; i < prop_req.length; i++) {

    //     var checkProp = prop_req[i] in req.userInfo
    //     if (checkProp == false) {
    //         return res.status(400).send({ error: "Properties Invalid" })
    //     }
    // }

    try {

        prop_req.forEach((updt) => req.userInfo[updt] = req.body[updt])
        await req.userInfo.save()
        res.send(req.userInfo)

    } catch (e) {
        res.status(400).send(e)
    }


})

router.delete('/users/me', auth, async (req, res) => {

    try {

        // const user = await User.findByIdAndDelete(req.userInfo._id)

        // if (!user) {
        //     return res.status(404).send()
        // }
        sendCancleEmail(req.userInfo.email, req.userInfo.name)
        await req.userInfo.remove()
        res.send(req.userInfo)

    } catch (e) {
        res.status(400).send(e)
    }

})


//********************************************************//
//-----------------User File Management----------------//
//********************************************************//

// Upload file router
const upload = multer({
    // dest: 'avatars', // file destination
    limits: {
        fileSize: 1000000 // file in bytes
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // useing regular expression
            return cb(new Error('does not support this file')) // Error message
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()

    req.userInfo.avatar = buffer
    await req.userInfo.save()
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({ Error: error.message }) // Error message ('Please upload Image File')
})


router.delete('/users/me/avatar', auth, async (req, res) => {

    try {

        req.userInfo.avatar = undefined
        await req.userInfo.save()
        res.send(req.userInfo)

    } catch (e) {
        res.status(400).send(e)
    }

})


router.get('/users/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }


})


// Export module
module.exports = router