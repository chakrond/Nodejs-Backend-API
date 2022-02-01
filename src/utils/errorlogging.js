const Errorlog = require('../models/errorlog')

const Errorlogging = async (req, res) => {

    const milnow = new Date(Date.now() + (7 * 60 * 60 * 1000))
    const Datestring = milnow.getFullYear() + '-' + ('0' + (milnow.getMonth() + 1)).slice(-2) + '-' + ('0' + milnow.getDate()).slice(-2)
    const LData = await Errorlog.findOne({ logDate: Datestring, owner: req.userInfo._id })

    if (LData) {

        LData.logInfo = await LData.logInfo.concat({
            logTime: Date.now(),
            ResHeader: JSON.stringify(res._header),
            ReqHeader: JSON.stringify(req.headers),
            ReqBody: JSON.stringify(req.body)
        })

        await LData.save()

    } else {

        const log = new Errorlog({
            logDate: Datestring,
            owner: req.userInfo._id
        })

        log.logInfo = await log.logInfo.concat({
            logTime: Date.now(),
            ResHeader: JSON.stringify(res._header),
            ReqHeader: JSON.stringify(req.headers),
            ReqBody: JSON.stringify(req.body)
        })

        await log.save()
    }
}

module.exports = Errorlogging
