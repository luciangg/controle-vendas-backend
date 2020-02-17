module.exports = app =>
{
    const {Sale} = app.api.models.Sale
    const queries = app.api.utils.queries

    const get = (req, res) =>
    {
        return queries.get(Sale, req, res)
    }
    const save = (req, res)=>
    {
        return queries.save(Sale, req, res)
    }
    const update = (req, res)=>
    {
        return queries.update(Sale, req, res)
    }
    const remove = (req, res)=>
    {
        return queries.remove(Sale, req, res)
    }
    const getById = async (req, res) =>
    {
        return queries.getById(Sale, req, res)
    }

    return { get, getById, save, update, remove}
}
