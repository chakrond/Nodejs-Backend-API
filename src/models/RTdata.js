const mongoose = require('mongoose')
const converTime = require('../utils/convertTime')


const RTdataSchema = new mongoose.Schema({

    // Option 1
    recTime: { // // use defalut in model record will create only once, no update
        type: Date,
        trim: true
    },
    Humidity: {
        type: Number,
        trim: true
    },
    Temperature: {
        type: Number,
        trim: true,
        set: n => n.toFixed(1)
    },
    
    // Option 2
    SHT20Humid: {
        type: Number,
        trim: true
    },
    SHT20Temp: {
        type: Number,
        trim: true,
        set: n => n.toFixed(1)
    },
    ds18b20Temp: {
        type: Number,
        trim: true,
        set: n => n.toFixed(1)
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users' // Create reference to 'users' schema
    },
    userAgent: {
        type: String,
        require: true,
        ref: 'users' // Create reference to 'RTdata' schema
    }
}, {
    timestamps: true
})


const RTData = mongoose.model('RTdata', RTdataSchema)

module.exports = RTData