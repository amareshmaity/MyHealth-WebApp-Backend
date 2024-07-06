const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    signup_as: {
        type: String,
        required: true,
    },
    profileImage: {
        filename: {
            type: String,
            default: ''
        },
        contentType: {
            type: String,
            default: ''
        },
        imageBase64: {
            type: String,
            default: ''
        }
    }
},
{
    timestamps: true 
}
);


// create model
const Doctor = mongoose.model("doctor", userSchema);
const Patient = mongoose.model("patient", userSchema);


module.exports = {Doctor, Patient};