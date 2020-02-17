module.exports = app => {
    app.post(`${app.apiPath}/signin`, app.api.auth.signin)
    app.post(`${app.apiPath}/validateToken`, app.api.auth.validateToken)

    app.get(['/',app.apiPath], (req,res)=>{
        res.send('LGG Backend ' + app.apiVersion)
    })

    app.get('/initialize_environment/', (req, res) => {
        app.api.controllers.company.newEnvironment(req, res)
    })

    app.use('/', app.config.passport.authenticate())
}
