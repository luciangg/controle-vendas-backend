const { authSecret } = require('../config/config')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')

module.exports = app => {
    const createToken = async (req, res, type = "Bearer") =>
    {
        if (!req.body.email || !req.body.password)
        {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.api.models.User.User.findOne({email: req.body.email}).populate({ path: 'profile', select: ['master'] })
        if (!user)
        {
            return res.status(400).send('Email/Senha inválidos!')
        }

        if(!bcrypt.compareSync(req.body.password, user.password))
        {
            return res.status(400).send('Email/Senha inválidos!')
        }

        let jsonReturn = {}

        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
        }
        if(user.profile.master)
        {
            payload.master = true
        }

        const now = Math.floor(Date.now() / 1000)
        payload.iat = now,
        payload.exp = now + ((24 - new Date().getHours()) * 60 * 60)
        jsonReturn = {...payload}
        jsonReturn.token = jwt.encode(payload, authSecret)

        res.json(jsonReturn)
    }

    const signin = (req, res) =>
    {
        return createToken(req, res)
    }

    const validateToken = async (req, res) =>
    {
        const userData = req.body || null
        try
        {
            if(userData)
            {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date())
                {
                    return res.send(true)
                }
            }
        }
        catch(e)
        {
          // console.log("Token com problema");
        }
        res.send(false)
    }

    return { signin, validateToken }
}
