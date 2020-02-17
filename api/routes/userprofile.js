module.exports = app => {
    const {admin} = app.api.middlewares.permission

    app.route(`${app.apiPath}/userprofiles`)
        .get(admin(app.api.controllers.userprofile.get))
        .post(admin(app.api.controllers.userprofile.save))

    app.route(`${app.apiPath}/userprofiles/roles`)
        .get(admin(app.api.controllers.userprofile.getRoles))

    app.route(`${app.apiPath}/userprofiles/profiles/:company`)
        .get(admin(app.api.controllers.userprofile.getProfiles))

    app.route(`${app.apiPath}/userprofiles/menus`)
        .get(app.api.controllers.userprofile.getMenus)

    app.route(`${app.apiPath}/userprofiles/:id`)
        .get(admin(app.api.controllers.userprofile.getById))
        .put(admin(app.api.controllers.userprofile.update))
        .delete(admin(app.api.controllers.userprofile.remove))
}
