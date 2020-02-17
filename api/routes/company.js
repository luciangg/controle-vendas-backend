module.exports = app =>
{
    const {profile} = app.api.middlewares.permission
    app.route(`${app.apiPath}/companies`)
        .get(profile(app.api.controllers.company.get))
        .post(profile(app.api.controllers.company.save))

    app.route(`${app.apiPath}/companies/:id`)
        .get(profile(app.api.controllers.company.getById,"companies","getById"))
        .put(profile(app.api.controllers.company.update))
        .delete(profile(app.api.controllers.company.remove))


}
