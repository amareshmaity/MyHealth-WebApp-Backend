const mongoose = require("mongoose");

// create service schema
const doctorServiceSchema = new mongoose.Schema({
    profileName:{
        type: String,
        required: true,
    },
    qualification:{
        type: String,
        required: true,
    },
    specialist:{
        type: String,
        required: true,
    },
    experience:{
        type: Number,
        required: true,
    },
    serviceCharge:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",       
    },
    bookedDetails: [
        {
            bookedTime: {type: Number},
            bookedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "patientDetails",
            }
        }
    ],
    ReportDetails: [
        
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "reports",
            }
        
    ],
},
{
    timestamps: true 
}
);



// create model
const DoctorService = mongoose.model("doctorService", doctorServiceSchema);


module.exports = {DoctorService};