// for mongoose schemas and models
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String
});

const usersModel = mongoose.model('w1user', usersSchema)

module.exports = usersModel;