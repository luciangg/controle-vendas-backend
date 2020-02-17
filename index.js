const app = require('express')()
const consign = require('consign')
const config = require('./config/config')
const mongoose = require('mongoose')
const compression = require('compression')

app.use(compression())

app.use(require('helmet')())

const initialize = async () =>
{
    try
    {
        let urlMongo = config.getUrl(config.mongo)
        await mongoose.connect(urlMongo)
        app.apiPath = "/api/v1"
        app.mongoose = mongoose

        app.apiVersion = require("./package.json").version

        app.use((req, res, next) => {
            res.set("X-Powered-By", "PHP/7.1.7");
            next();
        });

        consign()
        .include('./api/models')
        .then('./config/passport.js')
        .then('./config/middlewares.js')
        .then('./api/auth.js')
        .then('./api/utils/queries.js')
        .then('./api/utils/utils.js')
        .then('./api/middlewares')
        .then('./api/routes/_routes.js')
        .then('./api/controllers')
        .then('./api')
        .into(app)

        app.listen(3001, () => {
            console.log('Backend executando...')
        })
    }
    catch (e)
    {
        console.log("Error ao inicializar servidor", e)
    }
}

initialize()
