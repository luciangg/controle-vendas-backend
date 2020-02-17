module.exports = app =>
{
    const findByField = (array = [], id = "", field = "id", debug = false) =>
    {
        if(array.length > 0)
        {
            try
            {
                id = id.toString()
                const fnMapProperty = item =>
                {
                    if(debug) console.log(`FIND BY FIELD: ${JSON.stringify(item)} --------- field: '${field}', -------- id: '${id}'`)
                    //const toReturn = (item.hasOwnProperty(field)?item[field]:"aaa").toString().replace(/\s/g,"").toLowerCase()
                    const value = (item[field] !== undefined)? item[field] : ""
                    // const toReturn = (item[field] || "").toString().replace(/\s/g,"").toLowerCase()
                    const toReturn = value.toString().replace(/[^\w\s]/gi,"").toLowerCase()
                    if(debug) console.log("FIND BY FIELD: To Compare: ", toReturn, " -----> Original Value: ", item[field])
                    return toReturn
                }

                let idx = array.map(fnMapProperty).indexOf(id.replace(/[^\w\s]/gi,"").toLowerCase())
                return ( idx >= 0 )? array[idx] : null
            }
            catch(e)
            {
                console.log("Erro no findByField", e)
            }
        }
        return null
    }

    const clone = (object) => JSON.parse( JSON.stringify( object ) )

    const overwriteProperties = (item, newProps)=>{
        for(key in newProps)
        {
            item[key] = newProps[key]
        }
    }

    return {findByField, clone, overwriteProperties}
}
