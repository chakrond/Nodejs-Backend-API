const Data = require('../src/models/data')




storeDataArray = async function () {

    const data = await Data.findOne({ recDate: "2021-12-30"})
    data.dataArray = data.dataArray.concat({ recTime, Humidity, Temperature })
    // await data.save()

    return data

    // return token
}

// const data = Data.findOne({ recDate: "2021-12-29" })
// console.log(data)

