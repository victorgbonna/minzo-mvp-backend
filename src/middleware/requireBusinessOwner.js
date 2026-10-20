const jwt = require('jsonwebtoken')
const User = require('../model/User')
const Business = require('../model/Business')
const config = require('../config/constants')
// const checkUserAccountStatus = require('../utils/checkUserAccountStatus')

const requireAuth = async ( req, res, next ) => {
    
    try{
        const { authorization } = req.headers
        if(!authorization) {
            return res.status(403).json( { error: "Authorization token required" } )
        }
        const token = authorization.split( ' ' )[1]
        const {_id} = jwt.verify( token, config.APP_SECRET_KEY )
        
        const get_business = await Business.findOne({_id: req.params.businessId })
        if(!get_business){
            return res.status(400).json({error:{message:"Business not found"}});
        }
        if(get_business.owner.toString() !== _id.toString()){
            return res.status(403).json({error:{message:"Access Denied"}})
        }
        // const {error:status_error}= checkUserAccountStatus(isUser.status)
        // if(status_error){
        //     return res.status(419).json({error:status_error})
        // }
       
       req.user = {_id} 
       next()
    }catch (error) {
        console.log(error)
        res.status(403).json({error: 'Request is not authorized', status:"unauthorized" })
    }
}
module.exports = requireAuth