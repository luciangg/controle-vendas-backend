module.exports = app =>
{
    const {Supplier} = app.api.models.Supplier
    const queries = app.api.utils.queries

    const get = (req, res) =>
    {
        return queries.get(Supplier, req, res)
    }
    const save = (req, res)=>
    {
        return queries.save(Supplier, req, res)
    }
    const update = (req, res)=>
    {
        return queries.update(Supplier, req, res)
    }
    const remove = (req, res)=>
    {
        return queries.remove(Supplier, req, res)
    }
    const getById = async (req, res) =>
    {
        return queries.getById(Supplier, req, res)
    }

    return { get, getById, save, update, remove}
}
