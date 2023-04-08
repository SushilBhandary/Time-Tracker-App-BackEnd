const JWT = require("jsonwebtoken")
const config = require("../config/index")
const asyncHandler = require('../services/asyncHandler')
const CustomError =  require('../utils/customError')
const User = require( "../models/user.schema.js")

exports.auth = asyncHandler( async(req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        throw new CustomError('Not authorized to access this route', 401)
    }
    try {
        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET)
        req.user = await User.findById(decodedJwtPayload._id, "name email tracker")
        return next()
    } catch (error) {
        throw new CustomError('Not authorized to access this route', 401)
    }
})