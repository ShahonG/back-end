const Mongo = require('mongoose');
const schema = Mongo.Schema;

const userSchema = new schema({
    account: String,
    password: String,
    googleID: String,
    fileList: [{
        tags : [],
        id: { type: String },
        auth: { type: String },
    }],
});

const logSchema = new schema({
    time: String,
    content: String,
    type: String
});

const user = Mongo.model('users', userSchema);
const log  = Mongo.model('log', logSchema);

const collection = {
    user : user,
    log  : log,
}
module.exports = collection;