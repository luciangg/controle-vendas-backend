module.exports = app =>
{
    const {profile} = app.api.middlewares.permission
    app.route(`${app.apiPath}/suppliers`)
        .get(profile(app.api.controllers.supplier.get))
        .post(profile(app.api.controllers.supplier.save))

    app.route(`${app.apiPath}/suppliers/:id`)
        .get(profile(app.api.controllers.supplier.getById,"suppliers","getById"))
        .put(profile(app.api.controllers.supplier.update))
        .delete(profile(app.api.controllers.supplier.remove))


}
