const Tracker = require( '../models/tracker.schema')
const asyncHandler = require( '../services/asyncHandler')
const CustomError = require( '../utils/customError')

/******************************************************
 * @Create_Tracker
 * @description create a tracker for new user
 * @parameters user
 ******************************************************/
exports.createTracker = asyncHandler( async(user) => {
    try {
        const tracker = await Tracker.create({})
        user.tracker = tracker._id
        await user.save()
    } catch (error) {
        throw new CustomError('Not able to create tracker', 400)  
    }
})