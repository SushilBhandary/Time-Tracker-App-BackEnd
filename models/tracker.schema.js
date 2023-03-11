const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema(
    {
        dayTraker : {
            type : [ {
                date : Date,
                task : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "tasks"
                }
            } ]
        }
    }
)

module.exports = mongoose.model('tracker', trackerSchema)