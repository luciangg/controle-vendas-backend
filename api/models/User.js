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

        profile: {
            type: app.mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile'
        },

        id:String,

        name: {
            type: String,
            required: [true, "Informe o campo 'name'"],
        },
        email: {
            type: String, unique: true,
            required: [true, "Informe o campo 'email'"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: [true, "Informe o campo 'password'"],
            bcrypt: true
        },

        resetPasswordToken: String,
        resetPasswordExpires: Date,

        active: {type: Boolean, default: true},
        createAt: {type: Date, default: Date.now},
        updatedAt: Date
    });

    Schema.plugin(require('mongoose-bcrypt'));

    const User = app.mongoose.model('User', Schema)

    return { User }
}
