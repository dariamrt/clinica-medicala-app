const authController = require("./auth");
const userController = require("./user");
const patientController = require("./patient");
const doctorController = require("./doctor");
const appointmentController = require("./appointment");
const medicalHistoryController = require("./medicalHistory");
const prescriptionController = require("./prescription");
const notificationController = require("./notification");
const specialtyController = require("./specialty");
const availabilityController = require("./availability");
const adminReportController = require("./adminReports");

module.exports = {
    authController,
    userController,
    patientController,
    doctorController,
    appointmentController,
    medicalHistoryController,
    prescriptionController,
    notificationController,
    specialtyController,
    availabilityController,
    adminReportController
};
