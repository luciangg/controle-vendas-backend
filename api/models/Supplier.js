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
        id: {
            type: String,
            required: [true, "Informe o campo 'id'"],
        },

        name: {type: String, default: ""},
        address : {type: String, default: ""},

        phones : [{
            description : {type: String, default: ""},
            number : {type: String, default: ""},
        }],

        details : String,

        createAt: {type: Date, default: Date.now},
        active:{type: Boolean, default:true},
        updatedAt: Date,
    })
    const Supplier = app.mongoose.model('Supplier', Schema)
    return {Supplier}
}
