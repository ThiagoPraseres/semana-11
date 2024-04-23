//Vai verificar a autenticidade do token informado

const { verify } = require("jsonwebtoken")

async function auth(req, res, next){
    try {
        console.log("entramos no middleware")

        const { authorization } = req.headers
        //verifica se o codigo esta valido
        req['payload'] = verify(authorization, process.env.SECRET_JWT)

        next()
    } catch (error) {
       return res.status(401).send({
        message: "Autenticação falhou",
        cause: error.message
       }) 
    }
}

module.exports = { auth }