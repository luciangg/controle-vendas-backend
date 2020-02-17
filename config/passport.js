const { authSecret } = require('../config/config')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const {User} = app.api.models.User
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, async (payload, done) =>
    {
        try
        {
            let user = await User.findById(payload.id).populate("profile")
            done(null, user || false)
        }
        catch(err)
        {
            done(err, false)
        }
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}
