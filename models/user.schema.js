const mongoose =  require("mongoose" );
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const config = require("../config/index")


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength: [50, "Name must be less than 50"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "password is required"],
            minLength: [8, "password must be at least 8 characters"],
            select: false
        },
        tracker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tracker"
        }
    }
);

// encrypt password - hooks
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods = {
    //compare password
    comparePassword: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    },

    //generate JWT TOKEN
    getJwtToken: function () {
        return JWT.sign(
            {
                _id: this._id
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    }
}

module.exports = mongoose.model("User", userSchema)

