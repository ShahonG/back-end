const MongoCli = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/";
    
function DBconnect(dbName){
    return MongoCli.connect(url).then(client => client.db(dbName))
}

module.exports = async function() {
    var database = await Promise.all([DBconnect("testdb")]);
    console.log("Connect to DB");
    return {
        testdb : database[0]
    }
};