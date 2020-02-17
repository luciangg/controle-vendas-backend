module.exports = app => {
    const master = (middleware) =>
    {
        return (req, res, next) =>
        {
            if(req.user.profile && req.user.profile.master) middleware(req, res, next)
            else res.status(403).json({error:'Usuário sem permissão de acesso.'})
        }
    }
    const admin = (middleware) =>
    {
        return (req, res, next) =>
        {
            if(req.user.profile && (req.user.profile.master || req.user.profile.companyAdministrator)) middleware(req, res, next)
            else res.status(403).json({error:'Usuário sem permissão de acesso.'})
        }
    }


    const profile = (middleware, model, method) =>
    {
        return (req, res, next) =>
        {
            model = model || req.path.split("/")[3] || ""
            method = method || req.method.toLowerCase()
            for(let i = 0; i < req.user.profile.roles.length; i++)
            {
                let role = req.user.profile.roles[i]
                if(role.permission && role.model == model && role.method == method) return middleware(req, res, next)
            }
            console.log("Usuário sem permissão de acesso");
            return res.status(403).json({error:'Usuário sem permissão de acesso.'})
        }
    }
    return {master, admin, profile}
}
