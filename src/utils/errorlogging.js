const Errorlog = require('../models/errorlog')
const converTime = require('../utils/convertTime')

const Errorlogging = async (req, res) => {

    try {

        const Datestring = converTime(7) // this format 2022-02-07
        const LData = await Errorlog.findOne({ logDate: Datestring, owner: req.userInfo._id })

        if (LData) {

            LData.logInfo = await LData.logInfo.concat({
                ResHeader: JSON.stringify(res._header),
                ReqHeader: JSON.stringify(req.headers),
                ReqBody: JSON.stringify(req.body)
            })

            await LData.save()

        } else {

            const log = new Errorlog({
                owner: req.userInfo._id
            })

            log.logInfo = await log.logInfo.concat({
                ResHeader: JSON.stringify(res._header),
                ReqHeader: JSON.stringify(req.headers),
                ReqBody: JSON.stringify(req.body)
            })

            await log.save()
        }
    } catch (e) {
        
    }
}

module.exports = Errorlogging
