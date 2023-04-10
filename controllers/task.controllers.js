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
    const tracker = await Tracker.findById(req.user.tracker)
    let element
    for (let index = 0; index < tracker.dayTraker.length; index++) {
        element = tracker.dayTraker[index]
        if ( new Date(element.date).getDate() === new Date(date).getDate() && 
        new Date(element.date).getFullYear() === new Date(date).getFullYear() &&
        new Date(element.date).getMonth() === new Date(date).getMonth()) {
            const task = await Task.findById(element.task)
            return res.status(200).json({
                success: true,
                message: "Getting task",
                task,
                date : `${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()}`
            })
        }
    }
    const task = await Task.create({})
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
        task,
        date : `${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()}`
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
    const { action } = req.body
    const { taskid } = req.params
    const task = await Task.findById(taskid)
    task.action = action
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
    const { taskid } = req.params
    let task = await Task.findById(taskid)
    //-----------------------------------------
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
    noNo = (Math.round(noNo * 100) / 24).toFixed(2);
    yesNo = (Math.round(yesNo * 100) / 24).toFixed(2);
    noYes = (Math.round(noYes * 100) / 24).toFixed(2);
    urgentYes = (Math.round(urgentYes * 100) / 24).toFixed(2);
    ImportantYes = (Math.round(ImportantYes * 100) / 24).toFixed(2);
    urgentNo = (Math.round(urgentNo * 100) / 24).toFixed(2);
    ImportantNo = (Math.round(ImportantNo * 100) / 24).toFixed(2);
    const { Urgent, Important, urgentVsImportantMatrix } =  {
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
    // calculate Total House
    let totalHouseRecoded = 0
    task.action.forEach(element => {
        if (element.description) {
            totalHouseRecoded +=1
        }
    });
    task = await Task.findByIdAndUpdate( taskid, {Urgent, Important, urgentVsImportantMatrix, why , feel, totalHouseRecoded} )
    return res.status(200).json({
        success: true,
        message: "Updated task successfully",
        task
    })
})

/******************************************************
 * @Get_Task
 * @route /api/task/gettask/:trackerid
 * @description To get tasks
 * @parameters trackerid from params, date
 * @returns task Object
 ******************************************************/
exports.gettask = asyncHandler(async(req, res) => {
    console.log('gettask');
    const { date} = req.body
    const tracker = await Tracker.findById(req.user.tracker)
    let element
    for (let index = 0; index < tracker.dayTraker.length; index++) {
        element = tracker.dayTraker[index]
        if ( new Date(element.date).getDate() === new Date(date).getDate() && 
        new Date(element.date).getFullYear() === new Date(date).getFullYear() &&
        new Date(element.date).getMonth() === new Date(date).getMonth()) {
            const task = await Task.findById(element.task)
            console.log(task);
            return res.status(200).json({
                success: true,
                message: "Got task",
                task,
                date : `${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()}`
            })
        }
    }
    return res.status(201).json({
        success: false,
        message: `There is No data for ${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()} Date`
    })
})