const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
    {
        action : {
            type : [{
                description : String,
                startTime : String,
                endTime : String,
                Urgent : Boolean,
                Important : Boolean
            }]
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