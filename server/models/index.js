const { DataTypes } = require("sequelize");
const db = require("../config/db");

const UserModel = require("./user");
const DoctorModel = require("./doctorData");
const SpecialtyModel = require("./specialty");
const PatientModel = require("./patientData");
const AppointmentModel = require("./appointment");
const MedicalHistoryModel = require("./medicalHistory");
const PrescriptionModel = require("./prescription");
const NotificationModel = require("./notification");
const AdminReportModel = require("./adminReport");
const AvailabilityModel = require("./availability");

const User = UserModel(db, DataTypes);
const Doctor = DoctorModel(db, DataTypes);
const Specialty = SpecialtyModel(db, DataTypes);
const Patient = PatientModel(db, DataTypes);
const Appointment = AppointmentModel(db, DataTypes);
const MedicalHistory = MedicalHistoryModel(db, DataTypes);
const Prescription = PrescriptionModel(db, DataTypes);
const Notification = NotificationModel(db, DataTypes);
const AdminReport = AdminReportModel(db, DataTypes);
const Availability = AvailabilityModel(db, DataTypes);

User.hasOne(Doctor, { foreignKey: "user_id" });
Doctor.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Patient, { foreignKey: "user_id" });
Patient.belongsTo(User, { foreignKey: "user_id" });

Specialty.hasMany(Doctor, { foreignKey: "specialty_id" });
Doctor.belongsTo(Specialty, { foreignKey: "specialty_id" });

Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });
Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });

Patient.hasMany(Appointment, { foreignKey: "patient_id" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });

Patient.hasMany(MedicalHistory, { foreignKey: "patient_id" });
MedicalHistory.belongsTo(Patient, { foreignKey: "patient_id" });

Doctor.hasMany(MedicalHistory, { foreignKey: "doctor_id" });
MedicalHistory.belongsTo(Doctor, { foreignKey: "doctor_id" });

MedicalHistory.hasOne(Prescription, { foreignKey: "medical_history_id", onDelete: "CASCADE" });
Prescription.belongsTo(MedicalHistory, { foreignKey: "medical_history_id" });

User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(AdminReport, { foreignKey: "created_by_user_id" });
AdminReport.belongsTo(User, { foreignKey: "created_by_user_id" });

Doctor.hasMany(Availability, { foreignKey: "doctor_id", onDelete: "CASCADE" });
Availability.belongsTo(Doctor, { foreignKey: "doctor_id" });

Appointment.hasOne(Availability, { foreignKey: "appointment_id", onDelete: "SET NULL" });
Availability.belongsTo(Appointment, { foreignKey: "appointment_id", onDelete: "SET NULL" });

db.sync()
    .then(() => console.log("Conexiunea la BD este activă"))
    .catch((error) => console.error("Eroare la conectarea cu BD:", error));

module.exports = {
  User,
  Doctor,
  Specialty,
  Patient,
  Appointment,
  MedicalHistory,
  Prescription,
  Notification,
  AdminReport,
  Availability,
  connection: db,
};
