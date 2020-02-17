module.exports = app => {
    const Schema = app.mongoose.Schema({
        name: {
            type: String,
            required: [true, "Informe o campo 'name'"],
        },
        _user: {
            type: app.mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        address: {type:String, default: ""},

        active: {type: Boolean, default: true},
        createAt: {type: Date, default: Date.now},
        updatedAt: Date,
    });

    const Company = app.mongoose.model('Company', Schema)
    return { Company }
}
