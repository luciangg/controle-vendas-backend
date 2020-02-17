module.exports = app =>
{
    const {Purchase} = app.api.models.Purchase
    const queries = app.api.utils.queries

    const get = (req, res) =>
    {
        return queries.get(Purchase, req, res)
    }
    const save = (req, res)=>
    {
        return queries.save(Purchase, req, res)
    }
    const update = (req, res)=>
    {
        return queries.update(Purchase, req, res)
    }
    const remove = (req, res)=>
    {
        return queries.remove(Purchase, req, res)
    }
    const getById = async (req, res) =>
    {
        return queries.getById(Purchase, req, res)
    }

    return { get, getById, save, update, remove}
}
