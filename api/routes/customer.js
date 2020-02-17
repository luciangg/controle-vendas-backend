module.exports = app =>
{
    const {profile} = app.api.middlewares.permission
    app.route(`${app.apiPath}/customers`)
        .get(profile(app.api.controllers.customer.get))
        .post(profile(app.api.controllers.customer.save))

    app.route(`${app.apiPath}/customers/:id`)
        .get(profile(app.api.controllers.customer.getById,"customers","getById"))
        .put(profile(app.api.controllers.customer.update))
        .delete(profile(app.api.controllers.customer.remove))


}
