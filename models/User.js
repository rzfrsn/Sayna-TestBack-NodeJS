const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        min: 2
    },
    lastname: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        min: '1900-01-01',
        max: '2021-11-27',
        required: true 
    },
    gender: {
        type: String,
        required: true,
        max: 1
    },
    email: {
        type: String,
        required: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
  
});

module.exports = mongoose.model('User', userSchema);
