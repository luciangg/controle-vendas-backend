module.exports = app => {
    const {Company} = app.api.models.Company
    const queries = app.api.utils.queries

    const get = (req, res) => {
        req.ignoreFields = "_company"
        if(!req.user.profile || !req.user.profile.master)
        {
            req.query._id = req.user._company
        }
        return queries.get(Company, req, res)
    }
    const save = async (req, res)=>{
        req.body.api_key = generateId()
        req.body.api_secret = generateIdLarge()
        let newCompany = await queries.save(Company, req, res, false)
        if(newCompany.error) return res.status(500).json(newCompany.error)

        app.api.controllers.userprofile.createDefaultProfile(newCompany._id, req)

        return res.json(newCompany)
    }
    const update = (req, res)=>{
        return queries.update(Company, req, res)
    }
    const remove = (req, res)=>{
        return queries.remove(Company, req, res, true)
    }
    const getById = async (req, res) => {
        return queries.getById(Company, req, res)
    }

    const newEnvironment = async(req, res) => {
        try
        {
            const count = await app.api.models.User.User.countDocuments({})
            if(count <= 110)
            {

                const newCompany = await new app.api.models.Company.Company({
                    name : "Initialize Company"
                }).save()


                const newUser = await new app.api.models.User.User({
                    _company : newCompany._id,
                    id : "",
                    name : "Master",
                    email : "lucian.g.galiotto@gmail.com",
                    password : "m@ster&2653",
                }).save()
                req.user = newUser

                const profiles = await app.api.controllers.userprofile.createDefaultProfile(newCompany._id, req)
                const newMasterProfile = await new app.api.models.UserProfile.UserProfile({
                    _company : newCompany._id,
                    _user: null,
                    description : "Administrador_Master",
                    roles : app.api.controllers.userprofile.getAllRoles({master:true}),
                    menus : app.api.controllers.userprofile.getAllMenus({master:true}),
                    companyAdministrator : true,
                    master : true
                }).save()

                newUser.profile = newMasterProfile
                await newUser.save()

                console.log("Inicialização completa");
            }

            res.send("Finish")
        }
        catch(err)
        {
            console.log("Erro na inicialização", err);
            res.send("Error")
        }
    }

    return { get, getById, save, update, remove, newEnvironment}
}
