const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const Task      = require('../models/task')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email invalid')
            }
        }
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },

    password: {
        type: String,
        trim: true,
        minlength: 7,
        validate(value) {
            // if (!validator.isLength(value[6 ])) {
            //     throw new Error('Must be at least 6 characters')
            if (value.toLowerCase().includes("password")) {
                throw new Error('Cant include "password" ')
            }
        }
    },

    tokensArray: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }   
}, {
    timestamps: true
})

// Token
userSchema.methods.generateAuthToken = async function () {

    const user       = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokensArray = user.tokensArray.concat( {token} )
    await user.save()
   
    return token
}

// Login
userSchema.statics.findByCredentials = async (email, password) => {

    // console.log('Running findByCredentials')
    const user = await User.findOne({ email })
    // console.log(user)

    if (!user) {
        throw new Error('Unable to login')
    }


    const isPWmatch = await bcrypt.compare(password, user.password)

    if (!isPWmatch) {
        throw new Error('Unable to login')
    }

    return user

}


// Virtual Task in User model
userSchema.virtual('userTask', {
    ref: 'tasks', // refer to Schema "tasks"
    localField:'_id',
    foreignField: 'owner'
})



// Cnntrol sending response
userSchema.methods.toJSON = function () {

    const user       = this
    const userObject = user.toObject()

    const list       = ['password', 'tokensArray', 'avatar']
    list.forEach( (e) => { delete userObject[e] })
    
    return userObject
}



// Hash the plain password before saving
userSchema.pre('save', async function (next) {
    const user = this

    // console.log(this)
    // console.log('userSchema.pre: Before save')
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {

    const user = this

    await Task.deleteMany({owner: user._id})
    next()

})


const User = mongoose.model('users', userSchema) // Schema name is users


module.exports = User