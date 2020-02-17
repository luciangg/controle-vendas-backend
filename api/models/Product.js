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
        description: {type: String, default: "Product"},
        brand : {type: String, default: "Product"},
        supplier : {
            type: app.mongoose.Schema.Types.ObjectId,
            ref: 'Supplier'
        },
        externalId : {type: String, default: ""},

        price : {type: Number, default : 0},
        stock : {type: Number, default : 0},

        createAt: {type: Date, default: Date.now},
        active:{type: Boolean, default:true},
        updatedAt: Date,
    })
    const Product = app.mongoose.model('Product', Schema)
    return {Product}
}
