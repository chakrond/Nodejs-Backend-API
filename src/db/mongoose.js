const mongoose  = require('mongoose')
// const validator = require('validator')



mongoose.connect(process.env.MONGOSE_URI, {

    useNewUrlParser: true,
    // useCreateIndex: true

})
