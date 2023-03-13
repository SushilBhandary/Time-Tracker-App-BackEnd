const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
    {
        action : {
            type : [{
                description : String,
                startTime : Number,
                endTime : Number,
                Urgent : Boolean,
                Important : Boolean
            }],
            default : []
        },
        Urgent : {
            type : {
                yes : Number ,
                no : Number 
            }
        },
        Important : {
            type : {
                yes : Number ,
                no : Number 
            }
        },
        feelingGood : Boolean,
        why : String,
        totalHouseRecoded : Number 
    }
)

module.exports = mongoose.model('tasks', tasksSchema)