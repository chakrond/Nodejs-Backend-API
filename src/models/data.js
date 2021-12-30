const mongoose = require('mongoose')


const dataSchema = new mongoose.Schema({

    recDate: {
        type: Date,
        required: true,
        trim: true
    },
    dataArray: [{
        recTime: {
            type: Date,
            required: true,
            trim: true
        },
        Humidity: {
            type: Number,
            required: true,
            trim: true
        },
        Temperature: {
            type: Number,
            required: true,
            trim: true
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users' // Create reference to 'users' schema
    }
}, {
    timestamps: true
})


// Data
// dataSchema.methods.storeDataArray = async function (recTime, Humidity, Temperature) {

//     const data = this
//     data.dataArray = data.dataArray.concat({
//         'recTime': recTime,
//         'Humidity': Humidity,
//         'Temperature': Temperature
//     })
//     await data.save()

//     return data

//     // return token
// }




const Data = mongoose.model('data', dataSchema)

module.exports = Data