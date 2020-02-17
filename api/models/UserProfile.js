module.exports = app => {
    const Schema = app.mongoose.Schema({
        _company: {
            type: app.mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        _user: {
            type: app.mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        description: {
            type : String,
            required: [true, "Informe o campo 'description'"],
        },

        roles:[{
            _id : false,
            model:String,
            method:String,
            permission: {type: Boolean, default: true}
        }],

        menus:[{
            _id : false,
            route:String,
            permission: {type: Boolean, default: true}
        }],

        master: {type: Boolean, default: false},

        companyAdministrator: {type: Boolean, default: false},

        active: {type: Boolean, default: true},
        createAt: {type: Date, default: Date.now},
        updatedAt: Date
    })

    const UserProfile = app.mongoose.model('UserProfile', Schema)

    return { UserProfile }
}
