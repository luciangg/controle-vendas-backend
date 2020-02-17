module.exports = app =>
{
    const {profile} = app.api.middlewares.permission
    app.route(`${app.apiPath}/sales`)
        .get(profile(app.api.controllers.sale.get))
        .post(profile(app.api.controllers.sale.save))

    app.route(`${app.apiPath}/sales/:id`)
        .get(profile(app.api.controllers.sale.getById,"sales","getById"))
        .put(profile(app.api.controllers.sale.update))
        .delete(profile(app.api.controllers.sale.remove))


}
