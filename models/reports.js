const mongoose = require("mongoose");

// create service schema
const reportSchema = new mongoose.Schema({


    patientDetailsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patientDetails",
    },
    cratedByServiceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctorservices",
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    healthIssue: {
        type: String,
        required: true,
    },
    medicalHistory: {
        type: String,
        required: true,
    },
    diagnosticTests: {
        type: String,
        required: true,
    },
    followUp: {
        type: String,
        required: true,
    },
},
{
    timestamps: true 
}
);



// create model
const ReportDetails = mongoose.model("reportdetails", reportSchema);


module.exports = {ReportDetails};