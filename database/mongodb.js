const Mongo = require('mongoose');
const schema = Mongo.Schema;

const userSchema = new schema({
    account: String,
    password: String
});

const logSchema = new schema({
    time: String,
    content: String,
    type: String
});

/*
const fileSchema = new schema({

});
*/

const user = Mongo.model('users', userSchema);
const log  = Mongo.model('log', logSchema);
//const file = mongo.model('file', fileSchema);

const collection = {
    user : user,
    log  : log,
    // file : file
}
module.exports = collection;