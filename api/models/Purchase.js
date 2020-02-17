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
        description: {type: String, default: ""},
        products : [{
            _id : false,
            product : {type: app.mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity : Number,
            price : Number
        }],

        supplier : {
            type: app.mongoose.Schema.Types.ObjectId,
            ref: 'Supplier'
        },

        discount : {type: Number, default : 0},
        price : {type: Number, default : 0},
        finalPrice : {type: Number, default : 0},

        createAt: {type: Date, default: Date.now},
        active:{type: Boolean, default:true},
        updatedAt: Date,
    })
    const Purchase = app.mongoose.model('Purchase', Schema)
    return {Purchase}
}
