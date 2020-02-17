module.exports = app =>
{
    const {profile} = app.api.middlewares.permission
    app.route(`${app.apiPath}/users`)
        .get(profile(app.api.controllers.user.get))
        .post(profile(app.api.controllers.user.save))

    app.route(`${app.apiPath}/users/:id`)
        .get(profile(app.api.controllers.user.getById,"users","getById"))
        .put(profile(app.api.controllers.user.update))
        .delete(profile(app.api.controllers.user.remove))
}
