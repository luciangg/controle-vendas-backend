module.exports = app => {
    const publicProfiles = ["Administrador", "Operador", "Operador_Plano"]

    const get = async (model, req, res) => {
        try {
            const page = parseInt(req.query.page) || 0
            let limit = parseInt(req.query.limit) || 50
            let skip = parseInt(req.query.offset) || 0
            let populate = req.query.populate || ""

            if(page && page > 0) skip = limit * (page-1)
            if(limit > 10000) limit = 10000
            if(limit < 1) limit = 1

            if(skip < 0) skip = 0

            const sort = getSort(req)
            const where = getWhere(req)

            adjustWhereToModel(model, where)
            adjustWhereMasterUser(model, req, where)

            const count = await model.countDocuments(where)
            const models = await model.find(where, getFields(req), {skip, limit}).lean().populate(populate).sort(sort)

            if(!models) return res.json({error: "Não existem registros na base de dados"})

            adjustIgnoreFields(req, models)

            return res.json({count, limit, data:models})
        } catch (e) {
            console.log("Erro na consulta", e)
            return res.status(500).json({error:"Error ao consultar registros"})
        }
    }
    const getPromise = (model, req, res) => {
        return new Promise(async (resolve, reject)=>{
            try {
                const page = parseInt(req.query.page) || 0
                let limit = parseInt(req.query.limit) || 100
                let skip = parseInt(req.query.offset) || 0

                if(page && page > 0) skip = limit * (page-1)
                if(limit > 10000) limit = 10000
                if(limit < 1) limit = 1


                if(skip < 0) skip = 0
                const count = await model.find(getWhere(req), {_id:1}).count()
                const models = await model.find(getWhere(req), getFields(req), {skip, limit})
                resolve({count, limit, data:models||[]})
            } catch (e) {
                reject(e)
            }
        })
    }

    const save = async (model, req, res, autoReturn = true) => {
        let params = getParams(req.body)
        if(req.user) {
            params._company = req.user._company
            params._user = req.user._id
        }
        try {
            let saved = await new model(params).save()
            if(saved && !req.showCompany)
            {
                delete saved._doc._company
            }
            adjustIgnoreFields(req, saved._doc)

            if(autoReturn) return res.json(saved)
            return saved
        } catch (e) {
            console.log("Erro ao salvar", e)
            let errors = ["Erro ao salvar"]
            if(e.errors)
            {
                errors = []
                for(let key in e.errors)
                {
                    errors.push(e.errors[key].message)
                }
            }
            let error = errors.join(' , ')
            if(autoReturn) return res.status(400).json({error})
            return {error}
        }
    }

    const update = async (model, req, res, remove = false, autoReturn = true) =>
    {
        if(model.hasOwnProperty('requiredFields') && !remove)
        {
            if(!validation(req, res, model.requiredFields()))
            {
                return
            }
        }
        const userId = req.user._id
        let where = {'_id': req.params.id, '_company': req.user._company}
        if(req.ignoreFields){
            req.ignoreFields.split(',').map( field => {delete where[field]})
        }

        adjustWhereToModel(model, where)
        adjustWhereMasterUser(model, req, where)

        try
        {
            let find = await model.findOne(where)
            if(!find)
            {
                if(autoReturn) return res.status(400).json({error: "Registro não existe na base de dados"})
                return {error: "Registro não existe na base de dados"}
            }

            for (let key in req.body) {
                // if(key!='_id' && req.body[key]!='' && !Array.isArray(key))
                if(key!='_id' && !Array.isArray(key))
                find[key]=req.body[key]
            }
            find.updatedAt = new Date();
            find._user = userId

            let saved = await find.save()
            if(saved && !req.showCompany)
            {
                delete saved._doc._company
            }
            adjustIgnoreFields(req, saved._doc)
            if(autoReturn) return res.json(saved)
            return saved
        }catch(err){
            console.log(`Erro ao atualizar modelo: ${model.modelName}`, err);
            const error = (err.message)?err.message:"Não foi possível atualizar registro, _id inválido"
            if(autoReturn) return res.status(400).json({error})
            return {error}
        }
    }
    const remove = async (model, req, res) =>
    {
        req.body = {active:false}
        update(model, req, res, true)
    }

    const getById = async (model, req, res, autoReturn = true) => {
        const where = getWhere(req)
        where._id = req.params.id
        adjustWhereToModel(model, where)
        adjustWhereMasterUser(model, req, where)
        if(where._id.length != 24)
        {
            if(autoReturn) return res.status(400).json({error:"Invalid ID"})
            throw new Error("Invalid ID")
            return
        }
        try {
            let find = await model.findOne(where,getFields(req)).lean().populate(req.body.populate || "") || {}
            adjustIgnoreFields(req, find)
            if(autoReturn) res.json(find)
            return find
        } catch (e) {
            console.log("Error na consulta por _id ", e)
            if(autoReturn) return res.status(500).json({error:"Erro ao consultar registro"})
            throw new Error("Erro ao consultar registro")
        }
    }

    const getParams = (data) => {
        var params = {};
        for (var key in data) {
            if (key != '_id') {
                params[key] = data[key];
            }
        }
        params.updatedAt = new Date();
        return params;
    }

    const getWhere = (req) => {
        var params = (req.body.where)?req.body.where:{active:true}
        params._company = req.user._company
        if(req.query._id)
        {
            params._id = req.query._id
        }
        if(req.query.id)
        {
            params.id = req.query.id
        }
        if(req.query.search || req.query.searchBoolean)
        {
            let searchCondition = "$or"
            if(req.query.hasOwnProperty("searchFields"))
            {
                req.query.searchFields.split(',').map((field) =>
                {
                    const fieldOr = {}
                    fieldOr[field] = {$regex : req.query.search||"", $options: 'i'}
                    if(!params.hasOwnProperty(searchCondition)) params[searchCondition]= []
                    params[searchCondition].push(fieldOr)
                })
            }

            if(req.query.hasOwnProperty("searchNumberFields") && !isNaN(req.query.search.replace(',','.')))
            {
                req.query.searchNumberFields.split(',').map((field) =>
                {
                    const fieldOr = {}
                    fieldOr[field] = parseFloat(req.query.search.replace(',','.'))
                    if(!params.hasOwnProperty(searchCondition)) params[searchCondition]= []
                    params[searchCondition].push(fieldOr)
                })
            }

            if(req.query.hasOwnProperty("searchBooleanFields"))
            {
                req.query.searchBooleanFields.split(',').map((field) =>
                {
                    if(!field || field.trim()=="") return
                    const fieldOr = {}
                    const search = req.query.searchBoolean || req.query.search
                    searchCondition = (req.query.searchBoolean)?"$and":"$or"
                    fieldOr[field] = (search.toLowerCase() == "true")?true:false
                    if(!params.hasOwnProperty(searchCondition)) params[searchCondition]= []
                    params[searchCondition].push(fieldOr)
                })
            }

        }
        if(!params.hasOwnProperty('active')) params.active = true

        //Caso algum modelo não tenha um campo padrão de where, usar esse campo para ignorar o where padrão
        //Ex.: Modelo sem _company
        if(req.ignoreFields){
            req.ignoreFields.split(',').map( field => {delete params[field]})
        }
        return params
    }

    const getFields = (req) => {
        let params = {}
        if(req.query.fields){
            req.query.fields.split(',').map( field => {params[field] = 1})
        }else{
            params.__v = 0
            params._company = 0
            if(req.query.hideFields){
                req.query.hideFields.split(',').map( field => {params[field] = 0})
            }
        }
        if(!req.user.profile && !req.user.profile.master)
        {
            delete params._company
        }
        return params
    }

    const validation = (req, res, fields = []) =>
    {
        for(field in fields)
        {
            if(!req.body.hasOwnProperty(field) || !req.body[field])
            {
                res.status(400).send(`Campo '${fields[field]}' não informado ou inválido`)
                return false
            }
        }
        return true
    }

    const adjustIgnoreFields = (req, models) =>
    {
        if(!Array.isArray(models)) models = [models]
        if(req.query.fields && req.query.ignoreFields || req.query.forceIgnoreFields)
        {
            fields = req.query.ignoreFields || req.query.forceIgnoreFields
            fields = fields.split(',')
            models.forEach(loop=>{
                for(field of fields)
                {
                    delete loop[field]
                }
            })
        }
    }

    const adjustWhereToModel = (model, where) =>
    {
        if(model.modelName=='Company')
        {
            delete where._company
        }
        return where
    }

    const adjustWhereMasterUser = (model, req, where) =>
    {
        if(req.user.profile && req.user.profile.master && (model.modelName=='Company' || model.modelName=='User')
        {
            delete where._company
        }
        return where
    }

    const getSort = (req) => {
        const sortText = req.query.sort || req.body.sort || ""
        if(!sortText) return ""
        const sortList = sortText.split(",")
        const returnSort = {}
        sortList.forEach(text => {
            let textSplit = text.split(":")
            returnSort[textSplit[0]] = textSplit[1] || "asc"
        })
        return returnSort
    }

    const createOrUpdateMany = async (model, req) => {
        const {findByField} = require('./utils')(app)
        let savedList = []
        try
        {
            const listIds = req.body.map(item => item._id)
            const where = {
                _company : req.user._company,
                active : true,
                _id : {$in : listIds}
            }
            const databaseList = await model.find(where)

            for (var i = 0; i < req.body.length; i++) {
                try {
                    let params = getParams(req.body[i])
                    if(req.user) {
                        params._company = req.user._company
                        params._user = req.user._id
                    }
                    const modelSaved = findByField(databaseList, req.body[i]._id, "_id")
                    if(modelSaved)
                    {
                        for (let key in params) {
                            // if(key!='_id' && !Array.isArray(key))
                            if(key!='_id')
                            {
                                modelSaved[key] = params[key]
                            }
                        }
                        modelSaved.updatedAt = new Date()
                        const saved = await modelSaved.save()
                        savedList.push(saved)
                    }
                    else
                    {
                        const saved = await new model(params).save()
                        savedList.push(saved)
                    }

                } catch (e) {
                    // let error = (e.message.split(":")[2] || "Error ao salvar registros").trim()
                    console.log("Erro ao Importar", e)
                    let errors = ["Erro ao salvar"]
                    if(e.errors)
                    {
                        errors = []
                        for(let key in e.errors)
                        {
                            errors.push(e.errors[key].message)
                        }
                    }
                    let error = errors.join(' , ')
                    throw {error}
                }
            }
        }
        catch (e)
        {
            console.log("Erro ao importar", e)
            throw e
        }
        return savedList
    }
    const deleteMany = async (model, req, res) => {
        let savedList = []
        try
        {
            const listIds = req.body.map(item => item._id)
            const where = {
                _company : req.user._company,
                active : true,
                _id : {$in : listIds}
            }
            const databaseList = await model.find(where)

            for (var i = 0; i < databaseList.length; i++) {
                try {
                    databaseList[i].active = false
                    databaseList[i].updatedAt = new Date()
                    const saved = await databaseList[i].save()
                    savedList.push(saved)
                } catch (e) {
                    console.log("Erro ao Importar", e)
                    let errors = ["Erro ao salvar"]
                    if(e.errors)
                    {
                        errors = []
                        for(let key in e.errors)
                        {
                            errors.push(e.errors[key].message)
                        }
                    }
                    let error = errors.join(' , ')
                    throw {error}
                }
            }
        }
        catch (e)
        {
            console.log("Erro ao importar", e)
            return res.status(400).json(e)
        }
        // return savedList
        return res.send(`Removed '${savedList.length}' elements`)
    }

    const getDatabaseId = async (model, req, elementsToAddId = []) => {
        const {findByField} = require('./utils')(app)
        let findList = []
        req.fieldToSearch = req.fieldToSearch || "id"
        req.fieldToCheck = req.fieldToCheck || ["id"]
        try
        {
            let listIds = elementsToAddId.map(item => item[req.fieldToSearch])
            listIds = [...new Set(listIds)]
            const where = {
                _company : req.user._company,
                active : true
            }
            where[req.fieldToSearch] = {$in : listIds}
            const databaseList = await model.find(where)

            for (var i = 0; i < elementsToAddId.length; i++) {
                try {
                    object = elementsToAddId[i]
                    let modelSaved
                    for (let j = 0; j < databaseList.length; j++) {
                        let found = true
                        for (let k = 0; k < req.fieldToCheck.length; k++) {
                            key = req.fieldToCheck[k]
                            if(databaseList[j][key].toLowerCase() != object[key].toLowerCase())
                            {
                                found = false
                                break;
                            }
                        }
                        if(found)
                        {
                            modelSaved = databaseList[j]
                            break;
                        }
                    }
                    if(modelSaved)
                    {
                        object._id = modelSaved._id.toString()
                    }
                    findList.push(object)
                } catch (e) {
                    console.log("Erro ao localizar _id no banco de dados", e)
                    let errors = ["Erro ao localizar _id no banco de dados"]
                    if(e.errors)
                    {
                        errors = []
                        for(let key in e.errors)
                        {
                            errors.push(e.errors[key].message)
                        }
                    }
                    let error = errors.join(' , ')
                    throw {error}
                }
            }
        }
        catch (e)
        {
            console.log("Erro ao localizar _id da lista", e)
            throw e
        }
        return findList
    }

    return {get,getPromise, save, update, remove, getParams, getWhere, getFields, getById, createOrUpdateMany, deleteMany, getDatabaseId}
}
