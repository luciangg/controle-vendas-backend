module.exports = app =>
{
    const {profile} = app.api.middlewares.permission
    app.route(`${app.apiPath}/products`)
        .get(profile(app.api.controllers.product.get))
        .post(profile(app.api.controllers.product.save))

    app.route(`${app.apiPath}/products/:id`)
        .get(profile(app.api.controllers.product.getById,"products","getById"))
        .put(profile(app.api.controllers.product.update))
        .delete(profile(app.api.controllers.product.remove))
}
