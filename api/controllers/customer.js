module.exports = app =>
{
    const {Customer} = app.api.models.Customer
    const queries = app.api.utils.queries

    const get = (req, res) =>
    {
        return queries.get(Customer, req, res)
    }
    const save = (req, res)=>
    {
        return queries.save(Customer, req, res)
    }
    const update = (req, res)=>
    {
        return queries.update(Customer, req, res)
    }
    const remove = (req, res)=>
    {
        return queries.remove(Customer, req, res)
    }
    const getById = async (req, res) =>
    {
        return queries.getById(Customer, req, res)
    }

    return { get, getById, save, update, remove}
}
