const Task = require( '../models/tasks.schema')
const Tracker = require( '../models/tracker.schema')
const asyncHandler = require( '../services/asyncHandler')
const CustomError = require( '../utils/customError')

/******************************************************
 * @Create_Task
 * @route /api/createtask
 * @description create task
 * @parameters date
 * @returns task Object
 ******************************************************/
exports.createTask = asyncHandler( async(req, res) => {
    const {date} = req.body
    const task = await Task.create()
    const tracker = await Tracker.findById(req.usre.tracker)
    tracker.dayTraker.forEach(element => {
        if (element.date===date) {
            throw new CustomError('Date already exists', 400)
        }
    });
    tracker.dayTraker.push( {
        date : date,
        task : task._id
    })
    for (let index = 1; index < 24; index++) {
        task.action.push({
            description : '', 
            startTime : index, 
            endTime : index+1, 
            Urgent : false, 
            Important :false
        })
    }
    await tracker.save()
    await task.save()
    return res.status(200).json({
        success: true,
        message: "Task created successfully",
        task
    })
})

/******************************************************
 * @Add_Action
 * @route /api/task/addaction/:taskid
 * @description add action in task
 * @parameters description, startTime, endTime, Urgent, Important
 * @returns task Object
 ******************************************************/
exports.addAction = asyncHandler( async(req, res) => {
    const { description, startTime, endTime, Urgent, Important } = req.body
    const { taskid } = req.param
    const task = await Task.findById(taskid)
    task.action = task.action.map( t => t.startTime===startTime ? {description, startTime, endTime, Urgent, Important} : t)
    await task.save()
    return res.status(200).json({
        success: true,
        message: "Added action successfully",
        task
    })
})

/******************************************************
 * @Update_Action
 * @route /api/task/updateaction/:taskid
 * @description Update action in task
 * @parameters description, startTime, endTime, Urgent, Important
 * @returns task Object
 ******************************************************/
exports.updateAction = asyncHandler( async(req, res) => {
    const { description, startTime, endTime, Urgent, Important } = req.body
    const { taskid } = req.param
    const task = await Task.findById(taskid)
    task.action = task.action.map( t => t.startTime===startTime ? {description, startTime, endTime, Urgent, Important} : t)
    await task.save()
    return res.status(200).json({
        success: true,
        message: "Update action successfully",
        task
    })
})