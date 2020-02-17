module.exports = app =>
{
    const {profile} = app.api.middlewares.permission
    app.route(`${app.apiPath}/purchases`)
        .get(profile(app.api.controllers.purchase.get))
        .post(profile(app.api.controllers.purchase.save))

    app.route(`${app.apiPath}/purchases/:id`)
        .get(profile(app.api.controllers.purchase.getById,"purchases","getById"))
        .put(profile(app.api.controllers.purchase.update))
        .delete(profile(app.api.controllers.purchase.remove))


}
