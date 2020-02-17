module.exports = [
    {model: "companies", method: "get", master:true, companyAdministrator: false},
    {model: "companies", method: "post", master:true, companyAdministrator: false},
    {model: "companies", method: "put", master:true, companyAdministrator: false},
    {model: "companies", method: "delete", master:true, companyAdministrator: false},
    {model: "companies", method: "getById", master:true, companyAdministrator: false},

    {model: "users", method: "get", master:false, companyAdministrator: true},
    {model: "users", method: "post", master:false, companyAdministrator: true},
    {model: "users", method: "put", master:false, companyAdministrator: true},
    {model: "users", method: "delete", master:false, companyAdministrator: true},
    {model: "users", method: "getById", master:false, companyAdministrator: false},

    {model: "userprofiles", method: "get", master:false, companyAdministrator: true},
    {model: "userprofiles", method: "post", master:false, companyAdministrator: true},
    {model: "userprofiles", method: "put", master:false, companyAdministrator: true},
    {model: "userprofiles", method: "delete", master:false, companyAdministrator: true},
    {model: "userprofiles", method: "getById", master:false, companyAdministrator: true},

    {model: "products", method: "get", master:false, companyAdministrator: false},
    {model: "products", method: "post", master:false, companyAdministrator: false},
    {model: "products", method: "put", master:false, companyAdministrator: false},
    {model: "products", method: "delete", master:false, companyAdministrator: false},
    {model: "products", method: "getById", master:false, companyAdministrator: false},

    {model: "suppliers", method: "get", master:false, companyAdministrator: false},
    {model: "suppliers", method: "post", master:false, companyAdministrator: false},
    {model: "suppliers", method: "put", master:false, companyAdministrator: false},
    {model: "suppliers", method: "delete", master:false, companyAdministrator: false},
    {model: "suppliers", method: "getById", master:false, companyAdministrator: false},

    {model: "customers", method: "get", master:false, companyAdministrator: false},
    {model: "customers", method: "post", master:false, companyAdministrator: false},
    {model: "customers", method: "put", master:false, companyAdministrator: false},
    {model: "customers", method: "delete", master:false, companyAdministrator: false},
    {model: "customers", method: "getById", master:false, companyAdministrator: false},

    {model: "sales", method: "get", master:false, companyAdministrator: false},
    {model: "sales", method: "post", master:false, companyAdministrator: false},
    {model: "sales", method: "put", master:false, companyAdministrator: false},
    {model: "sales", method: "delete", master:false, companyAdministrator: false},
    {model: "sales", method: "getById", master:false, companyAdministrator: false},

    {model: "purchases", method: "get", master:false, companyAdministrator: false},
    {model: "purchases", method: "post", master:false, companyAdministrator: false},
    {model: "purchases", method: "put", master:false, companyAdministrator: false},
    {model: "purchases", method: "delete", master:false, companyAdministrator: false},
    {model: "purchases", method: "getById", master:false, companyAdministrator: false},

]
