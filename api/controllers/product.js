module.exports = app =>
{
    const {Product} = app.api.models.Product
    const queries = app.api.utils.queries

    const get = (req, res) =>
    {
        return queries.get(Product, req, res)
    }
    const save = (req, res)=>
    {
        return queries.save(Product, req, res)
    }
    const update = (req, res)=>
    {
        return queries.update(Product, req, res)
    }
    const remove = (req, res)=>
    {
        return queries.remove(Product, req, res)
    }
    const getById = async (req, res) =>
    {
        return queries.getById(Product, req, res)
    }

    return { get, getById, save, update, remove}
}
