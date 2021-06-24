module.exports = {
    Login : {
        origin: 'http://localhost:3000',
        method: ['GET', 'POST'],
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    },
    SignUp : {
        origin: 'https://localhost:3000',
        method: ['GET', 'POST'],
        optionsSuccessStatus: 200
    },
    Google : {
        origin: 'https://localhost:3000',
        method: ['GET', 'POST'],
        optionsSuccessStatus: 200
    }
}
