const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
    app.use(bodyParser.json({extended: true, limit: '200mb', parameterLimit: 30000}))
    app.use(bodyParser.urlencoded({extended: true, limit: "200mb", parameterLimit: 30000}));

    app.use(cors())
}
