const User = require( '../models/user.schema.js')
const Tracker = require( '../models/tracker.schema')
const asyncHandler = require( '../services/asyncHandler')
const CustomError = require( '../utils/customError')
const cookieOptions = require( '../Utils/cookieOptions')
const { createTracker } = require('../controllers/tracker.controllers')

/******************************************************
 * @SIGNUP
 * @route /api/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/
exports.signUp = asyncHandler(async (req, res) => {
    const {name, email, password } = req.body

    if (!name || !email || !password) {
        throw new CustomError('Please fill all fields', 400)
    }
    //check if user exists
    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new CustomError('User already exists', 400)  
    }
    const tracker = await Tracker.create({})
    const user = await User.create({
        name,
        email,
        password,
        tracker:tracker._id
    });
    const token = user.getJwtToken()
    console.log(user);
    user.password = undefined
    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success: true,
        token,
        user
    })

})

/******************************************************
 * @LOGIN
 * @route /api/auth/login
 * @description User signIn Controller for loging new user
 * @parameters  email, password
 * @returns User Object
 ******************************************************/
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if ( !email || !password) {
        throw new CustomError('Please fill all fields', 400)
    }

    const user = await User.findOne({email}).select("+password")

    if (!user) {
        throw new CustomError('Invalid credentials', 400)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (isPasswordMatched) {
        const token = user.getJwtToken()
        user.password = undefined;
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }
    throw new CustomError('Invalid credentials - pass', 400)

})


/******************************************************
 * @LOGOUT
 * @route /api/auth/logout
 * @description User logout by clearing user cookies
 * @parameters  
 * @returns success message
 ******************************************************/
exports.logout = asyncHandler(async (_req, res) => {
    res.clearCookie()
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})