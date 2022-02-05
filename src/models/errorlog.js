const mongoose = require('mongoose')
const converTime = require('../utils/convertTime')

const ErrorlogSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users' // Create reference to 'users' schema
    },
    logDate: {
        type: String,
        default: converTime(7)
    }, 
    logInfo: [{
        logTime: {
            type: Date,
            default: new Date(Date.now() + (7*60*60*1000))
        },
        ResHeader: {
            type: String,
            required: true,
        },
        ReqHeader: {
            type: String,
            required: true,
        },
        ReqBody: {
            type: String,
            required: true,
        }
    }],
    expireAt: {
        type: Date,
        default: new Date(Date.now() + (7*24*60*60*1000)),
        expires: '7d' //index: { expires: 20 }
    },
}, { timestamps: true })


const Errorlog = mongoose.model('errorlog', ErrorlogSchema)

module.exports = Errorlog