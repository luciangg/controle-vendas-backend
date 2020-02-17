module.exports = app => {
    const {User} = app.api.models.User
    const queries = app.api.utils.queries

    const get = (req, res) => {
        req.query.populate = [{path:"profile", select:'description'}, {path:"_company", select:'name'}]
        req.query.forceIgnoreFields = 'password'
        return queries.get(User, req, res)
    }
    const save = (req, res)=>{
        req.query.forceIgnoreFields = 'password'
        return queries.save(User, req, res)
    }
    const update = async (req, res)=>{
        req.query.forceIgnoreFields = 'password'
        if(!req.body.password || req.body.password.trim() == "")
        {
            delete req.body.password
        }
        if(!req.user.profile.master)
        {
            delete req.body._company
        }
        return queries.update(User, req, res)
    }
    const remove = (req, res)=>{
        if(req.user.profile && req.user.profile.master)
        {
            req.ignoreFields = "_company"
        }
        req.query.forceIgnoreFields = 'password'
        return queries.remove(User, req, res)
    }
    const getById = async (req, res) => {
        req.query.forceIgnoreFields = 'password'
        return queries.getById(User, req, res)
    }

    return { get, getById, save, update, remove}
}
