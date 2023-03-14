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
    for (let index = 0; index < 24; index++) {
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

/******************************************************
 * @Update_Task
 * @route /api/task/updatetask/:taskid
 * @description To Update task
 * @parameters why , feel
 * @returns task Object
 ******************************************************/
exports.updatetask = asyncHandler( async(req, res) => {
    const { why , feel} = req.body
    const { taskid } = rea.param
    let task = await Task.findById(taskid)
    const { Urgent, Important, urgentVsImportantMatrix } = calculateMatrix(task)
    const totalHouseRecoded = calculateTotalHouse(task)
    task = await Task.findByIdAndUpdate( taskid, {Urgent, Important, urgentVsImportantMatrix, why , feel, totalHouseRecoded} )
    return res.status(200).json({
        success: true,
        message: "Updated task successfully",
        task
    })
})

/******************************************************
 * @Calculate_Matrix_of_Urgent_and_Important 
 * @description To calculate urgent and important matrix
 * @parameters task
 * @returns Object
 ******************************************************/
const calculateMatrix = asyncHandler( (task) => {
    //Urgent VS Important 
    let yesYes  = 0, noNo = 0, yesNo = 0, noYes = 0, 
    urgentYes = 0, urgentNo = 0, ImportantYes = 0, ImportantNo = 0
    task.action.forEach(element => {
        if (element.Urgent === true && element.Important === true) {
            yesYes += 1
            urgentYes += 1
            ImportantYes += 1
        } else if (element.Urgent === false && element.Important === false) {
            noNo += 1
            urgentNo += 1
            ImportantNo += 1
        } else if (element.Urgent === true && element.Important === false) {
            yesNo += 1
            urgentYes += 1
            ImportantNo += 1
        } else if (element.Urgent === false && element.Important === true) {
            noYes += 1
            urgentNo += 1
            ImportantYes += 1
        }
    });
    yesYes = (Math.round(yesYes * 100) / 24).toFixed(2);
    noNo = (Math.round(yesYes * 100) / 24).toFixed(2);
    yesNo = (Math.round(yesYes * 100) / 24).toFixed(2);
    noYes = (Math.round(yesYes * 100) / 24).toFixed(2);
    urgentYes = (Math.round(urgentYes * 100) / 24).toFixed(2);
    ImportantYes = (Math.round(ImportantYes * 100) / 24).toFixed(2);
    urgentNo = (Math.round(urgentNo * 100) / 24).toFixed(2);
    ImportantNo = (Math.round(ImportantNo * 100) / 24).toFixed(2);
    return {
        Urgent : {
            yes : urgentYes ,
            no : urgentNo 
        }, 
        Important : {
            yes : ImportantYes ,
            no : ImportantNo 
        },
        urgentVsImportantMatrix : {
            yesYes,
            noNo,
            yesNo,
            noYes
        }
    }
    
})

/******************************************************
 * @Calculate_Total_House
 * @description To calculate Total house
 * @parameters task
 * @returns totalHouseRecoded
 ******************************************************/
const calculateTotalHouse = asyncHandler( (task) => {
    let count
    task.action.forEach(element => {
        if (!element.description) {
            count +=1
        }
    });
    return count
})