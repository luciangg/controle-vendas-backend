module.exports = app => {
    const {UserProfile} = app.api.models.UserProfile
    const queries = app.api.utils.queries

    const get = (req, res) => {
        if(req.user.profile.master)
        {
            req.query.populate = {path:"_company", select:'name'}
        }
        else
        {
            req.query.searchBooleanFields = "master"
            req.query.searchBoolean = "false"
        }
        return queries.get(UserProfile, req, res)
    }
    const save = (req, res)=>{
        req.query.forceIgnoreFields = 'master,companyAdministrator'
        if(!req.user.profile.master)
        {
            req.body.master = false
        }
        return queries.save(UserProfile, req, res)
    }
    const update = (req, res)=>{
        req.query.forceIgnoreFields = 'master,companyAdministrator'
        if(!req.user.profile.master)
        {
            req.body.master = false
        }
        return queries.update(UserProfile, req, res)
    }
    const remove = (req, res)=>{
        if(req.user.profile && req.user.profile.master)
        {
            req.ignoreFields = "_company"
        }
        return queries.remove(UserProfile, req, res)
    }
    const getById = async (req, res) => {
        if(req.user.profile.master)
        {
            req.body.populate = {path:"_company", select:'name'}
        }
        else
        {
            req.query.searchBooleanFields = "master"
            req.query.searchBoolean = "false"
            req.query.forceIgnoreFields = (req.user.profile.companyAdministrator) ? 'master' : 'master,companyAdministrator'
        }

        try
        {
            let profile = await queries.getById(UserProfile, req, res, false)
            profile.companyAdministrator = profile.companyAdministrator || false

            let allRoles = getAllRoles(profile)
            let allMenus = getAllMenus(profile)

            //Filter to only valid profile, on allRoles file.
            profile.roles = profile.roles || []
            profile.roles = profile.roles.filter(role=> (allRoles.findIndex(newRole => (newRole.model == role.model && newRole.method == role.method)) >= 0)?true:false )
            //Add new roles to profile.
            let newRoles = allRoles.filter(newRole=> (profile.roles.findIndex(role => (newRole.model == role.model && newRole.method == role.method)) >= 0)?false:true )
            newRoles.forEach(role=>{
                profile.roles.push({
                    model : role.model,
                    method : role.method,
                    permission : false
                })
            })

            profile.menus = profile.menus || []
            //To Validate lsit of Menus
            profile.menus = profile.menus.filter(menu=>(allMenus.map(m=>m.route).indexOf(menu.route) >= 0)? true:false)
            let newMenus = allMenus.filter(menu=>(profile.menus.map(m=>m.route).indexOf(menu.route) >= 0)? false:true)
            newMenus.forEach(menu=>{
                profile.menus.push({
                    route : menu.route,
                    permission : false,
                })
            })
            return res.json(profile)
        }
        catch(e)
        {
            return res.status(404).json({error:e.message})
        }
    }

    const createDefaultProfile = async (companyId, req) => //async (companyId, req) =>
    {
        let profiles = []
        let roles = getCompanyAdministratorRoles()

        let params = {
            _company : companyId || req.user._company,
            _user: req.user._id
        }
        params.master = false
        params.description = "Administrador"
        params.roles = roles
        params.companyAdministrator = true
        params.menus = getAllMenus(params)
        let saved = await new UserProfile(params).save()
        profiles.push(saved)

        params.companyAdministrator = false
        params.description = "Operador"
        params.roles = roles.filter(role => !role.companyAdministrator)
        params.menus = getAllMenus(params)
        saved = await new UserProfile(params).save()
        profiles.push(saved)

        return profiles
    }

    const getCompanyAdministratorRoles = () =>
    {
        let roles = require("../utils/allRoles")
        return roles.filter(role => !role.master)
    }

    const getRoles = (req, res) =>
    {
        let roles = require("../utils/allRoles")
        if(!req.user.profile || !req.user.profile.master) roles = roles.filter(role => !role.master)
        return res.json(roles)
    }

    const getAllRoles = (profile) =>
    {
        let roles = require("../utils/allRoles")
        if(!profile.master)
        {
            roles = roles.filter(role => !role.master)
            if(!profile.companyAdministrator)
            {
                roles = roles.filter(role => !role.companyAdministrator)
            }
        }
        return roles
    }

    const getProfiles = async (req, res) =>
    {
        try
        {
            const where = {_company : req.params.company, active:true}
            if(!req.user.profile || !req.user.profile.master)
            {
                where.master = false
            }
            if(!req.user.profile || !req.user.profile.companyAdministrator)
            {
                where.companyAdministrator = false
            }
            const models = await UserProfile.find(where, {description:1}).lean()
            return res.send(models)
        }
        catch (e)
        {
            console.log("Error",e.message);
            return res.status(400).json({error:e.message})
        }
    }

    const getAllMenus = (profile) =>
    {
        let menus = require("../utils/allMenus")
        if(!profile.master)
        {
            menus = menus.filter(menu => !menu.master)
            if(!profile.companyAdministrator)
            {
                menus = menus.filter(menu => !menu.companyAdministrator)
            }
        }
        return menus
    }

    const getMenus = async (req,res) =>
    {
        try
        {
            req.user.profile.menus = req.user.profile.menus || []
            return res.send(req.user.profile.menus.filter(menu=>menu.permission))
        }
        catch (e)
        {
            console.log("Error",e.message);
            return res.status(400).json({error:e.message})
        }
    }

    return { get, getById, save, update, remove, createDefaultProfile, getRoles, getProfiles, getMenus, getAllRoles, getAllMenus}
}
