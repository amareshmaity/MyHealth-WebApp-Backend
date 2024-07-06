const mongoose = require("mongoose");

// create service schema
const patientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    healthIssue:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "patients",       
    },
    bookedAppointment: [
        {
            bookedTime: {type: Number},
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "doctorservices",
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
const PatientDetails = mongoose.model("patientDetails", patientSchema);


module.exports = {PatientDetails};