const jwt = require('jsonwebtoken')
const Admin = require('../model/Admin') 
const User = require('../model/User') 
const config = require('../config/constants')

// const checkUserAccountStatus = require('../utils/checkUserAccountStatus')

const requireAuth = async ( req, res, next ) => {
    
    try{
        const { authorization } = req.headers
        if(!authorization) {
            return res.status(403).json( { error: "Authorization token required" } )
        }
        const token = authorization.split( ' ' )[1]
        // console.log({token,})
        const {id} = jwt.verify( token, config.APP_SECRET_KEY )
        const isUser = await User.findOne({ _id: id }).lean()
        console.log({isUser})  
       if(!isUser){
            return res.status(403).json({error:{message:"Access Denied"}});
        }
        // const {error:status_error}= checkUserAccountStatus(isUser.status)
        // if(status_error){
        //     return res.status(419).json({error:status_error})
        // }
       
       req.user = isUser 
       next()
    }catch (error) {
        console.log(error)
        res.status(403).json({error: 'Request is not authorized', status:"unauthorized" })
    }
}
module.exports = requireAuth