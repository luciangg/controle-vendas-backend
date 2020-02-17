module.exports = [
    {route: "company", master:true, companyAdministrator: false},

    {route: "userProfile", master:false, companyAdministrator: true},
    {route: "user", master:false, companyAdministrator: true},

    {route: "product", master:false, companyAdministrator: false},
    {route: "supplier", master:false, companyAdministrator: false},
    {route: "customer", master:false, companyAdministrator: false},
    
    {route: "sale", master:false, companyAdministrator: false},
    {route: "purchase", master:false, companyAdministrator: false},

]
